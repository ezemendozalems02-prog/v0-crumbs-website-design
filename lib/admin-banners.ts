"use server"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { revalidatePath, revalidateTag } from "next/cache"
import type { Banner, BannerInput } from "@/lib/admin-banners-types"

// Service role client — bypasa RLS para operaciones de admin
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY")
  return createSupabaseClient(url, key, { auth: { persistSession: false } })
}

const revalidateBannerPages = (pagina?: string) => {
  // Usar revalidateTag para on-demand revalidation (mucho más eficiente)
  revalidateTag("banners")
  if (pagina) {
    revalidateTag(`banners-${pagina}`)
  }
  revalidatePath("/admin/banners", "page")
}

export async function getBanners(pagina?: string): Promise<Banner[]> {
  const supabase = getServiceClient()
  let query = supabase
    .from("banners")
    .select("*")
    .order("pagina")
    .order("orden")

  if (pagina) query = query.eq("pagina", pagina)

  const { data, error } = await query
  if (error) {
    console.error("[admin-banners] getBanners error:", error.message)
    return []
  }
  return data ?? []
}

export async function getBanner(id: string): Promise<Banner | null> {
  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("id", id)
    .single()
  if (error) return null
  return data
}

export async function createBanner(input: BannerInput): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from("banners")
    .insert(input)
    .select("id")
    .single()
  if (error) return { success: false, error: error.message }
  revalidateBannerPages(input.pagina)
  return { success: true, id: data.id }
}

export async function updateBanner(id: string, input: Partial<BannerInput>): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient()

  const existing = await getBanner(id)
  if (!existing) return { success: false, error: "Banner no encontrado" }

  const { data, error } = await supabase
    .from("banners")
    .update(input)
    .eq("id", id)
    .select("id, imagen_url")

  if (error) return { success: false, error: error.message }

  if (!data || data.length === 0) {
    return { success: false, error: "No se actualizó ningún registro. Verificar permisos o ID." }
  }

  revalidateBannerPages(existing.pagina)
  return { success: true }
}

export async function toggleBannerActivo(id: string, activo: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient()
  const banner = await getBanner(id)
  const { error } = await supabase.from("banners").update({ activo }).eq("id", id)
  if (error) return { success: false, error: error.message }
  if (banner) revalidateBannerPages(banner.pagina)
  return { success: true }
}

export async function updateBannerOrden(id: string, orden: number): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient()
  const { error } = await supabase.from("banners").update({ orden }).eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteBanner(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getServiceClient()
  const banner = await getBanner(id)
  const { error } = await supabase.from("banners").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  if (banner) revalidateBannerPages(banner.pagina)
  return { success: true }
}

