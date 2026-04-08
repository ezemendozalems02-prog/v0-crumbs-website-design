"use client"

import { useState, useTransition } from "react"
import { createBanner, updateBanner, type Banner } from "@/lib/admin-banners"
import { ImageUploadField } from "./image-upload-field"
import { X } from "lucide-react"

interface Props {
  banner: Banner | null
  onClose: () => void
  onSaved: () => void
}

export function BannerFormModal({ banner, onClose, onSaved }: Props) {
  const isEdit = !!banner
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [titulo, setTitulo] = useState(banner?.titulo ?? "")
  const [descripcion, setDescripcion] = useState(banner?.descripcion ?? "")
  const [imagenUrl, setImagenUrl] = useState(banner?.imagen_url ?? "")
  const [enlaceUrl, setEnlaceUrl] = useState(banner?.enlace_url ?? "")
  const [activo, setActivo] = useState(banner?.activo ?? true)

  const handleSubmit = () => {
    if (!titulo.trim()) { setError("El título es requerido"); return }
    setError(null)

    startTransition(async () => {
      const input = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        imagen_url: imagenUrl.trim() || undefined,
        enlace_url: enlaceUrl.trim() || undefined,
        posicion: banner?.posicion ?? 0,
        activo,
      }
      const result = isEdit
        ? await updateBanner(banner!.id, input)
        : await createBanner(input)

      if (result.success) onSaved()
      else setError(result.error ?? "Error al guardar")
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-2xl border border-border/40 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{isEdit ? "Editar Banner" : "Nuevo Banner"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-background rounded-lg transition-colors">
            <X className="w-5 h-5 text-foreground/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Promoción Especial"
              className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg focus:outline-none focus:border-primary/60"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción opcional"
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg focus:outline-none focus:border-primary/60 resize-none"
            />
          </div>

          {/* Imagen */}
          <ImageUploadField value={imagenUrl} onChange={setImagenUrl} label="Imagen del Banner" />

          {/* Enlace URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Enlace URL (opcional)</label>
            <input
              type="url"
              value={enlaceUrl}
              onChange={(e) => setEnlaceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg focus:outline-none focus:border-primary/60"
            />
          </div>

          {/* Activo */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activo"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="activo" className="text-sm font-medium text-foreground">Activo</label>
          </div>

          {/* Error */}
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border/40 px-6 py-4 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-background rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  )
}
