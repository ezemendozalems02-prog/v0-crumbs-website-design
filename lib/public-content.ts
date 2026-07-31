import { createClient } from "@/lib/supabase/server"
import type { Banner } from "@/lib/admin-banners-types"
import type { Seccion } from "@/lib/admin-secciones-types"

// Hacer fetch directo a la API REST de Supabase con ISR tags
// Con tags, permite on-demand revalidation cuando el admin guarda
async function supabaseFetch<T>(
  table: string,
  filters: Record<string, string>,
  selectCols = "*",
  tags?: string[]
): Promise<T[]> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}`
  )

  // select siempre como primer param
  url.searchParams.set("select", selectCols)

  // Agregar filtros como query params (formato PostgREST)
  for (const [key, value] of Object.entries(filters)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600, tags: tags || [] },
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  if (!res.ok) {
    console.error(`[public-content] supabaseFetch error ${res.status} on ${table}:`, await res.text())
    return []
  }

  return res.json()
}

// Traer banners de una página específica — con ISR tags para on-demand revalidation
export async function getBannersForPage(
  pagina: string,
  options?: { tags?: string[] }
): Promise<Banner[]> {
  try {
    const data = await supabaseFetch<Banner>("banners", {
      pagina: `eq.${pagina}`,
      activo: "eq.true",
      order: "orden.asc",
    }, "*", options?.tags)
    return data
  } catch (err) {
    console.error("[public-content] getBannersForPage exception:", err)
    return []
  }
}

// Traer una sección por clave — con ISR tags para on-demand revalidation
export async function getSeccionByClave(
  clave: string,
  options?: { tags?: string[] }
): Promise<Seccion | null> {
  try {
    // Usar fetch con tags en lugar de cliente Supabase para permitir ISR
    const data = await supabaseFetch<Seccion>("secciones", {
      clave: `eq.${clave}`,
      activo: "eq.true",
    }, "*", options?.tags)
    return data[0] ?? null
  } catch (err) {
    console.error("[public-content] getSeccionByClave exception:", err)
    return null
  }
}

// Traer todas las secciones de una página — sin caché
export async function getSeccionesForPage(pagina: string): Promise<Seccion[]> {
  try {
    const data = await supabaseFetch<Seccion>("secciones", {
      pagina: `eq.${pagina}`,
      activo: "eq.true",
      order: "nombre.asc",
    })
    return data
  } catch (err) {
    console.error("[public-content] getSeccionesForPage exception:", err)
    return []
  }
}
