# Task.md — Desarrollo Marketplace de Diseños

## Estado actual: Fase 0 pendiente

---

## Fase 0: Setup del monorepo y tooling

### 0.1 Monorepo con npm workspaces

- [ ] Crear `package.json` raíz con `"workspaces": ["apps/*", "packages/*"]`
- [ ] Crear `apps/api/package.json` (@marketplace/api)
- [ ] Crear `apps/web/package.json` (@marketplace/web)
- [ ] Crear `packages/shared/package.json` (@marketplace/shared)

### 0.2 Husky + lint-staged + commitlint

- [ ] Instalar husky: `npm install -D husky`
- [ ] Inicializar: `npx husky init`
- [ ] Crear `.husky/pre-commit` → `npx lint-staged`
- [ ] Crear `.husky/commit-msg` → `npx --no-install commitlint --edit $1`
- [ ] Instalar lint-staged y configurar en package.json raíz
- [ ] Instalar commitlint y crear `commitlint.config.js`

### 0.3 ESLint 9 + Prettier

- [ ] Instalar eslint, @eslint/js, eslint-config-prettier
- [ ] Crear `eslint.config.js` (flat config)
- [ ] Crear `.prettierrc.json` (singleQuote, semi, trailingComma es5, printWidth 100)

### 0.4 Docker Compose (PostgreSQL)

- [ ] Crear `docker-compose.yml` con PostgreSQL 16

### 0.5 Variables de entorno

- [ ] Crear `apps/api/.env.example` documentado

### 0.6 Scripts raíz

- [ ] Scripts: dev, dev:web, build, lint, format, test, docker:up, docker:down, prepare

### 0.7 Verificación

- [ ] `npm install` sin errores
- [ ] `npm run lint` funciona
- [ ] `npm run format` funciona
- [ ] `docker compose up -d` levanta PostgreSQL
- [ ] Husky pre-commit dispara lint-staged

---

## Fase 1: Frontend — Mocks + Home + Detalle + Tienda

### 1.1 Setup del frontend

- [ ] Configurar Vite + React en `apps/web`
- [ ] Instalar Tailwind CSS v4 + @tailwindcss/vite
- [ ] Instalar react-router-dom, axios, framer-motion, lucide-react
- [ ] Configurar Axios instance con interceptor JWT en `config/api.js`
- [ ] Configurar React Router DOM en `App.jsx`
- [ ] Crear contextos: AuthContext, FavoritesContext, ToastContext

### 1.2 Mocks centralizados

- [ ] `hooks/useDesigns()` — mocks con shape idéntico a API real
- [ ] `hooks/useSeller()` — datos de vendedor
- [ ] Shape: id, title, price, previewUrl, sellerName, sellerAvatar, category, technique, rating, salesCount, createdAt
- [ ] Mocks de vendedor: id, name, avatar, rating, salesCount, isVerified, isTopSeller, description

### 1.3 Componentes base

- [ ] Navbar (responsive, links, badge favoritos)
- [ ] Footer
- [ ] DesignCard (preview, título, precio, vendedor, rating, badges)
- [ ] SellerBadge (verificado / top seller)
- [ ] RatingStars (1-5 estrellas)
- [ ] FilterBar (categoría, técnica, precio, rating, orden)
- [ ] SearchBar (texto libre)
- [ ] Pagination
- [ ] LoadingSkeleton
- [ ] EmptyState
- [ ] ErrorState
- [ ] Toast (notificaciones)
- [ ] ConfirmModal

### 1.4 Pantalla Home/Catálogo

- [ ] Hero section con diseño destacado
- [ ] Sección "Más vendidos"
- [ ] Sección "Tendencia" (últimos 7 días)
- [ ] Grid de diseños con cards
- [ ] Filtros funcionales (categoría, técnica, precio, rating)
- [ ] Ordenamiento (recientes, más vendidos, tendencia)
- [ ] Búsqueda por texto libre
- [ ] Paginación

### 1.5 Detalle de diseño

- [ ] Preview ampliable (zoom/modal grande)
- [ ] Info: título, descripción, precio, categoría, técnica
- [ ] Vendedor: avatar, nombre, rating, badge verificado/top seller
- [ ] Diseños relacionados (mismo vendedor / misma categoría)
- [ ] Botón "Comprar" y "Agregar a favoritos"
- [ ] Sección de ratings/reviews

### 1.6 Perfil de vendedor ("tienda")

- [ ] Info del vendedor (avatar, descripción, rating, badges)
- [ ] Grid de todos sus diseños
- [ ] Filtros dentro de la tienda

---

## Fase 2: Frontend — Checkout + Paneles

### 2.1 Checkout

