"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
import { getBanners, deleteBanner, type Banner } from "@/lib/admin-banners"
import { BannerFormModal } from "@/components/admin/banner-form-modal"
import { Plus, Search, RefreshCw, Image as ImageIcon, Pencil, Trash2 } from "lucide-react"

type Toast = { id: number; message: string; type: "success" | "error" }

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
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
        const data = await getBanners()
        setBanners(data)
      } catch (err) {
        addToast("Error al cargar banners", "error")
      }
    })
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`¿Eliminar banner "${titulo}"?`)) return
    setDeletingId(id)
    const result = await deleteBanner(id)
    setDeletingId(null)
    if (result.success) {
      addToast("Banner eliminado", "success")
      loadData()
    } else {
      addToast(result.error ?? "Error al eliminar", "error")
    }
  }

  const handleSaved = () => {
    setModalOpen(false)
    setEditingBanner(null)
    addToast("Banner guardado", "success")
    loadData()
  }

  const filteredBanners = banners.filter((b) =>
    b.titulo.toLowerCase().includes(search.toLowerCase()) || 
    b.descripcion?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground hidden lg:block sticky top-0 z-30 border-b border-primary-foreground/10">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/10 rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-dm-serif)] text-xl">Banners</h1>
              <p className="text-xs text-primary-foreground/60">Gestioná los banners principales</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} disabled={isLoading} className="flex items-center gap-2 px-3 py-2 bg-primary-foreground/10 rounded-xl text-sm hover:bg-primary-foreground/20 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
            <button onClick={() => { setEditingBanner(null); setModalOpen(true) }} className="flex items-center gap-2 px-4 py-2 bg-primary-foreground text-primary rounded-xl text-sm font-semibold hover:bg-primary-foreground/90 transition-colors">
              <Plus className="w-4 h-4" />
              Nuevo banner
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
              placeholder="Buscar banner..."
              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border/40 rounded-xl text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <button onClick={() => { setEditingBanner(null); setModalOpen(true) }} className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">
            <Plus className="w-4 h-4" />
            Nuevo
          </button>
        </div>

        {/* Resultados */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground/60">
            {isLoading ? "Cargando…" : `${filteredBanners.length} banner${filteredBanners.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="bg-card rounded-2xl border border-border/40 p-16 flex items-center justify-center gap-3 text-foreground/40">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando banners…</span>
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/40 p-16 text-center">
            <ImageIcon className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/50 font-medium">No hay banners</p>
            <p className="text-sm text-foreground/30 mt-1">Creá el primero con el botón de arriba</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBanners.map((banner) => (
              <div key={banner.id} className="bg-card rounded-2xl border border-border/40 overflow-hidden hover:border-border/60 transition-colors">
                {/* Imagen */}
                {banner.imagen_url ? (
                  <div className="relative w-full h-32 overflow-hidden bg-background">
                    <img src={banner.imagen_url} alt={banner.titulo} className="w-full h-full object-cover" />
                    {!banner.activo && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white text-sm font-semibold">Inactivo</span></div>}
                  </div>
                ) : (
                  <div className="w-full h-32 bg-background/50 flex items-center justify-center border-b border-border/40">
                    <ImageIcon className="w-8 h-8 text-foreground/20" />
                  </div>
                )}

                {/* Contenido */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-1">{banner.titulo}</h3>
                    {banner.descripcion && <p className="text-sm text-foreground/60 line-clamp-2 mt-1">{banner.descripcion}</p>}
                  </div>

                  {banner.enlace_url && (
                    <div className="text-xs text-primary break-all hover:underline">
                      {banner.enlace_url}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-border/20">
                    <button onClick={() => { setEditingBanner(banner); setModalOpen(true) }} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                      <Pencil className="w-4 h-4" />
                      Editar
                    </button>
                    <button onClick={() => handleDelete(banner.id, banner.titulo)} disabled={deletingId === banner.id} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40">
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
        <BannerFormModal
          banner={editingBanner}
          onClose={() => { setModalOpen(false); setEditingBanner(null) }}
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
