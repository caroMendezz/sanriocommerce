# Especificación: Sanriocommerce

Tienda online de peluches de Sanrio. Metodología **spec-driven**: primero el contrato
de requisitos, después la implementación y, al final, la verificación.

## 1. Objetivo

Permitir que una persona se registre, explore un catálogo de peluches Sanrio, consulte el
detalle de cada producto, arme un carrito y simule una compra con tarjeta o Mercado Pago.
El administrador administra el catálogo y el stock desde una vista propia.

## 2. Alcance

| Incluido | Fuera de alcance |
| --- | --- |
| Registro / login con JWT | Cobros reales (el pago es simulado) |
| Catálogo con buscador por prefijo | Recuperación de contraseña por email |
| Detalle: tamaño, peso, material | Envíos reales / tracking |
| Carrito y checkout simulado | Pasarela de pago real |
| Control de stock transaccional | Múltiples sucursales |
| Vista admin: publicar / eliminar | Edición completa de productos |
| Agente IA de recomendaciones | Modelo LLM externo (respuestas por reglas) |

## 3. Historias de usuario

1. **Registro** — Como visitante quiero crear una cuenta con nombre, email y contraseña
   para acceder al catálogo.
2. **Login** — Como usuario registrado quiero iniciar sesión y mantener la sesión entre
   recargas.
3. **Catálogo** — Como cliente quiero ver todos los peluches con su emoji de portada,
   precio y stock.
4. **Búsqueda** — Como cliente quiero escribir las dos primeras letras de un nombre y ver
   todos los productos que empiecen así.
5. **Detalle** — Como cliente quiero ver tamaño, peso, material y descripción antes de
   comprar.
6. **Carrito** — Como cliente quiero agregar, cambiar cantidades y quitar productos.
7. **Compra** — Como cliente quiero elegir tarjeta de crédito o Mercado Pago y confirmar
   un pago simulado.
8. **Stock** — Como cliente quiero que no se puedan comprar más unidades de las
   disponibles; como dueña quiero que el stock baje al comprar.
9. **Ayuda** — Como cliente quiero un botón que abra un email con los datos que debo enviar.
10. **Admin** — Como administradora quiero publicar y eliminar peluches.
11. **Agente IA** — Como cliente quiero un asistente que me recomiende peluches según
    personaje, precio o tamaño.

## 4. Contrato de API

Base: `http://localhost:4000/api`

| Método | Endpoint | Auth | Descripción |
| --- | --- | --- | --- |
| GET | `/health` | — | Estado del servicio |
| POST | `/auth/register` | — | Crea usuario `cliente` y devuelve JWT |
| POST | `/auth/login` | — | Devuelve JWT + usuario |
| GET | `/auth/me` | Bearer | Usuario de la sesión |
| GET | `/products?q=he` | — | Catálogo; `q` filtra por prefijo de nombre o personaje |
| GET | `/products/:id` | — | Detalle del producto |
| POST | `/products` | Bearer admin | Publica producto |
| DELETE | `/products/:id` | Bearer admin | Elimina producto |
| POST | `/orders` | Bearer | Compra simulada; descuenta stock en transacción |
| POST | `/agent` | Bearer | Agente de recomendaciones |

### Payloads

```json
// POST /auth/register
{ "name": "Ana", "email": "ana@mail.com", "password": "secreto123" }

// POST /orders
{ "items": [{ "productId": 3, "quantity": 2 }], "paymentMethod": "tarjeta" }

// POST /agent
{ "message": "¿tenés algo de Kuromi?" }
```

## 5. Modelo de datos (MySQL)

- `users`: id, name, email (único), password (bcrypt), role (`cliente` | `admin`).
- `products`: id, name, character, emoji, description, material, heightCm, weightGrams,
  price, stock, active.
- `orders`: id, userId, total, paymentMethod (`tarjeta` | `mercadopago`), status.
- `order_items`: id, orderId, productId, productName, emoji, unitPrice, quantity.

## 6. Reglas de negocio

- La búsqueda usa prefijo (`LIKE 'q%'`) sobre `name` y `character`, por eso alcanza con
  dos letras.
- La compra corre en una transacción con bloqueo de fila: valida stock, lo descuenta y
  guarda el total calculado en el servidor.
- Solo `role = admin` puede publicar o eliminar productos.
- El total se recalcula en el backend; nunca se confía en el precio del cliente.

## 7. Criterios de aceptación

- [x] Un visitante no puede ver el catálogo sin loguearse.
- [x] El buscador con "he" devuelve Hello Kitty.
- [x] El detalle muestra tamaño, peso y material.
- [x] Comprar muestra el modal de método de pago simulado.
- [x] El header tiene buscador, carrito con contador, ayuda y cerrar sesión.
- [x] El admin puede publicar y eliminar; el cliente recibe 403.
- [x] La compra descuenta stock y rechaza cantidades mayores al disponible.
