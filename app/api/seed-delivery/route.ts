import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Categorías de delivery
    const categoriesData = [
      { nombre: 'Entradas', descripcion: 'Entradas para compartir', orden: 1 },
      { nombre: 'Hamburguesas', descripcion: 'Hamburguesas gourmet', orden: 2 },
      { nombre: 'Bowls', descripcion: 'Bowls saludables', orden: 3 },
      { nombre: 'Al Plato', descripcion: 'Platos principales', orden: 4 },
      { nombre: 'Pastas', descripcion: 'Pastas frescas y salsas', orden: 5 },
      { nombre: 'Ensaladas', descripcion: 'Ensaladas frescas', orden: 6 },
      { nombre: 'Pizzas Individuales', descripcion: 'Pizzas de estación', orden: 7 },
      { nombre: 'Sandwiches', descripcion: 'Sandwiches artesanales', orden: 8 },
      { nombre: 'Wraps', descripcion: 'Wraps variados', orden: 9 },
      { nombre: 'Sin TACC / Tartas', descripcion: 'Opciones sin gluten y tartas', orden: 10 },
    ];

    // Insertar categorías
    const { data: categories, error: catError } = await supabase
      .from('categorias')
      .upsert(categoriesData, { onConflict: 'nombre' });

    if (catError) {
      console.error('Error inserting categories:', catError);
      return NextResponse.json({ error: catError.message }, { status: 500 });
    }

    // Obtener IDs de las categorías
    const { data: allCategories } = await supabase
      .from('categorias')
      .select('id, nombre');

    const categoryMap: Record<string, number> = {};
    allCategories?.forEach((cat: any) => {
      categoryMap[cat.nombre] = cat.id;
    });

    // Productos de delivery
    const productsData = [
      // ENTRADAS
      { nombre: 'Papas Fritas', descripcion: 'Papas fritas crocantes con sal marina', precio: 7000, categoria_id: categoryMap['Entradas'], disponible: true, destacado: false, orden: 1 },
      { nombre: 'Papas a Caballo', descripcion: 'Papas con salsa de queso', precio: 9400, categoria_id: categoryMap['Entradas'], disponible: true, destacado: false, orden: 2 },
      { nombre: 'Papas Bar', descripcion: 'Con cheddar, panceta y cebolla de verdeo', precio: 13200, categoria_id: categoryMap['Entradas'], disponible: true, destacado: false, orden: 3 },
      { nombre: 'Quesadillas de Pollo', descripcion: 'Quesadillas rellenas de pollo', precio: 14500, categoria_id: categoryMap['Entradas'], disponible: true, destacado: false, orden: 4 },
      { nombre: 'Quesadillas 4 Quesos', descripcion: 'Quesadillas con mezcla de 4 quesos', precio: 14500, categoria_id: categoryMap['Entradas'], disponible: true, destacado: false, orden: 5 },
      { nombre: 'Mini Burritos de Pollo (x3)', descripcion: 'Mini burritos de pollo', precio: 11000, categoria_id: categoryMap['Entradas'], disponible: true, destacado: false, orden: 6 },
      { nombre: 'Tequeños', descripcion: 'Tequeños rellenos de queso', precio: 12000, categoria_id: categoryMap['Entradas'], disponible: true, destacado: false, orden: 7 },
      { nombre: 'Empanadas de Vacío y Provoleta (x3)', descripcion: 'Empanadas', precio: 13200, categoria_id: categoryMap['Entradas'], disponible: true, destacado: false, orden: 8 },
      { nombre: 'Langostinos en Panko', descripcion: 'Langostinos rebozados en panko', precio: 15200, categoria_id: categoryMap['Entradas'], disponible: true, destacado: false, orden: 9 },
      { nombre: 'Rabas', descripcion: 'Rabas a la romana', precio: 15800, categoria_id: categoryMap['Entradas'], disponible: true, destacado: false, orden: 10 },
      { nombre: 'Nuggets', descripcion: 'Nuggets con salsa de miel mostaza', precio: 11900, categoria_id: categoryMap['Entradas'], disponible: true, destacado: false, orden: 11 },
      { nombre: 'Nachos', descripcion: 'Nachos con cheddar y jalapeños', precio: 12000, categoria_id: categoryMap['Entradas'], disponible: true, destacado: false, orden: 12 },

      // HAMBURGUESAS
      { nombre: 'Americana Simple', descripcion: 'Hamburguesa Americana - Simple', precio: 15500, categoria_id: categoryMap['Hamburguesas'], disponible: true, destacado: false, orden: 1 },
      { nombre: 'Americana Doble', descripcion: 'Hamburguesa Americana - Doble', precio: 18000, categoria_id: categoryMap['Hamburguesas'], disponible: true, destacado: false, orden: 2 },
      { nombre: 'Parrillera Simple', descripcion: 'Hamburguesa Parrillera - Simple', precio: 14000, categoria_id: categoryMap['Hamburguesas'], disponible: true, destacado: false, orden: 3 },
      { nombre: 'Parrillera Doble', descripcion: 'Hamburguesa Parrillera - Doble', precio: 16500, categoria_id: categoryMap['Hamburguesas'], disponible: true, destacado: false, orden: 4 },
      { nombre: 'Clásica Simple', descripcion: 'Hamburguesa Clásica - Simple', precio: 13500, categoria_id: categoryMap['Hamburguesas'], disponible: true, destacado: false, orden: 5 },
      { nombre: 'Clásica Doble', descripcion: 'Hamburguesa Clásica - Doble', precio: 16000, categoria_id: categoryMap['Hamburguesas'], disponible: true, destacado: false, orden: 6 },
      { nombre: 'Royale Simple', descripcion: 'Hamburguesa Royale - Simple', precio: 14000, categoria_id: categoryMap['Hamburguesas'], disponible: true, destacado: false, orden: 7 },
      { nombre: 'Royale Doble', descripcion: 'Hamburguesa Royale - Doble', precio: 16500, categoria_id: categoryMap['Hamburguesas'], disponible: true, destacado: false, orden: 8 },
      { nombre: 'Takisburguer Simple', descripcion: 'Hamburguesa Takis - Simple', precio: 15300, categoria_id: categoryMap['Hamburguesas'], disponible: true, destacado: false, orden: 9 },
      { nombre: 'Takisburguer Doble', descripcion: 'Hamburguesa Takis - Doble', precio: 17800, categoria_id: categoryMap['Hamburguesas'], disponible: true, destacado: false, orden: 10 },

      // BOWLS
      { nombre: 'Poke de Pollo Teriyaki', descripcion: 'Base de arroz, pollo marinado en teriyaki, edamame y vegetales', precio: 16000, categoria_id: categoryMap['Bowls'], disponible: true, destacado: false, orden: 1 },
      { nombre: 'Poke de Langostinos', descripcion: 'Base de arroz, langostinos frescos, palta, edamame y salsa ponzu', precio: 17600, categoria_id: categoryMap['Bowls'], disponible: true, destacado: false, orden: 2 },

      // AL PLATO
      { nombre: 'Suprema Grillé con Ensalada', descripcion: 'Pechuga de pollo grillada con ensalada fresca', precio: 17400, categoria_id: categoryMap['Al Plato'], disponible: true, destacado: false, orden: 1 },
      { nombre: 'Milanesa con Puré', descripcion: 'Milanesa y puré de papas', precio: 17400, categoria_id: categoryMap['Al Plato'], disponible: true, destacado: false, orden: 2 },
      { nombre: 'Milanesa Napolitana con Papas', descripcion: 'Milanesa napolitana con papas fritas', precio: 21200, categoria_id: categoryMap['Al Plato'], disponible: true, destacado: false, orden: 3 },
      { nombre: 'Bondiola Braseada con Puré de Batata', descripcion: 'Bondiola braseada con puré de batata', precio: 21200, categoria_id: categoryMap['Al Plato'], disponible: true, destacado: false, orden: 4 },

      // PASTAS
      { nombre: 'Cintas', descripcion: 'Pasta casera cintas', precio: 9600, categoria_id: categoryMap['Pastas'], disponible: true, destacado: false, orden: 1 },
      { nombre: 'Ravioles de Ricota y Verdura', descripcion: 'Ravioles rellenos de ricota y verduras', precio: 12000, categoria_id: categoryMap['Pastas'], disponible: true, destacado: false, orden: 2 },
      { nombre: 'Sorrentinos de Jamón y Queso', descripcion: 'Sorrentinos rellenos de jamón y queso', precio: 14400, categoria_id: categoryMap['Pastas'], disponible: true, destacado: false, orden: 3 },
      { nombre: 'Salsa Filetto', descripcion: 'Salsa a base de tomate', precio: 4200, categoria_id: categoryMap['Pastas'], disponible: true, destacado: false, orden: 4 },
      { nombre: 'Salsa Crema + Tomates Confitados + Pesto', descripcion: 'Salsa cremosa con tomates confitados', precio: 5400, categoria_id: categoryMap['Pastas'], disponible: true, destacado: false, orden: 5 },
      { nombre: 'Salsa Bolognesa', descripcion: 'Salsa a la bolognesa', precio: 6600, categoria_id: categoryMap['Pastas'], disponible: true, destacado: false, orden: 6 },

      // ENSALADAS
      { nombre: 'Caesar', descripcion: 'Lechuga romana, pollo, parmesano, croutons y aderezo caesar', precio: 15400, categoria_id: categoryMap['Ensaladas'], disponible: true, destacado: false, orden: 1 },
      { nombre: 'Cuzco', descripcion: 'Ensalada Cuzco con ingredientes especiales', precio: 16000, categoria_id: categoryMap['Ensaladas'], disponible: true, destacado: false, orden: 2 },
      { nombre: 'Mediterránea', descripcion: 'Ensalada mediterránea con tomate, mozzarella y aceitunas', precio: 18500, categoria_id: categoryMap['Ensaladas'], disponible: true, destacado: false, orden: 3 },
      { nombre: 'Anticucha', descripcion: 'Ensalada anticucha con carnes y vegetales', precio: 15500, categoria_id: categoryMap['Ensaladas'], disponible: true, destacado: false, orden: 4 },
      { nombre: 'Capri', descripcion: 'Tomate, mozzarella fresca, rúcula y aceite de oliva', precio: 17000, categoria_id: categoryMap['Ensaladas'], disponible: true, destacado: false, orden: 5 },

      // PIZZAS INDIVIDUALES
      { nombre: 'Muzza y Albahaca', descripcion: 'Pizza clásica con mozzarella y albahaca fresca', precio: 11600, categoria_id: categoryMap['Pizzas Individuales'], disponible: true, destacado: false, orden: 1 },
      { nombre: 'Crudo y Rúcula', descripcion: 'Pizza con jamón crudo y rúcula', precio: 14200, categoria_id: categoryMap['Pizzas Individuales'], disponible: true, destacado: false, orden: 2 },
      { nombre: 'Hongos y Queso Azul', descripcion: 'Pizza con hongos y queso azul', precio: 14200, categoria_id: categoryMap['Pizzas Individuales'], disponible: true, destacado: false, orden: 3 },

      // SANDWICHES
      { nombre: 'Bacon', descripcion: 'Sándwich con bacon crocante', precio: 17900, categoria_id: categoryMap['Sandwiches'], disponible: true, destacado: false, orden: 1 },
      { nombre: 'Carne Queso', descripcion: 'Sándwich de carne y queso', precio: 14900, categoria_id: categoryMap['Sandwiches'], disponible: true, destacado: false, orden: 2 },
      { nombre: 'Criollo', descripcion: 'Sándwich criollo con carnes', precio: 16900, categoria_id: categoryMap['Sandwiches'], disponible: true, destacado: false, orden: 3 },
      { nombre: 'Parisienne', descripcion: 'Sándwich parisienne', precio: 14900, categoria_id: categoryMap['Sandwiches'], disponible: true, destacado: false, orden: 4 },
      { nombre: 'Napolitano', descripcion: 'Sándwich napolitano con jamón y queso', precio: 16000, categoria_id: categoryMap['Sandwiches'], disponible: true, destacado: false, orden: 5 },
      { nombre: 'Pulled Pork', descripcion: 'Sándwich con carne deshilachada', precio: 16000, categoria_id: categoryMap['Sandwiches'], disponible: true, destacado: false, orden: 6 },
      { nombre: 'Milahuevo', descripcion: 'Sándwich milanesa con huevo frito', precio: 17900, categoria_id: categoryMap['Sandwiches'], disponible: true, destacado: false, orden: 7 },
      { nombre: 'Bocata de Calamar', descripcion: 'Bocata de calamares fritos', precio: 14900, categoria_id: categoryMap['Sandwiches'], disponible: true, destacado: false, orden: 8 },
      { nombre: 'Portobellos', descripcion: 'Sándwich con hongos portobello', precio: 16000, categoria_id: categoryMap['Sandwiches'], disponible: true, destacado: false, orden: 9 },
      { nombre: 'Viet-Ñam', descripcion: 'Sándwich estilo vietnamita', precio: 14900, categoria_id: categoryMap['Sandwiches'], disponible: true, destacado: false, orden: 10 },

      // WRAPS
      { nombre: 'Caesar Wrap', descripcion: 'Wrap Caesar con pollo, lechuga y queso sardo', precio: 15400, categoria_id: categoryMap['Wraps'], disponible: true, destacado: false, orden: 1 },
      { nombre: 'Pollo Palta', descripcion: 'Wrap con pollo, palta, tomate y espinaca', precio: 17000, categoria_id: categoryMap['Wraps'], disponible: true, destacado: false, orden: 2 },
      { nombre: 'Tuna Wrap', descripcion: 'Wrap con atún, lechuga y vegetales frescos', precio: 15400, categoria_id: categoryMap['Wraps'], disponible: true, destacado: false, orden: 3 },
      { nombre: 'Ternera', descripcion: 'Wrap con ternera y vegetales asados', precio: 17000, categoria_id: categoryMap['Wraps'], disponible: true, destacado: false, orden: 4 },
      { nombre: 'Hongos', descripcion: 'Wrap vegetariano con hongos y queso', precio: 16000, categoria_id: categoryMap['Wraps'], disponible: true, destacado: false, orden: 5 },

      // SIN TACC / TARTAS
      { nombre: 'Tarta de Cabutia', descripcion: 'Tarta sin TACC de cabutia', precio: 14900, categoria_id: categoryMap['Sin TACC / Tartas'], disponible: true, destacado: true, orden: 1 },
      { nombre: 'Tarta de Jamón y Queso', descripcion: 'Tarta sin TACC de jamón y queso', precio: 14900, categoria_id: categoryMap['Sin TACC / Tartas'], disponible: true, destacado: true, orden: 2 },
      { nombre: 'Tarta de Vegetales', descripcion: 'Tarta sin TACC de vegetales', precio: 14900, categoria_id: categoryMap['Sin TACC / Tartas'], disponible: true, destacado: true, orden: 3 },
    ];

    // Insertar productos
    const { data: products, error: prodError } = await supabase
      .from('productos')
      .insert(productsData);

    if (prodError) {
      console.error('Error inserting products:', prodError);
      return NextResponse.json({ error: prodError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: 'Delivery menu seeded successfully!',
        categories: categories?.length || 0,
        products: productsData.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
