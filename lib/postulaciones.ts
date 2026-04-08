'use server'

import { createClient } from '@/lib/supabase/server'

export interface Postulacion {
  id: string
  created_at: string
  nombre: string
  telefono: string
  email: string
  puesto: string
  mensaje?: string
  cv_url?: string
  cv_nombre_archivo?: string
  estado: string
}

export async function guardarPostulacion(data: {
  nombre: string
  telefono: string
  email: string
  puesto: string
  mensaje?: string
  cvUrl?: string
  cvNombreArchivo?: string
}): Promise<{ success: boolean; error?: string; id?: string }> {
  console.log('[DB postulaciones] ===== INICIO GUARDADO =====')
  console.log('[DB postulaciones] Datos a insertar:', {
    nombre: data.nombre,
    telefono: data.telefono,
    email: data.email,
    puesto: data.puesto,
    tieneMensaje: !!data.mensaje,
    tieneCVUrl: !!data.cvUrl,
  })

  try {
    const supabase = await createClient()
    console.log('[DB postulaciones] Cliente Supabase creado')

    const insertData = {
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email,
      puesto: data.puesto,
      mensaje: data.mensaje || null,
      cv_url: data.cvUrl || null,
      cv_nombre_archivo: data.cvNombreArchivo || null,
      estado: 'nueva',
    }

    console.log('[DB postulaciones] Ejecutando INSERT en postulaciones_trabajo...')

    const { data: inserted, error } = await supabase
      .from('postulaciones_trabajo')
      .insert(insertData)
      .select()
      .single()

    console.log('[DB postulaciones] Resultado INSERT:', {
      success: !error,
      error: error,
      insertedId: inserted?.id,
    })

    if (error) {
      console.error('[DB postulaciones] ✗ Error en INSERT:', error.message)
      console.error('[DB postulaciones] Error code:', error.code)
      console.error('[DB postulaciones] Error details:', error.details)
      return { success: false, error: error.message }
    }

    console.log('[DB postulaciones] ✓ Guardado exitoso, ID:', inserted.id)
    return { success: true, id: inserted.id }
  } catch (error) {
    console.error('[DB postulaciones] ✗✗✗ ERROR FATAL:', error)
    console.error('[DB postulaciones] Stack:', error instanceof Error ? error.stack : 'No stack')
    return { success: false, error: 'Error al guardar postulación: ' + (error instanceof Error ? error.message : 'desconocido') }
  }
}

export async function getPostulaciones(): Promise<Postulacion[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('postulaciones_trabajo')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return []
    return data as Postulacion[]
  } catch (error) {
    return []
  }
}

export async function cambiarEstadoPostulacion(id: string, estado: string): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('postulaciones_trabajo')
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) return { success: false }
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

export async function eliminarPostulacion(id: string): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('postulaciones_trabajo')
      .delete()
      .eq('id', id)

    if (error) return { success: false }
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
