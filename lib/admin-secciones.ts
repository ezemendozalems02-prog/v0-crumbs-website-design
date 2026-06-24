"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { Seccion, SeccionInput } from "@/lib/admin-secciones-types"

// Páginas públicas que usan secciones — se invalidan tras cada cambio
const RUTAS_PUBLICAS = ["/", "/cafeteria", "/cocina", "/delivery", "/nosotros", "/reservas", "/admin/secciones"]

function revalidarTodo() {
  // Revalidar todas las rutas públicas
  for (const ruta of RUTAS_PUBLICAS) {
    revalidatePath(ruta, "layout")
  }
  // Fuerza revalidación del layout raíz también
  revalidatePath("/", "layout")
}

export async function getSecciones(pagina?: string): Promise<Seccion[]> {
  const supabase = await createClient()
  let query = supabase
    .from("secciones")
    .select("*")
    .order("pagina")
    .order("nombre")

  if (pagina) query = query.eq("pagina", pagina)

  const { data, error } = await query
  if (error) {
    console.error("[admin-secciones] getSecciones error:", error)
    return []
  }
  return data ?? []
}

export async function getSeccion(id: string): Promise<Seccion | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("secciones")
    .select("*")
    .eq("id", id)
    .single()
  if (error) return null
  return data
}

export async function createSeccion(input: SeccionInput): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("secciones")
    .insert(input)
    .select("id")
    .single()
  if (error) return { success: false, error: error.message }
  revalidarTodo()
  return { success: true, id: data.id }
}

export async function updateSeccion(id: string, input: Partial<SeccionInput>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("secciones").update(input).eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidarTodo()
  return { success: true }
}

export async function toggleSeccionActiva(id: string, activo: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("secciones").update({ activo }).eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidarTodo()
  return { success: true }
}

export async function deleteSeccion(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("secciones").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidarTodo()
  return { success: true }
}
