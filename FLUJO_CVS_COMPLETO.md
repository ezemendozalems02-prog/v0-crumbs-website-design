# Flujo Completo de CVs - CRUMBS

## Resumen del Sistema

El sistema de postulaciones tiene un flujo end-to-end que va desde la carga del CV hasta que llega al email del admin con el CV completo:

```
Candidato Carga CV
    ↓
Upload a Supabase Storage (bucket: cvs)
    ↓
Retorna URL pública de Supabase
    ↓
Se guarda en BD (postulaciones_trabajo.cv_url)
    ↓
Se envía email al admin CON EL CV ADJUNTO
    ↓
Se envía confirmación al candidato
    ↓
Admin ve el CV en el panel /admin/postulaciones
```

## 1. Carga del CV - Frontend

**Página:** `/app/trabaja-con-nosotros/page.tsx`

El formulario permite:
- Seleccionar archivo PDF, DOC, DOCX
- Tamaño máximo: 5 MB
- Validación antes de envío

```javascript
// Línea ~79-94: Upload a Supabase Storage
const formDataBlob = new FormData()
formDataBlob.append("file", archivo)

const uploadRes = await fetch("/api/upload-cv-supabase", {
  method: "POST",
  body: formDataBlob,
})

const uploadData = await uploadRes.json()
const cvUrl = uploadData.url // URL pública completa
```

## 2. Upload a Supabase Storage

**Endpoint:** `/app/api/upload-cv-supabase/route.ts`

**Proceso:**
1. Valida que sea PDF, DOC o DOCX
2. Limita a 5 MB máximo
3. Sube a `cvs/postulaciones/[timestamp]-[originalname].pdf`
4. Retorna URL pública: `https://[PROJECT].supabase.co/storage/v1/object/public/cvs/...`

**Respuesta:**
```json
{
  "url": "https://rfpvwywsryzygrkkbwsx.supabase.co/storage/v1/object/public/cvs/postulaciones/1712953400000-DELIVERY-Menu_digital_CRUMBS_Abril.pdf",
  "name": "DELIVERY-Menu_digital_CRUMBS_Abril.pdf"
}
```

## 3. Guardado en Base de Datos

**Tabla:** `postulaciones_trabajo`

**Campos:**
- `cv_url`: URL pública completa de Supabase
- `cv_nombre_archivo`: Nombre original del archivo
- Otros: nombre, teléfono, email, puesto, mensaje, estado

**Función:** `/lib/postulaciones.ts` → `guardarPostulacion()`

## 4. Envío de Email al Admin

**Endpoint:** `/app/api/send-postulacion/route.ts`

**Destinatario:** `crumbsc38@gmail.com`

**Contenido del Email:**
- Datos del candidato (nombre, teléfono, email)
- Puesto solicitado
- Mensaje adicional (si lo hay)
- **Sección CV:** Con botón "Descargar CV (PDF)" que enlaza a la URL pública
- El CV es clickeable directamente en el email

**HTML:**
```html
<div class="cv-section">
  <div>📄 Curriculum Vitae</div>
  <p>El CV está disponible en Supabase Storage</p>
  <a href="https://...storage/v1/object/public/cvs/..." 
     target="_blank" 
     class="button">Descargar CV (PDF)</a>
  <p>O abre el siguiente enlace: https://...storage/v1/object/public/cvs/...</p>
</div>
```

## 5. Email de Confirmación al Candidato

**Destinatario:** Email del candidato

**Contenido:**
- Confirmación de recibido
- Puesto para el cual postula
- Notificación de que el CV fue recibido ✓
- Próximos pasos
- Invitación a mantener datos actualizados

## 6. Panel de Admin

**URL:** `/admin/postulaciones`

**Funcionalidades:**
- Listar todas las postulaciones
- Ver detalles de cada una
- Botón para descargar CV (línea ~153-163)
- Cambiar estado de postulación
- Eliminar postulación

**Botón de CV:**
```jsx
{detalle.cv_url && (
  <a 
    href={detalle.cv_url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="..."
  >
    Descargar CV
  </a>
)}
```

## Configuración Necesaria

### Supabase Storage (COMPLETADO ✓)
- Bucket `cvs` creado y público
- Políticas RLS configuradas:
  - Lectura pública
  - Escritura autenticada
  - Actualización autenticada
  - Eliminación autenticada

### Resend (Configuración Esperada)
- Environment variable: `RESEND_API_KEY`
- Environment variable: `FROM_EMAIL` (ej: `noreply@crumbs.ar`)
- Si no están configuradas, el sistema guarda la postulación pero no envía email

## URLs Públicas de Ejemplo

Las URLs de Supabase Storage son **PÚBLICAS** y se ven así:

```
https://rfpvwywsryzygrkkbwsx.supabase.co/storage/v1/object/public/cvs/postulaciones/1712953400000-CV_Juan_Perez.pdf
```

- Se pueden compartir sin problemas
- Se pueden abrir en cualquier navegador
- No expiran
- No requieren autenticación para descargar

## Troubleshooting

### Error: "Bucket not found"
- Verificar que el bucket `cvs` existe en Supabase Storage
- Verificar que está configurado como público

### El email no se envía
- Verificar `RESEND_API_KEY` en environment variables
- Verificar `FROM_EMAIL` en environment variables
- Ver logs en `/app/api/send-postulacion/route.ts`

### El CV no se ve en el email
- Verificar que la URL de Supabase Storage es accesible
- Verificar que el cliente de Resend soporta enlaces HTTP en HTML
- Verificar que el bucket está configurado como público

## Seguridad

- Los CVs se guardan en Supabase Storage (infraestructura profesional)
- URLs públicas pero únicamente accesibles a través de la URL completa
- Bucket protegido con políticas RLS
- Solo usuarios autenticados en el panel pueden subir
- El admin puede descargar en cualquier momento
