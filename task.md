# Task.md — Marketplace de Diseños

Estado actual: 2026-10-01

## Resumen

Backend y frontend integrados. Fases 0–9 completas. Suite de tests **86/86** corriendo
sobre una base de datos de test dedicada (no toca la base de desarrollo).

## Bases de datos

- **Desarrollo**: `marketplace_diseños` (`DB_URI`).
- **Test**: `marketplace_disenos_test` (`TEST_DB_URI`, se usa con `NODE_ENV=test`).
- Creación de la base de test: `docker/initdb` (primer arranque) o manual (ver AGENTS.md).
- Limpieza de datos de test que hayan quedado en desarrollo: `node scripts/clean-test-data.js`.

## Hecho

- **Auth**: registro/login, verificación de email, JWT, cambio de contraseña, suspensión.
- **Diseños**: upload wizard, validación técnica, preview con marca de agua (Cloudinary),
  original en R2 (URLs firmadas), múltiples previews, edición de precio/descripción,
  reemplazo de preview con revisión de admin, eliminación con solicitud.
- **Compras**: Mercado Pago (preferencia + webhook + simulación), snapshot de comisión,
  entrega por mail con link de descarga, re-descarga desde "Mis compras", ratings.
- **Admin**: moderación (aprobar/rechazar/pausar), usuarios, categorías/técnicas, denuncias,
  estadísticas, solicitudes (previews/eliminaciones).
- **Rangos/comisiones**: Bronce 20%, Plata 18% (50+), Oro 15% (200+), Platino 12% y
  Diamante 10% (manuales). Fuente única en `apps/api/src/config/ranks.js`.
- **Notificaciones**: in-app + mails transaccionales (Resend).
- **Frontend**: home, catálogo, detalle, tienda, checkout, paneles (vendedor, comprador,
  admin), favoritos, términos/privacidad.

## Decisiones clave

- **Comisión fija en código**, no editable desde el panel admin. `PUT /v1/admin/config`
  tiene whitelist: solo `categories` y `techniques` (el resto → 422).
- **Categoría**: texto libre sugerido por el vendedor; el admin asigna la real al aprobar.
- **Previews** siempre con marca de agua (Cloudinary); **originales** en R2 (bucket privado).
- **Soft delete**: los diseños aprobados se eliminan vía solicitud + aprobación de admin.
- **Link de descarga del mail**: de un solo uso; re-descarga desde el panel.

## Pendiente

- **M5 (prod)**: implementar la verificación de firma `x-signature` del webhook de MP
  (`verifyWebhookSignature()` es un no-op). Bloqueante antes de producción.
- **Producción (Fase 10)**: HTTPS, logging (Winston), Swagger, CORS/MP definitivos.
- **Tests manuales de UI** pendientes (placeholder de preview, toasts, modales, galería,
  notificaciones, rangos, `/compra/:token`).

## Comandos

- `npm run dev` — API + web en desarrollo.
- `npm test` — suite (workspace `@marketplace/api`).
- `npm run docker:up` — levanta PostgreSQL.
- `node scripts/clean-test-data.js` — desde `apps/api`.
