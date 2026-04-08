-- Migración: Reemplazar carta completa de CRUMBS
-- Elimina datos actuales e inserta nueva carta con 15 categorías y 70+ productos

-- Limpiar datos existentes (mantener integridad referencial)
DELETE FROM producto_variantes;
DELETE FROM productos;
DELETE FROM categorias;

-- Insertar nuevas categorías
INSERT INTO categorias (nombre, descripcion, imagen_url, orden) VALUES
('ENTRADA', 'Entrada para comenzar', null, 1),
('BURGERS', 'Hamburguesas artesanales', null, 2),
('HOT DOGS', 'Hot dogs gourmet', null, 3),
('SÁNDWICHES', 'Sándwiches variados', null, 4),
('PIZZA', 'Pizzas tradicionales', null, 5),
('TACOS', 'Tacos mexicanos', null, 6),
('PASTA', 'Pastas frescas', null, 7),
('ENSALADAS', 'Ensaladas', null, 8),
('TABLA DE QUESOS', 'Tablas de quesos', null, 9),
('BEBIDAS', 'Bebidas frías y calientes', null, 10),
('POSTRES', 'Postres caseros', null, 11),
('CÓCTELES', 'Cócteles clásicos', null, 12),
('CERVEZA', 'Cerveza artesanal', null, 13),
('VINOS', 'Vinos seleccionados', null, 14),
('BRUNCH', 'Brunch dominical', null, 15);

-- ENTRADA
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'ENTRADA'), 'Tabla de Entrada', 'Tabla mixta con fiambres, quesos, pan tostado y conservas', 890, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'ENTRADA'), 'Tabla de Quesos y Fiambres', 'Selección premium de quesos argentinos y fiambres', 950, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'ENTRADA'), 'Tabla Vegetariana', 'Tabla con hummus, pan árabe, verduras frescas', 650, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'ENTRADA'), 'Tabla de Embutidos', 'Variedad de embutidos y quesos artesanales', 1090, null, true, 4);

-- BURGERS
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'BURGERS'), 'Burger Clásica', 'Hamburguesa 150g con queso, lechuga, tomate, cebolla', 580, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'BURGERS'), 'Burger Doble', 'Doble hamburguesa 300g con queso cheddar derretido', 750, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'BURGERS'), 'Burger Premium', 'Hamburguesa 200g con queso azul, cebolla caramelizada, bacon', 820, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'BURGERS'), 'Burger Vegetariana', 'Hamburguesa 200g de lentejas y vegetales', 650, null, true, 4),
((SELECT id FROM categorias WHERE nombre = 'BURGERS'), 'Burger Picante', 'Hamburguesa con jalapeños, salsa picante y cheddar', 720, null, true, 5);

-- HOT DOGS
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'HOT DOGS'), 'Hot Dog Clásico', 'Hot dog con salsa de tomate y mostaza', 420, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'HOT DOGS'), 'Hot Dog Gourmet', 'Hot dog con cebolla caramelizada, bacon y queso', 550, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'HOT DOGS'), 'Hot Dog Completo', 'Hot dog con jalapeños, salsa picante y cheddar', 580, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'HOT DOGS'), 'Hot Dog Vegetariano', 'Hot dog vegano con verduras grilladas', 480, null, true, 4);

-- SÁNDWICHES
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'SÁNDWICHES'), 'Sándwich de Jamón y Queso', 'Pan de molde con jamón, queso y tomate', 450, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'SÁNDWICHES'), 'Sándwich Milanesa', 'Milanesa de pollo o carne con papas y mayo', 620, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'SÁNDWICHES'), 'Sándwich Completo', 'Jamón, queso, tomate, lechuga y mayonesa', 520, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'SÁNDWICHES'), 'Sándwich de Atún', 'Pan integral con atún, mayo y verduras', 580, null, true, 4),
((SELECT id FROM categorias WHERE nombre = 'SÁNDWICHES'), 'Sándwich Vegano', 'Pan multigrano con hummus y verduras grilladas', 550, null, true, 5);

-- PIZZA
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'PIZZA'), 'Pizza Margarita', 'Mozzarella, tomate y albahaca', 620, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'PIZZA'), 'Pizza Pepperoni', 'Mozzarella y pepperoni', 700, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'PIZZA'), 'Pizza Cuatro Quesos', 'Mozzarella, queso azul, queso de cabra, parmesano', 850, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'PIZZA'), 'Pizza Especial CRUMBS', 'Carnes varias, vegetales y queso', 950, null, true, 4),
((SELECT id FROM categorias WHERE nombre = 'PIZZA'), 'Pizza Vegetariana', 'Verduras grilladas, mozzarella y pesto', 780, null, true, 5),
((SELECT id FROM categorias WHERE nombre = 'PIZZA'), 'Pizza BBQ', 'Carne asada, cebolla, salsa BBQ', 890, null, true, 6);

-- TACOS
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'TACOS'), 'Tacos de Carne', 'Tacos con carne asada, cilantro y cebolla (3 unidades)', 580, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'TACOS'), 'Tacos de Pollo', 'Tacos con pollo marinado (3 unidades)', 550, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'TACOS'), 'Tacos de Camarones', 'Tacos con camarones a la mantequilla (3 unidades)', 750, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'TACOS'), 'Tacos Vegetarianos', 'Tacos con vegetales grillados (3 unidades)', 480, null, true, 4),
((SELECT id FROM categorias WHERE nombre = 'TACOS'), 'Mix de Tacos', 'Surtido de tacos carne, pollo y camarones', 850, null, true, 5);

