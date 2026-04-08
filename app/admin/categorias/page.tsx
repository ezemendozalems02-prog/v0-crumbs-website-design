"use client"
// v77 - Cleared build cache issue

import { useState, useEffect, useTransition, useCallback } from "react"
import { getCategorias, upsertCategoria, deleteCategoria, toggleCategoriaActiva, type Categoria } from "@/lib/admin-productos"
import { Tag, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, RefreshCw, X, Check } from "lucide-react"

const TIPO_OPTIONS = [
  { value: "desayuno", label: "Desayunos" },
  { value: "almuerzo_cena", label: "Almuerzo & Cenas" },
  { value: "delivery", label: "Delivery" },
  { value: "todos", label: "Todos los menús" },
]

const TIPO_COLORS: Record<string, string> = {
  desayuno: "bg-amber-100 text-amber-700",
  almuerzo_cena: "bg-primary/10 text-primary",
  delivery: "bg-blue-100 text-blue-700",
  todos: "bg-foreground/10 text-foreground/70",
}

type Toast = { id: number; message: string; type: "success" | "error" }

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

interface FormState { nombre: string; slug: string; tipo_menu: string; orden: string }

const emptyForm: FormState = { nombre: "", slug: "", tipo_menu: "desayuno", orden: "0" }

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isLoading, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, startSaving] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const loadData = useCallback(() => {
    startTransition(async () => {
      const data = await getCategorias()
      setCategorias(data)
    })
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const openNew = () => { setEditingId(null); setForm(emptyForm); setFormError(null); setShowForm(true) }
  const openEdit = (c: Categoria) => {
    setEditingId(c.id)
    setForm({ nombre: c.nombre, slug: c.slug, tipo_menu: c.tipo_menu, orden: String(c.orden) })
    setFormError(null)
    setShowForm(true)
  }
  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm) }

  const handleNombreChange = (v: string) => {
    setForm((prev) => ({ ...prev, nombre: v, slug: editingId ? prev.slug : slugify(v) }))
  }

  const handleSave = () => {
    if (!form.nombre.trim()) { setFormError("El nombre es requerido"); return }
    if (!form.slug.trim()) { setFormError("El slug es requerido"); return }
    if (!form.tipo_menu) { setFormError("Seleccioná el tipo de menú"); return }
    setFormError(null)
    startSaving(async () => {
      const payload: any = {
        nombre: form.nombre.trim(),
        slug: form.slug.trim(),
        tipo_menu: form.tipo_menu,
        orden: Number(form.orden) || 0,
        ...(editingId ? { id: editingId } : {}),
      }
      const r = await upsertCategoria(payload)
      if (r.success) { addToast(editingId ? "Categoría actualizada" : "Categoría creada", "success"); closeForm(); loadData() }
      else setFormError(r.error ?? "Error al guardar")
    })
  }

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar la categoría "${nombre}"? Los productos de esta categoría no podrán eliminarse si tienen productos asignados.`)) return
    setDeletingId(id)
    const r = await deleteCategoria(id)
    setDeletingId(null)
    if (r.success) { addToast("Categoría eliminada", "success"); loadData() }
    else addToast(r.error ?? "No se puede eliminar (tiene productos asignados)", "error")
  }

  const handleToggle = async (id: string, activa: boolean) => {
    setTogglingId(id)
    const r = await toggleCategoriaActiva(id, !activa)
    setTogglingId(null)
    if (r.success) { addToast(!activa ? "Categoría activada" : "Categoría desactivada", "success"); loadData() }
    else addToast(r.error ?? "Error", "error")
  }

  const byTipo = TIPO_OPTIONS.map((t) => ({
    ...t,
    items: categorias.filter((c) => c.tipo_menu === t.value),
  })).filter((t) => t.items.length > 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground hidden lg:block sticky top-0 z-30 border-b border-primary-foreground/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/10 rounded-xl"><Tag className="w-5 h-5" /></div>
            <div>
              <h1 className="font-[family-name:var(--font-dm-serif)] text-xl">Categorías</h1>
              <p className="text-xs text-primary-foreground/60">Organizá las secciones del menú</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} disabled={isLoading} className="flex items-center gap-2 px-3 py-2 bg-primary-foreground/10 rounded-xl text-sm hover:bg-primary-foreground/20 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary-foreground text-primary rounded-xl text-sm font-semibold hover:bg-primary-foreground/90 transition-colors">
              <Plus className="w-4 h-4" />
              Nueva categoría
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Mobile new button */}
        <button onClick={openNew} className="lg:hidden w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-semibold">
          <Plus className="w-4 h-4" />
          Nueva categoría
        </button>

        {isLoading ? (
          <div className="bg-card rounded-2xl border border-border/40 p-16 flex items-center justify-center gap-3 text-foreground/40">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {byTipo.map(({ value, label, items }) => (
              <div key={value} className="bg-card rounded-2xl border border-border/40 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border/20 bg-background/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TIPO_COLORS[value]}`}>{label}</span>
                    <span className="text-xs text-foreground/40">{items.length} categoría{items.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="divide-y divide-border/20">
                  {items.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-background/40 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium text-sm ${c.activa ? "text-foreground" : "text-foreground/40 line-through"}`}>{c.nombre}</span>
                        </div>
                        <p className="text-xs text-foreground/40 mt-0.5">slug: {c.slug} · orden: {c.orden}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleToggle(c.id, c.activa)}
                          disabled={togglingId === c.id}
                          className="p-1.5 rounded-lg transition-colors disabled:opacity-40"
                          title={c.activa ? "Desactivar" : "Activar"}
                        >
                          {c.activa
                            ? <ToggleRight className="w-5 h-5 text-emerald-600" />
                            : <ToggleLeft className="w-5 h-5 text-foreground/30" />}
                        </button>
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id, c.nombre)} disabled={deletingId === c.id} className="p-1.5 rounded-lg text-foreground/40 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
              <h2 className="font-[family-name:var(--font-dm-serif)] text-xl">{editingId ? "Editar categoría" : "Nueva categoría"}</h2>
              <button onClick={closeForm} className="p-2 rounded-xl text-foreground/40 hover:bg-background transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {formError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{formError}</div>}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Nombre *</label>
                <input type="text" value={form.nombre} onChange={(e) => handleNombreChange(e.target.value)} placeholder="Ej: Entradas frías" className="w-full px-4 py-3 bg-background border border-border/40 rounded-xl text-sm outline-none focus:border-primary/60 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Slug *</label>
                <input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="entradas-frias" className="w-full px-4 py-3 bg-background border border-border/40 rounded-xl text-sm font-mono outline-none focus:border-primary/60 transition-colors" />
                <p className="text-xs text-foreground/40">Identificador único, solo minúsculas y guiones</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Tipo de menú *</label>
                  <select value={form.tipo_menu} onChange={(e) => setForm((p) => ({ ...p, tipo_menu: e.target.value }))} className="w-full px-3 py-3 bg-background border border-border/40 rounded-xl text-sm outline-none focus:border-primary/60 transition-colors">
                    {TIPO_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Orden</label>
                  <input type="number" value={form.orden} onChange={(e) => setForm((p) => ({ ...p, orden: e.target.value }))} min="0" className="w-full px-4 py-3 bg-background border border-border/40 rounded-xl text-sm outline-none focus:border-primary/60 transition-colors" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border/40 flex gap-3">
              <button onClick={closeForm} className="flex-1 py-3 rounded-xl border border-border/40 text-sm font-medium text-foreground/60 hover:bg-background transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={isSaving} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
                {isSaving ? "Guardando…" : editingId ? "Guardar cambios" : "Crear categoría"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-lg pointer-events-auto ${t.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}
