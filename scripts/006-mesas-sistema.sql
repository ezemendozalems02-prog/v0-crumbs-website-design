-- TABLA 1: Configuración de Mesas (Inventario del restaurante)
CREATE TABLE IF NOT EXISTS configuracion_mesas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capacidad INT NOT NULL UNIQUE CHECK (capacidad > 0),
  cantidad INT NOT NULL CHECK (cantidad > 0),
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
COMMENT ON TABLE configuracion_mesas IS 'Inventario de mesas: ej. 5 mesas de 2 personas, 3 mesas de 4 personas';

-- TABLA 2: Reservas de Mesas (Log de asignaciones)
CREATE TABLE IF NOT EXISTS reservas_mesas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
  capacidad_mesa INT NOT NULL,
  cantidad_mesas INT NOT NULL CHECK (cantidad_mesas > 0),
  mesas_ids TEXT[] DEFAULT '{}',
  assigned_at TIMESTAMP DEFAULT NOW(),
  freed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
COMMENT ON TABLE reservas_mesas IS 'Rastrea qué mesas se asignaron a cada reserva';
CREATE INDEX IF NOT EXISTS idx_reservas_mesas_reserva_id ON reservas_mesas(reserva_id);

-- TABLA 3: Caché de Disponibilidad (Para performance)
CREATE TABLE IF NOT EXISTS disponibilidad_mesas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL,
  horario TEXT NOT NULL,
  capacidad INT NOT NULL,
  disponibles INT NOT NULL,
  reservado INT NOT NULL,
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(fecha, horario, capacidad)
);
COMMENT ON TABLE disponibilidad_mesas IS 'Caché de disponibilidad por fecha/horario/capacidad';
CREATE INDEX IF NOT EXISTS idx_disponibilidad_mesas_fecha_horario ON disponibilidad_mesas(fecha, horario);

-- AGREGAR COLUMNAS A TABLA RESERVAS EXISTENTE
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS mesas_asignadas JSONB DEFAULT '[]';
ALTER TABLE reservas ADD COLUMN IF NOT EXISTS asignacion_automatica BOOLEAN DEFAULT false;
COMMENT ON COLUMN reservas.mesas_asignadas IS 'Array con detalle de mesas asignadas: [{capacidad, cantidad, ids}]';

-- FUNCIÓN: Obtener disponibilidad de mesas para una fecha/horario
CREATE OR REPLACE FUNCTION obtener_disponibilidad_mesas(p_fecha DATE, p_horario TEXT)
RETURNS TABLE(capacidad INT, disponibles INT, reservado INT, total INT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cm.capacidad,
    cm.cantidad - COALESCE(SUM(rm.cantidad_mesas), 0) as disponibles,
    COALESCE(SUM(rm.cantidad_mesas), 0) as reservado,
    cm.cantidad as total
  FROM configuracion_mesas cm
  LEFT JOIN reservas_mesas rm ON rm.capacidad_mesa = cm.capacidad
  LEFT JOIN reservas r ON r.id = rm.reserva_id 
    AND r.fecha_reserva = p_fecha 
    AND r.horario = p_horario
    AND r.estado IN ('confirmada', 'pendiente')
  WHERE cm.activo = true
  GROUP BY cm.capacidad, cm.cantidad
  ORDER BY cm.capacidad;
END;
$$ LANGUAGE plpgsql;

-- FUNCIÓN: Asignar mesas inteligentemente a una reserva
CREATE OR REPLACE FUNCTION asignar_mesas_reserva(
  p_reserva_id UUID,
  p_fecha DATE,
  p_horario TEXT,
  p_cantidad_personas INT
)
RETURNS JSONB AS $$
DECLARE
  v_mesas_asignadas JSONB := '[]'::JSONB;
  v_personas_restantes INT := p_cantidad_personas;
  v_capacidad INT;
  v_disponibles INT;
  v_cantidad_mesas INT;
  v_asignacion_record RECORD;
BEGIN
  -- Obtener mesas disponibles de menor a mayor capacidad (optimización)
  FOR v_asignacion_record IN 
    SELECT 
      cm.capacidad,
      cm.cantidad - COALESCE(SUM(rm.cantidad_mesas), 0) as disponibles
    FROM configuracion_mesas cm
    LEFT JOIN reservas_mesas rm ON rm.capacidad_mesa = cm.capacidad
    LEFT JOIN reservas r ON r.id = rm.reserva_id 
      AND r.fecha_reserva = p_fecha 
      AND r.horario = p_horario
      AND r.estado IN ('confirmada', 'pendiente')
    WHERE cm.activo = true
    GROUP BY cm.capacidad, cm.cantidad
    ORDER BY cm.capacidad ASC
  LOOP
    v_capacidad := v_asignacion_record.capacidad;
    v_disponibles := v_asignacion_record.disponibles;
    
    IF v_disponibles > 0 AND v_personas_restantes > 0 THEN
      -- Calcular cuántas mesas de esta capacidad necesitamos
      v_cantidad_mesas := CEIL(v_personas_restantes::FLOAT / v_capacidad);
      v_cantidad_mesas := LEAST(v_cantidad_mesas, v_disponibles);
      
      IF v_cantidad_mesas > 0 THEN
        v_mesas_asignadas := v_mesas_asignadas || jsonb_build_object(
          'capacidad', v_capacidad,
          'cantidad', v_cantidad_mesas,
          'personas_asignadas', v_cantidad_mesas * v_capacidad
        );
        
        v_personas_restantes := v_personas_restantes - (v_cantidad_mesas * v_capacidad);
      END IF;
    END IF;
    
    EXIT WHEN v_personas_restantes <= 0;
  END LOOP;
  
  -- Si no se pudieron asignar suficientes mesas, retornar error
  IF v_personas_restantes > 0 THEN
    RAISE EXCEPTION 'No hay suficientes mesas disponibles para % personas', p_cantidad_personas;
  END IF;
  
  -- Guardar las asignaciones en la tabla reservas_mesas
  FOR v_asignacion_record IN
    SELECT * FROM jsonb_to_recordset(v_mesas_asignadas) AS x(capacidad INT, cantidad INT, personas_asignadas INT)
  LOOP
    INSERT INTO reservas_mesas (reserva_id, capacidad_mesa, cantidad_mesas)
    VALUES (p_reserva_id, v_asignacion_record.capacidad, v_asignacion_record.cantidad);
  END LOOP;
  
  RETURN v_mesas_asignadas;
END;
$$ LANGUAGE plpgsql;

-- FUNCIÓN: Liberar mesas al cancelar una reserva
CREATE OR REPLACE FUNCTION liberar_mesas_reserva(p_reserva_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE reservas_mesas
  SET freed_at = NOW()
  WHERE reserva_id = p_reserva_id AND freed_at IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ÍNDICES para performance
CREATE INDEX IF NOT EXISTS idx_disponibilidad_mesas_fecha ON disponibilidad_mesas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_mesas_capacidad ON reservas_mesas(capacidad_mesa);
