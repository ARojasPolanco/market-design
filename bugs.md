# Bugs.md — Marketplace de Diseños

## Estado actual: Revisión completa del código

Última actualización: 2026-09-16

---

## BUGS CRÍTICOS (bloquean funcionalidad)

### 1. Upload de diseño no guarda en DB
- **Pantalla**: `/vendedor/panel/subir`
- **Error**: `POST /api/v1/designs` devuelve error de conexión
- **Causa probable**: El backend requiere MP conectado para crear diseños, el usuario vendedor no tiene MP conectado
- **Fix**: Verificar que el seller tiene `mp_connected: true` antes de permitir upload, o quitar esa restricción para testing
- **Archivo backend**: `apps/api/src/modules/designs/design.controller.js` línea ~43
- **Archivo frontend**: `apps/web/src/pages/upload/UploadDesignPage.jsx` línea ~121

### 2. Admin no ve diseños pendientes (403 Forbidden)
- **Pantalla**: `/admin` → tab Pendientes
- **Error**: `GET /api/v1/admin/designs/pending` devuelve 403
- **Causa probable**: El usuario logueado no tiene rol `admin` en la DB
- **Fix**: Cambiar el rol del usuario a `admin` directamente en la DB
- **Archivo backend**: `apps/api/src/modules/admin/admin.route.js`

### 3. Panel de vendedor muestra datos incorrectos
- **Pantalla**: `/vendedor/panel`
- **Error**: Ventas siempre en 0, diseños no aparecen
- **Causa**: `useSellerSales()` devuelve datos vacíos (no hay endpoint `/api/v1/purchases/seller`)
- **Fix**: Crear endpoint para obtener ventas del vendedor
- **Archivo**: `apps/web/src/hooks/useDesigns.js` línea ~194

---

## BUGS MEDIOS (afectan UX pero no bloquean)

### 4. Categorías no se cargan en el admin (403)
- **Pantalla**: `/admin` → tab Categorías
- **Error**: `GET /api/v1/admin/config` devuelve 403 para no-admins
- **Causa**: El hook `useCategories()` intenta leer config de admin
- **Fix**: Ya creamos endpoint público `/api/v1/admin/categories`, pero hay que actualizar el hook
- **Archivo**: `apps/web/src/hooks/useCategories.js`

### 5. Diseños pendientes no aparecen en admin
- **Pantalla**: `/admin` → tab Pendientes
- **Error**: Los diseños se crean pero no aparecen en la cola de moderación
- **Causa**: Los diseños se crean con status `pending` pero el endpoint de pendientes puede estar filtrando por admin
- **Fix**: Verificar que `GET /api/v1/admin/designs/pending` funciona para admins

### 6. Favoritos no persisten entre sesiones
- **Pantalla**: Cualquiera
- **Error**: Los favoritos se pierden al recargar
- **Causa**: El `FavoritesContext` intenta leer de localStorage cuando no hay token, pero el hook no guarda en localStorage
- **Fix**: Asegurar que `useFavorites` guarde en localStorage cuando no hay usuario logueado

### 7. Error al cargar el diseño (500)
- **Pantalla**: Detalle de diseño
- **Error**: `GET /api/v1/designs/:id` devuelve 500
- **Causa**: El endpoint intenta leer `previewUrls` y `previewKeys` que no existen en la DB
- **Fix**: Verificar que la migración 005 se aplicó correctamente
- **Archivo**: `apps/api/src/modules/designs/design.service.js`

---

## BUGS MENORES (cosméticos o no urgentes)

### 8. Rate limit muy estricto para testing
- **Error**: Después de varias requests, devuelve 429
- **Fix**: Aumentar el límite en `.env` o en el código

### 9. Botón "Siguiente" en upload sometimes blocked
- **Pantalla**: `/vendedor/panel/subir` → Paso 3
- **Error**: El botón se desactiva aunque los campos están llenos
- **Causa**: `formData.price` se compara como string, `Number()` no se aplica correctamente
- **Fix**: Verificar que `Number(formData.price) > 0` funciona

### 10. Puerto 3000 en uso
- **Error**: `EADDRINUSE: address already in use :::3000`
- **Causa**: Procesos Node.js anteriores no liberan el puerto
- **Fix**: `taskkill /F /IM node.exe` antes de `npm run dev`

### 11. Error 500 en consola (sin impacto visible)
- **Error**: `GET /api/v1/admin/config` devuelve 500
- **Causa**: El endpoint de config intenta leer de la tabla `config` que puede no tener datos
- **Fix**: Verificar que la migración 004 sembró los datos por defecto

---

## ENDPOINTS FALTANTES (el frontend llama pero no existen)

| Endpoint | Método | Usado por | Estado |
|----------|--------|-----------|--------|
| `/api/v1/purchases/seller` | GET | `useSellerSales()` | ❌ No existe |
| `/api/v1/designs?sellerId=:id` | GET | `useSellerDesigns()` | ❌ UUID inválido (era "s1") |
| `/api/v1/admin/reports` | GET | `useAdminReports()` | ⚠️ Endpoint existe, sin datos |
| `/api/v1/badges/my-progress` | GET | Seller dashboard | ❌ No existe |

---

## ENDPOINTS EXISTENTES QUE NECESITAN FIX

| Endpoint | Problema | Fix |
|----------|----------|-----|
| `POST /api/v1/designs` | Requiere `mp_connected` | Quitar restricción para testing |
| `GET /api/v1/admin/designs/pending` | Requiere rol `admin` | Asegurar que el usuario test es admin |
| `GET /api/v1/admin/config` | Solo para admins | Crear endpoint público para categorías |
| `GET /api/v1/designs/:id` | Falta `preview_urls` en DB | Verificar migración 005 |

---

## ARCHIVOS QUE NECESITAN REVISIÓN

### Backend
- `apps/api/src/modules/designs/design.controller.js` — restricción MP
- `apps/api/src/modules/designs/design.service.js` — query con columnas faltantes
- `apps/api/src/modules/admin/admin.route.js` — rutas protegidas
- `apps/api/src/modules/purchases/purchase.route.js` — endpoints faltantes

### Frontend
- `apps/web/src/hooks/useDesigns.js` — hooks con endpoints incorrectos
- `apps/web/src/hooks/useCategories.js` — hook llama endpoint de admin
- `apps/web/src/pages/SellerDashboard.jsx` — datos hardcodeados
- `apps/web/src/pages/upload/UploadDesignPage.jsx` — validación y submit

---

## PRÓXIMOS PASOS (orden sugerido)

1. **Arreglar endpoint de diseños** → quitar restricción MP para testing
2. **Verificar migraciones** → asegurar que todas las tablas/columnas existen
3. **Crear endpoint de ventas del vendedor** → `/api/v1/purchases/seller`
4. **Arreglar hooks del frontend** → usar endpoints correctos
5. **Testing completo** → recorrer cada pantalla y documentar errores
6. **Deploy** → cuando todo funcione

---

## TOKENS

Sí, podés conectarte con otra cuenta de opencode. El proyecto está en GitHub (`dev` branch), así que la otra cuenta puede clonar el repo y continuar exactamente donde dejamos. Solo necesitás:

1. Clonar el repo en la otra cuenta
2. Instalar dependencias: `npm install`
3. Levantar Docker: `docker compose up -d postgres`
4. El `.env` ya está configurado

---

## NOTAS

- Los tests del backend (41 tests) pasan correctamente
- El frontend no tiene tests automatizados
- Docker Desktop debe estar abierto para que funcione PostgreSQL
- Las credenciales de R2, MP y Resend están en `apps/api/.env`