- [ ] Resumen de compra (diseño, precio, vendedor)
- [ ] Formulario de datos (nombre, email)
- [ ] Botón de pago (mock de Mercado Pago)
- [ ] Pantalla de confirmación/éxito
- [ ] Pantalla de error/pago pendiente

### 2.2 Panel del vendedor

- [ ] Dashboard con stats (ventas, ganancias, rating)
- [ ] Listado de diseños (pendientes, aprobados, rechazados)
- [ ] Sección "Rechazados" con motivo visible + acciones
- [ ] Ventas realizadas
- [ ] Ganancias (con desglose de comisión)
- [ ] Nivel de comisión actual + progreso
- [ ] Formulario de carga de diseño (con validación en tiempo real)

### 2.3 Panel del comprador ("Mis compras")

- [ ] Historial de compras
- [ ] Botón de re-descarga por cada compra
- [ ] Rating (1-5 estrellas) — solo si compró
- [ ] Favoritos / Wishlist

### 2.4 Panel de Admin (moderación)

- [ ] Cola de diseños pendientes (preview, categoría, vendedor)
- [ ] Acciones: aprobar / rechazar (con motivo obligatorio)
- [ ] Listado de usuarios (activos/suspendidos)
- [ ] Gestión de denuncias
- [ ] Reportes de ventas y comisiones
- [ ] Configuración de % de comisión

---

## Fase 3: Frontend — Auth UI + Onboarding

### 3.1 Auth UI

- [ ] Login
- [ ] Registro (con captcha placeholder)
- [ ] Verificación de email (pantalla éxito/error)
- [ ] Perfil de usuario

### 3.2 Onboarding de vendedores

- [ ] Pantalla de bienvenida (3-4 pasos)
- [ ] Feedback en tiempo real al cargar diseño
- [ ] Ejemplos visuales "aprobado vs rechazado"

---

## Fase 4: Backend — Auth y seguridad

- [ ] Configurar Sequelize + Umzug + migraciones
- [ ] Migración 001: users, errors
- [ ] Plugins: encrypted-password, generate-jwt
- [ ] Módulo Auth: model, service, schema, controller, route, middleware
- [ ] Seguridad: helmet, cors, rate-limit, captcha
- [ ] Errores: AppError, catchAsync, errorMatchers, globalErrorHandler
- [ ] Verificación de email (token + mail)
- [ ] Tests: registro, login, rutas protegidas

---

## Fase 5: Backend — Designs CRUD + validación técnica

- [ ] Migración 002: designs, design_files
- [ ] Módulo Designs: model, service, schema, controller, route
- [ ] Storage R2: uploadFile, getSignedUrl, deleteFile
- [ ] Upload Multer: memoryStorage, filtro MIME
- [ ] Sharp: preview con marca de agua, validación DPI/formato/peso
- [ ] Full-text search: pg_trgm, índices GIN
- [ ] Tests: CRUD, filtros, validación técnica

---

## Fase 6: Backend — Purchases + webhook MP + entrega

- [ ] Migración 003: purchases, ratings
- [ ] Módulo Purchases: model, service, schema, controller, route
- [ ] Mercado Pago: OAuth, createPreference, webhook, verifyPayment
- [ ] Entrega automática: URL firmada + mail con link
- [ ] Re-descarga autenticada
- [ ] Ratings: solo si compró
- [ ] Tests: flujo de compra completo

---

## Fase 7: Backend — Admin + moderación

- [ ] Migración 004: moderation_logs, favorites, config, reports
- [ ] Módulo Admin: moderación, config, reportes, denuncias
- [ ] Módulo Favorites: CRUD
- [ ] Checklist de moderación (criterios objetivos)
- [ ] Configuración editable desde admin
- [ ] Tests: moderación, favoritos, config

---

## Fase 8: Backend — Comisión escalonada + badges

- [ ] Comisión por período móvil (90 días)
- [ ] Niveles configurables desde admin
- [ ] Badge "Vendedor verificado" automático
- [ ] Badge "Top seller" automático
- [ ] Notificaciones mail (Resend)
- [ ] Tests: cálculo de comisión, badges

---

## Fase 9: Integración

- [ ] Reemplazar useDesigns() mock → fetch real
- [ ] Reemplazar useSeller() mock → fetch real
- [ ] Reemplazar usePurchases() mock → fetch real
- [ ] Reemplazar useAdmin() mock → fetch real
- [ ] Conectar auth, upload, checkout, paneles
- [ ] Testing end-to-end

---

## Fase 10: Pulido y producción

- [ ] HTTPS en producción
- [ ] Logs y monitoreo (Winston)
- [ ] Documentación API (Swagger)
- [ ] Tests completos
- [ ] Variables de entorno producción
- [ ] CORS producción
