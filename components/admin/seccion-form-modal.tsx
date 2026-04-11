'use client'

import { useState, useEffect, useTransition } from 'react'
import { X, Loader2 } from 'lucide-react'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import { createSeccion, updateSeccion } from '@/lib/admin-secciones'
import type { Seccion, SeccionInput } from '@/lib/admin-secciones-types'
import { PAGINAS_OPCIONES } from '@/lib/admin-secciones-types'

interface SeccionFormModalProps {
  seccion?: Seccion | null
  onClose: () => void
  onSaved: () => void
}

const EMPTY: SeccionInput = {
  clave: '',
  nombre: '',
  titulo: '',
  subtitulo: '',
  descripcion: '',
  imagen_url: '',
  pagina: 'inicio',
  activo: true,
}

export function SeccionFormModal({ seccion, onClose, onSaved }: SeccionFormModalProps) {
  const [form, setForm] = useState<SeccionInput>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (seccion) {
      setForm({
        clave: seccion.clave,
        nombre: seccion.nombre,
        titulo: seccion.titulo ?? '',
        subtitulo: seccion.subtitulo ?? '',
        descripcion: seccion.descripcion ?? '',
        imagen_url: seccion.imagen_url ?? '',
        pagina: seccion.pagina,
        activo: seccion.activo,
      })
    } else {
      setForm(EMPTY)
    }
  }, [seccion])

  const set = (key: keyof SeccionInput, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleNombreChange = (nombre: string) => {
    setForm(prev => ({
      ...prev,
      nombre,
      // Auto-generar clave solo si es nueva sección
      ...(!seccion ? { clave: nombre.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') } : {}),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.nombre.trim()) { setError('El nombre es obligatorio'); return }
    if (!form.clave.trim()) { setError('La clave es obligatoria'); return }
    if (!/^[a-z0-9_]+$/.test(form.clave)) { setError('La clave solo puede tener letras minúsculas, números y guiones bajos'); return }

    startTransition(async () => {
      const input: SeccionInput = {
        ...form,
        nombre: form.nombre.trim(),
        clave: form.clave.trim(),
        titulo: form.titulo?.trim() || undefined,
        subtitulo: form.subtitulo?.trim() || undefined,
        descripcion: form.descripcion?.trim() || undefined,
        imagen_url: form.imagen_url?.trim() || undefined,
      }

      const result = seccion
        ? await updateSeccion(seccion.id, input)
        : await createSeccion(input)

      if (!result.success) {
        setError(result.error ?? 'Error al guardar')
        return
      }
      onSaved()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm">
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-[family-name:var(--font-dm-serif)] text-xl text-primary">
            {seccion ? 'Editar sección' : 'Nueva sección'}
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
                  Nombre <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => handleNombreChange(e.target.value)}
                  placeholder="Ej: Hero Principal"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Clave única <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.clave}
                  onChange={e => set('clave', e.target.value)}
                  placeholder="Ej: hero_principal"
                  disabled={!!seccion}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                />
                <p className="text-xs text-foreground/50 mt-1">
                  {seccion ? 'La clave no puede modificarse una vez creada' : 'Solo letras minúsculas, números y guiones bajos'}
                </p>
              </div>

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
                <label className="block text-sm font-medium text-foreground mb-1.5">Título</label>
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
                <label className="block text-sm font-medium text-foreground mb-1.5">Descripción / Texto</label>
                <textarea
                  value={form.descripcion}
                  onChange={e => set('descripcion', e.target.value)}
                  placeholder="Texto principal de la sección..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
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
                    {form.activo ? 'Sección activa' : 'Sección inactiva'}
                  </span>
                </label>
              </div>
            </div>

            {/* Col derecha: imagen */}
            <div>
              <ImageUploadField
                value={form.imagen_url ?? null}
                onChange={url => set('imagen_url', url ?? '')}
                label="Imagen de la sección"
              />
              {form.imagen_url && (
                <p className="text-xs text-foreground/50 mt-2 break-all">{form.imagen_url}</p>
              )}

              {/* Preview card */}
              {(form.titulo || form.subtitulo || form.descripcion) && (
                <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/15">
                  <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider mb-2">Vista previa</p>
                  {form.titulo && <p className="font-[family-name:var(--font-dm-serif)] text-lg text-primary leading-tight">{form.titulo}</p>}
                  {form.subtitulo && <p className="text-sm text-foreground/70 mt-1">{form.subtitulo}</p>}
                  {form.descripcion && <p className="text-xs text-foreground/60 mt-2 leading-relaxed">{form.descripcion}</p>}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mx-6 mb-4 px-4 py-3 bg-destructive/10 text-destructive text-sm rounded-xl">
              {error}
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
              {seccion ? 'Guardar cambios' : 'Crear sección'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
