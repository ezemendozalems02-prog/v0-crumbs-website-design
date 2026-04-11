import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('[UPLOAD CV SUPABASE] ===== INICIO =====')

  try {
    const formData = await request.formData()
    console.log('[UPLOAD CV SUPABASE] FormData recibido')

    const file = formData.get('file') as File

    if (!file) {
      console.log('[UPLOAD CV SUPABASE] ERROR: No se recibió archivo')
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

    console.log('[UPLOAD CV SUPABASE] Archivo recibido:', {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    // Validar que sea PDF
    if (!file.type.includes('pdf')) {
      console.log('[UPLOAD CV SUPABASE] ERROR: Tipo de archivo inválido:', file.type)
      return NextResponse.json(
        { error: 'Solo se aceptan archivos PDF' },
        { status: 400 }
      )
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      console.log('[UPLOAD CV SUPABASE] ERROR: Archivo muy grande:', file.size)
      return NextResponse.json(
        { error: 'El archivo no puede superar los 5MB' },
        { status: 400 }
      )
    }

    console.log('[UPLOAD CV SUPABASE] Validaciones pasadas, creando cliente Supabase...')

    // Crear cliente Supabase
    const supabase = await createClient()

    // Generar nombre único con timestamp y random
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const fileExtension = 'pdf'
    const fileName = `${timestamp}-${random}.${fileExtension}`
    const filePath = `postulaciones/${fileName}`

    console.log('[UPLOAD CV SUPABASE] Subiendo a Supabase Storage...')

    // Convertir File a Buffer
    const buffer = await file.arrayBuffer()

    // Subir a Supabase Storage en bucket 'cvs'
    const { data, error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      })

    if (uploadError) {
      console.error('[UPLOAD CV SUPABASE] ✗ Error en upload:', uploadError)
      throw new Error(`Error al subir: ${uploadError.message}`)
    }

    console.log('[UPLOAD CV SUPABASE] ✓ Archivo subido exitosamente:', data.path)

    // Obtener la URL pública del archivo
    const { data: publicUrlData } = supabase.storage
      .from('cvs')
      .getPublicUrl(filePath)

    const publicUrl = publicUrlData.publicUrl

    console.log('[UPLOAD CV SUPABASE] ✓ URL pública generada:', publicUrl)

    return NextResponse.json({
      url: publicUrl,
      path: filePath,
      fileName: file.name,
      size: file.size,
    })
  } catch (error) {
    console.error('[UPLOAD CV SUPABASE] ✗ ERROR FATAL:', error)
    console.error(
      '[UPLOAD CV SUPABASE] Stack trace:',
      error instanceof Error ? error.stack : 'No stack available'
    )
    return NextResponse.json(
      {
        error:
          'Error al subir el archivo: ' +
          (error instanceof Error ? error.message : 'Error desconocido'),
      },
      { status: 500 }
    )
  }
}
