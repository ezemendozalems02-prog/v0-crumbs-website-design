-- Crear tabla banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  enlace_url TEXT,
  posicion INT DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla secciones
CREATE TABLE IF NOT EXISTS secciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  posicion INT DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_banners_activo ON banners(activo);
CREATE INDEX IF NOT EXISTS idx_banners_posicion ON banners(posicion);
CREATE INDEX IF NOT EXISTS idx_secciones_activo ON secciones(activo);
CREATE INDEX IF NOT EXISTS idx_secciones_posicion ON secciones(posicion);
