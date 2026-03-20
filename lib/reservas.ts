"use server"

import { createClient } from "@/lib/supabase/server"

export interface Disponibilidad {
  cubiertos_usados: number
  cubiertos_disponibles: number
  porcentaje_ocupacion: number
}

export interface ReservaInput {
  nombre: string
  telefono: string
  fecha: string // YYYY-MM-DD
  horario: string
  tipoMesa: string
  cantidadPersonas: number
  requerimiento?: string
  tolerancia: boolean
}

export interface ReservaResult {
  success: boolean
  reservaId?: string
  error?: string
}

const STOCK_TOTAL = 100

/**
 * Obtiene la disponibilidad de cubiertos para una fecha específica
 */
export async function getDisponibilidad(fecha: string): Promise<Disponibilidad> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc("get_disponibilidad", {
    p_fecha: fecha,
  })

  if (error) {
    console.error("Error fetching disponibilidad:", error)
    // Retornar valores por defecto si hay error
    return {
      cubiertos_usados: 0,
      cubiertos_disponibles: STOCK_TOTAL,
      porcentaje_ocupacion: 0,
    }
  }

  if (data && data.length > 0) {
    return {
      cubiertos_usados: Number(data[0].cubiertos_usados),
      cubiertos_disponibles: Number(data[0].cubiertos_disponibles),
      porcentaje_ocupacion: Number(data[0].porcentaje_ocupacion),
    }
  }

  return {
    cubiertos_usados: 0,
    cubiertos_disponibles: STOCK_TOTAL,
    porcentaje_ocupacion: 0,
  }
}

/**
 * Crea una nueva reserva con validación de stock
 */
export async function crearReserva(input: ReservaInput): Promise<ReservaResult> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("crear_reserva", {
    p_nombre: input.nombre,
    p_telefono: input.telefono,
    p_fecha: input.fecha,
    p_horario: input.horario,
    p_tipo_mesa: input.tipoMesa,
    p_cantidad_personas: input.cantidadPersonas,
    p_requerimiento: input.requerimiento || null,
    p_tolerancia: input.tolerancia,
  })

  if (error) {
    console.error("Error creating reserva:", error)
    return {
      success: false,
      error: error.message.includes("No hay disponibilidad")
        ? "Lo sentimos, no hay disponibilidad para esa cantidad de personas en esta fecha."
        : "Ocurrió un error al procesar tu reserva. Por favor intentá de nuevo.",
    }
  }

  return {
    success: true,
    reservaId: data as string,
  }
}

/**
 * Verifica si hay suficiente disponibilidad para una cantidad de personas
 */
export async function verificarDisponibilidad(
  fecha: string,
  cantidadPersonas: number
): Promise<{ disponible: boolean; mensaje?: string }> {
  const disponibilidad = await getDisponibilidad(fecha)

  if (disponibilidad.cubiertos_disponibles < cantidadPersonas) {
    return {
      disponible: false,
      mensaje: `Solo quedan ${disponibilidad.cubiertos_disponibles} lugares disponibles para esta fecha.`,
    }
  }

  return { disponible: true }
}
