"use server"

import { createClient } from "@/lib/supabase/server"
import type { Banner, BannerInput } from "@/lib/admin-banners-types"

export async function getBanners(pagina?: string): Promise<Banner[]> {
  const supabase = await createClient()
  let query = supabase
    .from("banners")
    .select("*")
    .order("pagina")
    .order("orden")

  if (pagina) query = query.eq("pagina", pagina)

  const { data, error } = await query
  if (error) {
    console.error("[admin-banners] getBanners error:", error)
    return []
  }
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

