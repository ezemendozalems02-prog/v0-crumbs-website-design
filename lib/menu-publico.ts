import type { Producto, Categoria } from "@/lib/admin-productos"

export type MenuCategory = {
  id: string
  nombre: string
  slug: string
  tipo_menu: string
  productos: Producto[]
}

// Consulta pública sin cookies (mismo patrón que lib/public-content.ts): esta
// función alimenta /cocina, /cafeteria y /delivery, y quedaba bloqueada de
// ISR por createClient()/cookies(). Las 5 tablas involucradas (categorias,
// productos, producto_variantes, producto_extras, producto_extras_opciones)
// tienen RLS pública de solo lectura confirmada en Supabase (SELECT,
// roles={public}, qual=true), no dependen de sesión.
async function menuFetch<T>(table: string, params: Record<string, string>): Promise<T[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  if (!res.ok) {
    console.error(`[menu-publico] menuFetch error ${res.status} on ${table}:`, await res.text())
    return []
  }

  return res.json()
}

export async function getMenuByTipo(tipo_menu: "desayuno" | "almuerzo_cena" | "delivery"): Promise<MenuCategory[]> {
  // Misma consulta que antes: categorias.tipo_menu IN (tipo_menu, 'todos') AND activa = true, order by orden asc
  const categorias = await menuFetch<Categoria>("categorias", {
    select: "*",
    tipo_menu: `in.(${tipo_menu},todos)`,
    activa: "eq.true",
    order: "orden.asc",
  })

  if (!categorias.length) return []

  const categoriaIds = categorias.map((c) => c.id)

  // Misma consulta que antes: productos + embeds de variantes/extras/opciones,
  // categoria_id IN (categoriaIds) AND disponible = true, order by orden asc, created_at desc
  const productos = await menuFetch<Producto>("productos", {
    select: "*,variantes:producto_variantes(*),extras:producto_extras(*,opciones:producto_extras_opciones(*))",
    categoria_id: `in.(${categoriaIds.join(",")})`,
    disponible: "eq.true",
    order: "orden.asc,created_at.desc",
  })

  return categorias.map((cat) => ({
    ...cat,
    productos: productos.filter((p) => p.categoria_id === cat.id),
  })).filter((c) => c.productos.length > 0)
}
