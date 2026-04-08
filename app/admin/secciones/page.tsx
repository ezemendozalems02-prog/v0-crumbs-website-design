"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
import { getSecciones, deleteSeccion, toggleSeccionActiva, type Seccion } from "@/lib/admin-secciones"
import { SeccionFormModal } from "@/components/admin/seccion-form-modal"
import { Plus, Search, RefreshCw, Layout, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react"

export const dynamic = 'force-dynamic'

type Toast = { id: number; message: string; type: "success" | "error" }

export default function AdminSeccionesPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSeccion, setEditingSeccion] = useState<Seccion | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isLoading, startTransition] = useTransition()

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const loadData = useCallback(() => {
    startTransition(async () => {
      const s = await getSecciones()
      setSecciones(search.trim() ? s.filter((s) => s.titulo.toLowerCase().includes(search.toLowerCase())) : s)
    })
  }, [search])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`¿Eliminar "${titulo}"?`)) return
    setDeletingId(id)
    const r = await deleteSeccion(id)
    setDeletingId(null)
    if (r.success) { addToast("Sección eliminada", "success"); loadData() }
    else addToast(r.error ?? "Error", "error")
  }

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id)
    const r = await toggleSeccionActiva(id, !current)
    setTogglingId(null)
    if (r.success) { addToast(!current ? "Sección activada" : "Sección desactivada", "success"); loadData() }
    else addToast(r.error ?? "Error", "error")
  }

  const handleSaved = () => { setModalOpen(false); setEditingSeccion(null); addToast("Sección guardada", "success"); loadData() }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground hidden lg:block sticky top-0 z-30 border-b border-primary-foreground/10">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/10 rounded-xl">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-dm-serif)] text-xl">Secciones</h1>
              <p className="text-xs text-primary-foreground/60">Gestioná las secciones del menú</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} disabled={isLoading} className="flex items-center gap-2 px-3 py-2 bg-primary-foreground/10 rounded-xl text-sm hover:bg-primary-foreground/20 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
            <button onClick={() => { setEditingSeccion(null); setModalOpen(true) }} className="flex items-center gap-2 px-4 py-2 bg-primary-foreground text-primary rounded-xl text-sm font-semibold hover:bg-primary-foreground/90 transition-colors">
              <Plus className="w-4 h-4" />
              Nueva sección
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
          {[
            { label: "Total secciones", value: secciones.length, color: "bg-primary/10 text-primary" },
            { label: "Activas", value: secciones.filter((s) => s.activo).length, color: "bg-emerald-100 text-emerald-700" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-card rounded-2xl border border-border/40 p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${color}`}>{value}</div>
              <p className="text-sm text-foreground/70 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-foreground/40" />
            <input type="text" placeholder="Buscar secciones..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-card border border-border/40 rounded-xl focus:outline-none focus:border-primary/60 text-sm" />
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {secciones.length === 0 ? (
            <div className="bg-card border border-border/40 rounded-2xl p-8 text-center">
              <Layout className="w-12 h-12 mx-auto mb-3 text-foreground/30" />
              <p className="text-foreground/60 font-medium">No hay secciones creadas</p>
            </div>
          ) : (
            secciones.map((seccion) => (
              <div key={seccion.id} className="bg-card border border-border/40 rounded-2xl p-4 flex items-center gap-4">
                {seccion.imagen_url && <img src={seccion.imagen_url} alt={seccion.titulo} className="w-20 h-20 object-cover rounded-lg" />}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{seccion.titulo}</h3>
                  {seccion.descripcion && <p className="text-sm text-foreground/60">{seccion.descripcion}</p>}
                </div>
                <button onClick={() => handleToggle(seccion.id, seccion.activo)} disabled={togglingId === seccion.id} className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50">
                  {seccion.activo ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-foreground/40" />}
                </button>
                <button onClick={() => { setEditingSeccion(seccion); setModalOpen(true) }} className="p-2 hover:bg-background rounded-lg transition-colors">
                  <Pencil className="w-5 h-5 text-foreground/60" />
                </button>
                <button onClick={() => handleDelete(seccion.id, seccion.titulo)} disabled={deletingId === seccion.id} className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && <SeccionFormModal seccion={editingSeccion} onClose={() => { setModalOpen(false); setEditingSeccion(null) }} onSaved={handleSaved} />}

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(({ id, message, type }) => (
          <div key={id} className={`px-4 py-2 rounded-lg text-sm font-medium ${type === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
            {message}
          </div>
        ))}
      </div>
    </div>
  )
}
