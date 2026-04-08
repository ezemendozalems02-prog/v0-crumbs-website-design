"use server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface Banner {
  id: string
  titulo: string
  descripcion?: string
  imagen_url?: string
  enlace_url?: string
  posicion: number
  activo: boolean
  created_at: string
  updated_at: string
}

export async function getBanners() {
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("posicion", { ascending: true })

  if (error) throw new Error(error.message)
  return (data || []) as Banner[]
}

export async function createBanner(banner: Partial<Banner>) {
  const { data, error } = await supabase
    .from("banners")
    .insert([banner])
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as Banner }
}

export async function updateBanner(id: string, banner: Partial<Banner>) {
  const { data, error } = await supabase
    .from("banners")
    .update({ ...banner, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as Banner }
}

export async function deleteBanner(id: string) {
  const { error } = await supabase
    .from("banners")
    .delete()
    .eq("id", id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function reorderBanners(banners: Array<{ id: string; posicion: number }>) {
  const { error } = await supabase.rpc("reorder_items", {
    items: banners.map((b, i) => ({ id: b.id, position: i })),
    table: "banners",
  })

  if (error) {
    // Fallback: actualizar uno por uno
    for (const { id, posicion } of banners) {
      await supabase
        .from("banners")
        .update({ posicion })
        .eq("id", id)
    }
  }

  return { success: true }
}
