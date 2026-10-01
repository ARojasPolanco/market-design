# Bugs.md — Marketplace de Diseños

Última actualización: 2026-09-16

---

## BUGS CRÍTICOS

### 1. Upload de diseño no guarda en DB
- **Ruta**: `/vendedor/panel/subir`
- **Error**: `POST /api/v1/designs` devuelve error
- **Causa**: El backend requiere `mp_connected: true` para crear diseños
- **Archivo**: `apps/api/src/modules/designs/design.controller.js` línea 43
- **Fix**: Quitar la restricción MP para testing, o conectar MP al vendedor

### 2. Admin no ve diseños pendientes (403)
- **Ruta**: `/admin` → tab Pendientes
- **Error**: `GET /api/v1/admin/designs/pending` devuelve 403
- **Causa**: El usuario logueado no tiene rol `admin` en la DB
- **Fix**: Cambiar rol a `admin` en la DB

### 3. Panel vendedor — datos hardcodeados
- **Ruta**: `/vendedor/panel`
- **Error**: `useSellerSales('s1')` y `useSellerDesigns('s1')` usan ID inválido
- **Archivo**: `apps/web/src/pages/SellerDashboard.jsx` línea 38-39
- **Fix**: Quitar `'s1'` y usar el hook sin parámetros (ya usa endpoint autenticado)

### 4. Diseño no aparece en admin después de crearlo
- **Ruta**: `/admin` → tab Pendientes
- **Error**: Diseño creado pero no visible en la cola
- **Causa**: Posiblemente el diseño se crea con status incorrecto o el endpoint filtra mal
- **Fix**: Verificar que `POST /api/v1/designs` crea con status `pending` y que `GET /api/v1/admin/designs/pending` lo devuelve

### 5. Puerto 3000 en uso (error recurrente)
- **Error**: `EADDRINUSE: address already in use :::3000`
- **Causa**: Procesos Node.js anteriores no liberan el puerto
- **Fix**: `taskkill /F /IM node.exe` antes de `npm run dev`

---

## BUGS MEDIOS

### 6. Hook useSellerSales no tiene endpoint
- **Archivo**: `apps/web/src/hooks/useDesigns.js` línea 196
- **Error**: `GET /api/v1/purchases/seller` devuelve 404
- **Fix**: Crear endpoint en backend o devolver datos vacíos

### 7. Hook useCategories llama endpoint de admin
- **Archivo**: `apps/web/src/hooks/useCategories.js`
- **Error**: `GET /api/v1/admin/config` devuelve 403 para no-admins
- **Fix**: Ya existe endpoint público `/api/v1/admin/categories`, actualizar el hook

### 8. Datos hardcodeados en hooks
- **Archivo**: `apps/web/src/hooks/useDesigns.js`
- **Problema**: `useSellerDesigns('s1')` usa ID mock
- **Fix**: Usar el endpoint autenticado `/v1/designs/my`

### 9. Category no es obligatoria pero el form la pide
- **Archivo**: `apps/web/src/pages/upload/UploadDesignPage.jsx`
- **Problema**: El campo categoría es opcional pero el datalist puede confundir
- **Fix**: Agregar placeholder más claro

### 10. Botón "Siguiente" sometimes blocked
- **Ruta**: `/vendedor/panel/subir` → Paso 3
- **Error**: El botón se desactiva aunque los campos están llenos
- **Causa**: `formData.price` se compara como string
- **Fix**: Usar `Number(formData.price) > 0`

---

## BUGS MENORES

### 11. placehold.co en RankDemoPage
- **Archivo**: `apps/web/src/pages/RankDemoPage.jsx` líneas 21-93
- **Problema**: Avatares usan placehold.co (no es real)
- **Fix**: Reemplazar con avatares reales o SVGs

### 12. placehold.co en BuyerDashboard
- **Archivo**: `apps/web/src/pages/BuyerDashboard.jsx` líneas 46, 379
- **Problema**: Avatar fallback usa placehold.co
- **Fix**: Usar SVG local o avatar con iniciales

### 13. console.error en hooks (21 ocurrencias)
- **Archivos**: `useDesigns.js`, `useSeller.js`, `useCategories.js`
- **Problema**: Muchos `console.error` en producción
- **Fix**: Usar un logger centralizado o quitar en producción

---

## ENDPOINTS FALTANTES EN BACKEND

| Endpoint | Método | Usado por |
|----------|--------|-----------|
| `/api/v1/purchases/seller` | GET | `useSellerSales()` |
| `/api/v1/badges/my-progress` | GET | Seller dashboard |

---

## DATOS HARDCODEADOS EN FRONTEND

| Archivo | Línea | Dato hardcodeado |
|---------|-------|------------------|
| `SellerDashboard.jsx` | 38 | `useSellerSales('s1')` |
| `SellerDashboard.jsx` | 39 | `useSellerDesigns('s1')` |
| `RankDemoPage.jsx` | 21-93 | Avatares placehold.co |
| `BuyerDashboard.jsx` | 46 | Avatar fallback placehold.co |

---

## ARCHIVOS QUE NECESITAN REVISIÓN

### Backend
- `design.controller.js` — restricción MP
- `design.service.js` — query con columnas
- `admin.route.js` — rutas protegidas

### Frontend
- `useDesigns.js` — hooks con endpoints incorrectos
- `SellerDashboard.jsx` — datos hardcodeados
- `BuyerDashboard.jsx` — avatar fallback

---

## PRÓXIMOS PASOS

1. Quitar restricción MP para testing
2. Verificar migraciones en DB
3. Crear endpoint de ventas del vendedor
4. Arreglar hooks del frontend
5. Testing completo
6. Deploy
