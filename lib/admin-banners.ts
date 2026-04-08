"use server"

import { createClient } from "@/lib/supabase/server"

export type Banner = {
  id: string
  titulo: string
  descripcion: string | null
  imagen_url: string | null
  enlace_url: string | null
  posicion: number
  activo: boolean
  created_at: string
  updated_at: string
}

export type BannerInput = {
  titulo: string
  descripcion?: string
  imagen_url?: string
  enlace_url?: string
  posicion: number
  activo: boolean
}

export async function getBanners(): Promise<Banner[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("posicion")
  if (error) {
    console.error(error)
    return []
  }
  return data ?? []
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
  const { error } = await supabase
    .from("banners")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function toggleBannerActivo(id: string, activo: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("banners")
    .update({ activo, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteBanner(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("banners").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}
