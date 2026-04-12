'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadFieldProps {
  value: string | null
  onChange: (url: string | null) => void
  label?: string
}

export function ImageUploadField({ value, onChange, label = 'Imagen del producto' }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(value)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo debe ser menor a 5MB')
      return
    }

    setError(null)
    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.url) {
        onChange(result.url)
        setError(null)
      } else {
        setError(result.error || 'Error al subir la imagen')
        setPreview(value)
      }
    } catch (err) {
      console.error('[v0] Upload error:', err)
      setError('Error al subir la imagen')
      setPreview(value)
    }

    setIsUploading(false)
  }

  const handleRemove = () => {
    onChange(null)
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">{label}</label>

      {preview ? (
        <div className="relative group">
          <div className="relative w-full aspect-square bg-background rounded-xl overflow-hidden border border-primary/20">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
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
        <label className="flex flex-col items-center justify-center w-full aspect-square bg-background border-2 border-dashed border-primary/20 hover:border-primary/40 rounded-xl cursor-pointer transition-colors group">
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-primary mb-2 animate-spin" />
                <p className="text-sm text-foreground/60">Subiendo imagen...</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-primary/60 mb-2 group-hover:text-primary transition-colors" />
                <p className="text-sm font-medium text-foreground">Arrastra una imagen aquí</p>
                <p className="text-xs text-foreground/50 mt-1">o haz clic para seleccionar</p>
                <p className="text-xs text-foreground/40 mt-2">JPG, PNG (máx. 5MB)</p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      )}

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
      )}
    </div>
  )
}
