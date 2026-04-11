-- Insertar categorías de Delivery
INSERT INTO categorias (nombre, descripcion, imagen_url, orden) VALUES ('Entradas', 'Entradas para compartir', NULL, 1);
INSERT INTO categorias (nombre, descripcion, imagen_url, orden) VALUES ('Hamburguesas', 'Hamburguesas gourmet', NULL, 2);
INSERT INTO categorias (nombre, descripcion, imagen_url, orden) VALUES ('Bowls', 'Bowls saludables', NULL, 3);
INSERT INTO categorias (nombre, descripcion, imagen_url, orden) VALUES ('Al Plato', 'Platos principales', NULL, 4);
INSERT INTO categorias (nombre, descripcion, imagen_url, orden) VALUES ('Pastas', 'Pastas frescas y salsas', NULL, 5);
INSERT INTO categorias (nombre, descripcion, imagen_url, orden) VALUES ('Ensaladas', 'Ensaladas frescas', NULL, 6);
INSERT INTO categorias (nombre, descripcion, imagen_url, orden) VALUES ('Pizzas Individuales', 'Pizzas de estación', NULL, 7);
INSERT INTO categorias (nombre, descripcion, imagen_url, orden) VALUES ('Sandwiches', 'Sandwiches artesanales', NULL, 8);
INSERT INTO categorias (nombre, descripcion, imagen_url, orden) VALUES ('Wraps', 'Wraps variados', NULL, 9);
INSERT INTO categorias (nombre, descripcion, imagen_url, orden) VALUES ('Sin TACC / Tartas', 'Opciones sin gluten y tartas', NULL, 10);

-- ENTRADAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Papas Fritas', 'Papas fritas crocantes con sal marina', 7000, id, true, false, 1 FROM categorias WHERE nombre = 'Entradas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Papas a Caballo', 'Papas con salsa de queso', 9400, id, true, false, 2 FROM categorias WHERE nombre = 'Entradas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Papas Bar', 'Con cheddar, panceta y cebolla de verdeo', 13200, id, true, false, 3 FROM categorias WHERE nombre = 'Entradas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Quesadillas de Pollo', 'Quesadillas rellenas de pollo', 14500, id, true, false, 4 FROM categorias WHERE nombre = 'Entradas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Quesadillas 4 Quesos', 'Quesadillas con mezcla de 4 quesos', 14500, id, true, false, 5 FROM categorias WHERE nombre = 'Entradas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Mini Burritos de Pollo (x3)', 'Mini burritos de pollo', 11000, id, true, false, 6 FROM categorias WHERE nombre = 'Entradas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Tequeños', 'Tequeños rellenos de queso', 12000, id, true, false, 7 FROM categorias WHERE nombre = 'Entradas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Empanadas de Vacío y Provoleta (x3)', 'Empanadas', 13200, id, true, false, 8 FROM categorias WHERE nombre = 'Entradas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Langostinos en Panko', 'Langostinos rebozados en panko', 15200, id, true, false, 9 FROM categorias WHERE nombre = 'Entradas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Rabas', 'Rabas a la romana', 15800, id, true, false, 10 FROM categorias WHERE nombre = 'Entradas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Nuggets', 'Nuggets con salsa de miel mostaza', 11900, id, true, false, 11 FROM categorias WHERE nombre = 'Entradas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Nachos', 'Nachos con cheddar y jalapeños', 12000, id, true, false, 12 FROM categorias WHERE nombre = 'Entradas' LIMIT 1;

-- HAMBURGUESAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Americana Simple', 'Hamburguesa Americana - Simple', 15500, id, true, false, 1 FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Americana Doble', 'Hamburguesa Americana - Doble', 18000, id, true, false, 2 FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Parrillera Simple', 'Hamburguesa Parrillera - Simple', 14000, id, true, false, 3 FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Parrillera Doble', 'Hamburguesa Parrillera - Doble', 16500, id, true, false, 4 FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Clásica Simple', 'Hamburguesa Clásica - Simple', 13500, id, true, false, 5 FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Clásica Doble', 'Hamburguesa Clásica - Doble', 16000, id, true, false, 6 FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Royale Simple', 'Hamburguesa Royale - Simple', 14000, id, true, false, 7 FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Royale Doble', 'Hamburguesa Royale - Doble', 16500, id, true, false, 8 FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Takisburguer Simple', 'Hamburguesa Takis - Simple', 15300, id, true, false, 9 FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Takisburguer Doble', 'Hamburguesa Takis - Doble', 17800, id, true, false, 10 FROM categorias WHERE nombre = 'Hamburguesas' LIMIT 1;

-- BOWLS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Poke de Pollo Teriyaki', 'Base de arroz, pollo marinado en teriyaki, edamame y vegetales', 16000, id, true, false, 1 FROM categorias WHERE nombre = 'Bowls' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Poke de Langostinos', 'Base de arroz, langostinos frescos, palta, edamame y salsa ponzu', 17600, id, true, false, 2 FROM categorias WHERE nombre = 'Bowls' LIMIT 1;

-- AL PLATO
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Suprema Grillé con Ensalada', 'Pechuga de pollo grillada con ensalada fresca', 17400, id, true, false, 1 FROM categorias WHERE nombre = 'Al Plato' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Milanesa con Puré', 'Milanesa y puré de papas', 17400, id, true, false, 2 FROM categorias WHERE nombre = 'Al Plato' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Milanesa Napolitana con Papas', 'Milanesa napolitana con papas fritas', 21200, id, true, false, 3 FROM categorias WHERE nombre = 'Al Plato' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Bondiola Braseada con Puré de Batata', 'Bondiola braseada con puré de batata', 21200, id, true, false, 4 FROM categorias WHERE nombre = 'Al Plato' LIMIT 1;

-- PASTAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Cintas', 'Pasta casera cintas', 9600, id, true, false, 1 FROM categorias WHERE nombre = 'Pastas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Ravioles de Ricota y Verdura', 'Ravioles rellenos de ricota y verduras', 12000, id, true, false, 2 FROM categorias WHERE nombre = 'Pastas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Sorrentinos de Jamón y Queso', 'Sorrentinos rellenos de jamón y queso', 14400, id, true, false, 3 FROM categorias WHERE nombre = 'Pastas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Salsa Filetto', 'Salsa a base de tomate', 4200, id, true, false, 4 FROM categorias WHERE nombre = 'Pastas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Salsa Crema + Tomates Confitados + Pesto', 'Salsa cremosa con tomates confitados', 5400, id, true, false, 5 FROM categorias WHERE nombre = 'Pastas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Salsa Bolognesa', 'Salsa a la bolognesa', 6600, id, true, false, 6 FROM categorias WHERE nombre = 'Pastas' LIMIT 1;

-- ENSALADAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Caesar', 'Lechuga romana, pollo, parmesano, croutons y aderezo caesar', 15400, id, true, false, 1 FROM categorias WHERE nombre = 'Ensaladas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Cuzco', 'Ensalada Cuzco con ingredientes especiales', 16000, id, true, false, 2 FROM categorias WHERE nombre = 'Ensaladas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Mediterránea', 'Ensalada mediterránea con tomate, mozzarella y aceitunas', 18500, id, true, false, 3 FROM categorias WHERE nombre = 'Ensaladas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Anticucha', 'Ensalada anticucha con carnes y vegetales', 15500, id, true, false, 4 FROM categorias WHERE nombre = 'Ensaladas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Capri', 'Tomate, mozzarella fresca, rúcula y aceite de oliva', 17000, id, true, false, 5 FROM categorias WHERE nombre = 'Ensaladas' LIMIT 1;

-- PIZZAS INDIVIDUALES
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Muzza y Albahaca', 'Pizza clásica con mozzarella y albahaca fresca', 11600, id, true, false, 1 FROM categorias WHERE nombre = 'Pizzas Individuales' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Crudo y Rúcula', 'Pizza con jamón crudo y rúcula', 14200, id, true, false, 2 FROM categorias WHERE nombre = 'Pizzas Individuales' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Hongos y Queso Azul', 'Pizza con hongos y queso azul', 14200, id, true, false, 3 FROM categorias WHERE nombre = 'Pizzas Individuales' LIMIT 1;

-- SANDWICHES
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Bacon', 'Sándwich con bacon crocante', 17900, id, true, false, 1 FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Carne Queso', 'Sándwich de carne y queso', 14900, id, true, false, 2 FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Criollo', 'Sándwich criollo con carnes', 16900, id, true, false, 3 FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Parisienne', 'Sándwich parisienne', 14900, id, true, false, 4 FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Napolitano', 'Sándwich napolitano con jamón y queso', 16000, id, true, false, 5 FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Pulled Pork', 'Sándwich con carne deshilachada', 16000, id, true, false, 6 FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Milahuevo', 'Sándwich milanesa con huevo frito', 17900, id, true, false, 7 FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Bocata de Calamar', 'Bocata de calamares fritos', 14900, id, true, false, 8 FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Portobellos', 'Sándwich con hongos portobello', 16000, id, true, false, 9 FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Viet-Ñam', 'Sándwich estilo vietnamita', 14900, id, true, false, 10 FROM categorias WHERE nombre = 'Sandwiches' LIMIT 1;

-- WRAPS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Caesar Wrap', 'Wrap Caesar con pollo, lechuga y queso sardo', 15400, id, true, false, 1 FROM categorias WHERE nombre = 'Wraps' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Pollo Palta', 'Wrap con pollo, palta, tomate y espinaca', 17000, id, true, false, 2 FROM categorias WHERE nombre = 'Wraps' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Tuna Wrap', 'Wrap con atún, lechuga y vegetales frescos', 15400, id, true, false, 3 FROM categorias WHERE nombre = 'Wraps' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Ternera', 'Wrap con ternera y vegetales asados', 17000, id, true, false, 4 FROM categorias WHERE nombre = 'Wraps' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Hongos', 'Wrap vegetariano con hongos y queso', 16000, id, true, false, 5 FROM categorias WHERE nombre = 'Wraps' LIMIT 1;

-- SIN TACC / TARTAS
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Tarta de Cabutia', 'Tarta sin TACC de cabutia', 14900, id, true, true, 1 FROM categorias WHERE nombre = 'Sin TACC / Tartas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Tarta de Jamón y Queso', 'Tarta sin TACC de jamón y queso', 14900, id, true, true, 2 FROM categorias WHERE nombre = 'Sin TACC / Tartas' LIMIT 1;
INSERT INTO productos (nombre, descripcion, precio, categoria_id, disponible, destacado, orden) 
SELECT 'Tarta de Vegetales', 'Tarta sin TACC de vegetales', 14900, id, true, true, 3 FROM categorias WHERE nombre = 'Sin TACC / Tartas' LIMIT 1;
