'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { X, Loader2, Plus, Trash2, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import { createSeccion, updateSeccion, getSeccion } from '@/lib/admin-secciones'
import type { Seccion, SeccionInput, SeccionItem } from '@/lib/admin-secciones-types'
import { PAGINAS_OPCIONES } from '@/lib/admin-secciones-types'

interface SeccionFormModalProps {
  seccion?: Seccion | null
  onClose: () => void
  onSaved: () => void
}

const EMPTY_ITEM: SeccionItem = { imagen_url: '', titulo: '', subtitulo: '', link: '', is_active: true }

const EMPTY: SeccionInput = {
  clave: '',
  nombre: '',
  titulo: '',
  subtitulo: '',
  descripcion: '',
  imagen_url: '',
  items_json: null,
  pagina: 'inicio',
  activo: true,
}

export function SeccionFormModal({ seccion, onClose, onSaved }: SeccionFormModalProps) {
  const [form, setForm] = useState<SeccionInput>(EMPTY)
  const [items, setItems] = useState<SeccionItem[]>([])
  // Ref para siempre tener el valor más reciente en el closure de handleSubmit
  const itemsRef = useRef<SeccionItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saveConfirmed, setSaveConfirmed] = useState(false)
  const [isPending, startTransition] = useTransition()
  // Usar también la clave original de seccion para no depender del form state
  const claveSesion = seccion?.clave ?? form.clave
  const isItemsSection = claveSesion === 'home-highlights' || claveSesion.includes('highlights')

  // Wrapper que actualiza estado Y ref al mismo tiempo
  const setItemsAndRef = (updater: SeccionItem[] | ((prev: SeccionItem[]) => SeccionItem[])) => {
    setItems(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      itemsRef.current = next
      return next
    })
  }

  const moveItem = (idx: number, direction: -1 | 1) => {
    setItemsAndRef(prev => {
      const targetIdx = idx + direction
      if (targetIdx < 0 || targetIdx >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[targetIdx]] = [next[targetIdx], next[idx]]
      return next
    })
  }

  useEffect(() => {
    if (seccion) {
      setForm({
        clave: seccion.clave,
        nombre: seccion.nombre,
        titulo: seccion.titulo ?? '',
        subtitulo: seccion.subtitulo ?? '',
        descripcion: seccion.descripcion ?? '',
        imagen_url: seccion.imagen_url ?? '',
        items_json: seccion.items_json ?? null,
        pagina: seccion.pagina,
        activo: seccion.activo,
      })
      const initial = seccion.items_json ?? []
      setItems(initial)
      itemsRef.current = initial
    } else {
      setForm(EMPTY)
      setItems([])
      itemsRef.current = []
    }
    setSaveConfirmed(false)
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

    startTransition(async () => {
      // Snapshot del ref en este momento exacto, con sort_order normalizado a la posición actual
      const currentItems = itemsRef.current.map((item, idx) => ({ ...item, sort_order: idx }))

      const input: SeccionInput = {
        ...form,
        nombre: form.nombre.trim(),
        clave: form.clave.trim(),
        titulo: form.titulo?.trim() || undefined,
        subtitulo: form.subtitulo?.trim() || undefined,
        descripcion: form.descripcion?.trim() || undefined,
        imagen_url: form.imagen_url?.trim() || undefined,
        items_json: isItemsSection && currentItems.length > 0 ? currentItems : null,
      }

      const result = seccion
        ? await updateSeccion(seccion.id, input)
        : await createSeccion(input)

      if (!result.success) {
        setError(result.error ?? 'Error al guardar')
        return
      }

      // Si actualizamos sección existente, reemplazar estado local con data de DB
      if (seccion && result.data) {
        const savedItems = (result.data.items_json as SeccionItem[]) ?? []
        setItems(savedItems)
        itemsRef.current = savedItems
        setForm(result.data)
        setSaveConfirmed(true)
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

          {/* Editor de items (para secciones tipo highlights) */}
          {isItemsSection && (
            <div className="px-6 pb-4 space-y-4">
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Tarjetas de la sección</h3>
                    <p className="text-xs text-foreground/50 mt-0.5">Cada tarjeta tiene imagen, título, subtítulo y un link opcional</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setItemsAndRef(prev => [...prev, { ...EMPTY_ITEM }])}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Agregar tarjeta
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item, idx) => (
                    <div key={idx} className={`p-4 bg-muted/40 rounded-xl border border-border/60 space-y-3 transition-opacity ${item.is_active === false ? 'opacity-60' : ''}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Tarjeta {idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveItem(idx, -1)}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Subir"
                          >
                            <ChevronUp className="w-3.5 h-3.5 text-foreground/60" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(idx, 1)}
                            disabled={idx === items.length - 1}
                            className="p-1 rounded hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Bajar"
                          >
                            <ChevronDown className="w-3.5 h-3.5 text-foreground/60" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setItemsAndRef(prev => prev.filter((_, i) => i !== idx))}
                            className="p-1 rounded hover:bg-destructive/10 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-destructive/60" />
                          </button>
                        </div>
                      </div>

                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <div
                          onClick={() => setItemsAndRef(prev => prev.map((it, i) => i === idx ? { ...it, is_active: it.is_active === false } : it))}
                          className={`relative w-9 h-[18px] rounded-full transition-colors cursor-pointer ${item.is_active !== false ? 'bg-primary' : 'bg-foreground/20'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${item.is_active !== false ? 'translate-x-[18px]' : 'translate-x-0'}`} />
                        </div>
                        <span className="text-xs font-medium text-foreground/70">
                          {item.is_active !== false ? 'Tarjeta activa' : 'Tarjeta inactiva'}
                        </span>
                      </label>

                      {/* Imagen */}
                      <ImageUploadField
                        value={item.imagen_url || null}
                        onChange={url => setItemsAndRef(prev => prev.map((it, i) => i === idx ? { ...it, imagen_url: url ?? '' } : it))}
                        label="Imagen de la tarjeta"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-foreground/70 mb-1">Título</label>
                          <input
                            type="text"
                            value={item.titulo}
                            onChange={e => setItemsAndRef(prev => prev.map((it, i) => i === idx ? { ...it, titulo: e.target.value } : it))}
                            placeholder="Ej: Hamburguesas"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-foreground/70 mb-1">Subtítulo</label>
                          <input
                            type="text"
                            value={item.subtitulo}
                            onChange={e => setItemsAndRef(prev => prev.map((it, i) => i === idx ? { ...it, subtitulo: e.target.value } : it))}
                            placeholder="Ej: Para comer con ganas"
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-foreground/70 mb-1">
                          Link <span className="text-foreground/40">(opcional — si lo dejás vacío la tarjeta no redirige a ningún lado)</span>
                        </label>
                        <input
                          type="text"
                          value={item.link ?? ''}
                            onChange={e => setItemsAndRef(prev => prev.map((it, i) => i === idx ? { ...it, link: e.target.value } : it))}
                          placeholder="Ej: /cocina o https://..."
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="text-center py-6 text-foreground/40 text-sm border-2 border-dashed border-border rounded-xl">
                      No hay tarjetas. Hacé clic en "Agregar tarjeta" para comenzar.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mx-6 mb-4 px-4 py-3 bg-destructive/10 text-destructive text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* Confirmacion guardado en DB */}
          {saveConfirmed && (
            <div className="mx-6 mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>Cambios guardados y verificados correctamente en la base de datos.</span>
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
