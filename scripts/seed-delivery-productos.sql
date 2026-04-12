-- ============================================================
-- SEED DELIVERY PRODUCTOS
-- Inserta categorías faltantes y todos los productos de delivery
-- NO borra nada existente, NO crea nuevas tablas
-- ============================================================

-- 1. CREAR CATEGORÍAS FALTANTES (solo las que no existen aún)
INSERT INTO categorias (nombre, slug, tipo_menu, orden, activo)
SELECT 'Entradas', 'entradas-delivery', 'delivery', 1, true
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE slug = 'entradas-delivery');

INSERT INTO categorias (nombre, slug, tipo_menu, orden, activo)
SELECT 'Hamburguesas', 'hamburguesas-delivery', 'delivery', 2, true
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE slug = 'hamburguesas-delivery');

INSERT INTO categorias (nombre, slug, tipo_menu, orden, activo)
SELECT 'Platos', 'platos-delivery', 'delivery', 5, true
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE slug = 'platos-delivery');

INSERT INTO categorias (nombre, slug, tipo_menu, orden, activo)
SELECT 'Ensaladas', 'ensaladas-delivery', 'delivery', 6, true
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE slug = 'ensaladas-delivery');

INSERT INTO categorias (nombre, slug, tipo_menu, orden, activo)
SELECT 'Pizzas', 'pizzas-delivery', 'delivery', 7, true
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE slug = 'pizzas-delivery');

INSERT INTO categorias (nombre, slug, tipo_menu, orden, activo)
SELECT 'Sándwiches', 'sandwiches-delivery', 'delivery', 8, true
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE slug = 'sandwiches-delivery');

-- ============================================================
-- 2. ENTRADAS
-- ============================================================
WITH cat AS (SELECT id FROM categorias WHERE slug = 'entradas-delivery')
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, orden)
SELECT nombre, descripcion, precio, cat.id, true, orden FROM cat, (VALUES
  ('Papas Fritas',           'Papas fritas crocantes',                               7000,  1),
  ('Papas a Caballo',        'Papas fritas con huevo frito',                         9400,  2),
  ('Papas Bar',              'Papas fritas con cheddar, bacon y cebolla caramelizada',13200, 3),
  ('Quesadillas de Pollo',   'Quesadillas rellenas con pollo grillé',                14500, 4),
  ('Quesadillas 4 Quesos',   'Quesadillas rellenas con mezcla de 4 quesos',          14500, 5),
  ('Mini Burritos x3',       'Mini burritos rellenos x3 unidades',                  11000, 6),
  ('Tequeños',               'Tequeños de queso, crujientes por fuera',              12000, 7),
  ('Empanadas x3',           'Empanadas x3 unidades',                               12000, 8),
  ('Langostinos en Panko',   'Langostinos rebozados en panko con salsa dip',        15200, 9),
  ('Rabas',                  'Rabas crocantes con limón',                           15800, 10),
  ('Nuggets',                'Nuggets de pollo crocantes con salsa',                13200, 11),
  ('Nachos',                 'Nachos con guacamole, queso y pico de gallo',         13200, 12)
) AS p(nombre, descripcion, precio, orden)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 3. HAMBURGUESAS (con variantes simple/doble)
-- ============================================================
WITH cat AS (SELECT id FROM categorias WHERE slug = 'hamburguesas-delivery')
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, orden)
SELECT nombre, descripcion, precio, cat.id, true, orden FROM cat, (VALUES
  ('Americana',     'Hamburguesa con cheddar, lechuga, tomate, cebolla y salsa especial', 15500, 1),
  ('Parrillera',    'Hamburguesa con cheddar, bacon, cebolla caramelizada y salsa BBQ',   15500, 2),
  ('Clásica',       'Hamburguesa con lechuga, tomate, pepinos y salsa de la casa',         14500, 3),
  ('Royale',        'Hamburguesa con queso brie, rúcula, tomate y reducción de aceto',     16500, 4),
  ('Takisburger',   'Hamburguesa con guacamole, jalapeños, cheddar y salsa picante',       16000, 5)
) AS p(nombre, descripcion, precio, orden)
ON CONFLICT DO NOTHING;

-- Insertar variantes para cada hamburguesa
INSERT INTO producto_variantes (producto_id, nombre, precio, disponible, orden)
SELECT p.id, 'Simple', p.precio, true, 1
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
WHERE c.slug = 'hamburguesas-delivery'
ON CONFLICT DO NOTHING;

