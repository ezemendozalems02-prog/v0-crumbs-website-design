"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
import Image from "next/image"
import { getBanners, deleteBanner, toggleBannerActivo, updateBannerOrden } from "@/lib/admin-banners"
import type { Banner } from "@/lib/admin-banners-types"
import { PAGINAS_OPCIONES } from "@/lib/admin-banners-types"
import { BannerFormModal } from "@/components/admin/banner-form-modal"
import {
  Plus, RefreshCw, Image as ImageIcon, Pencil, Trash2,
  ChevronUp, ChevronDown, ToggleLeft, ToggleRight, Layers,
} from "lucide-react"

type Toast = { id: number; message: string; type: "success" | "error" }

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [filterPagina, setFilterPagina] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
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
      const data = await getBanners(filterPagina || undefined)
      setBanners(data)
    })
  }, [filterPagina])

  useEffect(() => { loadData() }, [loadData])

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`¿Eliminar el banner "${titulo}"? Esta acción no se puede deshacer.`)) return
    setDeletingId(id)
    const r = await deleteBanner(id)
    setDeletingId(null)
    if (r.success) { addToast("Banner eliminado", "success"); loadData() }
    else addToast(r.error ?? "Error al eliminar", "error")
  }

  const handleToggle = async (id: string, activo: boolean) => {
    setTogglingId(id)
    const r = await toggleBannerActivo(id, !activo)
    setTogglingId(null)
    if (r.success) { addToast(activo ? "Banner desactivado" : "Banner activado", "success"); loadData() }
    else addToast(r.error ?? "Error", "error")
  }

  const handleOrden = async (id: string, currentOrden: number, direction: "up" | "down") => {
    const newOrden = direction === "up" ? currentOrden - 1 : currentOrden + 1
    if (newOrden < 0) return
    const r = await updateBannerOrden(id, newOrden)
    if (r.success) loadData()
    else addToast(r.error ?? "Error al reordenar", "error")
  }

  const handleSaved = () => {
    setModalOpen(false)
    setEditingBanner(null)
    
    // Mostrar toast de éxito
    addToast(editingBanner ? "Banner actualizado y publicado" : "Banner creado y publicado", "success")
    
    // Esperar un poco para que se actualice en BD y caché
    setTimeout(() => {
      loadData()
    }, 1000)
  }

  // Agrupar por página
  const grouped = PAGINAS_OPCIONES.reduce<Record<string, Banner[]>>((acc, p) => {
    const items = banners.filter(b => b.pagina === p.value)
    if (items.length > 0 || !filterPagina) acc[p.value] = items
    return acc
  }, {})

  const totalActivos = banners.filter(b => b.activo).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-dm-serif)] text-2xl text-primary">Banners</h1>
          <p className="text-sm text-foreground/60 mt-0.5">Gestioná los banners y slides del sitio</p>
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
            onClick={() => { setEditingBanner(null); setModalOpen(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo banner
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total banners", value: banners.length, icon: Layers },
          { label: "Activos", value: totalActivos, icon: ToggleRight },
          { label: "Inactivos", value: banners.length - totalActivos, icon: ToggleLeft },
          { label: "Páginas con banners", value: Object.values(grouped).filter(g => g.length > 0).length, icon: ImageIcon },
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

      {/* Filtro por página */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilterPagina("")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!filterPagina ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70 hover:bg-muted/80"}`}
        >
          Todas las páginas
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

      {/* Lista agrupada por página */}
      {isLoading && banners.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 text-primary/40 animate-spin" />
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-primary/10 rounded-2xl mb-4">
            <ImageIcon className="w-8 h-8 text-primary/60" />
          </div>
          <p className="text-foreground/60 text-sm">No hay banners todavía</p>
          <button
            onClick={() => { setEditingBanner(null); setModalOpen(true) }}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Crear el primer banner
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([pagina, items]) => {
            if (items.length === 0) return null
            const paginaLabel = PAGINAS_OPCIONES.find(p => p.value === pagina)?.label ?? pagina
            return (
              <div key={pagina}>
                <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">
                  {paginaLabel} ({items.length})
                </h3>
                <div className="space-y-2">
                  {items.map((banner, idx) => (
                    <div
                      key={banner.id}
                      className={`bg-card rounded-2xl border border-border p-4 flex items-center gap-4 transition-opacity ${!banner.activo ? "opacity-60" : ""}`}
                    >
                      {/* Imagen miniatura */}
                      <div className="w-16 h-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                        {banner.imagen_url ? (
                          <Image src={banner.imagen_url} alt={banner.titulo} width={64} height={48} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-foreground/20" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-foreground truncate">{banner.titulo}</p>
                          {!banner.activo && (
                            <span className="px-1.5 py-0.5 bg-foreground/10 text-foreground/50 text-xs rounded-md shrink-0">Inactivo</span>
                          )}
                        </div>
                        {banner.subtitulo && <p className="text-xs text-foreground/60 truncate mt-0.5">{banner.subtitulo}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-foreground/40">Orden: {banner.orden}</span>
                          {banner.boton_texto && (
                            <span className="text-xs text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full">{banner.boton_texto}</span>
                          )}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Reordenar */}
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleOrden(banner.id, banner.orden, "up")}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-muted transition-colors disabled:opacity-20"
                          >
                            <ChevronUp className="w-3.5 h-3.5 text-foreground/50" />
                          </button>
                          <button
                            onClick={() => handleOrden(banner.id, banner.orden, "down")}
                            disabled={idx === items.length - 1}
                            className="p-1 rounded hover:bg-muted transition-colors disabled:opacity-20"
                          >
                            <ChevronDown className="w-3.5 h-3.5 text-foreground/50" />
                          </button>
                        </div>

                        {/* Toggle activo */}
                        <button
                          onClick={() => handleToggle(banner.id, banner.activo)}
                          disabled={togglingId === banner.id}
                          className="p-2 rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
                          title={banner.activo ? "Desactivar" : "Activar"}
                        >
                          {banner.activo
                            ? <ToggleRight className="w-4 h-4 text-primary" />
                            : <ToggleLeft className="w-4 h-4 text-foreground/40" />
                          }
                        </button>

                        {/* Editar */}
                        <button
                          onClick={() => { setEditingBanner(banner); setModalOpen(true) }}
                          className="p-2 rounded-xl hover:bg-muted transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4 text-foreground/60" />
                        </button>

                        {/* Eliminar */}
                        <button
                          onClick={() => handleDelete(banner.id, banner.titulo)}
                          disabled={deletingId === banner.id}
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
        <BannerFormModal
          banner={editingBanner}
          onClose={() => { setModalOpen(false); setEditingBanner(null) }}
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
