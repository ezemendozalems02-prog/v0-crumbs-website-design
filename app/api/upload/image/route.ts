import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'

// Aumentar el límite del body parser de Next.js a 15MB para permitir fotos grandes
export const maxDuration = 30
export const dynamic = 'force-dynamic'

// Necesario para que Next.js permita bodies grandes en esta ruta
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
    sizeLimit: '15mb',
  },
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const BUCKET = 'banners'

// Service role client — bypasa RLS, requerido para uploads desde API routes
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Faltan variables NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo', success: false }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Use JPG, PNG o WebP.', success: false },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      return NextResponse.json(
        { error: `Archivo demasiado grande: ${sizeMB}MB (máximo 10MB)`, success: false },
        { status: 413 }
      )
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${Date.now()}-${uuidv4()}.${ext}`

    const supabase = getServiceClient()

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('[upload] Supabase Storage error:', uploadError.message)
      return NextResponse.json(
        { error: `Error al subir: ${uploadError.message}`, success: false },
        { status: 500 }
      )
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filename)

    return NextResponse.json({ url: publicUrlData.publicUrl, success: true }, { status: 200 })

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[upload] Unexpected error:', msg)
    return NextResponse.json({ error: `Error inesperado: ${msg}`, success: false }, { status: 500 })
  }
}
