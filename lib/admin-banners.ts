"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Banner, BannerInput } from "@/lib/admin-banners-types"

const revalidateBannerPages = async (pagina?: string) => {
  // Revalidar la página específica
  if (pagina === "inicio") revalidatePath("/")
  if (pagina === "cafeteria") revalidatePath("/cafeteria")
  if (pagina === "cocina") revalidatePath("/cocina")
  
  // Revalidar admin también
  revalidatePath("/admin/banners")
  
  // También hacer llamada al API para asegurar revalidación
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    console.log("[admin-banners] Revalidating via API:", appUrl)
    
    const response = await fetch(`${appUrl}/api/revalidate-banners`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagina }),
      cache: "no-store",
    })
    
    if (!response.ok) {
      console.error("[admin-banners] Revalidation API error:", response.statusText)
    }
  } catch (err) {
    console.error("[admin-banners] Error calling revalidate API:", err)
  }
}

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
  
  // Revalidar páginas después de crear
  await revalidateBannerPages(input.pagina)
  
  return { success: true, id: data.id }
}

export async function updateBanner(id: string, input: Partial<BannerInput>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  // Obtener el banner para saber su página
  const banner = await getBanner(id)
  
  const { error } = await supabase.from("banners").update(input).eq("id", id)
  if (error) return { success: false, error: error.message }
  
  // Revalidar la página del banner
  if (banner) await revalidateBannerPages(banner.pagina)
  
  return { success: true }
}

export async function toggleBannerActivo(id: string, activo: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  // Obtener el banner para saber su página
  const banner = await getBanner(id)
  
  const { error } = await supabase.from("banners").update({ activo }).eq("id", id)
  if (error) return { success: false, error: error.message }
  
  // Revalidar la página del banner
  if (banner) await revalidateBannerPages(banner.pagina)
  
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
  
  // Obtener el banner para saber su página antes de eliminarlo
  const banner = await getBanner(id)
  
  const { error } = await supabase.from("banners").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  
  // Revalidar la página del banner
  if (banner) await revalidateBannerPages(banner.pagina)
  
  return { success: true }
}

