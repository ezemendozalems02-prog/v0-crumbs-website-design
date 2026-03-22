"use server"

import { createClient } from "@/lib/supabase/server"

export interface Reserva {
  id: string
  created_at: string
  updated_at: string
  nombre: string
  telefono: string
  fecha_reserva: string
  horario: string
  tipo_mesa: string
  cantidad_personas: number
  requerimiento_especial: string | null
  tolerancia_aceptada: boolean
  cubiertos_consumidos: number
  whatsapp_enviado: boolean
}

export interface FiltrosAdmin {
  fecha?: string
  nombre?: string
  telefono?: string
  horario?: string
}

export interface MetricasAdmin {
  total: number
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
    .select("cubiertos_consumidos")
    .eq("fecha_reserva", fecha)

  if (error || !data) {
    return { total: 0, cubiertos_ocupados: 0, cubiertos_disponibles: STOCK_TOTAL }
  }

  const total = data.length
  const cubiertos_ocupados = data.reduce((sum, r) => sum + r.cubiertos_consumidos, 0)

  return {
    total,
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


export async function getUltimasReservas(limite: number = 5): Promise<Reserva[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("reservas")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limite)

  if (error) return []
  return (data ?? []) as Reserva[]
}
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("reservas")
      .delete()
      .eq("id", id)

    if (error) {
      return { success: false, error: "Error al eliminar la reserva: " + error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: "Error inesperado al eliminar la reserva." }
  }
}

