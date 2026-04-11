-- Script para agregar el menú de Delivery completo
-- Primero, agregar/actualizar las categorías de delivery

INSERT INTO categorias (nombre, slug, tipo_menu, activa, orden)
VALUES 
  ('Entradas', 'entradas', 'delivery', true, 1),
  ('Hamburguesas', 'hamburguesas', 'delivery', true, 2),
  ('Bowls', 'bowls', 'delivery', true, 3),
  ('Al Plato', 'al-plato', 'delivery', true, 4),
  ('Pastas', 'pastas', 'delivery', true, 5),
  ('Ensaladas', 'ensaladas', 'delivery', true, 6),
  ('Pizzas Individuales', 'pizzas-individuales', 'delivery', true, 7),
  ('Sandwiches', 'sandwiches', 'delivery', true, 8),
  ('Wraps', 'wraps', 'delivery', true, 9),
  ('Sin TACC / Tartas', 'sin-tacc-tartas', 'delivery', true, 10)
ON CONFLICT (slug, tipo_menu) DO NOTHING;

-- Ahora agregar los productos

-- ENTRADAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, disponible, destacado, orden, etiquetas)
SELECT 
  nombre, descripcion, precio, 
  (SELECT id FROM categorias WHERE slug = 'entradas' AND tipo_menu = 'delivery'),
  NULL, true, false, orden, '[]'::jsonb
FROM (
  VALUES
    ('Papas Fritas', 'Papas fritas crocantes con sal marina', 7000, 1),
    ('Papas a Caballo', 'Papas con salsa de queso', 9400, 2),
    ('Papas Bar', 'Con cheddar, panceta y cebolla de verdeo', 13200, 3),
    ('Quesadillas de Pollo', 'Quesadillas rellenas de pollo', 14500, 4),
    ('Quesadillas 4 Quesos', 'Quesadillas con mezcla de 4 quesos', 14500, 5),
    ('Mini Burritos de Pollo', 'Mini burritos de pollo (x3)', 11000, 6),
    ('Tequeños', 'Tequeños rellenos de queso', 12000, 7),
    ('Empanadas de Vacío y Provoleta', 'Empanadas (x3)', 13200, 8),
    ('Langostinos en Panko', 'Langostinos rebozados en panko', 15200, 9),
    ('Rabas', 'Rabas a la romana', 15800, 10),
    ('Nuggets', 'Con salsa de miel mostaza', 11900, 11),
    ('Nachos', 'Nachos con cheddar y jalapeños', 12000, 12)
) AS t(nombre, descripcion, precio, orden)
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = t.nombre AND categoria_id = (SELECT id FROM categorias WHERE slug = 'entradas' AND tipo_menu = 'delivery'));

-- HAMBURGUESAS (con variantes Simple/Doble)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, disponible, destacado, orden, etiquetas)
SELECT 
  nombre, descripcion, precio,
  (SELECT id FROM categorias WHERE slug = 'hamburguesas' AND tipo_menu = 'delivery'),
  NULL, true, false, orden, '[]'::jsonb
FROM (
  VALUES
    ('Americana', 'Hamburguesa Americana - Simple', 15500, 1),
    ('Americana Doble', 'Hamburguesa Americana - Doble', 18000, 2),
    ('Parrillera', 'Hamburguesa Parrillera - Simple', 14000, 3),
    ('Parrillera Doble', 'Hamburguesa Parrillera - Doble', 16500, 4),
    ('Clásica', 'Hamburguesa Clásica - Simple', 13500, 5),
    ('Clásica Doble', 'Hamburguesa Clásica - Doble', 16000, 6),
    ('Royale', 'Hamburguesa Royale - Simple', 14000, 7),
    ('Royale Doble', 'Hamburguesa Royale - Doble', 16500, 8),
    ('Takisburguer', 'Hamburguesa Takis - Simple', 15300, 9),
    ('Takisburguer Doble', 'Hamburguesa Takis - Doble', 17800, 10)
) AS t(nombre, descripcion, precio, orden)
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = t.nombre AND categoria_id = (SELECT id FROM categorias WHERE slug = 'hamburguesas' AND tipo_menu = 'delivery'));

