"use server"

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface Seccion {
  id: string
  titulo: string
  descripcion?: string
  imagen_url?: string
  posicion: number
  activo: boolean
  created_at: string
  updated_at: string
}

export async function getSecciones() {
  const { data, error } = await supabase
    .from("secciones")
    .select("*")
    .order("posicion", { ascending: true })

  if (error) throw new Error(error.message)
  return (data || []) as Seccion[]
}

export async function createSeccion(seccion: Partial<Seccion>) {
  const { data, error } = await supabase
    .from("secciones")
    .insert([seccion])
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as Seccion }
}

export async function updateSeccion(id: string, seccion: Partial<Seccion>) {
  const { data, error } = await supabase
    .from("secciones")
    .update({ ...seccion, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as Seccion }
}

export async function deleteSeccion(id: string) {
  const { error } = await supabase
    .from("secciones")
    .delete()
    .eq("id", id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function reorderSecciones(secciones: Array<{ id: string; posicion: number }>) {
  for (const { id, posicion } of secciones) {
    await supabase
      .from("secciones")
      .update({ posicion })
      .eq("id", id)
  }
  return { success: true }
}
