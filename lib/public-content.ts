import { createClient } from "@/lib/supabase/server"
import type { Banner } from "@/lib/admin-banners-types"
import type { Seccion } from "@/lib/admin-secciones-types"

// Traer banners de una página específica
export async function getBannersForPage(pagina: string): Promise<Banner[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("pagina", pagina)
      .eq("activo", true)
      .order("orden")

    if (error) {
      console.error("[public-content] getBannersForPage error:", error)
      return []
    }
    return data ?? []
  } catch (err) {
    console.error("[public-content] getBannersForPage exception:", err)
    return []
  }
}

// Traer una sección por clave
export async function getSeccionByClave(clave: string): Promise<Seccion | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("secciones")
      .select("*")
      .eq("clave", clave)
      .eq("activo", true)
      .single()

    if (error) {
      console.error("[public-content] getSeccionByClave error:", error)
      return null
    }
    return data
  } catch (err) {
    console.error("[public-content] getSeccionByClave exception:", err)
    return null
  }
}

// Traer todas las secciones de una página
export async function getSeccionesForPage(pagina: string): Promise<Seccion[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("secciones")
      .select("*")
      .eq("pagina", pagina)
      .eq("activo", true)
      .order("nombre")

    if (error) {
      console.error("[public-content] getSeccionesForPage error:", error)
      return []
    }
    return data ?? []
  } catch (err) {
    console.error("[public-content] getSeccionesForPage exception:", err)
    return []
  }
}
