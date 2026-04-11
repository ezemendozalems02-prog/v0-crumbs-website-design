-- Insertar categorías de delivery primero
INSERT INTO categorias (nombre, descripcion, imagen_url, orden)
VALUES 
  ('Entradas', 'Entradas para compartir', NULL, 1),
  ('Hamburguesas', 'Hamburguesas gourmet', NULL, 2),
  ('Bowls', 'Bowls saludables', NULL, 3),
  ('Al Plato', 'Platos principales', NULL, 4),
  ('Pastas', 'Pastas frescas y salsas', NULL, 5),
  ('Ensaladas', 'Ensaladas frescas', NULL, 6),
  ('Pizzas Individuales', 'Pizzas de estación', NULL, 7),
  ('Sandwiches', 'Sandwiches artesanales', NULL, 8),
  ('Wraps', 'Wraps variados', NULL, 9),
  ('Sin TACC / Tartas', 'Opciones sin gluten y tartas', NULL, 10)
ON CONFLICT DO NOTHING;

-- ENTRADAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden)
VALUES 
  ('Papas Fritas', 'Papas fritas crocantes con sal marina', 7000, (SELECT id FROM categorias WHERE nombre = 'Entradas' LIMIT 1), true, false, 1),
  ('Papas a Caballo', 'Papas con salsa de queso', 9400, (SELECT id FROM categorias WHERE nombre = 'Entradas' LIMIT 1), true, false, 2),
  ('Papas Bar', 'Con cheddar, panceta y cebolla de verdeo', 13200, (SELECT id FROM categorias WHERE nombre = 'Entradas' LIMIT 1), true, false, 3),
  ('Quesadillas de Pollo', 'Quesadillas rellenas de pollo', 14500, (SELECT id FROM categorias WHERE nombre = 'Entradas' LIMIT 1), true, false, 4),
  ('Quesadillas 4 Quesos', 'Quesadillas con mezcla de 4 quesos', 14500, (SELECT id FROM categorias WHERE nombre = 'Entradas' LIMIT 1), true, false, 5),
  ('Mini Burritos de Pollo (x3)', 'Mini burritos de pollo', 11000, (SELECT id FROM categorias WHERE nombre = 'Entradas' LIMIT 1), true, false, 6),
  ('Tequeños', 'Tequeños rellenos de queso', 12000, (SELECT id FROM categorias WHERE nombre = 'Entradas' LIMIT 1), true, false, 7),
  ('Empanadas de Vacío y Provoleta (x3)', 'Empanadas', 13200, (SELECT id FROM categorias WHERE nombre = 'Entradas' LIMIT 1), true, false, 8),
  ('Langostinos en Panko', 'Langostinos rebozados en panko', 15200, (SELECT id FROM categorias WHERE nombre = 'Entradas' LIMIT 1), true, false, 9),
  ('Rabas', 'Rabas a la romana', 15800, (SELECT id FROM categorias WHERE nombre = 'Entradas' LIMIT 1), true, false, 10),
  ('Nuggets', 'Nuggets con salsa de miel mostaza', 11900, (SELECT id FROM categorias WHERE nombre = 'Entradas' LIMIT 1), true, false, 11),
  ('Nachos', 'Nachos con cheddar y jalapeños', 12000, (SELECT id FROM categorias WHERE nombre = 'Entradas' LIMIT 1), true, false, 12)
ON CONFLICT DO NOTHING;

-- HAMBURGUESAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden)
VALUES 
  ('Americana Simple', 'Hamburguesa Americana - Simple', 15500, (SELECT id FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1), true, false, 1),
  ('Americana Doble', 'Hamburguesa Americana - Doble', 18000, (SELECT id FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1), true, false, 2),
  ('Parrillera Simple', 'Hamburguesa Parrillera - Simple', 14000, (SELECT id FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1), true, false, 3),
  ('Parrillera Doble', 'Hamburguesa Parrillera - Doble', 16500, (SELECT id FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1), true, false, 4),
  ('Clásica Simple', 'Hamburguesa Clásica - Simple', 13500, (SELECT id FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1), true, false, 5),
  ('Clásica Doble', 'Hamburguesa Clásica - Doble', 16000, (SELECT id FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1), true, false, 6),
  ('Royale Simple', 'Hamburguesa Royale - Simple', 14000, (SELECT id FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1), true, false, 7),
  ('Royale Doble', 'Hamburguesa Royale - Doble', 16500, (SELECT id FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1), true, false, 8),
  ('Takisburguer Simple', 'Hamburguesa Takis - Simple', 15300, (SELECT id FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1), true, false, 9),
  ('Takisburguer Doble', 'Hamburguesa Takis - Doble', 17800, (SELECT id FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1), true, false, 10)
