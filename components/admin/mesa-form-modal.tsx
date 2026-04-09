'use client'

import { useState, useTransition } from 'react'
import { createMesa, updateMesa, type Mesa } from '@/lib/mesas'
import { X } from 'lucide-react'

interface MesaFormModalProps {
  mesa?: Mesa | null
  onClose: () => void
  onSaved: () => void
}

export function MesaFormModal({ mesa, onClose, onSaved }: MesaFormModalProps) {
  const [formData, setFormData] = useState({
    capacidad: mesa?.capacidad || 2,
    cantidad: mesa?.cantidad || 1,
    descripcion: mesa?.descripcion || '',
    activo: mesa?.activo ?? true,
  })
  const [isLoading, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      if (mesa) {
        const result = await updateMesa(mesa.id, formData)
        if (result.success) {
          onSaved()
        }
      } else {
        const result = await createMesa(formData)
        if (result.success) {
          onSaved()
        }
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border/40 w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">
            {mesa ? 'Editar mesa' : 'Nueva mesa'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-background rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Capacidad */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Capacidad (personas)
            </label>
            <input
              type="number"
              min="1"
              value={formData.capacidad}
              onChange={(e) =>
                setFormData({ ...formData, capacidad: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg text-sm"
              required
            />
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cantidad de mesas
            </label>
            <input
              type="number"
              min="1"
              value={formData.cantidad}
              onChange={(e) =>
                setFormData({ ...formData, cantidad: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg text-sm"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg text-sm resize-none"
              rows={3}
              placeholder="Ej: Mesas altas junto a la barra"
            />
          </div>

          {/* Activo */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) =>
                setFormData({ ...formData, activo: e.target.checked })
              }
              className="w-4 h-4"
            />
            <label htmlFor="activo" className="text-sm font-medium text-foreground">
              Activo
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border/20">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-background border border-border/40 rounded-lg text-sm font-medium hover:bg-background/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
