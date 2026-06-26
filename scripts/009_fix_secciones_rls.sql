-- Fix: la tabla secciones tiene RLS activado pero le falta la politica de escritura
-- para el rol anon. Esto hace que cada UPDATE/INSERT desde el panel admin afecte
-- 0 filas y el cliente de Supabase devuelva "Cannot coerce the result to a single
-- JSON object" (PostgREST PGRST116) al hacer .select().single() sobre 0 filas.
--
-- Mismo modelo de seguridad ya usado en el resto del proyecto (productos, mesas,
-- reservation_times, etc.): la proteccion real de /admin/* la hace el middleware
-- via cookie admin_session, no RLS a nivel de base de datos.

ALTER TABLE secciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_public_select" ON secciones;
CREATE POLICY "allow_public_select" ON secciones
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow_public_write" ON secciones;
CREATE POLICY "allow_public_write" ON secciones
  FOR ALL USING (true) WITH CHECK (true);
