"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
import Image from "next/image"
import { getSecciones, deleteSeccion, toggleSeccionActiva } from "@/lib/admin-secciones"
import type { Seccion } from "@/lib/admin-content-types"
import { PAGINAS_OPCIONES } from "@/lib/admin-content-types"
import { SeccionFormModal } from "@/components/admin/seccion-form-modal"
import {
  Plus, RefreshCw, LayoutTemplate, Pencil, Trash2,
  ToggleLeft, ToggleRight, Image as ImageIcon,
} from "lucide-react"

type Toast = { id: number; message: string; type: "success" | "error" }

export default function AdminSeccionesPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [filterPagina, setFilterPagina] = useState("")
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSeccion, setEditingSeccion] = useState<Seccion | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isLoading, startTransition] = useTransition()

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  const loadData = useCallback(() => {
    startTransition(async () => {
      const data = await getSecciones(filterPagina || undefined)
      setSecciones(data)
    })
  }, [filterPagina])

  useEffect(() => { loadData() }, [loadData])

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar la sección "${nombre}"? Esta acción no se puede deshacer.`)) return
    setDeletingId(id)
    const r = await deleteSeccion(id)
    setDeletingId(null)
    if (r.success) { addToast("Sección eliminada", "success"); loadData() }
    else addToast(r.error ?? "Error al eliminar", "error")
  }

  const handleToggle = async (id: string, activo: boolean) => {
    setTogglingId(id)
    const r = await toggleSeccionActiva(id, !activo)
    setTogglingId(null)
    if (r.success) { addToast(activo ? "Sección desactivada" : "Sección activada", "success"); loadData() }
    else addToast(r.error ?? "Error", "error")
  }

  const handleSaved = () => {
    setModalOpen(false)
    setEditingSeccion(null)
    addToast(editingSeccion ? "Sección actualizada" : "Sección creada", "success")
    loadData()
  }

  const filtered = secciones.filter(s =>
    !search.trim() ||
    s.nombre.toLowerCase().includes(search.toLowerCase()) ||
    s.clave.toLowerCase().includes(search.toLowerCase()) ||
    (s.titulo ?? "").toLowerCase().includes(search.toLowerCase())
  )

  // Agrupar por página
  const grouped = PAGINAS_OPCIONES.reduce<Record<string, Seccion[]>>((acc, p) => {
    const items = filtered.filter(s => s.pagina === p.value)
    if (items.length > 0) acc[p.value] = items
    return acc
  }, {})

  const totalActivas = secciones.filter(s => s.activo).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-dm-serif)] text-2xl text-primary">Secciones</h1>
          <p className="text-sm text-foreground/60 mt-0.5">Editá el contenido de las secciones del sitio</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-foreground/60 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => { setEditingSeccion(null); setModalOpen(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva sección
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total secciones", value: secciones.length, icon: LayoutTemplate },
          { label: "Activas", value: totalActivas, icon: ToggleRight },
          { label: "Inactivas", value: secciones.length - totalActivas, icon: ToggleLeft },
          { label: "Páginas con contenido", value: Object.keys(grouped).length, icon: ImageIcon },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl shrink-0">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-foreground/60">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, clave o título..."
          className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterPagina("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!filterPagina ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70 hover:bg-muted/80"}`}
          >
            Todas
          </button>
          {PAGINAS_OPCIONES.map(p => (
            <button
              key={p.value}
              onClick={() => setFilterPagina(p.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterPagina === p.value ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70 hover:bg-muted/80"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {isLoading && secciones.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 text-primary/40 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-primary/10 rounded-2xl mb-4">
            <LayoutTemplate className="w-8 h-8 text-primary/60" />
          </div>
          <p className="text-foreground/60 text-sm">No hay secciones todavía</p>
          <button
            onClick={() => { setEditingSeccion(null); setModalOpen(true) }}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Crear la primera sección
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([pagina, items]) => {
            const paginaLabel = PAGINAS_OPCIONES.find(p => p.value === pagina)?.label ?? pagina
            return (
              <div key={pagina}>
                <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">
                  {paginaLabel} ({items.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map(seccion => (
                    <div
                      key={seccion.id}
                      className={`bg-card rounded-2xl border border-border p-4 flex gap-4 transition-opacity ${!seccion.activo ? "opacity-60" : ""}`}
                    >
                      {/* Imagen miniatura */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                        {seccion.imagen_url ? (
                          <Image src={seccion.imagen_url} alt={seccion.nombre} width={56} height={56} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <LayoutTemplate className="w-5 h-5 text-foreground/20" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{seccion.nombre}</p>
                            <code className="text-xs text-foreground/40 font-mono">{seccion.clave}</code>
                          </div>
                          {!seccion.activo && (
                            <span className="px-1.5 py-0.5 bg-foreground/10 text-foreground/50 text-xs rounded-md shrink-0">Inactiva</span>
                          )}
                        </div>
                        {seccion.titulo && (
                          <p className="text-xs text-foreground/70 mt-1 truncate">{seccion.titulo}</p>
                        )}
                        {seccion.descripcion && (
                          <p className="text-xs text-foreground/50 mt-0.5 line-clamp-2">{seccion.descripcion}</p>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggle(seccion.id, seccion.activo)}
                          disabled={togglingId === seccion.id}
                          className="p-2 rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
                          title={seccion.activo ? "Desactivar" : "Activar"}
                        >
                          {seccion.activo
                            ? <ToggleRight className="w-4 h-4 text-primary" />
                            : <ToggleLeft className="w-4 h-4 text-foreground/40" />
                          }
                        </button>
                        <button
                          onClick={() => { setEditingSeccion(seccion); setModalOpen(true) }}
                          className="p-2 rounded-xl hover:bg-muted transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4 text-foreground/60" />
                        </button>
                        <button
                          onClick={() => handleDelete(seccion.id, seccion.nombre)}
                          disabled={deletingId === seccion.id}
                          className="p-2 rounded-xl hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-destructive/70" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <SeccionFormModal
          seccion={editingSeccion}
          onClose={() => { setModalOpen(false); setEditingSeccion(null) }}
          onSaved={handleSaved}
        />
      )}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
              t.type === "success" ? "bg-primary text-primary-foreground" : "bg-destructive text-white"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}
