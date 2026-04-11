"use server"

import { createClient } from "@/lib/supabase/server"

export type Categoria = {
  id: string
  nombre: string
  slug: string
  tipo_menu: "desayuno" | "almuerzo_cena" | "delivery" | "todos"
  activa: boolean
  orden: number
}

export type Variante = {
  id: string
  producto_id: string
  nombre: string
  precio: number
  disponible: boolean
  orden: number
}

export type Producto = {
  id: string
  created_at: string
  updated_at: string
  nombre: string
  descripcion: string | null
  precio: number
  categoria_id: string
  categoria?: Categoria
  imagen_url: string | null
  disponible: boolean
  destacado: boolean
  orden: number
  etiquetas: string[]
  variantes?: Variante[]
}

export type ProductoInput = {
  nombre: string
  descripcion?: string
  precio: number
  categoria_id: string
  imagen_url?: string
  disponible: boolean
  destacado: boolean
  orden: number
  etiquetas: string[]
}

export type VarianteInput = {
  nombre: string
  precio: number
  disponible: boolean
  orden: number
}

// ---------- CATEGORÍAS ----------

export async function getCategorias(): Promise<Categoria[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("tipo_menu")
    .order("orden")
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function upsertCategoria(input: Partial<Categoria> & { nombre: string; slug: string; tipo_menu: string }): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("categorias").upsert(input)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function toggleCategoriaActiva(id: string, activa: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("categorias").update({ activa }).eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteCategoria(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("categorias").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ---------- PRODUCTOS ----------

export async function getProductos(filters?: { categoria_id?: string; disponible?: boolean; search?: string; tipo_menu?: string }): Promise<Producto[]> {
  const supabase = await createClient()
  let query = supabase
    .from("productos")
    .select("*, categoria:categorias(*), variantes:producto_variantes(*)")
    .order("orden")
    .order("created_at", { ascending: false })

  if (filters?.categoria_id) query = query.eq("categoria_id", filters.categoria_id)
  if (filters?.disponible !== undefined) query = query.eq("disponible", filters.disponible)
  if (filters?.search) query = query.ilike("nombre", `%${filters.search}%`)
  
  const { data, error } = await query
  if (error) { console.error(error); return [] }
  
  // Filter by tipo_menu on the client side since we need to check the categoria relationship
  if (filters?.tipo_menu) {
    if (filters.tipo_menu === "delivery") {
      return (data ?? []).filter(p => p.categoria?.tipo_menu === "delivery")
    } else if (filters.tipo_menu === "carta") {
      return (data ?? []).filter(p => p.categoria?.tipo_menu === "desayuno" || p.categoria?.tipo_menu === "almuerzo_cena")
    }
  }
  
  return data ?? []
}

export async function getProducto(id: string): Promise<Producto | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("productos")
    .select("*, categoria:categorias(*), variantes:producto_variantes(*)")
    .eq("id", id)
    .single()
  if (error) return null
  return data
}

export async function createProducto(input: ProductoInput, variantes: VarianteInput[]): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("productos").insert(input).select("id").single()
  if (error) return { success: false, error: error.message }

  if (variantes.length > 0) {
    const vars = variantes.map((v, i) => ({ ...v, producto_id: data.id, orden: i }))
    const { error: vErr } = await supabase.from("producto_variantes").insert(vars)
    if (vErr) return { success: false, error: vErr.message }
  }
  return { success: true, id: data.id }
}

export async function updateProducto(id: string, input: Partial<ProductoInput>, variantes: VarianteInput[]): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("productos").update(input).eq("id", id)
  if (error) return { success: false, error: error.message }

  // Replace all variantes
  await supabase.from("producto_variantes").delete().eq("producto_id", id)
  if (variantes.length > 0) {
    const vars = variantes.map((v, i) => ({ ...v, producto_id: id, orden: i }))
    const { error: vErr } = await supabase.from("producto_variantes").insert(vars)
    if (vErr) return { success: false, error: vErr.message }
  }
  return { success: true }
}

export async function toggleProductoDisponible(id: string, disponible: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("productos").update({ disponible }).eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteProducto(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("productos").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function getMetricasProductos(): Promise<{
  total: number
  disponibles: number
  no_disponibles: number
  destacados: number
  por_categoria: { nombre: string; count: number }[]
}> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("productos")
    .select("disponible, destacado, categoria:categorias(nombre)")
  if (error || !data) return { total: 0, disponibles: 0, no_disponibles: 0, destacados: 0, por_categoria: [] }

  const total = data.length
  const disponibles = data.filter((p) => p.disponible).length
  const destacados = data.filter((p) => p.destacado).length
  const catMap: Record<string, number> = {}
  data.forEach((p) => {
    const cat = (p.categoria as any)?.nombre ?? "Sin categoría"
    catMap[cat] = (catMap[cat] ?? 0) + 1
  })
  return {
    total,
    disponibles,
    no_disponibles: total - disponibles,
    destacados,
    por_categoria: Object.entries(catMap).map(([nombre, count]) => ({ nombre, count })),
  }
}
