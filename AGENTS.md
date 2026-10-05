# AGENTS.md — Marketplace de Diseños

## Contexto

Marketplace donde diseñadores (estampadores, sublimadores, papelería) suben y venden diseños digitales. Los compradores los adquieren y reciben automáticamente por mail el archivo en alta calidad, listo para imprimir.

## Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express + Sequelize
- **Base de datos**: PostgreSQL
- **Storage**: Cloudflare R2
- **Pagos**: Mercado Pago Marketplace (split automático)
- **Mail transaccional**: Resend
- **Procesamiento de imágenes**: sharp
- **Validación**: Zod
- **Tests**: Vitest + Supertest

## Arquitectura del monorepo

```
marketplace-diseños/
├── .husky/                    → Pre-commit (lint-staged) + commit-msg (commitlint)
├── .prettierrc.json
├── eslint.config.js           → Flat config (ESLint 9)
├── commitlint.config.js
├── package.json               → npm workspaces
├── docker-compose.yml         → PostgreSQL
├── packages/
│   └── shared/
│       └── src/
│           └── schemas.ts     → Zod schemas compartidos (types inferidos)
└── apps/
    ├── api/                   → Express API
    │   ├── migrations/        → Umzug (versionadas)
    │   ├── seeders/
    │   └── src/
    │       ├── modules/       → auth, designs, sellers, purchases, admin, payments
    │       ├── config/        → database, R2, Resend, MP, envs, plugins
    │       ├── errors/        → AppError, catchAsync, error.controller, errorMatchers
    │       └── middlewares/   → auth, upload, validateUUID, rateLimit
    └── web/                   → React + Vite
        └── src/
            ├── hooks/         → useDesigns() (mocks → fetch)
            ├── context/       → AuthContext, FavoritesContext, ToastContext
            ├── components/
            └── pages/
```

## Patrón de capas (backend)

```
Route → Controller → Service → Model
         ↓
    Validation (Zod)
```

Cada módulo sigue la estructura:

- `*.model.ts` — Modelo Sequelize
- `*.service.ts` — Clase con métodos de acceso a datos
- `*.controller.ts` — Handlers HTTP envueltos en `catchAsync`
- `*.route.ts` — Definición de rutas
- `*.middleware.ts` — Middlewares específicos del módulo
- `*.schema.ts` — Schemas Zod + funciones `validate*()` que retornan `{ hasError, errorMessages, data }`

## Stack de middleware (Express)

Orden en `app.ts`:

1. `helmet()` — headers de seguridad
2. `express.json()` — parseo de body
3. `cors()` — whitelist configurable
4. `express-rate-limit` — global + por endpoint sensible
5. `GET /health` — healthcheck
6. `/api/docs` — Swagger UI
7. `/api/v1` — router principal
8. `app.all('*')` — catch-all 404 con `AppError`
9. `globalErrorHandler` — handler global de errores

## Manejo de errores

- **AppError**: Clase con `statusCode`, `status` ("fail" 4xx / "error" 5xx), `isOperational: true`
- **catchAsync**: Wrapper que captura errores de handlers async y los pasa a `next()`
- **errorMatchers**: Array que convierte errores técnicos (Sequelize, JWT, Zod, Multer, PG) en AppErrors amigables
- **globalErrorHandler**: Dev expone el stack en la respuesta; Prod responde amigable. Persiste en la tabla `errors` (vía `modules/logs`) **solo los errores inesperados**: los 5xx y cualquier error no operativo (con stack, método, ruta, `user_id`, IP y user-agent; email/tokens se redactan antes de guardar). Los 4xx esperados (AppErrors con mensaje claro al cliente: 400/401/404/422, incluidos los que los controllers devuelven con `res.status(422)` directo) **no** se persisten para no generar ruido.

## Variables de entorno

- Centralizadas en `config/enviroments.ts`
- Validadas al arrancar con Zod (si falta alguna, el servidor no arranca)
- Nunca usar `process.env.X` directo — siempre `envs.X`
- `.env.example` documentado por grupos

## Tests

- **Vitest + Supertest**. Comando raíz: `npm test` (workspace `@marketplace/api`).
- **Base de datos aislada**: con `NODE_ENV=test` la API usa `TEST_DB_URI` (no `DB_URI`), para no tocar los datos de desarrollo. No hay CI, así que los tests corren en local.
- Crear la base de test una vez: `docker exec <container> psql -U marketplace -d postgres -c 'CREATE DATABASE marketplace_disenos_test'`. En instalaciones nuevas, `docker/initdb` la crea automáticamente en el primer arranque de Postgres.
- Los tests **fallan si la base no está disponible** (no se auto-saltan). Levantá Postgres antes: `npm run docker:up`.
- Los archivos corren en serie (`fileParallelism: false`) para evitar colisiones de emails/usuarios.
- Limpieza de datos de test que hayan quedado en la base de desarrollo: `node scripts/clean-test-data.js` (desde `apps/api`).

