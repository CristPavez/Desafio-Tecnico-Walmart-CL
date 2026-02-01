# Servidor Backend - Retail Walmart CL

## Descripcion

API REST desarrollada con Spring Boot que gestiona la logica de negocio del sistema de ecommerce. Maneja productos, zonas, ventanas de despacho, reservas temporales y el proceso de checkout.

## Tecnologias

- Java 17
- Spring Boot 4.0.2
- Spring Data JPA
- SQLite (base de datos)
- Maven

## Funcionalidades

- CRUD de productos y zonas
- Gestion de ventanas de despacho con capacidad por zona
- Sistema de reservas temporales para ventanas horarias
- Validacion de disponibilidad en tiempo real
- Integracion con servicio de ML para busqueda inteligente

## Instalacion

```bash
# Compilar y ejecutar con Maven
./mvnw spring-boot:run

# O en Windows
mvnw.cmd spring-boot:run
```

## Base de Datos

El sistema utiliza SQLite y crea automaticamente la base de datos `walmart.db` con datos iniciales al iniciar.

## Puerto

El servidor corre en `http://localhost:8081`

## Endpoints Principales

- GET /products - Lista de productos
- GET /zones - Zonas disponibles
- POST /delivery/search - Buscar ventanas disponibles
- POST /delivery/reserve - Crear reserva temporal
- DELETE /delivery/cancel-reservation/{sessionId} - Cancelar reserva
