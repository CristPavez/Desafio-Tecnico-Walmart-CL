import pandas as pd
import numpy as np
import sqlite3
import pickle
from sentence_transformers import SentenceTransformer
from sklearn.neighbors import NearestNeighbors
import os

# ========================================
# CONFIGURACIÓN
# ========================================

DB_PATH = r'../server-retail-walmart-cl/src/main/resources/retail_walmart.db'

print("=" * 80)
print(" ENTRENAMIENTO KNN - SISTEMA DE BÚSQUEDA SEMÁNTICO")
print("=" * 80)

# ========================================
# CARGAR DATOS
# ========================================


conn = sqlite3.connect(DB_PATH)
query = """
    SELECT id, name, description, price, brand, category, image_url, tags, stock, old_price
    FROM products
    ORDER BY id
"""
df = pd.read_sql_query(query, conn)
conn.close()


# ========================================
# PREPARAR TEXTOS (SIN stopword removal)
# ========================================



# Normalizar campos (sin stopword removal)
df['name_clean'] = df['name'].fillna('').str.strip().str.lower()
df['description_clean'] = df['description'].fillna('').str.strip().str.lower()
df['brand_clean'] = df['brand'].fillna('').str.strip().str.lower()
df['category_clean'] = df['category'].fillna('').str.strip().str.lower()

# Combinar: name (x2) + description + category + brand
df['combined_text'] = (
    df['name_clean'] + '. ' +
    df['name_clean'] + '. ' +        # name con peso x2
    df['description_clean'] + '. ' +  # contexto semántico
    df['category_clean'] + ' ' +
    df['brand_clean']
)

# ========================================
# VECTORIZACIÓN
# ========================================


model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')



vectors_dense = model.encode(
    df['combined_text'].tolist(),
    normalize_embeddings=True,  # Normalizar para coseno estable
    show_progress_bar=True,
    convert_to_numpy=True
)



# ========================================
# ENTRENAR KNN
# ========================================

print(f"\nEntrenando KNN...")

knn_model = NearestNeighbors(
    n_neighbors=min(50, len(df)),  # Más candidatos para filtrar después
    algorithm='auto',
    metric='cosine'
)

knn_model.fit(vectors_dense)

# ========================================
# GUARDAR EN SQLITE
# ========================================

print(f"\nGuardando en SQLite...")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

cursor.execute("DROP TABLE IF EXISTS product_vectors")
cursor.execute("""
    CREATE TABLE product_vectors (
        id TEXT PRIMARY KEY,
        vector BLOB NOT NULL,
        name TEXT,
        brand TEXT,
        category TEXT,
        price REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
""")

for idx, row in df.iterrows():
    cursor.execute("""
        INSERT INTO product_vectors (id, vector, name, brand, category, price)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        row['id'],
        pickle.dumps(vectors_dense[idx]),
        row['name'],
        row['brand'],
        row['category'],
        row['price']
    ))

conn.commit()
conn.close()


# ========================================
# GUARDAR MODELOS
# ========================================

os.makedirs('models', exist_ok=True)

model.save('models/sentence_transformer_model')

with open('models/knn_model.pkl', 'wb') as f:
    pickle.dump(knn_model, f)

config = {
    'n_neighbors': knn_model.n_neighbors,
    'metric': knn_model.metric,
    'vector_dim': vectors_dense.shape[1]
}

with open('models/config.pkl', 'wb') as f:
    pickle.dump(config, f)

print(f"Modelos guardados")
