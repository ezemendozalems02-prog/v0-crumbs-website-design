'use server'

import { createClient } from '@/lib/supabase/server'

export interface ConfiguracionMesa {
  id: string
  capacidad: number
  cantidad: number
  descripcion?: string
  activo: boolean
}

export interface DisponibilidadMesa {
  capacidad: number
  cantidad: number
  reservado: number
  disponibles: number
}

export interface MesasAsignadas {
  capacidad: number
  cantidad: number
  config_id: string
}

// Obtener todas las configuraciones de mesas
export async function getConfiguracionMesas() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('configuracion_mesas')
    .select('*')
    .order('capacidad', { ascending: true })

  if (error) throw error
  return (data || []) as ConfiguracionMesa[]
}

// Crear configuración de mesa
export async function crearConfiguracionMesa(
  capacidad: number,
  cantidad: number,
  descripcion?: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('configuracion_mesas')
    .insert({
      capacidad,
      cantidad,
      descripcion,
      activo: true,
    })
    .select()
    .single()

  if (error) throw error
  return data as ConfiguracionMesa
}

// Actualizar configuración de mesa
export async function actualizarConfiguracionMesa(
  id: string,
  updates: Partial<Omit<ConfiguracionMesa, 'id'>>
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('configuracion_mesas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as ConfiguracionMesa
}

// Eliminar configuración de mesa
export async function eliminarConfiguracionMesa(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('configuracion_mesas')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

// Calcular disponibilidad de mesas
export async function calcularDisponibilidadMesas(
  fecha: string,
  horario: string
) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('calcular_disponibilidad_mesas', {
    p_fecha: fecha,
    p_horario: horario,
  })

  if (error) throw error
  return (data || []) as DisponibilidadMesa[]
}

// Asignar mesas automáticamente
export async function asignarMesasAutomaticamente(
  reservaId: string,
  fecha: string,
  horario: string,
  cantidadPersonas: number
) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('asignar_mesas_automaticamente', {
    p_reserva_id: reservaId,
    p_fecha: fecha,
    p_horario: horario,
    p_cantidad_personas: cantidadPersonas,
  })

  if (error) throw error
  if (!data) return null // No hay mesas disponibles
  
  return data as MesasAsignadas[]
}

// Registrar asignación de mesas
export async function registrarAsignacionMesas(
  reservaId: string,
  mesasAsignadas: MesasAsignadas[]
) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('registrar_asignacion_mesas', {
    p_reserva_id: reservaId,
    p_mesas_asignadas: mesasAsignadas,
  })

  if (error) throw error
  return true
}

// Liberar mesas de una reserva
export async function liberarMesasReserva(reservaId: string) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('liberar_mesas_reserva', {
    p_reserva_id: reservaId,
  })

  if (error) throw error
  return true
}

// Obtener mesas asignadas a una reserva
export async function getMesasReserva(reservaId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reservas_mesas')
    .select('*')
    .eq('reserva_id', reservaId)
    .is('freed_at', null)

  if (error) throw error
  return data || []
}
