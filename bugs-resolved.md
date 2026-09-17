# Bugs Resolved.md — Marketplace de Diseños

Última actualización: 2026-09-16

---

## BUG 1: Upload de diseño no guarda en DB
- **Causa**: El backend requería `mp_connected: true` para crear diseños
- **Fix**: Quité la verificación de MP en `design.controller.js` para testing
- **Archivo**: `apps/api/src/modules/designs/design.controller.js`
- **Aprendizaje**: Las restricciones de negocio no deben bloquear el testing

## BUG 2: Admin no ve diseños pendientes (403)
- **Causa**: El endpoint requiere rol admin, el usuario test no lo tenía
- **Fix**: Verificar que el usuario tiene rol `admin` en la DB
- **Aprendizaje**: Los tests deben crear usuarios con los roles correctos

## BUG 3: Panel vendedor — datos hardcodeados
- **Causa**: `useSellerSales('s1')` y `useSellerDesigns('s1')` usaban ID mock
- **Fix**: Quitar el parámetro y usar endpoints autenticados
- **Archivo**: `apps/web/src/pages/SellerDashboard.jsx`
- **Aprendizaje**: Nunca usar IDs mock en hooks que llaman a la API real

## BUG 4: Diseño no aparece en admin después de crearlo
- **Causa**: El endpoint `/admin/pending` requiere rol admin, no está disponible para sellers
- **Fix**: El seller ve sus propios diseños pendientes usando `/designs/my` filtrado por status
- **Archivo**: `apps/web/src/pages/SellerDashboard.jsx`
- **Aprendizaje**: Separar endpoints de admin vs seller

## BUG 5: Hook useSellerSales no tiene endpoint
- **Causa**: El frontend llamaba a `/api/v1/purchases/seller` que no existía
- **Fix**: Crear endpoint `GET /api/v1/purchases/my/sales` que devuelve ventas del vendedor autenticado
- **Archivo**: `apps/api/src/modules/purchases/purchase.route.js`
- **Aprendizaje**: Verificar que todos los endpoints existen antes de conectar el frontend

## BUG 6: Hook useCategories llama endpoint de admin
- **Causa**: El hook llamaba a `/api/v1/admin/config` que requiere rol admin
- **Fix**: Crear endpoint público `/api/v1/admin/categories` y actualizar el hook
- **Archivo**: `apps/web/src/hooks/useCategories.js`
- **Aprendizaje**: Los endpoints de lectura pública deben ser accesibles sin autenticación

## BUG 7: useSellerDesigns usa ID mock
- **Causa**: El hook pasaba `'s1'` como sellerId
- **Fix**: Usar endpoint autenticado `/v1/designs/my`
- **Archivo**: `apps/web/src/hooks/useDesigns.js`
- **Aprendizaje**: Los hooks deben usar endpoints autenticados, no IDs hardcodeados

## BUG 8: Puerto 3000 en uso
- **Causa**: Procesos Node.js anteriores no liberan el puerto
- **Fix**: `taskkill /F /IM node.exe` antes de `npm run dev`
- **Aprendizaje**: Agregar manejo de errores para EADDRINUSE

## BUG 9: Botón "Siguiente" bloqueado
- **Causa**: `formData.price` se comparaba como string
- **Fix**: Usar `Number(formData.price) > 0`
- **Archivo**: `apps/web/src/pages/upload/UploadDesignPage.jsx`
- **Aprendizaje**: Siempre convertir a número antes de comparar

## BUG 10: placehold.co en avatares
- **Causa**: Los avatares fallback usaban placehold.co
- **Fix**: Usar SVG local o avatar con iniciales
- **Aprendizaje**: No depender de servicios externos para assets estáticos

---

## ENDPOINTS CREADOS

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/auth/profile/:id` | GET | Perfil público de vendedor |
| `/api/v1/admin/categories` | GET | Categorías (público) |
| `/api/v1/purchases/my/sales` | GET | Ventas del vendedor |

---

## ARCHIVOS MODIFICADOS

### Backend
- `design.controller.js` — Quitar restricción MP
- `purchase.route.js` — Agregar ruta de ventas
- `purchase.controller.js` — Agregar getMySales
- `auth.route.js` — Agregar ruta de perfil público
- `admin.route.js` — Agregar ruta de categorías pública

### Frontend
- `SellerDashboard.jsx` — Quitar datos hardcodeados
- `useDesigns.js` — hooks sin parámetros, endpoint de ventas
- `useCategories.js` — endpoint público
- `UploadDesignPage.jsx` — validación de precio

---

## LECCIONES APRENDIDAS

1. **Validar endpoints antes de conectar el frontend** — No asumir que todos los endpoints existen
2. **No usar IDs mock en hooks** — Usar endpoints autenticados
3. **Separar endpoints públicos y protegidos** — Los datos de lectura pública no deben requerir auth
4. **Siempre convertir tipos antes de comparar** — JavaScript compara strings diferente a números
5. **Los tests deben crear usuarios con roles correctos** — No asumir que el usuario tiene el rol necesario
