# Task.md — Desarrollo Marketplace de Diseños

## Estado actual: Frontend MVP completado, Backend pendiente

---

## Fase 0: Setup del monorepo y tooling ✅

- [x] Monorepo con npm workspaces (apps/api, apps/web, packages/shared)
- [x] Husky + lint-staged + commitlint
- [x] ESLint 9 flat config + Prettier
- [x] Docker Compose (PostgreSQL 16)
- [x] Variables de entorno (.env.example)
- [x] Scripts raíz (dev, dev:web, build, lint, format, docker:up)
- [x] Verificación (npm install, lint, format, docker)

---

## Fase 1: Frontend — Home + Catálogo + Detalle + Tienda ✅

- [x] Setup Vite + React + Tailwind CSS
- [x] Axios instance con interceptor JWT
- [x] Contextos: Auth, Favorites, Toast
- [x] Hooks de mocks: useDesigns (25 diseños), useSeller (4 vendedores)
- [x] Componentes: Navbar, Footer, DesignCard, RatingStars, SellerBadge, Skeletons, EmptyStates
- [x] Home: Hero, features, slogan, categorías, tendencia, destacados
- [x] Catálogo: Grid, filtros (categoría, técnica, precio, orden), pills de filtros activos, empty state
- [x] Detalle: Preview con zoom, info, vendedor, reviews, login para comprar/review
- [x] Tienda: Perfil de vendedor con diseños

---

## Fase 2: Frontend — Checkout + Paneles ✅

- [x] Checkout: Resumen de compra, pantalla de éxito con aviso de email + invitación a review
- [x] Panel vendedor: Stats, diseños, pendientes, rechazados, ventas, editar perfil, nivel de comisión
- [x] Panel comprador: Compras, favoritos, sugerencias por intereses, editar perfil
- [x] Panel admin: Moderación (aprobar/rechazar con motivo), usuarios, denuncias, categorías, config

---

## Fase 3: Frontend — Auth + Onboarding ✅

- [x] Login: Formulario + link "¿Olvidaste tu contraseña?"
- [x] Registro: Nombre completo, username, email, contraseña, checkbox "Quiero vender" con campo tienda
- [x] Onboarding de vendedores: 4 tarjetas animadas (specs, qué no se acepta, ganancia, moderación)
- [x] Formulario de carga: Wizard de 4 pasos (archivo, preview, info, declaración) + preview en tiempo real

---

## Fase 3.5: Sistema de rangos ✅

- [x] Componentes SVG: Bronce, Plata, Oro, Platino, Diamante
- [x] Rangos automáticos: Bronce (20%), Plata (18%), Oro (15%)
- [x] Rangos manuales: Platino (12%, admin only), Diamante (10%, primeros 10)
- [x] Admin: Modal para cambiar rangos de vendedores
- [x] Panel vendedor Diamante: Banner, stats extendidos, logros
- [x] Demo de rangos (/demo/rangos)

---

## Fase 4: Backend — Auth y seguridad ⬜

- [ ] Configurar Sequelize + Umzug + migraciones
- [ ] Migración 001: tabla `users`, tabla `errors`
- [ ] Plugins: bcrypt (encrypted-password), JWT (generate-jwt)
- [ ] Módulo Auth: model, service, schema, controller, route, middleware
- [ ] Seguridad: helmet, cors, rate-limit, captcha
- [ ] Errores: AppError, catchAsync, errorMatchers, globalErrorHandler
- [ ] Verificación de email (token + mail con Resend)
- [ ] Tests: registro, login, rutas protegidas

---

## Fase 5: Backend — Designs CRUD + validación técnica ⬜

- [ ] Migración 002: designs, design_files
- [ ] Módulo Designs: model, service, schema, controller, route
- [ ] Storage R2: uploadFile, getSignedUrl, deleteFile
- [ ] Upload Multer: memoryStorage, filtro MIME
- [ ] Sharp: preview con marca de agua, validación DPI/formato/peso
- [ ] Full-text search: pg_trgm, índices GIN
- [ ] Tests: CRUD, filtros, validación técnica

---

## Fase 6: Backend — Purchases + webhook MP + entrega ⬜

- [ ] Migración 003: purchases, ratings
- [ ] Módulo Purchases: model, service, schema, controller, route
- [ ] Mercado Pago: OAuth, createPreference, webhook, verifyPayment
- [ ] Entrega automática: URL firmada + mail con link
- [ ] Re-descarga autenticada
- [ ] Ratings: solo si compró
- [ ] Tests: flujo de compra completo

---

## Fase 7: Backend — Admin + moderación ⬜

- [ ] Migración 004: moderation_logs, favorites, config, reports
- [ ] Módulo Admin: moderación, config, reportes, denuncias
- [ ] Módulo Favorites: CRUD
- [ ] Sistema de rangos: lógica automática + manual
- [ ] Tests: moderación, favoritos, config

---

## Fase 8: Backend — Comisión escalonada + badges ⬜

- [ ] Comisión por período móvil (90 días)
- [ ] Niveles configurables desde admin
- [ ] Badge "Vendedor verificado" automático
- [ ] Badge "Top seller" automático
- [ ] Notificaciones mail (Resend)

---

## Fase 9: Integración ⬜

- [ ] Reemplazar useDesigns() mock → fetch real
- [ ] Reemplazar useSeller() mock → fetch real
- [ ] Reemplazar usePurchases() mock → fetch real
- [ ] Reemplazar useCategories() mock → fetch real
- [ ] Conectar auth, upload, checkout, paneles
- [ ] Testing end-to-end

---

## Fase 10: Pulido y producción ⬜

- [ ] HTTPS en producción
- [ ] Logs y monitoreo (Winston)
- [ ] Documentación API (Swagger)
- [ ] Tests completos
- [ ] Variables de entorno producción
- [ ] CORS producción
