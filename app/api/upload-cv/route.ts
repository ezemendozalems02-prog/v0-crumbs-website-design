import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    // Validar que sea PDF
    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Solo se aceptan archivos PDF" },
        { status: 400 }
      )
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo no puede superar los 5MB" }, { status: 400 })
    }

    // Generar nombre único con timestamp
    const timestamp = Date.now()
    const filename = `cvs/${timestamp}-${file.name}`

    // Subir a Vercel Blob con acceso público
    const blob = await put(filename, file, {
      access: "public",
    })

    console.log("[CV UPLOAD] Archivo subido exitosamente:", blob.url)

    return NextResponse.json({ url: blob.url, fileName: file.name, size: file.size })
  } catch (error) {
    console.error("[CV UPLOAD] Error al subir archivo:", error)
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 })
  }
}