INSERT INTO producto_variantes (producto_id, nombre, precio, disponible, orden)
SELECT p.id, 'Doble', ROUND(p.precio * 1.17)::int, true, 2
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
WHERE c.slug = 'hamburguesas-delivery'
ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. BOWLS (los existentes ya están, solo agregar si faltan)
-- ============================================================
-- Ya existen: Poke de Pollo Teriyaki y Poke de Langostinos → no tocar

-- ============================================================
-- 5. PLATOS
-- ============================================================
WITH cat AS (SELECT id FROM categorias WHERE slug = 'platos-delivery')
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, orden)
SELECT nombre, descripcion, precio, cat.id, true, orden FROM cat, (VALUES
  ('Suprema Grillé',       'Suprema de pollo a la plancha con guarnición a elección',           17400, 1),
  ('Milanesa con Puré',    'Milanesa de ternera con puré de papa casero',                       17400, 2),
  ('Milanesa Napolitana',  'Milanesa de ternera con salsa napolitana, jamón y queso gratinado', 21200, 3),
  ('Bondiola',             'Bondiola braseada con papas rústicas',                              21200, 4)
) AS p(nombre, descripcion, precio, orden)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 6. ENSALADAS
-- ============================================================
WITH cat AS (SELECT id FROM categorias WHERE slug = 'ensaladas-delivery')
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, orden)
SELECT nombre, descripcion, precio, cat.id, true, orden FROM cat, (VALUES
  ('Ensalada César',       'Lechuga romana, croutons, parmesano y aderezo césar',                         14500, 1),
  ('Ensalada Griega',      'Tomate, pepino, aceitunas, cebolla morada y queso feta',                     13500, 2),
  ('Ensalada de Pollo',    'Mix de hojas verdes con pollo grillé, tomate cherry y aderezo de mostaza',    15500, 3),
  ('Ensalada de Atún',     'Mix de hojas verdes con atún, tomate, huevo duro y aceto',                   14000, 4),
  ('Ensalada Caprese',     'Tomate, mozzarella fresca, albahaca y aceite de oliva',                      13000, 5)
) AS p(nombre, descripcion, precio, orden)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. PIZZAS
-- ============================================================
WITH cat AS (SELECT id FROM categorias WHERE slug = 'pizzas-delivery')
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, orden)
SELECT nombre, descripcion, precio, cat.id, true, orden FROM cat, (VALUES
  ('Muzza',               'Pizza de mozzarella con salsa de tomate casera',                    14000, 1),
  ('Crudo y Rúcula',      'Pizza con jamón crudo, rúcula fresca y parmesano',                  17500, 2),
  ('Hongos y Queso Azul', 'Pizza con mix de hongos salteados y queso azul',                   17000, 3)
) AS p(nombre, descripcion, precio, orden)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. SÁNDWICHES
-- ============================================================
WITH cat AS (SELECT id FROM categorias WHERE slug = 'sandwiches-delivery')
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, orden)
SELECT nombre, descripcion, precio, cat.id, true, orden FROM cat, (VALUES
  ('Sándwich de Pollo',      'Pollo grillé, lechuga, tomate y mayonesa en pan brioche',          14500, 1),
  ('Sándwich de Milanesa',   'Milanesa de ternera con lechuga, tomate y salsa golf',             15500, 2),
  ('Sándwich Caprese',       'Mozzarella, tomate, albahaca y pesto en ciabatta',                13500, 3),
  ('Club Sándwich',          'Triple de jamón, queso, pollo, lechuga, tomate y huevo duro',     16000, 4),
  ('Sándwich de Bondiola',   'Bondiola braseada con cebolla caramelizada en pan de campo',      17000, 5)
) AS p(nombre, descripcion, precio, orden)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. WRAPS — ya existen los 5, no tocar
-- ============================================================

-- ============================================================
-- 10. SIN TACC / TARTAS — ya existen 3, no tocar
-- ============================================================

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
SELECT c.nombre AS categoria, COUNT(p.id) AS total_productos
FROM categorias c
LEFT JOIN productos p ON p.categoria_id = c.id
WHERE c.tipo_menu = 'delivery'
GROUP BY c.nombre, c.orden
ORDER BY c.orden;
