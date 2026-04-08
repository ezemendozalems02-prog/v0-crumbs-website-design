import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log('[UPLOAD CV] ===== INICIO =====')
  
  try {
    const formData = await request.formData()
    console.log('[UPLOAD CV] FormData recibido')
    
    const file = formData.get("file") as File

    if (!file) {
      console.log('[UPLOAD CV] ERROR: No se recibió archivo')
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    console.log('[UPLOAD CV] Archivo recibido:', {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    // Validar que sea PDF
    if (!file.type.includes("pdf")) {
      console.log('[UPLOAD CV] ERROR: Tipo de archivo inválido:', file.type)
      return NextResponse.json(
        { error: "Solo se aceptan archivos PDF" },
        { status: 400 }
      )
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      console.log('[UPLOAD CV] ERROR: Archivo muy grande:', file.size)
      return NextResponse.json({ error: "El archivo no puede superar los 5MB" }, { status: 400 })
    }

    console.log('[UPLOAD CV] Validaciones pasadas, subiendo a Blob (PRIVATE)...')

    // Generar nombre único con timestamp
    const timestamp = Date.now()
    const filename = `cvs/${timestamp}-${file.name}`

    // Subir a Vercel Blob con acceso PRIVADO (el store está configurado en modo privado)
    const blob = await put(filename, file, {
      access: "private",
    })

    console.log('[UPLOAD CV] ✓ Archivo subido exitosamente:', blob.pathname)

    // Retornar pathname para servir a través de endpoint privado
    return NextResponse.json({ 
      pathname: blob.pathname,
      fileName: file.name, 
      size: file.size 
    })
  } catch (error) {
    console.error('[UPLOAD CV] ✗ ERROR FATAL:', error)
    console.error('[UPLOAD CV] Stack trace:', error instanceof Error ? error.stack : 'No stack available')
    return NextResponse.json({ 
      error: "Error al subir el archivo: " + (error instanceof Error ? error.message : 'Error desconocido')
    }, { status: 500 })
  }
}
