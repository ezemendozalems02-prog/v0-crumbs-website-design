import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos de imagen' },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo debe ser menor a 5MB' },
        { status: 400 }
      )
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `uploads/${uuidv4()}.${ext}`

    const blob = await put(filename, file, {
      access: 'public',
    })

    return NextResponse.json({
      url: blob.url,
      success: true,
    })
  } catch (error) {
    console.error('[v0] Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image', success: false },
      { status: 500 }
    )
  }
}
