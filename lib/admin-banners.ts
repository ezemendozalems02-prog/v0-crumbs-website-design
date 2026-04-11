"use server"

import { createClient } from "@/lib/supabase/server"

export type Banner = {
  id: string
  titulo: string
  subtitulo: string | null
  descripcion: string | null
  imagen_url: string | null
  boton_texto: string | null
  boton_link: string | null
  pagina: string
  activo: boolean
  orden: number
  created_at: string
  updated_at: string
}

export type BannerInput = {
  titulo: string
  subtitulo?: string
  descripcion?: string
  imagen_url?: string
  boton_texto?: string
  boton_link?: string
  pagina: string
  activo: boolean
  orden: number
}

export const PAGINAS_OPCIONES = [
  { value: "inicio", label: "Inicio" },
  { value: "cafeteria", label: "Cafetería" },
  { value: "cocina", label: "Cocina" },
  { value: "delivery", label: "Delivery" },
  { value: "contacto", label: "Contacto" },
  { value: "nosotros", label: "Nosotros" },
]

export async function getBanners(pagina?: string): Promise<Banner[]> {
  const supabase = await createClient()
  let query = supabase
    .from("banners")
    .select("*")
    .order("pagina")
    .order("orden")

  if (pagina) query = query.eq("pagina", pagina)

  const { data, error } = await query
  if (error) { console.error("[admin-banners] getBanners error:", error); return [] }
  return data ?? []
}

export async function getBanner(id: string): Promise<Banner | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("id", id)
    .single()
  if (error) return null
  return data
}

export async function createBanner(input: BannerInput): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("banners")
    .insert(input)
    .select("id")
    .single()
  if (error) return { success: false, error: error.message }
  return { success: true, id: data.id }
}

export async function updateBanner(id: string, input: Partial<BannerInput>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("banners").update(input).eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function toggleBannerActivo(id: string, activo: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("banners").update({ activo }).eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function updateBannerOrden(id: string, orden: number): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("banners").update({ orden }).eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteBanner(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("banners").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}
