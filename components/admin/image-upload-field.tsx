'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react'

interface ImageUploadFieldProps {
  value: string | null
  onChange: (url: string | null) => void
  label?: string
}

export function ImageUploadField({ value, onChange, label = 'Imagen del banner' }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setError(`Tipo de archivo no permitido. Use JPG, PNG o WebP.`)
      return
    }

    // Validar tamaño
    if (file.size > 10 * 1024 * 1024) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      setError(`Archivo demasiado grande: ${sizeMB}MB (máximo 10MB)`)
      return
    }

    setError(null)
    setUploadSuccess(false)
    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || `Error HTTP ${response.status}`)
        return
      }

      if (!result.url) {
        setError('No se recibió URL de la imagen del servidor')
        return
      }

      console.log("[v0] ImageUploadField: upload OK, URL:", result.url)
      onChange(result.url)
      setUploadSuccess(true)
      setError(null)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(`Error de conexión: ${errorMsg}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange(null)
    setError(null)
    setUploadSuccess(false)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">{label}</label>

      {value ? (
        <div className="relative group">
          <div className="relative w-full aspect-video bg-background rounded-xl overflow-hidden border border-primary/20">
            <Image
              src={value}
              alt="Imagen cargada"
              fill
              className="object-cover"
              unoptimized
            />
            {uploadSuccess && (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="w-8 h-8 text-primary" />
                  <p className="text-xs font-medium text-primary">Guardado</p>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            className="absolute top-2 right-2 p-1.5 bg-destructive/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full aspect-video bg-background border-2 border-dashed border-primary/20 hover:border-primary/40 rounded-xl cursor-pointer transition-colors group">
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-primary mb-2 animate-spin" />
                <p className="text-sm text-foreground/60">Subiendo imagen...</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-primary/60 mb-2 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium text-foreground">Arrastra aquí o haz clic</p>
                <p className="text-xs text-foreground/50 mt-1">JPG, PNG, WebP (máx. 10MB)</p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {uploadSuccess && value && (
        <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-lg">
          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-primary">Imagen subida exitosamente</p>
        </div>
      )}
    </div>
  )
}
