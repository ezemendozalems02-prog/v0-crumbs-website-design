-- Tabla de horarios de reserva configurables desde el panel admin
-- Reemplaza los horarios hardcodeados de almuerzo/cena en la pagina /reservas

CREATE TABLE IF NOT EXISTS reservation_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time TEXT NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('almuerzo', 'cena')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT reservation_times_time_format CHECK (time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  CONSTRAINT reservation_times_unique_per_meal UNIQUE (meal_type, time)
);

CREATE INDEX IF NOT EXISTS idx_reservation_times_active ON reservation_times(meal_type, is_active, sort_order);

-- Trigger para actualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reservation_times_updated_at ON reservation_times;
CREATE TRIGGER trg_reservation_times_updated_at
  BEFORE UPDATE ON reservation_times
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: lectura publica, escritura abierta (protegida por el middleware de /admin, no por RLS)
ALTER TABLE reservation_times ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_select" ON reservation_times
  FOR SELECT USING (true);

CREATE POLICY "allow_public_write" ON reservation_times
  FOR ALL USING (true) WITH CHECK (true);

-- Seed con los horarios actuales
INSERT INTO reservation_times (time, meal_type, sort_order) VALUES
  ('12:00', 'almuerzo', 0),
  ('12:30', 'almuerzo', 1),
  ('13:00', 'almuerzo', 2),
  ('13:30', 'almuerzo', 3),
  ('20:00', 'cena', 0),
  ('20:30', 'cena', 1),
  ('21:00', 'cena', 2),
  ('21:30', 'cena', 3),
  ('22:00', 'cena', 4)
ON CONFLICT (meal_type, time) DO NOTHING;
