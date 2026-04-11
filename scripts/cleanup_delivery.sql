-- Eliminar todos los productos de delivery que NO estén en una categoría delivery
DELETE FROM productos 
WHERE nombre IN (
  'Papas Fritas', 'Papas a Caballo', 'Papas Bar', 'Quesadillas de Pollo',
  'Quesadillas 4 Quesos', 'Mini Burritos de Pollo (x3)', 'Tequeños',
  'Empanadas de Vacío y Provoleta (x3)', 'Langostinos en Panko', 'Rabas',
  'Nuggets', 'Nachos', 'Americana Simple', 'Americana Doble',
  'Parrillera Simple', 'Parrillera Doble', 'Clásica Simple', 'Clásica Doble',
  'Royale Simple', 'Royale Doble', 'Takisburguer Simple', 'Takisburguer Doble',
  'Poke de Pollo Teriyaki', 'Poke de Langostinos', 'Suprema Grillé con Ensalada',
  'Milanesa con Puré', 'Milanesa Napolitana con Papas', 'Bondiola Braseada con Puré de Batata',
  'Cintas', 'Ravioles de Ricota y Verdura', 'Sorrentinos de Jamón y Queso',
  'Salsa Filetto', 'Salsa Crema + Tomates Confitados + Pesto', 'Salsa Bolognesa',
  'Caesar', 'Cuzco', 'Mediterránea', 'Anticucha', 'Capri',
  'Muzza y Albahaca', 'Crudo y Rúcula', 'Hongos y Queso Azul',
  'Bacon', 'Carne Queso', 'Criollo', 'Parisienne', 'Napolitano',
  'Pulled Pork', 'Milahuevo', 'Bocata de Calamar', 'Portobellos', 'Viet-Ñam',
  'Caesar Wrap', 'Pollo Palta', 'Tuna Wrap', 'Ternera', 'Hongos',
  'Tarta de Cabutia', 'Tarta de Jamón y Queso', 'Tarta de Vegetales'
)
AND categoria_id NOT IN (
  SELECT id FROM categorias WHERE tipo_menu = 'delivery'
);

-- Mover todos los productos delivery que estén en categorías no-delivery a la primera categoría delivery
UPDATE productos
SET categoria_id = (SELECT id FROM categorias WHERE tipo_menu = 'delivery' LIMIT 1)
WHERE nombre IN (
  'Papas Fritas', 'Papas a Caballo', 'Papas Bar', 'Quesadillas de Pollo',
  'Quesadillas 4 Quesos', 'Mini Burritos de Pollo (x3)', 'Tequeños',
  'Empanadas de Vacío y Provoleta (x3)', 'Langostinos en Panko', 'Rabas',
  'Nuggets', 'Nachos', 'Americana Simple', 'Americana Doble',
  'Parrillera Simple', 'Parrillera Doble', 'Clásica Simple', 'Clásica Doble',
  'Royale Simple', 'Royale Doble', 'Takisburguer Simple', 'Takisburguer Doble',
  'Poke de Pollo Teriyaki', 'Poke de Langostinos', 'Suprema Grillé con Ensalada',
  'Milanesa con Puré', 'Milanesa Napolitana con Papas', 'Bondiola Braseada con Puré de Batata',
  'Cintas', 'Ravioles de Ricota y Verdura', 'Sorrentinos de Jamón y Queso',
  'Salsa Filetto', 'Salsa Crema + Tomates Confitados + Pesto', 'Salsa Bolognesa',
  'Caesar', 'Cuzco', 'Mediterránea', 'Anticucha', 'Capri',
  'Muzza y Albahaca', 'Crudo y Rúcula', 'Hongos y Queso Azul',
  'Bacon', 'Carne Queso', 'Criollo', 'Parisienne', 'Napolitano',
  'Pulled Pork', 'Milahuevo', 'Bocata de Calamar', 'Portobellos', 'Viet-Ñam',
  'Caesar Wrap', 'Pollo Palta', 'Tuna Wrap', 'Ternera', 'Hongos',
  'Tarta de Cabutia', 'Tarta de Jamón y Queso', 'Tarta de Vegetales'
)
AND categoria_id IN (
  SELECT id FROM categorias WHERE tipo_menu != 'delivery'
);
