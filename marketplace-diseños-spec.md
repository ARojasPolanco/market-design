# Marketplace de Diseños — Especificación para Agente de IA

## Objetivo del producto

Marketplace donde diseñadores (estampadores, sublimadores, papelería) suben y venden diseños digitales. Los compradores los adquieren y reciben automáticamente por mail el archivo en alta calidad, listo para imprimir.

Stack a usar: **Node.js + Express + PostgreSQL + React**.

---

## 1. Modelo de negocio

- Comisión por venta (no suscripción). Porcentaje **configurable desde el panel admin**, sin valor fijo en código.
- Split automático del pago vía **Mercado Pago Marketplace**: en la misma transacción, el vendedor recibe su parte y la plataforma retiene su comisión (`application_fee` / split de MP).
- Cada vendedor conecta su propia cuenta de Mercado Pago vía OAuth para poder cobrar.

---

## 2. Roles y paneles

### Vendedor

- Registro con email (verificación de email **obligatoria** antes de poder publicar).
- Conecta cuenta de Mercado Pago — **no se pide DNI**; la verificación de identidad queda delegada a la validación de MP (CBU/CUIT).
- Sube diseños → quedan en estado "pendiente" hasta aprobación del admin.
- Panel: listado de sus diseños, ventas realizadas, ganancias, rating recibido.
- **Verificación automática por sistema** (sin intervención manual):
  - Badge "Vendedor verificado": se activa solo cuando tiene email confirmado + cuenta de MP conectada y verificada + perfil completo (foto, descripción).
  - Badge "Top seller" / "Vendedor de confianza": se activa automático tras alcanzar X ventas concretadas sin disputas (regla de negocio corrida periódicamente en backend).
- Al subir un diseño, debe aceptar checkbox obligatorio: _"Declaro que este diseño es de mi autoría o tengo los derechos para venderlo"_ (protección legal, queda registrado con timestamp).

### Comprador

- Registro con email (verificación de email obligatoria antes de poder comprar).
- Panel "Mis compras": historial de compras + botón de re-descarga (por si vence el link o pierde el mail).
- Puede dejar rating (1-5 estrellas) **solo si compró ese diseño** (evita reviews falsas).
- Favoritos / Wishlist: guardar diseños para comprar después.
- Datos de cuenta: nombre, email, cambio de contraseña.

### Admin

- Cola de moderación: ve diseños pendientes con preview + categoría + vendedor. Aprueba o rechaza (con motivo obligatorio si rechaza, para que el vendedor sepa qué corregir).
- Checklist de moderación (criterio objetivo, no subjetivo):
  - ¿Es original o copia obvia de marca/personaje con derechos de autor? → rechazar.
  - ¿La preview se ve nítida y representa fielmente el diseño?
  - ¿Está categorizado correctamente (no forzado a otra categoría para más visibilidad)?
  - ¿Título/descripción son coherentes, sin spam?
- Listado de usuarios (vendedores y compradores) con estado activo/suspendido.
- Gestión de denuncias (diseños reportados como robados/copiados quedan marcados para revisión).
- Reportes de ventas y comisiones generadas.
- Configuración del % de comisión.

---

## 3. Validación técnica automática al subir un diseño

Bloquea la publicación **antes** de llegar a moderación si no se cumple:

- Resolución/DPI mínimo (a definir el valor exacto, ej. 150-300 dpi según estándar imprimible).
- Formato de archivo obligatorio: solo los formatos de entrega definidos (ver punto 6). Rechaza JPG de baja calidad, capturas de pantalla, etc.
- Peso de archivo mínimo (detecta archivos vacíos/corruptos).
- Metadata obligatoria completa: título, categoría, técnica, al menos una preview generada correctamente. Sin esto, el formulario no permite enviar.

---

## 4. Flujo de compra y entrega automática

1. Vendedor sube diseño → proceso automático server-side (librería `sharp` en Node) genera:
   - Preview de baja resolución (ej. 800-1000px de ancho) con **marca de agua en patrón diagonal repetido**, opacidad 15-25% (visible pero no invasiva, no debe tapar el diseño).
   - El archivo original de alta calidad se guarda en bucket **privado** (S3 o Cloudflare R2), nunca accesible por URL directa.
2. Diseño pasa validación técnica + moderación admin → se publica.
3. Comprador paga → Mercado Pago dispara **webhook** al backend confirmando el pago.
4. El webhook:
   - Genera una **URL firmada temporal** (expira en X horas) hacia el archivo original.
   - Dispara el envío de mail (proveedor: Resend — a confirmar/reemplazar según preferencia del cliente) con el archivo adjunto o el link de descarga.
5. El comprador también puede re-descargar en cualquier momento desde "Mis compras" (esto no depende del link firmado del mail, sino de un endpoint autenticado).

---

## 5. Descubrimiento / features de catálogo

- **Reputación de vendedores**: rating 1-5 (solo de compradores reales), visible en el perfil.
- **Más vendidos**: sección histórica + sección "tendencia" (más vendidos últimos 7 días), para rotar contenido en home.
- **Categorías cruzadas**: por técnica (estampado / sublimado / papelería) + por temática (infantil, deportivo, religioso, frases, animales, etc.).
- **Filtros de búsqueda**: categoría, técnica, rango de precio, rating del vendedor, orden por más recientes/más vendidos.
- **Perfil de vendedor tipo "tienda"**: página con todos los diseños de ese vendedor.
- **Diseños relacionados**: "otros de este vendedor" / "similares en esta categoría" en la vista de detalle.
- **Búsqueda por texto libre**: alcanza con full-text search nativo de PostgreSQL (`pg_trgm` o similar) para el MVP, no hace falta Elasticsearch.
- **Vista previa ampliable** (zoom/modal grande): importante en este rubro para que el comprador vea el detalle antes de comprar.

