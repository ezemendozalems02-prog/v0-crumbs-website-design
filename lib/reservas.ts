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

/**
 * Obtiene la capacidad total del restaurante desde configuración de mesas
 * Esto es la fuente única de verdad para la capacidad
 */
async function getTotalCapacity(): Promise<number> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("configuracion_mesas")
    .select("capacidad, cantidad")
    .eq("activo", true)
  
  if (error || !data) {
    console.error("Error fetching table configuration:", error)
    return 0 // Si falla, retorna 0 para que se notifique el error
  }
  
  // Calcular capacidad total: suma de (capacidad * cantidad) para cada tipo de mesa
  const total = data.reduce((sum, table) => {
    return sum + (table.capacidad * table.cantidad)
  }, 0)
  
  return total
}

/**
 * Obtiene la disponibilidad de cubiertos para una fecha específica
 */
export async function getDisponibilidad(fecha: string): Promise<Disponibilidad> {
  const supabase = await createClient()
  const STOCK_TOTAL = await getTotalCapacity()
  
  const { data, error } = await supabase.rpc("get_disponibilidad", {
    p_fecha: fecha,
    p_stock_total: STOCK_TOTAL,
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

/**
 * Asigna mesas automáticamente a una reserva
 */
export async function asignarMesasAReserva(
  reservaId: string,
  fecha: string,
  horario: string,
  cantidadPersonas: number
): Promise<{ success: boolean; mesas?: any; error?: string }> {
  const supabase = await createClient()

  // Llamar RPC para obtener asignación de mesas
  const { data: mesasAsignadas, error: errorAsignacion } = await supabase.rpc(
    "asignar_mesas_automaticamente",
    {
      p_reserva_id: reservaId,
      p_fecha: fecha,
      p_horario: horario,
      p_cantidad_personas: cantidadPersonas,
    }
  )

  if (errorAsignacion || !mesasAsignadas) {
    console.error("Error asigning tables:", errorAsignacion)
    return {
      success: false,
      error: "No hay suficientes mesas disponibles para esta cantidad de personas.",
    }
  }

  // Registrar la asignación
  const { error: errorRegistro } = await supabase.rpc("registrar_asignacion_mesas", {
    p_reserva_id: reservaId,
    p_mesas_asignadas: mesasAsignadas,
  })

  if (errorRegistro) {
    console.error("Error registering table assignment:", errorRegistro)
    return {
      success: false,
      error: "Error al registrar la asignación de mesas.",
    }
  }

  return {
    success: true,
    mesas: mesasAsignadas,
  }
}

/**
 * Obtiene disponibilidad de mesas por fecha y horario
 */
export async function getDisponibilidadMesas(
  fecha: string,
  horario: string
): Promise<any[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc("calcular_disponibilidad_mesas", {
    p_fecha: fecha,
    p_horario: horario,
  })

  if (error) {
    console.error("Error fetching table availability:", error)
    return []
  }

  return (data || []) as any[]
}

/**
 * Envía email de confirmación después de crear una reserva
 */
export async function enviarConfirmacionReserva(reservaData: {
  nombre: string
  email?: string
  telefono: string
  fecha: string
  horario: string
  cantidadPersonas: number
  tipoMesa: string
}) {
  // No hacer await - enviar en background
  try {
    if (!reservaData.email) {
      console.log("[RESERVA] No email provided, skipping confirmation")
      return
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-reserva-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservaData),
    })

    if (!response.ok) {
      console.error("[RESERVA] Failed to send confirmation email:", await response.text())
    } else {
      console.log("[RESERVA] Confirmation email sent successfully")
    }
  } catch (error) {
    console.error("[RESERVA] Error sending confirmation email:", error)
    // No throw - la reserva ya fue creada, solo el email falló
  }
}

