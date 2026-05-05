"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface ConfigItem {
  id: string
  valor: string
  descripcion: string | null
  updated_at: string
}

export async function getConfiguracion(): Promise<Record<string, string>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("configuracion")
    .select("id, valor")
    .order("id")

  if (error) {
    console.error("[configuracion] Error al leer configuración:", error)
    return {}
  }

  return Object.fromEntries((data ?? []).map((r) => [r.id, r.valor]))
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

  // Revalidar todas las páginas públicas que consumen configuración
  revalidatePath("/", "layout")
  revalidatePath("/contacto")

  return { success: true }
}