ON CONFLICT DO NOTHING;

-- BOWLS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden)
VALUES 
  ('Poke de Pollo Teriyaki', 'Base de arroz, pollo marinado en teriyaki, edamame y vegetales', 16000, (SELECT id FROM categorias WHERE nombre = 'Bowls' LIMIT 1), true, false, 1),
  ('Poke de Langostinos', 'Base de arroz, langostinos frescos, palta, edamame y salsa ponzu', 17600, (SELECT id FROM categorias WHERE nombre = 'Bowls' LIMIT 1), true, false, 2)
ON CONFLICT DO NOTHING;

-- AL PLATO
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden)
VALUES 
  ('Suprema Grillé con Ensalada', 'Pechuga de pollo grillada con ensalada fresca', 17400, (SELECT id FROM categorias WHERE nombre = 'Al Plato' LIMIT 1), true, false, 1),
  ('Milanesa con Puré', 'Milanesa y puré de papas', 17400, (SELECT id FROM categorias WHERE nombre = 'Al Plato' LIMIT 1), true, false, 2),
  ('Milanesa Napolitana con Papas', 'Milanesa napolitana con papas fritas', 21200, (SELECT id FROM categorias WHERE nombre = 'Al Plato' LIMIT 1), true, false, 3),
  ('Bondiola Braseada con Puré de Batata', 'Bondiola braseada con puré de batata', 21200, (SELECT id FROM categorias WHERE nombre = 'Al Plato' LIMIT 1), true, false, 4)
ON CONFLICT DO NOTHING;

-- PASTAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden)
VALUES 
  ('Cintas', 'Pasta casera cintas', 9600, (SELECT id FROM categorias WHERE nombre = 'Pastas' LIMIT 1), true, false, 1),
  ('Ravioles de Ricota y Verdura', 'Ravioles rellenos de ricota y verduras', 12000, (SELECT id FROM categorias WHERE nombre = 'Pastas' LIMIT 1), true, false, 2),
  ('Sorrentinos de Jamón y Queso', 'Sorrentinos rellenos de jamón y queso', 14400, (SELECT id FROM categorias WHERE nombre = 'Pastas' LIMIT 1), true, false, 3),
  ('Salsa Filetto', 'Salsa a base de tomate', 4200, (SELECT id FROM categorias WHERE nombre = 'Pastas' LIMIT 1), true, false, 4),
  ('Salsa Crema + Tomates Confitados + Pesto', 'Salsa cremosa con tomates confitados', 5400, (SELECT id FROM categorias WHERE nombre = 'Pastas' LIMIT 1), true, false, 5),
  ('Salsa Bolognesa', 'Salsa a la bolognesa', 6600, (SELECT id FROM categorias WHERE nombre = 'Pastas' LIMIT 1), true, false, 6)
ON CONFLICT DO NOTHING;

-- ENSALADAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden)
VALUES 
  ('Caesar', 'Lechuga romana, pollo, parmesano, croutons y aderezo caesar', 15400, (SELECT id FROM categorias WHERE nombre = 'Ensaladas' LIMIT 1), true, false, 1),
  ('Cuzco', 'Ensalada Cuzco con ingredientes especiales', 16000, (SELECT id FROM categorias WHERE nombre = 'Ensaladas' LIMIT 1), true, false, 2),
  ('Mediterránea', 'Ensalada mediterránea con tomate, mozzarella y aceitunas', 18500, (SELECT id FROM categorias WHERE nombre = 'Ensaladas' LIMIT 1), true, false, 3),
  ('Anticucha', 'Ensalada anticucha con carnes y vegetales', 15500, (SELECT id FROM categorias WHERE nombre = 'Ensaladas' LIMIT 1), true, false, 4),
  ('Capri', 'Tomate, mozzarella fresca, rúcula y aceite de oliva', 17000, (SELECT id FROM categorias WHERE nombre = 'Ensaladas' LIMIT 1), true, false, 5)
