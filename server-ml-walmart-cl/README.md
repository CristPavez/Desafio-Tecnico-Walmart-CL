# Servicio ML - Retail Walmart CL

## Descripcion

Servicio de Machine Learning desarrollado con FastAPI que proporciona busqueda inteligente de productos usando modelos de similitud semantica (KNN con embeddings de Sentence Transformers).

## Tecnologias

- Python 3.10+
- FastAPI
- Sentence Transformers
- Scikit-learn
- Pandas
- NumPy

## Funcionalidades

- Busqueda semantica de productos mediante embeddings
- Modelo KNN para encontrar productos similares
- API REST para integracion con el backend principal
- Carga automatica de modelos al iniciar

## Instalacion

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Entrenar modelo (primera vez)
python train_knn_model.py

# Ejecutar servidor
python app.py
```

## Modelo

El sistema utiliza `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` para generar embeddings multilingues de alta calidad.

## Puerto

El servicio corre en `http://localhost:5000`

## Endpoints

- POST /search - Busqueda de productos por texto
  - Body: `{ "query": "texto busqueda", "top_k": 5 }`
  - Retorna: Lista de productos similares con scores
