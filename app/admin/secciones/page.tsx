"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
import { getSecciones, deleteSeccion, type Seccion } from "@/lib/admin-secciones"
import { SeccionFormModal } from "@/components/admin/seccion-form-modal"
import { Plus, Search, RefreshCw, Layout, Pencil, Trash2 } from "lucide-react"

type Toast = { id: number; message: string; type: "success" | "error" }

export default function AdminSeccionesPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSeccion, setEditingSeccion] = useState<Seccion | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isLoading, startTransition] = useTransition()

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const loadData = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await getSecciones()
        setSecciones(data)
      } catch (err) {
        addToast("Error al cargar secciones", "error")
      }
    })
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`¿Eliminar sección "${titulo}"?`)) return
    setDeletingId(id)
    const result = await deleteSeccion(id)
    setDeletingId(null)
    if (result.success) {
      addToast("Sección eliminada", "success")
      loadData()
    } else {
      addToast(result.error ?? "Error al eliminar", "error")
    }
  }

  const handleSaved = () => {
    setModalOpen(false)
    setEditingSeccion(null)
    addToast("Sección guardada", "success")
    loadData()
  }

  const filteredSecciones = secciones.filter((s) =>
    s.titulo.toLowerCase().includes(search.toLowerCase()) || 
    s.descripcion?.toLowerCase().includes(search.toLowerCase())
  )

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
        {/* Filtros */}
        <div className="bg-card rounded-2xl border border-border/40 p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar sección..."
              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border/40 rounded-xl text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <button onClick={() => { setEditingSeccion(null); setModalOpen(true) }} className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">
            <Plus className="w-4 h-4" />
            Nueva
          </button>
        </div>

        {/* Resultados */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground/60">
            {isLoading ? "Cargando…" : `${filteredSecciones.length} sección${filteredSecciones.length !== 1 ? "es" : ""}`}
          </p>
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="bg-card rounded-2xl border border-border/40 p-16 flex items-center justify-center gap-3 text-foreground/40">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando secciones…</span>
          </div>
        ) : filteredSecciones.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/40 p-16 text-center">
            <Layout className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/50 font-medium">No hay secciones</p>
            <p className="text-sm text-foreground/30 mt-1">Creá la primera con el botón de arriba</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSecciones.map((seccion) => (
              <div key={seccion.id} className="bg-card rounded-2xl border border-border/40 overflow-hidden hover:border-border/60 transition-colors">
                {/* Imagen */}
                {seccion.imagen_url ? (
                  <div className="relative w-full h-32 overflow-hidden bg-background">
                    <img src={seccion.imagen_url} alt={seccion.titulo} className="w-full h-full object-cover" />
                    {!seccion.activo && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white text-sm font-semibold">Inactiva</span></div>}
                  </div>
                ) : (
                  <div className="w-full h-32 bg-background/50 flex items-center justify-center border-b border-border/40">
                    <Layout className="w-8 h-8 text-foreground/20" />
                  </div>
                )}

                {/* Contenido */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-1">{seccion.titulo}</h3>
                    {seccion.descripcion && <p className="text-sm text-foreground/60 line-clamp-2 mt-1">{seccion.descripcion}</p>}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border/20">
                    <button onClick={() => { setEditingSeccion(seccion); setModalOpen(true) }} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                      <Pencil className="w-4 h-4" />
                      Editar
                    </button>
                    <button onClick={() => handleDelete(seccion.id, seccion.titulo)} disabled={deletingId === seccion.id} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40">
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <SeccionFormModal
          seccion={editingSeccion}
          onClose={() => { setModalOpen(false); setEditingSeccion(null) }}
          onSaved={handleSaved}
        />
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
