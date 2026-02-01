# Cliente Web - Retail Walmart CL

## Descripcion

Aplicacion web de ecommerce desarrollada con Next.js y React. Permite a los usuarios navegar por un catalogo de productos, agregar items al carrito, y completar el proceso de compra seleccionando ventanas de despacho disponibles.

## Tecnologias

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (manejo de estado)
- Axios (cliente HTTP)

## Funcionalidades

- Catalogo de productos con busqueda y filtros
- Carrito de compras persistente
- Proceso de checkout con seleccion de ventanas de despacho
- Reserva de bloques horarios por zona
- Busqueda inteligente mediante ML

## Instalacion

```bash
# Instalar dependencias
yarn install

# Ejecutar en modo desarrollo
yarn dev

# Compilar para produccion
yarn build
yarn start
```

## Variables de Entorno

El servicio se conecta por defecto a:
- Backend Java: http://localhost:8080
- Servicio ML: http://localhost:8000

## Puerto

La aplicacion corre en `http://localhost:3000`
