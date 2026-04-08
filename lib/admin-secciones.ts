"use server"

import { createClient } from "@/lib/supabase/server"

export type Seccion = {
  id: string
  titulo: string
  descripcion: string | null
  imagen_url: string | null
  posicion: number
  activo: boolean
  created_at: string
  updated_at: string
}

export type SeccionInput = {
  titulo: string
  descripcion?: string
  imagen_url?: string
  posicion: number
  activo: boolean
}

export async function getSecciones(): Promise<Seccion[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("secciones")
    .select("*")
    .order("posicion")
  if (error) {
    console.error(error)
    return []
  }
  return data ?? []
}

export async function createSeccion(input: SeccionInput): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("secciones")
    .insert(input)
    .select("id")
    .single()
  if (error) return { success: false, error: error.message }
  return { success: true, id: data.id }
}

export async function updateSeccion(id: string, input: Partial<SeccionInput>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("secciones")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function toggleSeccionActiva(id: string, activo: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("secciones")
    .update({ activo, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteSeccion(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("secciones").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}
