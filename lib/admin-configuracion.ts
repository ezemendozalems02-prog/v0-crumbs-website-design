"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface ConfigItem {
  id: string
  valor: string
  descripcion: string | null
  updated_at: string
}

// Consulta pública sin cookies (mismo patrón que lib/public-content.ts): esta
// función la usa components/footer.tsx, presente en todas las páginas
// públicas, así que depender de cookies() acá bloqueaba el ISR de esas
// páginas. La tabla "configuracion" tiene RLS pública de solo lectura, no
// depende de sesión, por eso puede resolverse con la anon key vía REST.
export async function getConfiguracion(): Promise<Record<string, string>> {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/configuracion`)
    url.searchParams.set("select", "id,valor")
    url.searchParams.set("order", "id.asc")

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
      console.error("[configuracion] Error al leer configuración:", await res.text())
      return {}
    }

    const data = (await res.json()) as { id: string; valor: string }[]
    return Object.fromEntries((data ?? []).map((r) => [r.id, r.valor]))
  } catch (error) {
    console.error("[configuracion] Error al leer configuración:", error)
    return {}
  }
}

export async function getConfiguracionCompleta(): Promise<ConfigItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("configuracion")
    .select("*")
    .order("id")

  if (error) {
    console.error("[configuracion] Error al leer configuración completa:", error)
    return []
  }

  return (data ?? []) as ConfigItem[]
}

export async function updateConfiguracionBulk(
  cambios: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const updates = Object.entries(cambios).map(([id, valor]) =>
    supabase
      .from("configuracion")
      .update({ valor: valor.trim(), updated_at: new Date().toISOString() })
      .eq("id", id)
  )

  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)

  if (failed?.error) {
    console.error("[configuracion] Error en bulk update:", failed.error)
    return { success: false, error: failed.error.message }
  }

  // Revalidar todas las páginas del sitio ya que el footer con horarios está en todas
  for (const ruta of ["/", "/cafeteria", "/cocina", "/delivery", "/nosotros", "/reservas", "/contacto"]) {
    revalidatePath(ruta, "layout")
  }

  return { success: true }
}
