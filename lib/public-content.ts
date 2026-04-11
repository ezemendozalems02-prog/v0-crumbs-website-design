import type { Banner } from "@/lib/admin-banners-types"
import type { Seccion } from "@/lib/admin-secciones-types"

// Hacer fetch directo a la API REST de Supabase con cache: 'no-store'
// Esto evita que el Data Cache de Next.js guarde los datos entre requests
async function supabaseFetch<T>(
  table: string,
  params: Record<string, string>
): Promise<T[]> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}`
  )

  // Agregar filtros como query params (formato PostgREST)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  if (!res.ok) {
    console.error(`[public-content] supabaseFetch error ${res.status}:`, await res.text())
    return []
  }

  return res.json()
}

// Traer banners de una página específica — sin caché
export async function getBannersForPage(pagina: string): Promise<Banner[]> {
  try {
    const data = await supabaseFetch<Banner>("banners", {
      pagina: `eq.${pagina}`,
      activo: "eq.true",
      order: "orden.asc",
      select: "*",
    })
    return data
  } catch (err) {
    console.error("[public-content] getBannersForPage exception:", err)
    return []
  }
}

// Traer una sección por clave — sin caché
export async function getSeccionByClave(clave: string): Promise<Seccion | null> {
  try {
    const data = await supabaseFetch<Seccion>("secciones", {
      clave: `eq.${clave}`,
      activo: "eq.true",
      select: "*",
      limit: "1",
    })
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
      select: "*",
    })
    return data
  } catch (err) {
    console.error("[public-content] getSeccionesForPage exception:", err)
    return []
  }
}
