"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { ReservationTime, ReservationTimeInput } from "@/lib/admin-horarios-types"
import { HORARIO_FORMATO_REGEX } from "@/lib/admin-horarios-types"

// Rutas que dependen de los horarios de reserva — se invalidan tras cada cambio
const RUTAS_PUBLICAS = ["/reservas", "/admin/horarios"]

function revalidarTodo() {
  for (const ruta of RUTAS_PUBLICAS) {
    revalidatePath(ruta, "layout")
  }
}

function validarInput(input: ReservationTimeInput): string | null {
  if (!HORARIO_FORMATO_REGEX.test(input.time)) {
    return "El horario debe tener el formato HH:mm"
  }
  if (input.meal_type !== "almuerzo" && input.meal_type !== "cena") {
    return "El tipo de comida debe ser almuerzo o cena"
  }
  return null
}

export async function getHorarios(): Promise<ReservationTime[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reservation_times")
    .select("*")
    .order("meal_type")
    .order("sort_order")
    .order("time")

  if (error) {
    console.error("[admin-horarios] getHorarios error:", error)
    return []
  }
  return data ?? []
}

export async function getHorariosActivos(): Promise<ReservationTime[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reservation_times")
    .select("*")
    .eq("is_active", true)
    .order("meal_type")
    .order("sort_order")
    .order("time")

  if (error) {
    console.error("[admin-horarios] getHorariosActivos error:", error)
    return []
  }
  return data ?? []
}

export async function createHorario(
  input: ReservationTimeInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  const validationError = validarInput(input)
  if (validationError) return { success: false, error: validationError }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reservation_times")
    .insert(input)
    .select("id")
    .single()

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Ya existe un horario igual para ese turno" }
    }
    return { success: false, error: error.message }
  }
  revalidarTodo()
  return { success: true, id: data.id }
}

export async function updateHorario(
  id: string,
  input: ReservationTimeInput
): Promise<{ success: boolean; data?: ReservationTime; error?: string }> {
  const validationError = validarInput(input)
  if (validationError) return { success: false, error: validationError }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reservation_times")
    .update(input)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Ya existe un horario igual para ese turno" }
    }
    return { success: false, error: error.message }
  }
  revalidarTodo()
  return { success: true, data }
}

export async function toggleHorarioActivo(
  id: string,
  is_active: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("reservation_times").update({ is_active }).eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidarTodo()
  return { success: true }
}

export async function deleteHorario(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from("reservation_times").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidarTodo()
  return { success: true }
}
