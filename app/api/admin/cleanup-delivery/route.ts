import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Obtener todos los productos delivery
    const delivery_products = [
      "Papas Fritas", "Papas a Caballo", "Papas Bar", "Quesadillas de Pollo",
      "Quesadillas 4 Quesos", "Mini Burritos de Pollo (x3)", "Tequeños",
      "Empanadas de Vacío y Provoleta (x3)", "Langostinos en Panko", "Rabas",
      "Nuggets", "Nachos", "Americana Simple", "Americana Doble",
      "Parrillera Simple", "Parrillera Doble", "Clásica Simple", "Clásica Doble",
      "Royale Simple", "Royale Doble", "Takisburguer Simple", "Takisburguer Doble",
      "Poke de Pollo Teriyaki", "Poke de Langostinos", "Suprema Grillé con Ensalada",
      "Milanesa con Puré", "Milanesa Napolitana con Papas", "Bondiola Braseada con Puré de Batata",
      "Cintas", "Ravioles de Ricota y Verdura", "Sorrentinos de Jamón y Queso",
      "Salsa Filetto", "Salsa Crema + Tomates Confitados + Pesto", "Salsa Bolognesa",
      "Caesar", "Cuzco", "Mediterránea", "Anticucha", "Capri",
      "Muzza y Albahaca", "Crudo y Rúcula", "Hongos y Queso Azul",
      "Bacon", "Carne Queso", "Criollo", "Parisienne", "Napolitano",
      "Pulled Pork", "Milahuevo", "Bocata de Calamar", "Portobellos", "Viet-Ñam",
      "Caesar Wrap", "Pollo Palta", "Tuna Wrap", "Ternera", "Hongos",
      "Tarta de Cabutia", "Tarta de Jamón y Queso", "Tarta de Vegetales"
    ]

    // Obtener IDs de categorías delivery
    const { data: delivery_cats } = await supabase
      .from('categorias')
      .select('id')
      .eq('tipo_menu', 'delivery')

    const delivery_cat_ids = delivery_cats?.map(c => c.id) || []

    if (delivery_cat_ids.length === 0) {
      return NextResponse.json({ error: 'No delivery categories found' }, { status: 400 })
    }

    // Para cada producto delivery, si existe en otras categorías, moverlo a delivery
    let moved = 0
    let kept = 0

    for (const product_name of delivery_products) {
      const { data: products } = await supabase
        .from('productos')
        .select('id, categoria_id')
        .ilike('nombre', product_name)

      if (!products || products.length === 0) continue

      // Dejar el primero en delivery, eliminar los demás
      let found_in_delivery = false
      const ids_to_delete = []

      for (const p of products) {
        if (delivery_cat_ids.includes(p.categoria_id)) {
          if (!found_in_delivery) {
            found_in_delivery = true
            kept++
          } else {
            ids_to_delete.push(p.id)
          }
        } else {
          ids_to_delete.push(p.id)
        }
      }

      // Si no está en delivery pero existe, mover el primero
      if (!found_in_delivery && products.length > 0) {
        await supabase
          .from('productos')
          .update({ categoria_id: delivery_cat_ids[0] })
          .eq('id', products[0].id)
        moved++
      }

      // Eliminar duplicados
      for (const id of ids_to_delete) {
        await supabase
          .from('productos')
          .delete()
          .eq('id', id)
      }
    }

    return NextResponse.json({ 
      success: true, 
      moved,
      kept,
      total: moved + kept
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