-- PASTA
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'PASTA'), 'Fetuccini Alfredo', 'Pasta fresca con salsa de crema y parmesano', 720, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'PASTA'), 'Spaghetti Carbonara', 'Pasta con salsa de huevo, bacon y queso', 750, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'PASTA'), 'Penne a la Bolognesa', 'Pasta con ragú de carne', 780, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'PASTA'), 'Pasta Primavera', 'Pasta con verduras de estación', 680, null, true, 4),
((SELECT id FROM categorias WHERE nombre = 'PASTA'), 'Ravioles de Ricotta', 'Ravioles caseros con salsa de tomate', 820, null, true, 5);

-- ENSALADAS
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'ENSALADAS'), 'Ensalada César', 'Lechuga, crutones, parmesano y aderezo César', 650, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'ENSALADAS'), 'Ensalada Griega', 'Tomate, pepino, cebolla, queso feta y aceitunas', 720, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'ENSALADAS'), 'Ensalada de Pollo', 'Lechuga, pollo, tomate, cebolla y vinagreta', 780, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'ENSALADAS'), 'Ensalada Mixta', 'Variedad de lechugas y verduras frescas', 580, null, true, 4);

-- TABLA DE QUESOS
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'TABLA DE QUESOS'), 'Tabla de Quesos Argentinos', 'Selección de quesos regionales', 1200, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'TABLA DE QUESOS'), 'Tabla Gourmet', 'Quesos importados y frutos secos', 1500, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'TABLA DE QUESOS'), 'Tabla Clásica', 'Queso de cabra, azul y cheddar', 950, null, true, 3);

-- BEBIDAS
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'BEBIDAS'), 'Agua Mineral', 'Agua sin gas o con gas (500ml)', 120, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'BEBIDAS'), 'Gaseosa', 'Refrescos variados (330ml)', 150, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'BEBIDAS'), 'Jugo Natural', 'Jugos exprimidos al momento (250ml)', 280, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'BEBIDAS'), 'Café', 'Café expreso, cortado o con leche', 180, null, true, 4),
((SELECT id FROM categorias WHERE nombre = 'BEBIDAS'), 'Cerveza Artesanal', 'Cerveza artesanal 350ml', 280, null, true, 5);

-- POSTRES
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'POSTRES'), 'Tiramisú', 'Postre italiano clásico', 480, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'POSTRES'), 'Brownie', 'Brownie de chocolate casero', 380, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'POSTRES'), 'Flan Casero', 'Flan casero con dulce de leche', 320, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'POSTRES'), 'Fruta con Queso', 'Tabla de frutas con queso', 520, null, true, 4),
((SELECT id FROM categorias WHERE nombre = 'POSTRES'), 'Helado', 'Helado artesanal (2 bolas)', 280, null, true, 5);

-- CÓCTELES
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'CÓCTELES'), 'Margarita', 'Tequila, triple sec, jugo de limón', 620, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'CÓCTELES'), 'Mojito', 'Ron blanco, menta, limón y soda', 580, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'CÓCTELES'), 'Daiquiri', 'Ron blanco, jugo de limón y azúcar', 580, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'CÓCTELES'), 'Piña Colada', 'Ron, crema de coco y piña', 620, null, true, 4),
((SELECT id FROM categorias WHERE nombre = 'CÓCTELES'), 'Caipirinha', 'Cachaza, lima, azúcar y hielo', 600, null, true, 5);

-- CERVEZA
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'CERVEZA'), 'Cerveza Rubia Artesanal', 'Cerveza artesanal estilo pilsen (350ml)', 280, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'CERVEZA'), 'Cerveza Negra Artesanal', 'Cerveza artesanal estilo stout (350ml)', 320, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'CERVEZA'), 'Cerveza IPA', 'Cerveza artesanal estilo IPA (350ml)', 300, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'CERVEZA'), 'Cerveza Importada', 'Cerveza premium importada (330ml)', 380, null, true, 4);

-- VINOS
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'VINOS'), 'Vino Tinto Mendoza', 'Vino tinto malbec copa', 380, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'VINOS'), 'Vino Blanco Salta', 'Vino blanco torrontés copa', 350, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'VINOS'), 'Vino Rosado', 'Vino rosado copa', 360, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'VINOS'), 'Champagne', 'Champagne copa', 420, null, true, 4);

-- BRUNCH
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, disponible, orden) VALUES
((SELECT id FROM categorias WHERE nombre = 'BRUNCH'), 'Huevos Benedictinos', 'Pan tostado, jamón, huevo pochado y salsa holandesa', 680, null, true, 1),
((SELECT id FROM categorias WHERE nombre = 'BRUNCH'), 'Omelette', 'Omelette relleno de queso y jamón', 620, null, true, 2),
((SELECT id FROM categorias WHERE nombre = 'BRUNCH'), 'Pancakes', 'Pancakes con frutas frescas y miel', 580, null, true, 3),
((SELECT id FROM categorias WHERE nombre = 'BRUNCH'), 'Tostadas Francesas', 'Tostadas francesas con mermelada', 520, null, true, 4),
((SELECT id FROM categorias WHERE nombre = 'BRUNCH'), 'Desayuno Completo', 'Jamón, queso, huevo, pan tostado y café', 780, null, true, 5);