---

## 6. Pendiente de definir con el cliente (dejar como configurable, no hardcodeado)

- Porcentaje exacto de comisión.
- Formatos de archivo de entrega final (propuesta: PDF + PNG 300dpi, posible .zip con ambos).
- Proveedor de mail transaccional (propuesta: Resend).
- Proveedor de storage (propuesta: S3 o Cloudflare R2).
- Texto/logo exacto de la marca de agua (placeholder por ahora).
- Valor exacto de dpi/resolución mínima aceptada en la validación técnica.

---

## 7. Onboarding de vendedores

No se implementa como documento/tutorial aparte, sino integrado en el flujo de carga:

- **Pantalla de bienvenida** (3-4 pasos/tarjetas), mostrada antes de habilitar la primera carga: formatos aceptados, resolución mínima, qué se rechaza automáticamente, qué revisa el moderador.
- **Feedback en tiempo real durante la carga**: si el archivo no cumple specs (ej. dpi bajo), mostrarlo al instante en el formulario, no que el vendedor se entere recién cuando lo rechazan.
- **Ejemplo visual "diseño aprobado" vs "diseño rechazado"**, con explicación breve de motivo.
- Contenido a cubrir:
  - Specs técnicas: dpi mínimo, formatos aceptados, tamaño de archivo.
  - Qué NO se acepta: contenido con copyright de terceros, diseños borrosos/baja calidad, spam en título/descripción.
  - Cómo se calcula su ganancia (ejemplo simple con la comisión aplicada).
  - Tiempo estimado de moderación (ej. 24-48hs).
  - Cómo funciona el sistema de reputación.
- División clara: **lo obligatorio** (specs técnicas — ya se aplica solo vía validación automática, ver punto 3) vs **lo recomendado** (buenas prácticas para vender más, tips de preview, categorización) — lo recomendado no bloquea el proceso, queda como guía opcional.

## 8. Notificaciones de aprobación / rechazo (mail vía Resend)

- **Diseño aprobado** → mail automático al vendedor con tono motivador: confirmación + próximos pasos (ver su tienda pública, recordatorio de cómo se calculan las ganancias).
- **Diseño rechazado** → mail automático al vendedor incluyendo el **motivo cargado por el admin** (input de texto libre en el panel de moderación), invitando a revisar y corregir, con link directo a su sección de "Rechazados".
- **Sección "Rechazados" en el panel del vendedor**:
  - Lista los diseños rechazados con el motivo visible.
  - Acciones disponibles: **editar y reenviar** (vuelve a validación técnica automática completa + cola de moderación del admin, sin atajos) o **eliminar** definitivamente.

## 9. Sistema de recompensas: comisión escalonada por volumen

- Comisión base configurable (ver punto 1), pero se reduce automáticamente según niveles de volumen de ventas. Ejemplo ilustrativo, porcentajes no definitivos: 20% base → 18% al alcanzar una meta de ventas → 15% (tope mínimo) al alcanzar una meta mayor.
- Cálculo automático en backend, sin intervención manual del admin (mismo mecanismo que el badge "Top seller").
- Se calcula sobre **período móvil** (ej. últimos 90 días), no acumulado histórico total — recompensa a quien vende bien actualmente y evita que alguien quede "atado" a un nivel viejo sin estar activo.
- Rangos y porcentajes de cada nivel **configurables desde el panel admin**, no hardcodeados.
- Visibilidad para el vendedor en su panel: nivel actual + cuánto le falta para bajar de nivel de comisión.
- Mail automático (Resend) al subir de nivel, felicitándolo por la reducción de comisión — mismo patrón que las notificaciones de aprobación/rechazo (punto 8).

## 10. Seguridad obligatoria (no negociable, independiente de la velocidad de entrega)

- Verificación de email obligatoria antes de comprar o vender.
- Rate limiting en registro y login (`express-rate-limit` o similar).
- Captcha (reCAPTCHA/hCaptcha) en el formulario de registro.
- Contraseñas hasheadas con bcrypt.
- JWT de corta duración + refresh token (no tokens eternos).
- HTTPS obligatorio en producción.
- URLs firmadas con expiración para toda descarga de archivo original.
- Publicar diseños solo permitido con cuenta de cobro (MP) conectada y verificada.

---

## 8. Metodología de desarrollo (importante para el agente)

- **Frontend primero**, con datos hardcodeados/mockeados que tengan **exactamente el mismo shape** que va a tener la respuesta real de la API (mismos nombres de campo: `id`, `title`, `price`, `previewUrl`, `sellerName`, `category`, `technique`, `rating`, etc.).
- Centralizar los mocks en un único módulo o hook (ej. `useDesigns()`) que hoy devuelve datos mockeados y luego solo se reemplaza el contenido interno por el `fetch` real — el resto de los componentes no debe modificarse.
- Backend se desarrolla en paralelo, integración al final.
- Pantallas mínimas a mockear primero: catálogo/home, detalle de diseño, perfil de vendedor ("tienda"), checkout, panel del vendedor, panel del comprador ("mis compras"), panel de moderación del admin.
- No se usa Figma; el frontend navegable con mocks cumple la función de referencia visual para el cliente.
