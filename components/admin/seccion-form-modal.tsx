"use client"

import { useState } from "react"
import { createSeccion, updateSeccion, type Seccion } from "@/lib/admin-secciones"
import { X } from "lucide-react"

interface SeccionFormModalProps {
  seccion?: Seccion | null
  onClose: () => void
  onSaved: () => void
}

export function SeccionFormModal({ seccion, onClose, onSaved }: SeccionFormModalProps) {
  const [titulo, setTitulo] = useState(seccion?.titulo ?? "")
  const [descripcion, setDescripcion] = useState(seccion?.descripcion ?? "")
  const [imagenUrl, setImagenUrl] = useState(seccion?.imagen_url ?? "")
  const [activo, setActivo] = useState(seccion?.activo ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!titulo.trim()) {
      setError("El título es requerido")
      setLoading(false)
      return
    }

    try {
      const data = { titulo: titulo.trim(), descripcion: descripcion.trim(), imagen_url: imagenUrl, activo, posicion: seccion?.posicion ?? 0 }

      let result
      if (seccion) {
        result = await updateSeccion(seccion.id, data)
      } else {
        result = await createSeccion(data)
      }

      if (result.success) {
        onSaved()
      } else {
        setError(result.error ?? "Error al guardar")
      }
    } catch (err) {
      setError("Error al guardar la sección")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border border-border/40 max-w-md w-full p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg">{seccion ? "Editar sección" : "Nueva sección"}</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-foreground/40 hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Título *</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Desayunos especiales"
              className="w-full px-4 py-2.5 bg-background border border-border/40 rounded-xl text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe esta sección del menú"
              rows={3}
              className="w-full px-4 py-2.5 bg-background border border-border/40 rounded-xl text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          {/* URL de imagen */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">URL de imagen</label>
            <input
              type="url"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-4 py-2.5 bg-background border border-border/40 rounded-xl text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-primary/50 transition-colors"
            />
            {imagenUrl && (
              <div className="mt-2 w-full h-32 bg-background rounded-xl overflow-hidden">
                <img src={imagenUrl} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Activo */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="activo"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="w-4 h-4 rounded border-border/40 text-primary focus:ring-primary"
            />
            <label htmlFor="activo" className="text-sm font-medium text-foreground cursor-pointer">
              Mostrar esta sección
            </label>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          {/* Botones */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-background border border-border/40 rounded-xl text-sm font-medium text-foreground hover:bg-background/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Guardando..." : seccion ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
