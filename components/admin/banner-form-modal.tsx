'use client'

import { useState, useEffect, useTransition } from 'react'
import Image from 'next/image'
import { X, Loader2, ExternalLink, Check } from 'lucide-react'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import { createBanner, updateBanner } from '@/lib/admin-banners'
import type { Banner, BannerInput } from '@/lib/admin-banners-types'
import { PAGINAS_OPCIONES } from '@/lib/admin-banners-types'

interface BannerFormModalProps {
  banner?: Banner | null
  onClose: () => void
  onSaved: () => void
}

const EMPTY: BannerInput = {
  titulo: '',
  subtitulo: '',
  descripcion: '',
  imagen_url: '',
  boton_texto: '',
  boton_link: '',
  pagina: 'inicio',
  activo: true,
  orden: 0,
}

export function BannerFormModal({ banner, onClose, onSaved }: BannerFormModalProps) {
  const [form, setForm] = useState<BannerInput>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    if (banner) {
      setForm({
        titulo: banner.titulo,
        subtitulo: banner.subtitulo ?? '',
        descripcion: banner.descripcion ?? '',
        imagen_url: banner.imagen_url ?? '',
        boton_texto: banner.boton_texto ?? '',
        boton_link: banner.boton_link ?? '',
        pagina: banner.pagina,
        activo: banner.activo,
        orden: banner.orden,
      })
      setImagePreview(banner.imagen_url ?? "")
    } else {
      setForm(EMPTY)
      setImagePreview("")
    }
  }, [banner])

  const set = (key: keyof BannerInput, value: string | boolean | number) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (key === 'imagen_url' && typeof value === 'string') {
      setImagePreview(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    if (!form.titulo.trim()) { 
      setError('El título es obligatorio')
      return 
    }

    startTransition(async () => {
      const input: BannerInput = {
        ...form,
        titulo: form.titulo.trim(),
        subtitulo: form.subtitulo?.trim() || undefined,
        descripcion: form.descripcion?.trim() || undefined,
        imagen_url: form.imagen_url?.trim() || undefined,
        boton_texto: form.boton_texto?.trim() || undefined,
        boton_link: form.boton_link?.trim() || undefined,
      }

      console.log("[v0] BannerFormModal submit", {
        op: banner ? "update" : "create",
        id: banner?.id,
        imagen_url: input.imagen_url ?? "(sin imagen)",
      })

      const result = banner
        ? await updateBanner(banner.id, input)
        : await createBanner(input)

      console.log("[v0] BannerFormModal result:", result)

      if (!result.success) {
        setError(result.error ?? 'Error al guardar')
        return
      }
      
      setSuccess(banner ? 'Banner actualizado correctamente' : 'Banner creado correctamente')
      setTimeout(() => onSaved(), 500)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm">
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-[family-name:var(--font-dm-serif)] text-xl text-primary">
            {banner ? 'Editar banner' : 'Nuevo banner'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-foreground/60" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Col izquierda */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Título <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={e => set('titulo', e.target.value)}
                  placeholder="Ej: Bienvenidos a CRUMBS"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Subtítulo</label>
                <input
                  type="text"
                  value={form.subtitulo}
                  onChange={e => set('subtitulo', e.target.value)}
                  placeholder="Ej: Ciudad Jardín, Buenos Aires"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={e => set('descripcion', e.target.value)}
                  placeholder="Texto descriptivo del banner..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Texto del botón</label>
                  <input
                    type="text"
                    value={form.boton_texto}
                    onChange={e => set('boton_texto', e.target.value)}
                    placeholder="Ej: Ver menú"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Link del botón</label>
                  <input
                    type="text"
                    value={form.boton_link}
                    onChange={e => set('boton_link', e.target.value)}
                    placeholder="Ej: /cafeteria"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Página</label>
                  <select
                    value={form.pagina}
                    onChange={e => set('pagina', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {PAGINAS_OPCIONES.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Orden</label>
                  <input
                    type="number"
                    value={form.orden}
                    onChange={e => set('orden', Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div
                    onClick={() => set('activo', !form.activo)}
                    className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${form.activo ? 'bg-primary' : 'bg-foreground/20'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.activo ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {form.activo ? 'Banner activo' : 'Banner inactivo'}
                  </span>
                </label>
              </div>

              {/* Preview link */}
              {form.boton_link && (
                <a
                  href={form.boton_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Previsualizar link
                </a>
              )}
            </div>

            {/* Col derecha: imagen */}
            <div>
              <ImageUploadField
                value={form.imagen_url ?? null}
                onChange={url => set('imagen_url', url ?? '')}
                label="Imagen del banner"
              />
              
              {/* Preview de imagen */}
              {imagePreview && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-medium text-foreground flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary" />
                    Previsualización
                  </div>
                  <div className="w-full aspect-video rounded-xl overflow-hidden border border-border bg-muted">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-foreground/50 break-all">{imagePreview}</p>
                </div>
              )}
              
              {!imagePreview && (
                <div className="mt-4 p-4 rounded-xl border border-dashed border-border/50 text-center">
                  <p className="text-xs text-foreground/40">Sin imagen cargada</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mx-6 mb-4 px-4 py-3 bg-destructive/10 text-destructive text-sm rounded-xl">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mx-6 mb-4 px-4 py-3 bg-primary/10 text-primary text-sm rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-xl text-sm font-medium text-foreground/70 hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {banner ? 'Guardar cambios' : 'Crear banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
