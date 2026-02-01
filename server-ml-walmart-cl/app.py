from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from contextlib import asynccontextmanager
import sqlite3
import pickle
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.neighbors import NearestNeighbors
import os

# ========================================
# CONFIGURACIÓN
# ========================================

DB_PATH = r'../server-retail-walmart-cl/src/main/resources/retail_walmart.db'
MODELS_DIR = 'models'

# ========================================
# MODELOS GLOBALES
# ========================================

model = None
knn_model = None
products_df = None
vectors_matrix = None

# ========================================
# MODELOS PYDANTIC
# ========================================

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

class ProductResult(BaseModel):
    id: str
    name: str
    brand: str
    description: str
    price: float
    category: str
    image_url: str
    similarity_score: float

# ========================================
# FUNCIONES DE CARGA
# ========================================

def load_vectors_from_db():
    """Carga vectores y metadata desde SQLite"""
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, vector, name, brand, category, price
        FROM product_vectors
        ORDER BY id
    """)
    
    rows = cursor.fetchall()
    conn.close()
    
    if not rows:
        raise Exception("No hay vectores en la base de datos.")
    
    products = []
    vectors = []
    
    for row in rows:
        product_id, vector_bytes, name, brand, cat, price = row
        
        vector = pickle.loads(vector_bytes)
        vectors.append(vector)
        
        products.append({
            'id': product_id,
            'name': name,
            'brand': brand,
            'category': cat,
            'price': price
        })
    
    products_df = pd.DataFrame(products)
    vectors_matrix = np.vstack(vectors)
    
    return products_df, vectors_matrix

def train_knn_if_needed():
    """Verifica que existan modelos entrenados"""
    
    model_path = f'{MODELS_DIR}/sentence_transformer_model'
    knn_path = f'{MODELS_DIR}/knn_model.pkl'
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='product_vectors'
    """)
    table_exists = cursor.fetchone() is not None
    conn.close()
    
    if not table_exists or not os.path.exists(model_path) or not os.path.exists(knn_path):
        raise Exception("No se encontró modelo o tabla de vectores. Ejecuta train_knn_model.py primero")

# ========================================
# CARGAR MODELOS
# ========================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global model, knn_model, products_df, vectors_matrix
    
    print("Iniciando Backend")
    
    try:
        train_knn_if_needed()
        
        model = SentenceTransformer(f'{MODELS_DIR}/sentence_transformer_model')
        
        products_df, vectors_matrix = load_vectors_from_db()
        
        knn_path = f'{MODELS_DIR}/knn_model.pkl'
        with open(knn_path, 'rb') as f:
            knn_model = pickle.load(f)
        
    except Exception as e:
        print(f"Error cargando modelos: {e}")
        raise
    
    yield
    
    # Shutdown (cleanup if needed)
    pass

app = FastAPI(title="Product Search API - KNN", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["localhost", "http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================================
# ENDPOINTS
# ========================================

@app.get("/")
async def root():
    return {
        "message": "Product Search API - Búsqueda Semántica",
        "version": "1.0"
    }

@app.post("/search", response_model=List[ProductResult])
async def search_products(request: SearchRequest):
    """
    Busca productos usando KNN semántico
    """
    
    try:
        query = request.query.strip()
        if not query:
            raise HTTPException(status_code=400, detail="Query vacío")
        
        query_normalized = query.lower().strip()
        query_vector = model.encode([query_normalized], normalize_embeddings=True)
        
        n_neighbors = min(request.top_k * 3, len(products_df))
        distances, indices = knn_model.kneighbors(query_vector, n_neighbors=n_neighbors)
        
        SIMILARITY_THRESHOLD = 0.40 
        
        filtered_results = []
        for dist, idx in zip(distances[0], indices[0]):
            similarity = 1 - dist
            
            if similarity < SIMILARITY_THRESHOLD:
                continue
            
            product = products_df.iloc[idx]
            filtered_results.append({
                'idx': idx,
                'id': product['id'],
                'similarity': similarity
            })
            
            if len(filtered_results) >= request.top_k:
                break
        
        if not filtered_results:
            return []
        
        result_ids = [r['id'] for r in filtered_results]
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        placeholders = ','.join(['?'] * len(result_ids))
        cursor.execute(
            f"SELECT id, image_url, description FROM products WHERE id IN ({placeholders})",
            result_ids
        )
        extra_data = {row[0]: {'image_url': row[1] or '', 'description': row[2] or ''} 
                      for row in cursor.fetchall()}
        conn.close()
        
        results = []
        
        for result_data in filtered_results:
            idx = result_data['idx']
            product_id = str(result_data['id'])
            similarity = result_data['similarity']
            
            product = products_df.iloc[idx]
            
            results.append(ProductResult(
                id=product_id,
                name=product['name'],
                brand=product['brand'],
                description=extra_data.get(product_id, {}).get('description', ''),
                price=float(product['price']),
                category=product['category'],
                image_url=extra_data.get(product_id, {}).get('image_url', ''),
                similarity_score=float(similarity)
            ))
        
        
        return results
        
    except Exception as e:
        print(f"Error en búsqueda: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ========================================
# MAIN
# ========================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000, reload=False)
