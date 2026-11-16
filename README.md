# Sanriocommerce 🎀

E-commerce de peluches de Sanrio con backend Express/MySQL y frontend React (Vite).
Incluye registro/login con JWT, catálogo con búsqueda por prefijo, detalle de producto,
carrito, pago simulado, control de stock, vista de administración y un agente de
recomendaciones.

La especificación funcional está en [`specs/sanriocommerce.spec.md`](specs/sanriocommerce.spec.md).

## Estructura

```
sistema/
├── api/                       # Backend (Express + Sequelize + MySQL)
│   ├── config/                # env, conexión y seed de datos
│   ├── controllers/           # auth, productos, pedidos y agente
│   ├── middlewares/           # JWT, admin, CORS, errores
│   ├── models/                # User, Product, Order, OrderItem
│   ├── routes/                # definición de endpoints
│   ├── utils/                 # helpers
│   └── index.js               # arranque de la API
└── frontend/                  # React + Vite
    └── src/
        ├── api/               # cliente HTTP
        ├── components/        # header, tarjetas, modal de pago, asistente
        ├── context/           # sesión y carrito
        ├── pages/             # login, catálogo, detalle, carrito, ayuda, admin
        ├── services/          # llamadas a la API por dominio
        ├── styles/            # design system + componentes + páginas
        └── utils/             # formato de precios
```

## Puesta en marcha

### 1. Base de datos

Creá la base en MySQL (phpMyAdmin, MySQL Workbench o consola):

```sql
CREATE DATABASE sanriocommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Revisá `sistema/api/.env` (hay un `.env.example` de referencia) y ajustá
`DB_USER`, `DB_PASSWORD` y `JWT_SECRET` si hace falta.

### 2. Backend

```bash
cd sistema/api
npm install      # las dependencias ya están descargadas
npm run dev      # http://localhost:4000
```

Al primer arranque se crean las tablas y se cargan los 12 peluches y el usuario admin.

- Admin: `admin@sanriocommerce.com` / `admin123`
- Para recargar datos manualmente: `npm run seed`

### 3. Frontend

```bash
cd sistema/frontend
npm install
npm run dev      # http://localhost:5173
```

Vite hace proxy de `/api` hacia `http://localhost:4000`, por lo que no hace falta CORS
en desarrollo.

## Notas

- El pago con tarjeta y Mercado Pago es **simulado**: no se cobra dinero real.
- La compra descuenta stock dentro de una transacción; si no hay unidades, responde 409.
- La búsqueda acepta dos letras y devuelve los productos cuyo nombre o personaje empiezan
  con ese texto (`he` → Hello Kitty, `ku` → Kuromi).
- El agente "Sani" responde con reglas locales sobre el catálogo, sin servicios externos.
- El correo de ayuda (`ayuda@sanriocommerce.com`) es de ejemplo para la demo.
