"use server"

import { createClient } from "@/lib/supabase/server"

export type EstadoReserva = "pendiente" | "confirmada" | "cancelada"

export interface Reserva {
  id: string
  created_at: string
  nombre: string
  telefono: string
  fecha_reserva: string
  horario: string
  tipo_mesa: string
  cantidad_personas: number
  requerimiento_especial: string | null
  tolerancia_aceptada: boolean
  cubiertos_consumidos: number
  estado: EstadoReserva
  whatsapp_enviado: boolean
}

export interface FiltrosAdmin {
  fecha?: string
  estado?: EstadoReserva | "todos"
  horario?: string
  nombre?: string
  telefono?: string
}

export interface MetricasAdmin {
  total: number
  pendientes: number
  confirmadas: number
  canceladas: number
  cubiertos_ocupados: number
  cubiertos_disponibles: number
}

export interface DisponibilidadAdmin {
  cubiertos_usados: number
  cubiertos_disponibles: number
  porcentaje_ocupacion: number
  fecha: string
}

const STOCK_TOTAL = 100

export async function getReservasAdmin(filtros: FiltrosAdmin = {}): Promise<Reserva[]> {
  const supabase = await createClient()

  let query = supabase
    .from("reservas")
    .select("*")
    .order("fecha_reserva", { ascending: true })
    .order("horario", { ascending: true })
    .order("created_at", { ascending: false })

  if (filtros.fecha) {
    query = query.eq("fecha_reserva", filtros.fecha)
  }
  if (filtros.estado && filtros.estado !== "todos") {
    query = query.eq("estado", filtros.estado)
  }
  if (filtros.horario) {
    query = query.eq("horario", filtros.horario)
  }
  if (filtros.nombre) {
    query = query.ilike("nombre", `%${filtros.nombre}%`)
  }
  if (filtros.telefono) {
    query = query.ilike("telefono", `%${filtros.telefono}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching reservas admin:", error)
    return []
  }

  return (data ?? []) as Reserva[]
}

export async function getMetricasAdmin(fecha: string): Promise<MetricasAdmin> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("reservas")
    .select("estado, cubiertos_consumidos")
    .eq("fecha_reserva", fecha)

  if (error || !data) {
    return { total: 0, pendientes: 0, confirmadas: 0, canceladas: 0, cubiertos_ocupados: 0, cubiertos_disponibles: STOCK_TOTAL }
  }

  const pendientes = data.filter((r) => r.estado === "pendiente").length
  const confirmadas = data.filter((r) => r.estado === "confirmada").length
  const canceladas = data.filter((r) => r.estado === "cancelada").length
  const cubiertos_ocupados = data
    .filter((r) => r.estado !== "cancelada")
    .reduce((sum, r) => sum + (r.cubiertos_consumidos ?? 0), 0)

  return {
    total: data.length,
    pendientes,
    confirmadas,
    canceladas,
    cubiertos_ocupados,
    cubiertos_disponibles: Math.max(0, STOCK_TOTAL - cubiertos_ocupados),
  }
}

export async function getDisponibilidadAdmin(fecha: string): Promise<DisponibilidadAdmin> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("get_disponibilidad", { p_fecha: fecha })

  if (error || !data || data.length === 0) {
    return { cubiertos_usados: 0, cubiertos_disponibles: STOCK_TOTAL, porcentaje_ocupacion: 0, fecha }
  }

  return {
    cubiertos_usados: Number(data[0].cubiertos_usados),
    cubiertos_disponibles: Number(data[0].cubiertos_disponibles),
    porcentaje_ocupacion: Number(data[0].porcentaje_ocupacion),
    fecha,
  }
}

export async function actualizarEstadoReserva(
  id: string,
  nuevoEstado: EstadoReserva
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("reservas")
    .update({ estado: nuevoEstado })
    .eq("id", id)

  if (error) {
    console.error("Error updating reserva:", error)
    return { success: false, error: "Error al actualizar la reserva." }
  }

  return { success: true }
}

export async function getProximasReservas(limite: number = 5): Promise<Reserva[]> {
  const supabase = await createClient()

  const hoy = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("reservas")
    .select("*")
    .gte("fecha_reserva", hoy)
    .in("estado", ["pendiente", "confirmada"])
    .order("fecha_reserva", { ascending: true })
    .order("horario", { ascending: true })
    .limit(limite)

  if (error) return []
  return (data ?? []) as Reserva[]
}

export async function getReservasPendientes(): Promise<Reserva[]> {
  const supabase = await createClient()

  const hoy = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("reservas")
    .select("*")
    .gte("fecha_reserva", hoy)
    .eq("estado", "pendiente")
    .order("fecha_reserva", { ascending: true })
    .order("horario", { ascending: true })

  if (error) return []
  return (data ?? []) as Reserva[]
}
