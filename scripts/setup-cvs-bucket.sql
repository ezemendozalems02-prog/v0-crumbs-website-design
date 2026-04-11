-- Script para crear el bucket CVS en Supabase Storage
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- O usar: supabase_apply_migration

INSERT INTO storage.buckets (id, name, public)
VALUES ('cvs', 'cvs', true)
ON CONFLICT DO NOTHING;

-- Configurar políticas RLS para que sea públicamente legible pero solo escriba el owner
CREATE POLICY "Public read access on cvs" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'cvs')
  WITH CHECK (bucket_id = 'cvs');

CREATE POLICY "Authenticated users can upload CVs" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'cvs' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their own CVs" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'cvs' 
    AND auth.uid() = owner
  );
