-- Tabla de reservas para CRUMBS
-- Stock total por fecha: 100 cubiertos compartidos entre todas las mesas

CREATE TABLE IF NOT EXISTS reservas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  fecha_reserva DATE NOT NULL,
  horario TEXT NOT NULL,
  tipo_mesa TEXT NOT NULL CHECK (tipo_mesa IN ('mesa_2', 'mesa_4', 'mesa_6', 'mesa_8_plus')),
  cantidad_personas INTEGER NOT NULL CHECK (cantidad_personas >= 1 AND cantidad_personas <= 15),
  requerimiento_especial TEXT,
  tolerancia_aceptada BOOLEAN NOT NULL DEFAULT false,
  cubiertos_consumidos INTEGER NOT NULL CHECK (cubiertos_consumidos >= 1 AND cubiertos_consumidos <= 15),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
  whatsapp_enviado BOOLEAN DEFAULT false
);

-- Índice para consultas rápidas por fecha y estado
CREATE INDEX IF NOT EXISTS idx_reservas_fecha_estado ON reservas(fecha_reserva, estado);

-- Habilitar RLS (sin políticas restrictivas ya que no hay auth de usuario para reservas públicas)
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT público (cualquiera puede hacer una reserva)
CREATE POLICY "allow_public_insert" ON reservas
  FOR INSERT
  WITH CHECK (true);

-- Política para permitir SELECT público (para consultar disponibilidad)
CREATE POLICY "allow_public_select" ON reservas
  FOR SELECT
  USING (true);

-- Función para calcular disponibilidad por fecha
CREATE OR REPLACE FUNCTION get_disponibilidad(p_fecha DATE)
RETURNS TABLE (
  total_cubiertos INTEGER,
  cubiertos_reservados BIGINT,
  cubiertos_disponibles BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    100 AS total_cubiertos,
    COALESCE(SUM(cubiertos_consumidos), 0)::BIGINT AS cubiertos_reservados,
    (100 - COALESCE(SUM(cubiertos_consumidos), 0))::BIGINT AS cubiertos_disponibles
  FROM reservas
  WHERE fecha_reserva = p_fecha
    AND estado IN ('pendiente', 'confirmada');
END;
$$;

-- Función para crear reserva con validación de stock
CREATE OR REPLACE FUNCTION crear_reserva(
  p_nombre TEXT,
  p_telefono TEXT,
  p_fecha_reserva DATE,
  p_horario TEXT,
  p_tipo_mesa TEXT,
  p_cantidad_personas INTEGER,
  p_requerimiento_especial TEXT DEFAULT NULL,
  p_tolerancia_aceptada BOOLEAN DEFAULT false
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  reserva_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_disponibles BIGINT;
  v_reserva_id UUID;
BEGIN
  -- Validar tolerancia aceptada
  IF NOT p_tolerancia_aceptada THEN
    RETURN QUERY SELECT false, 'Debes aceptar la política de tolerancia', NULL::UUID;
    RETURN;
  END IF;

  -- Validar capacidad según tipo de mesa
  IF p_tipo_mesa = 'mesa_2' AND p_cantidad_personas > 2 THEN
    RETURN QUERY SELECT false, 'La mesa para 2 permite hasta 2 personas', NULL::UUID;
    RETURN;
  ELSIF p_tipo_mesa = 'mesa_4' AND p_cantidad_personas > 4 THEN
    RETURN QUERY SELECT false, 'La mesa para 4 permite hasta 4 personas', NULL::UUID;
    RETURN;
  ELSIF p_tipo_mesa = 'mesa_6' AND p_cantidad_personas > 6 THEN
    RETURN QUERY SELECT false, 'La mesa para 6 permite hasta 6 personas', NULL::UUID;
    RETURN;
  ELSIF p_tipo_mesa = 'mesa_8_plus' AND (p_cantidad_personas < 8 OR p_cantidad_personas > 15) THEN
    RETURN QUERY SELECT false, 'La mesa para 8+ permite entre 8 y 15 personas', NULL::UUID;
    RETURN;
  END IF;

  -- Consultar disponibilidad actual (con bloqueo para evitar race conditions)
  SELECT (100 - COALESCE(SUM(cubiertos_consumidos), 0))::BIGINT
  INTO v_disponibles
  FROM reservas
  WHERE fecha_reserva = p_fecha_reserva
    AND estado IN ('pendiente', 'confirmada')
  FOR UPDATE;

  -- Validar stock suficiente
  IF v_disponibles < p_cantidad_personas THEN
    RETURN QUERY SELECT false, 
      format('No hay cupo suficiente. Disponibles: %s, Solicitados: %s', v_disponibles, p_cantidad_personas),
      NULL::UUID;
    RETURN;
  END IF;

  -- Insertar reserva
  INSERT INTO reservas (
    nombre,
    telefono,
    fecha_reserva,
    horario,
    tipo_mesa,
    cantidad_personas,
    requerimiento_especial,
    tolerancia_aceptada,
    cubiertos_consumidos,
    estado
  ) VALUES (
    p_nombre,
    p_telefono,
    p_fecha_reserva,
    p_horario,
    p_tipo_mesa,
    p_cantidad_personas,
    p_requerimiento_especial,
    p_tolerancia_aceptada,
    p_cantidad_personas, -- cubiertos_consumidos = cantidad_personas
    'pendiente'
  )
  RETURNING id INTO v_reserva_id;

  RETURN QUERY SELECT true, 'Reserva creada correctamente', v_reserva_id;
END;
$$;