-- BOWLS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, disponible, destacado, orden, etiquetas)
SELECT 
  nombre, descripcion, precio,
  (SELECT id FROM categorias WHERE slug = 'bowls' AND tipo_menu = 'delivery'),
  NULL, true, false, orden, '[]'::jsonb
FROM (
  VALUES
    ('Poke de Pollo Teriyaki', 'Base de arroz, pollo marinado en teriyaki, edamame y vegetales', 16000, 1),
    ('Poke de Langostinos', 'Base de arroz, langostinos frescos, palta, edamame y salsa ponzu', 17600, 2)
) AS t(nombre, descripcion, precio, orden)
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = t.nombre AND categoria_id = (SELECT id FROM categorias WHERE slug = 'bowls' AND tipo_menu = 'delivery'));

-- AL PLATO
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, disponible, destacado, orden, etiquetas)
SELECT 
  nombre, descripcion, precio,
  (SELECT id FROM categorias WHERE slug = 'al-plato' AND tipo_menu = 'delivery'),
  NULL, true, false, orden, '[]'::jsonb
FROM (
  VALUES
    ('Suprema Grillé con Ensalada', 'Pechuga de pollo grillada con ensalada fresca', 17400, 1),
    ('Milanesa con Puré', 'Milanesa y puré de papas', 17400, 2),
    ('Milanesa Napolitana con Papas', 'Milanesa napolitana con papas fritas', 21200, 3),
    ('Bondiola Braseada con Puré de Batata', 'Bondiola braseada con puré de batata', 21200, 4)
) AS t(nombre, descripcion, precio, orden)
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = t.nombre AND categoria_id = (SELECT id FROM categorias WHERE slug = 'al-plato' AND tipo_menu = 'delivery'));

-- PASTAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, disponible, destacado, orden, etiquetas)
SELECT 
  nombre, descripcion, precio,
  (SELECT id FROM categorias WHERE slug = 'pastas' AND tipo_menu = 'delivery'),
  NULL, true, false, orden, '[]'::jsonb
FROM (
  VALUES
    ('Cintas', 'Pasta casera cintas', 9600, 1),
    ('Ravioles de Ricota y Verdura', 'Ravioles rellenos de ricota y verduras', 12000, 2),
    ('Sorrentinos de Jamón y Queso', 'Sorrentinos rellenos de jamón y queso', 14400, 3)
) AS t(nombre, descripcion, precio, orden)
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = t.nombre AND categoria_id = (SELECT id FROM categorias WHERE slug = 'pastas' AND tipo_menu = 'delivery'));

-- SALSAS PARA PASTAS (como productos separados)
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, disponible, destacado, orden, etiquetas)
SELECT 
  nombre, descripcion, precio,
  (SELECT id FROM categorias WHERE slug = 'pastas' AND tipo_menu = 'delivery'),
  NULL, true, false, orden, '[]'::jsonb
FROM (
  VALUES
    ('Salsa Filetto', 'Salsa a base de tomate', 4200, 4),
    ('Salsa Crema + Tomates Confitados + Pesto', 'Salsa cremosa con tomates confitados', 5400, 5),
    ('Salsa Bolognesa', 'Salsa a la bolognesa', 6600, 6)
) AS t(nombre, descripcion, precio, orden)
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = t.nombre AND categoria_id = (SELECT id FROM categorias WHERE slug = 'pastas' AND tipo_menu = 'delivery'));

-- ENSALADAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, disponible, destacado, orden, etiquetas)
SELECT 
  nombre, descripcion, precio,
  (SELECT id FROM categorias WHERE slug = 'ensaladas' AND tipo_menu = 'delivery'),
  NULL, true, false, orden, '[]'::jsonb
FROM (
  VALUES
    ('Caesar', 'Lechuga romana, pollo, parmesano, croutons y aderezo caesar', 15400, 1),
    ('Cuzco', 'Ensalada Cuzco con ingredientes especiales', 16000, 2),
    ('Mediterránea', 'Ensalada mediterránea con tomate, mozzarella y aceitunas', 18500, 3),
    ('Anticucha', 'Ensalada anticucha con carnes y vegetales', 15500, 4),
    ('Capri', 'Tomate, mozzarella fresca, rúcula y aceite de oliva', 17000, 5)
) AS t(nombre, descripcion, precio, orden)
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = t.nombre AND categoria_id = (SELECT id FROM categorias WHERE slug = 'ensaladas' AND tipo_menu = 'delivery'));

