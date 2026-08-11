import type { Banner } from "@/lib/admin-banners-types"
import type { Seccion } from "@/lib/admin-secciones-types"

// Hacer fetch directo a la API REST de Supabase.
// Next.js 15+ no cachea fetch() por defecto (cambio de default respecto a
// versiones previas), por eso se declara next.revalidate explícito acá para
// que quede sujeto a la Data Cache de Next con la misma ventana que el ISR
// de las páginas (60s). La invalidación puntual al guardar en el admin sigue
// haciéndose vía revalidatePath() en lib/admin-banners.ts / lib/admin-secciones.ts.
async function supabaseFetch<T>(
  table: string,
  filters: Record<string, string>,
  selectCols = "*"
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
    next: { revalidate: 60 },
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

// Traer banners de una página específica — sin caché
export async function getBannersForPage(pagina: string): Promise<Banner[]> {
  try {
    const data = await supabaseFetch<Banner>("banners", {
      pagina: `eq.${pagina}`,
      activo: "eq.true",
      order: "orden.asc",
    })
    return data
  } catch (err) {
    console.error("[public-content] getBannersForPage exception:", err)
    return []
  }
}

// Traer una sección por clave — consulta pública sin cookies (mismo patrón
// que getBannersForPage). La tabla "secciones" tiene RLS pública de solo
// lectura (scripts/009_fix_secciones_rls.sql), no depende de sesión.
export async function getSeccionByClave(clave: string): Promise<Seccion | null> {
  try {
    const data = await supabaseFetch<Seccion>("secciones", {
      clave: `eq.${clave}`,
      activo: "eq.true",
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
    })
    return data
  } catch (err) {
    console.error("[public-content] getSeccionesForPage exception:", err)
    return []
  }
}
