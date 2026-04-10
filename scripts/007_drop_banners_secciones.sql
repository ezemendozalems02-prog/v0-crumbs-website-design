-- ============================================================
-- Script: 007_drop_banners_secciones.sql
-- Descripción: Eliminación segura de las tablas "banners" y "secciones"
-- Motivo: Tablas sin uso en la aplicación actual ni planificadas a futuro
-- Fecha: 2026-04-10
-- ============================================================

-- PASO 1: Verificar existencia antes de proceder
-- Si las tablas no existen, los DROP IF EXISTS no producirán error.

-- PASO 2: Respaldar datos en tablas temporales de archivo
-- (por si se necesita recuperar información histórica)
DO $$
BEGIN
  -- Archivar banners si la tabla existe y tiene datos
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'banners'
  ) THEN
    RAISE NOTICE 'Tabla banners encontrada. Procediendo con respaldo y eliminación.';

    -- Crear tabla de respaldo
    CREATE TABLE IF NOT EXISTS _archivo_banners AS
    SELECT * FROM banners;

    RAISE NOTICE 'Respaldo creado en _archivo_banners con % filas.',
      (SELECT COUNT(*) FROM _archivo_banners);
  ELSE
    RAISE NOTICE 'Tabla banners no existe. Se omite el respaldo.';
  END IF;

  -- Archivar secciones si la tabla existe y tiene datos
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'secciones'
  ) THEN
    RAISE NOTICE 'Tabla secciones encontrada. Procediendo con respaldo y eliminación.';

    -- Crear tabla de respaldo
    CREATE TABLE IF NOT EXISTS _archivo_secciones AS
    SELECT * FROM secciones;

    RAISE NOTICE 'Respaldo creado en _archivo_secciones con % filas.',
      (SELECT COUNT(*) FROM _archivo_secciones);
  ELSE
    RAISE NOTICE 'Tabla secciones no existe. Se omite el respaldo.';
  END IF;
END $$;

-- PASO 3: Eliminar Foreign Keys dependientes (si existen)
DO $$
DECLARE
  r RECORD;
BEGIN
  -- Buscar y eliminar constraints que referencian a banners
  FOR r IN (
    SELECT tc.constraint_name, tc.table_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.referential_constraints rc
      ON tc.constraint_name = rc.constraint_name
    JOIN information_schema.table_constraints ccu
      ON rc.unique_constraint_name = ccu.constraint_name
    WHERE ccu.table_name IN ('banners', 'secciones')
    AND tc.constraint_type = 'FOREIGN KEY'
  ) LOOP
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I', r.table_name, r.constraint_name);
    RAISE NOTICE 'Foreign key % eliminada de tabla %', r.constraint_name, r.table_name;
  END LOOP;
END $$;

-- PASO 4: Eliminar políticas RLS si existen
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname, tablename
    FROM pg_policies
    WHERE tablename IN ('banners', 'secciones')
    AND schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
    RAISE NOTICE 'Política RLS % eliminada de tabla %', r.policyname, r.tablename;
  END LOOP;
END $$;

-- PASO 5: Eliminar triggers si existen
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT trigger_name, event_object_table
    FROM information_schema.triggers
    WHERE event_object_table IN ('banners', 'secciones')
    AND trigger_schema = 'public'
  ) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', r.trigger_name, r.event_object_table);
    RAISE NOTICE 'Trigger % eliminado de tabla %', r.trigger_name, r.event_object_table;
  END LOOP;
END $$;

-- PASO 6: Eliminar las tablas
DROP TABLE IF EXISTS public.banners CASCADE;
DROP TABLE IF EXISTS public.secciones CASCADE;

-- PASO 7: Verificar que la eliminación fue exitosa
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'banners'
  ) THEN
    RAISE NOTICE '✓ Tabla banners eliminada correctamente.';
  ELSE
    RAISE WARNING '✗ La tabla banners NO fue eliminada.';
  END IF;

  IF NOT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'secciones'
  ) THEN
    RAISE NOTICE '✓ Tabla secciones eliminada correctamente.';
  ELSE
    RAISE WARNING '✗ La tabla secciones NO fue eliminada.';
  END IF;

  -- Verificar respaldos
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = '_archivo_banners'
  ) THEN
    RAISE NOTICE '✓ Respaldo _archivo_banners disponible.';
  END IF;

  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = '_archivo_secciones'
  ) THEN
    RAISE NOTICE '✓ Respaldo _archivo_secciones disponible.';
  END IF;
END $$;
