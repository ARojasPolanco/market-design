# Marketplace de Diseños

Marketplace donde diseñadores (estampadores, sublimadores, papelería) suben y venden diseños digitales. Los compradores los adquieren y reciben automáticamente por mail el archivo en alta calidad, listo para imprimir.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express + Sequelize |
| Base de datos | PostgreSQL |
| Storage | Cloudflare R2 |
| Pagos | Mercado Pago Marketplace |
| Email | Resend |
| Procesamiento de imágenes | sharp |
| Validación | Zod |
| Tests | Vitest + Supertest |

## Funcionalidades

### Vendedores
- Registro y verificación de email
- Carga de diseños con validación técnica automática (DPI, formato, peso)
- Panel de ventas, ganancias y reputación
- Sistema de comisión escalonada por volumen
- Badges automáticos (verificado, top seller)

### Compradores
- Catálogo con filtros, búsqueda y categorías
- Compra segura con Mercado Pago
- Entrega automática por email con link de descarga
- Historial de compras y re-descarga
- Ratings y favoritos

### Admin
- Cola de moderación con checklist objetivo
- Gestión de usuarios y denuncias
- Reportes de ventas y comisiones
- Configuración de comisiones y parámetros

## Quick Start

```bash
# Clonar
git clone https://github.com/ARojasPolanco/market-design.git
cd market-design

# Instalar dependencias
npm install

# Levantar PostgreSQL
docker compose up -d

# Copiar variables de entorno
cp apps/api/.env.example apps/api/.env

# Desarrollo frontend
npm run dev:web

# Desarrollo backend
npm run dev
```

## Estructura

```
market-design/
├── apps/
│   ├── api/          → Express API
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── src/
│   │       ├── modules/    → auth, designs, sellers, purchases, admin, payments
│   │       ├── config/     → database, R2, Resend, MP
│   │       ├── errors/     → AppError, catchAsync, errorMatchers
│   │       └── middlewares/
│   └── web/          → React + Vite
│       └── src/
│           ├── hooks/      → useDesigns(), useSeller()
│           ├── context/    → Auth, Favorites, Toast
│           ├── components/
│           └── pages/
├── packages/
│   └── shared/       → Schemas Zod compartidos
├── .husky/           → Pre-commit (lint-staged) + commit-msg (commitlint)
└── docker-compose.yml
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev:web` | Frontend en http://localhost:5173 |
| `npm run dev` | Backend en http://localhost:3000 |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run test` | Tests con Vitest |
| `npm run docker:up` | Levantar PostgreSQL |
| `npm run docker:down` | Detener PostgreSQL |

## Roadmap

- [x] Fase 0: Setup del monorepo y tooling
- [ ] Fase 1: Frontend — Mocks + Home + Detalle + Tienda
- [ ] Fase 2: Frontend — Checkout + Paneles
- [ ] Fase 3: Frontend — Auth UI + Onboarding
- [ ] Fase 4: Backend — Auth y seguridad
- [ ] Fase 5: Backend — Designs CRUD + validación técnica
- [ ] Fase 6: Backend — Purchases + webhook MP + entrega
- [ ] Fase 7: Backend — Admin + moderación
- [ ] Fase 8: Backend — Comisión escalonada + badges
- [ ] Fase 9: Integración (mocks → API real)
- [ ] Fase 10: Pulido y producción

## Licencia

Privado — Todos los derechos reservados.
