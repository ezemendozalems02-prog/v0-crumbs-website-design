-- Script para agregar el menú de Delivery completo
-- Primero, agregar las categorías de delivery

INSERT INTO categorias (nombre, descripcion, imagen_url, orden) VALUES
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
