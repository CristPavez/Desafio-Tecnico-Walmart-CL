# Sistema Retail Walmart CL

Sistema de ecommerce completo con busqueda inteligente mediante Machine Learning y gestion de ventanas de despacho con reservas temporales.

VIDEO DEMO: https://drive.google.com/file/d/1SgZrnoFxLZtDoF3cbL5MTW0xctgjO1A1/view?usp=sharing

## Arquitectura

El sistema esta compuesto por 3 servicios independientes:

1. **client-retail-walmart-cl** - Frontend web (Next.js)
2. **server-retail-walmart-cl** - Backend API (Spring Boot)
3. **server-ml-walmart-cl** - Servicio ML (FastAPI)

## Requisitos Previos

- Node.js 18+ y Yarn
- Java 17+
- Python 3.10+
- Maven

## Pasos para Iniciar el Sistema


### 1. Iniciar Backend

```bash
cd server-retail-walmart-cl

# Ejecutar con Maven
./mvnw spring-boot:run

# O en Windows
mvnw.cmd spring-boot:run
```
El servidor estara disponible en `http://localhost:8081`

### 2. Iniciar Servicio ML

```bash
cd server-ml-walmart-cl

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate o source venv/Scripts/activate
# En Linux/Mac:
source venv/bin/activate


# Instalar dependencias
pip install -r requirements.txt

# Entrenar modelo, cargar vectores a sqlite (solo primera vez)
python train_knn_model.py

# Iniciar servidor
python app.py
```

El servicio estara disponible en `http://localhost:5000`

 

 

### 3. Iniciar Frontend

```bash
cd client-retail-walmart-cl

# Instalar dependencias
yarn install

# Crear build
yarn build

# Ejecutar build
yarn start
```

La aplicacion estara disponible en `http://localhost:3000`

## Orden de Inicio Recomendado

1. Backend (puerto 8081)
2. Servicio ML (puerto 5000)
3. Frontend (puerto 3000)

## Verificacion

- Frontend: Abrir `http://localhost:3000` en el navegador
- Backend: Verificar `http://localhost:8081/products`
- ML Service: Verificar `http://localhost:5000/docs` (documentacion Swagger)


---

## Mejoras Posibles

### Cliente Web (client-retail-walmart-cl)

- Optimizar el rendimiento de carga y renderizado

- Implementar pruebas unitarias para cada componente

- Rediseñar la interfaz visual con componentes más profesionales y modernos

- Corregir errores en la carga asíncrona de elementos

### Backend (server-retail-walmart-cl)
- Migrar de SQLite a PostgreSQL para aprovechar funcionalidades avanzadas como triggers y PL/SQL

- Implementar Redis + PostgreSQL para mejorar las reservas de ventanas de delivery

- Implementar triggers que detecten inactividad en ventanas de despacho y liberen automáticamente los cupos reservados

- Desarrollar pruebas unitarias para todos los endpoints

- Reforzar la seguridad mediante validación de entradas, rate limiting y autenticación robusta

### Servicio ML (server-ml-walmart-cl)
- Migrar el modelo KNN a búsqueda vectorial utilizando FAISS o alternativas similares para mejor escalabilidad

- Expandir funcionalidades con búsqueda de productos por imagen

- Integrar un chatbot de asistencia con IA generativa para soporte al usuario