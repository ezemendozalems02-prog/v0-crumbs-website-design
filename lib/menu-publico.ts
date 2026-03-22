import { createClient } from "@/lib/supabase/server"
import type { Producto, Categoria } from "@/lib/admin-productos"

export type MenuCategory = {
  id: string
  nombre: string
  slug: string
  tipo_menu: string
  productos: Producto[]
}

export async function getMenuByTipo(tipo_menu: "desayuno" | "almuerzo_cena" | "delivery"): Promise<MenuCategory[]> {
  const supabase = await createClient()

  const { data: categorias, error: catError } = await supabase
    .from("categorias")
    .select("*")
    .in("tipo_menu", [tipo_menu, "todos"])
    .eq("activa", true)
    .order("orden")

  if (catError || !categorias?.length) return []

  const categoriaIds = categorias.map((c) => c.id)

  const { data: productos, error: prodError } = await supabase
    .from("productos")
    .select("*, variantes:producto_variantes(*)")
    .in("categoria_id", categoriaIds)
    .eq("disponible", true)
    .order("orden")
    .order("created_at", { ascending: false })

  if (prodError) return []

  return categorias.map((cat) => ({
    ...cat,
    productos: (productos ?? []).filter((p) => p.categoria_id === cat.id),
  })).filter((c) => c.productos.length > 0)
}
