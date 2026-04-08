-- Crear tabla postulaciones_trabajo
CREATE TABLE IF NOT EXISTS postulaciones_trabajo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  puesto TEXT NOT NULL,
  mensaje TEXT,
  cv_url TEXT,
  cv_nombre_archivo TEXT,
  estado TEXT DEFAULT 'nueva',
  origen TEXT DEFAULT 'web_crumbs'
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_postulaciones_email ON postulaciones_trabajo(email);
CREATE INDEX IF NOT EXISTS idx_postulaciones_puesto ON postulaciones_trabajo(puesto);
CREATE INDEX IF NOT EXISTS idx_postulaciones_estado ON postulaciones_trabajo(estado);
CREATE INDEX IF NOT EXISTS idx_postulaciones_created ON postulaciones_trabajo(created_at DESC);

-- RLS: permitir lectura/escritura a admin
ALTER TABLE postulaciones_trabajo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_write_postulaciones" 
  ON postulaciones_trabajo 
  FOR ALL 
  USING (true)
  WITH CHECK (true);
