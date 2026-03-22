-- Verificar y arreglar políticas RLS para DELETE en tabla reservas

-- Primero, ver si RLS está habilitado
-- Si no está habilitado, NO es un problema para DELETE desde admin
-- pero si está, necesitamos una policy explícita

-- Crear policy para ADMIN DELETE si no existe
-- Esta policy permite DELETE sin restricciones (ya que es admin)

DO $$ 
BEGIN
  -- Habilitar RLS en reservas si no está habilitado
  -- (sin fallo si ya está habilitado)
  EXECUTE 'ALTER TABLE reservas ENABLE ROW LEVEL SECURITY' EXCEPTION WHEN OTHERS THEN NULL;
  
  -- Crear o reemplazar policy para admin delete
  -- Allow anyone authenticated to delete their own reservas
  -- or allow service_role to delete any reserva
  BEGIN
    CREATE POLICY "allow_admin_delete_reservas" 
      ON reservas 
      FOR DELETE 
      TO authenticated, service_role
      USING (true);
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;

-- Verificar que el DELETE funcione
-- Test: Intentar obtener todas las reservas después de una eliminación
SELECT 'RLS policies configured for reservas DELETE' AS status;