ON CONFLICT DO NOTHING;

-- PIZZAS INDIVIDUALES
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden)
VALUES 
  ('Muzza y Albahaca', 'Pizza clásica con mozzarella y albahaca fresca', 11600, (SELECT id FROM categorias WHERE nombre = 'Pizzas Individuales' LIMIT 1), true, false, 1),
  ('Crudo y Rúcula', 'Pizza con jamón crudo y rúcula', 14200, (SELECT id FROM categorias WHERE nombre = 'Pizzas Individuales' LIMIT 1), true, false, 2),
  ('Hongos y Queso Azul', 'Pizza con hongos y queso azul', 14200, (SELECT id FROM categorias WHERE nombre = 'Pizzas Individuales' LIMIT 1), true, false, 3)
ON CONFLICT DO NOTHING;

-- SANDWICHES
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden)
VALUES 
  ('Bacon', 'Sándwich con bacon crocante', 17900, (SELECT id FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1), true, false, 1),
  ('Carne Queso', 'Sándwich de carne y queso', 14900, (SELECT id FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1), true, false, 2),
  ('Criollo', 'Sándwich criollo con carnes', 16900, (SELECT id FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1), true, false, 3),
  ('Parisienne', 'Sándwich parisienne', 14900, (SELECT id FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1), true, false, 4),
  ('Napolitano', 'Sándwich napolitano con jamón y queso', 16000, (SELECT id FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1), true, false, 5),
  ('Pulled Pork', 'Sándwich con carne deshilachada', 16000, (SELECT id FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1), true, false, 6),
  ('Milahuevo', 'Sándwich milanesa con huevo frito', 17900, (SELECT id FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1), true, false, 7),
  ('Bocata de Calamar', 'Bocata de calamares fritos', 14900, (SELECT id FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1), true, false, 8),
  ('Portobellos', 'Sándwich con hongos portobello', 16000, (SELECT id FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1), true, false, 9),
  ('Viet-Ñam', 'Sándwich estilo vietnamita', 14900, (SELECT id FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1), true, false, 10)
ON CONFLICT DO NOTHING;

-- WRAPS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden)
VALUES 
  ('Caesar Wrap', 'Wrap Caesar con pollo, lechuga y queso sardo', 15400, (SELECT id FROM categorias WHERE nombre = 'Wraps' LIMIT 1), true, false, 1),
  ('Pollo Palta', 'Wrap con pollo, palta, tomate y espinaca', 17000, (SELECT id FROM categorias WHERE nombre = 'Wraps' LIMIT 1), true, false, 2),
  ('Tuna Wrap', 'Wrap con atún, lechuga y vegetales frescos', 15400, (SELECT id FROM categorias WHERE nombre = 'Wraps' LIMIT 1), true, false, 3),
  ('Ternera', 'Wrap con ternera y vegetales asados', 17000, (SELECT id FROM categorias WHERE nombre = 'Wraps' LIMIT 1), true, false, 4),
  ('Hongos', 'Wrap vegetariano con hongos y queso', 16000, (SELECT id FROM categorias WHERE nombre = 'Wraps' LIMIT 1), true, false, 5)
ON CONFLICT DO NOTHING;

-- SIN TACC / TARTAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden)
VALUES 
  ('Tarta de Cabutia', 'Tarta sin TACC de cabutia', 14900, (SELECT id FROM categorias WHERE nombre = 'Sin TACC / Tartas' LIMIT 1), true, true, 1),
  ('Tarta de Jamón y Queso', 'Tarta sin TACC de jamón y queso', 14900, (SELECT id FROM categorias WHERE nombre = 'Sin TACC / Tartas' LIMIT 1), true, true, 2),
  ('Tarta de Vegetales', 'Tarta sin TACC de vegetales', 14900, (SELECT id FROM categorias WHERE nombre = 'Sin TACC / Tartas' LIMIT 1), true, true, 3)
ON CONFLICT DO NOTHING;