## Convenciones de código

- **Lenguaje**: JavaScript puro (no TypeScript en esta fase)
- **ESM**: `"type": "module"` — imports con extensión `.js` explícita
- **Comillas**: Single quotes
- **Prettier**: `semi: true`, `singleQuote: true`, `trailingComma: "es5"`, `printWidth: 100`
- **Naming**:
  - Archivos backend: `camelCase.js` (services, controllers, routes)
  - Modelos Sequelize: `PascalCase.js`
  - Componentes React: `PascalCase.jsx`
  - Variables de entorno: `SCREAMING_SNAKE_CASE`
- **Soft delete**: Todas las entidades usan `isDeleted: boolean` (no borrado físico)
- **Imports**: Todos con extensión `.js` explícita (ESM)
- **No hardcodear**: Valores configurables van en tabla `config` editable desde admin

## Metodología de desarrollo

1. **Frontend primero** con datos mockeados
2. Los mocks deben tener **exactamente el mismo shape** que la respuesta real de la API
3. Centralizar mocks en hooks únicos (ej: `useDesigns()`, `useSeller()`) que inicialmente devuelven mocks y luego se reemplazan por `fetch` real
4. Backend se desarrolla en paralelo, integración al final
5. No se usa Figma; el frontend navegable con mocks cumple la función de referencia visual

## Git y commits

- **Husky**: pre-commit ejecuta `lint-staged` (prettier + eslint), commit-msg ejecuta `commitlint`
- **Formato convencional**: `type(scope): descripción`
  - Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
  - Ejemplo: `feat(designs): agregar endpoint de carga de diseños`

## Reglas de seguridad (no negociables)

- Verificación de email obligatoria antes de comprar o vender
- Rate limiting en registro y login
- Captcha en formulario de registro
- Contraseñas hasheadas con bcrypt (salt rounds 12)
- JWT de corta duración + refresh token
- HTTPS obligatorio en producción
- URLs firmadas con expiración para descarga de archivos originales
- Publicar diseños solo con cuenta de MP conectada y verificada
- **Webhook de MP**: verificar la firma `x-signature` con `MP_WEBHOOK_SECRET`. Hoy `verifyWebhookSignature()` es un no-op → **bloqueante antes de producción**.

## Validación técnica al subir diseño

Antes de llegar a moderación, el sistema bloquea si no cumple:

- Resolución/DPI mínimo (configurable, ej: 150-300 dpi)
- Formato de archivo obligatorio (configurable)
- Peso de archivo mínimo (detecta archivos vacíos/corruptos)
- Metadata obligatoria: título, categoría, técnica, preview

## Flujo de compra y entrega

1. Vendedor sube diseño → `sharp` genera preview con marca de agua
2. Archivo original se guarda en bucket privado (R2)
3. Diseño pasa validación + moderación → se publica
4. Comprador paga → MP webhook confirma pago
5. Backend genera URL firmada temporal → envía mail con link/adjunto
6. Comprador puede re-descargar desde "Mis compras"

## Configuración

Editable desde panel admin (tabla `config`), solo mediante el endpoint `PUT /v1/admin/config` con **whitelist de claves**:

- Categorías (`categories`)
- Técnicas (`techniques`)

**No configurable (fijo en código, por seguridad):**

- Porcentaje de comisión y umbrales de rango → `apps/api/src/config/ranks.js`
- Formatos de archivo aceptados, texto/logo de marca de agua y DPI mínimo → hardcodeados en el procesamiento de imágenes

Cualquier otra clave enviada a `PUT /v1/admin/config` es rechazada (422).

## Roles

| Rol           | Descripción                                             |
| ------------- | ------------------------------------------------------- |
| **Vendedor**  | Sube diseños, cobra comisión, ve sus ventas/ganancias   |
| **Comprador** | Compra diseños, descarga archivos, deja ratings         |
| **Admin**     | Modera diseños, gestiona usuarios, configura comisiones |

## Pantallas mínimas

- Home/Catálogo (con filtros y búsqueda)
- Detalle de diseño
- Perfil de vendedor ("tienda")
- Checkout
- Panel del vendedor
- Panel del comprador ("Mis compras")
- Panel de moderación del admin