-- PIZZAS INDIVIDUALES
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, disponible, destacado, orden, etiquetas)
SELECT 
  nombre, descripcion, precio,
  (SELECT id FROM categorias WHERE slug = 'pizzas-individuales' AND tipo_menu = 'delivery'),
  NULL, true, false, orden, '[]'::jsonb
FROM (
  VALUES
    ('Muzza y Albahaca', 'Pizza clásica con mozzarella y albahaca fresca', 11600, 1),
    ('Crudo y Rúcula', 'Pizza con jamón crudo y rúcula', 14200, 2),
    ('Hongos y Queso Azul', 'Pizza con hongos y queso azul', 14200, 3)
) AS t(nombre, descripcion, precio, orden)
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = t.nombre AND categoria_id = (SELECT id FROM categorias WHERE slug = 'pizzas-individuales' AND tipo_menu = 'delivery'));

-- SANDWICHES
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, disponible, destacado, orden, etiquetas)
SELECT 
  nombre, descripcion, precio,
  (SELECT id FROM categorias WHERE slug = 'sandwiches' AND tipo_menu = 'delivery'),
  NULL, true, false, orden, '[]'::jsonb
FROM (
  VALUES
    ('Bacon', 'Sándwich con bacon crocante', 17900, 1),
    ('Carne Queso', 'Sándwich de carne y queso', 14900, 2),
    ('Criollo', 'Sándwich criollo con carnes', 16900, 3),
    ('Parisienne', 'Sándwich parisienne', 14900, 4),
    ('Napolitano', 'Sándwich napolitano con jamón y queso', 16000, 5),
    ('Pulled Pork', 'Sándwich con carne deshilachada', 16000, 6),
    ('Milahuevo', 'Sándwich milanesa con huevo frito', 17900, 7),
    ('Bocata de Calamar', 'Bocata de calamares fritos', 14900, 8),
    ('Portobellos', 'Sándwich con hongos portobello', 16000, 9),
    ('Viet-Ñam', 'Sándwich estilo vietnamita', 14900, 10)
) AS t(nombre, descripcion, precio, orden)
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = t.nombre AND categoria_id = (SELECT id FROM categorias WHERE slug = 'sandwiches' AND tipo_menu = 'delivery'));

-- WRAPS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, disponible, destacado, orden, etiquetas)
SELECT 
  nombre, descripcion, precio,
  (SELECT id FROM categorias WHERE slug = 'wraps' AND tipo_menu = 'delivery'),
  NULL, true, false, orden, '[]'::jsonb
FROM (
  VALUES
    ('Caesar', 'Wrap Caesar con pollo, lechuga y queso sardo', 15400, 1),
    ('Pollo Palta', 'Wrap con pollo, palta, tomate y espinaca', 17000, 2),
    ('Tuna Wrap', 'Wrap con atún, lechuga y vegetales frescos', 15400, 3),
    ('Ternera', 'Wrap con ternera y vegetales asados', 17000, 4),
    ('Hongos', 'Wrap vegetariano con hongos y queso', 16000, 5)
) AS t(nombre, descripcion, precio, orden)
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = t.nombre AND categoria_id = (SELECT id FROM categorias WHERE slug = 'wraps' AND tipo_menu = 'delivery'));

-- SIN TACC / TARTAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen_url, disponible, destacado, orden, etiquetas)
SELECT 
  nombre, descripcion, precio,
  (SELECT id FROM categorias WHERE slug = 'sin-tacc-tartas' AND tipo_menu = 'delivery'),
  NULL, true, true, orden, '["sin-tacc"]'::jsonb
FROM (
  VALUES
    ('Tarta de Cabutia', 'Tarta sin TACC de cabutia', 14900, 1),
    ('Tarta de Jamón y Queso', 'Tarta sin TACC de jamón y queso', 14900, 2),
    ('Tarta de Vegetales', 'Tarta sin TACC de vegetales', 14900, 3)
) AS t(nombre, descripcion, precio, orden)
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = t.nombre AND categoria_id = (SELECT id FROM categorias WHERE slug = 'sin-tacc-tartas' AND tipo_menu = 'delivery'));
