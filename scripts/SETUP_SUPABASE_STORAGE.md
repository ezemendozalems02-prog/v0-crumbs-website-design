-- Script para configurar Supabase Storage para CVs
-- Este script crea el bucket 'cvs' y configura las políticas de acceso

-- Nota: Este script debe ejecutarse manualmente en la consola de Supabase
-- No se puede ejecutar directamente con RLS porque Storage requiere configuración especial

-- 1. Crear el bucket 'cvs' (si no existe)
-- Ir a: Supabase Console → Storage → New Bucket
-- Nombre: cvs
-- Make it public: SI (para que las URLs sean públicas)
-- Allowed MIME types: application/pdf

-- 2. Las políticas de acceso se configuran así:

-- CREATE POLICY "Allow authenticated users to upload CVs"
-- ON storage.objects FOR INSERT TO authenticated
-- WITH CHECK (bucket_id = 'cvs' AND (storage.foldername(name))[1] = 'postulaciones');

-- CREATE POLICY "Allow public read access to CVs"
-- ON storage.objects FOR SELECT USING (bucket_id = 'cvs');

-- 3. Para eliminar un CV si es necesario:
-- DELETE FROM storage.objects WHERE bucket_id = 'cvs' AND name = 'postulaciones/RUTA_DEL_ARCHIVO.pdf'
