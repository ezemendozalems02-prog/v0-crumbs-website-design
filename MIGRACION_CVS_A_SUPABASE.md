# Migración de CVs: Vercel Blob → Supabase Storage

## Resumen del Cambio
Los CVs de postulaciones ahora se suben a **Supabase Storage** en lugar de Vercel Blob, con URLs públicas completas guardadas en la base de datos.

## Archivos Modificados

### 1. Nuevo Endpoint: `/api/upload-cv-supabase` (NUEVO)
- **Archivo:** `app/api/upload-cv-supabase/route.ts`
- **Qué hace:**
  - Valida el archivo PDF (máx 5MB)
  - Sube a Supabase Storage en bucket `cvs` → carpeta `postulaciones/`
  - Retorna URL pública completa: `https://XXX.supabase.co/storage/v1/object/public/cvs/postulaciones/...`
- **Retorna:** `{ url, path, fileName, size }`

### 2. Página de Postulaciones: `app/trabaja-con-nosotros/page.tsx` (MODIFICADO)
- **Cambio:** Línea 80 ahora llama `/api/upload-cv-supabase` en lugar de `/api/upload-cv`
- **Cambio:** Línea 94 extrae `uploadData.url` en lugar de `uploadData.pathname`
- **Resultado:** La URL pública completa se guarda en la BD automáticamente

### 3. Endpoint Antiguo: `/api/upload-cv` (DEPRECADO)
- **Estado:** Sigue funcionando pero ya no se usa
- **Recomendación:** Puede eliminarse después de verificar que no hay referencias
- **Archivo:** `app/api/upload-cv/route.ts`

## Requisitos en Supabase

### 1. Crear el bucket `cvs`
1. Ir a Supabase Dashboard → Storage
2. Clic en "New Bucket"
3. Nombre: `cvs`
4. **Make it public: SÍ** ✓ (importante para URLs públicas)
5. Allowed MIME types: `application/pdf`
6. Crear

### 2. Políticas de Acceso (RLS)
Las políticas se configuran automáticamente si:
- El bucket está público
- Los archivos están en la carpeta `postulaciones/`

Opcional - configurar manualmente:
```sql
CREATE POLICY "Allow public read CVs"
ON storage.objects FOR SELECT USING (bucket_id = 'cvs');

CREATE POLICY "Allow upload via service_role"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cvs');
```

## Flujo de Guardado

1. **Cliente:** Usuario sube CV en `app/trabaja-con-nosotros`
2. **API:** POST a `/api/upload-cv-supabase`
3. **Supabase Storage:** Archivo guardado en `cvs/postulaciones/{timestamp-random}.pdf`
4. **API:** Retorna URL pública completa
5. **Cliente:** POST a `/api/send-postulacion` con URL pública
6. **BD (Supabase):** Tabla `postulaciones_trabajo` guarda:
   - `cv_url`: URL pública completa (ej: `https://...supabase.co/storage/v1/object/public/cvs/...`)
   - `cv_nombre_archivo`: Nombre original del archivo (ej: `mi-cv.pdf`)

## URLs Guardadas en BD

**Antes (Blob):**
```
cvs/1712937600000-mi-cv.pdf
```

**Después (Supabase):**
```
https://your-project.supabase.co/storage/v1/object/public/cvs/postulaciones/1712937600000-abc123.pdf
```

## Beneficios

✅ URLs públicas accesibles directamente  
✅ No depende de endpoints privados  
✅ Almacenamiento integrado con Supabase  
✅ Más escalable para el volumen de archivos  
✅ URLs permanentes y estables  

## Verificación

Para verificar que todo funciona:
1. Ir a `app/trabaja-con-nosotros`
2. Rellenar formulario y subir un PDF
3. En la BD (tabla `postulaciones_trabajo`), verificar que `cv_url` contiene una URL completa de Supabase
4. Hacer clic en la URL en el admin panel - debe abrir el PDF

## Rollback (si es necesario)

Si necesitas volver a Blob:
1. Cambiar `/api/upload-cv-supabase` → `/api/upload-cv` en `app/trabaja-con-nosotros/page.tsx` línea 80
2. Cambiar `uploadData.url` → `uploadData.pathname` en línea 94
