import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    console.log(`[v0] Upload request received. File: ${file?.name}, Type: ${file?.type}, Size: ${file?.size}`)

    // Validar que existe archivo
    if (!file) {
      console.log('[v0] No file provided')
      return NextResponse.json(
        { error: 'No se proporcionó archivo', success: false },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.log(`[v0] Invalid file type: ${file.type}`)
      return NextResponse.json(
        { error: `Tipo de archivo no permitido. Use: JPG, PNG, WebP. Recibido: ${file.type}`, success: false },
        { status: 400 }
      )
    }

    // Validar tamaño
    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      console.log(`[v0] File too large: ${sizeMB}MB`)
      return NextResponse.json(
        { error: `Archivo demasiado grande: ${sizeMB}MB (máximo 10MB)`, success: false },
        { status: 413 }
      )
    }

    // Generar nombre único para el blob
    const ext = file.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const filename = `banners/${timestamp}-${uuidv4()}.${ext}`

    console.log(`[v0] Uploading to Blob Storage: ${filename}`)

    // Subir a Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    console.log(`[v0] Upload successful. URL: ${blob.url}`)

    return NextResponse.json({
      url: blob.url,
      success: true,
      filename: blob.pathname,
    }, { status: 200 })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`[v0] Image upload error: ${errorMsg}`, error)
    return NextResponse.json(
      { error: `Error al subir imagen: ${errorMsg}`, success: false },
      { status: 500 }
    )
  }
}
