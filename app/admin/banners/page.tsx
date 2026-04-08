"use client"

// Admin Banners Page v2 - Manage promotional banners and advertisements
import { useState, useEffect, useTransition, useCallback } from "react"
import { getBanners, deleteBanner, toggleBannerActivo, type Banner } from "@/lib/admin-banners"
import { BannerFormModal } from "@/components/admin/banner-form-modal"
import { Plus, Search, RefreshCw, Image, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react"

type Toast = { id: number; message: string; type: "success" | "error" }

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
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
      const b = await getBanners()
      setBanners(search.trim() ? b.filter((b) => b.titulo.toLowerCase().includes(search.toLowerCase())) : b)
    })
  }, [search])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDelete = async (id: string, titulo: string) => {
    if (!confirm(`¿Eliminar "${titulo}"?`)) return
    setDeletingId(id)
    const r = await deleteBanner(id)
    setDeletingId(null)
    if (r.success) { addToast("Banner eliminado", "success"); loadData() }
    else addToast(r.error ?? "Error", "error")
  }

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id)
    const r = await toggleBannerActivo(id, !current)
    setTogglingId(null)
    if (r.success) { addToast(!current ? "Banner activado" : "Banner desactivado", "success"); loadData() }
    else addToast(r.error ?? "Error", "error")
  }

  const handleSaved = () => { setModalOpen(false); setEditingBanner(null); addToast("Banner guardado", "success"); loadData() }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground hidden lg:block sticky top-0 z-30 border-b border-primary-foreground/10">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/10 rounded-xl">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-dm-serif)] text-xl">Banners</h1>
              <p className="text-xs text-primary-foreground/60">Gestioná los banners publicitarios</p>
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
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
          {[
            { label: "Total banners", value: banners.length, color: "bg-primary/10 text-primary" },
            { label: "Activos", value: banners.filter((b) => b.activo).length, color: "bg-emerald-100 text-emerald-700" },
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
            <input type="text" placeholder="Buscar banners..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-card border border-border/40 rounded-xl focus:outline-none focus:border-primary/60 text-sm" />
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {banners.length === 0 ? (
            <div className="bg-card border border-border/40 rounded-2xl p-8 text-center">
              <Image className="w-12 h-12 mx-auto mb-3 text-foreground/30" />
              <p className="text-foreground/60 font-medium">No hay banners creados</p>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className="bg-card border border-border/40 rounded-2xl p-4 flex items-center gap-4">
                {banner.imagen_url && <img src={banner.imagen_url} alt={banner.titulo} className="w-20 h-12 object-cover rounded-lg" />}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{banner.titulo}</h3>
                  {banner.descripcion && <p className="text-sm text-foreground/60">{banner.descripcion}</p>}
                </div>
                <button onClick={() => handleToggle(banner.id, banner.activo)} disabled={togglingId === banner.id} className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50">
                  {banner.activo ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-foreground/40" />}
                </button>
                <button onClick={() => { setEditingBanner(banner); setModalOpen(true) }} className="p-2 hover:bg-background rounded-lg transition-colors">
                  <Pencil className="w-5 h-5 text-foreground/60" />
                </button>
                <button onClick={() => handleDelete(banner.id, banner.titulo)} disabled={deletingId === banner.id} className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && <BannerFormModal banner={editingBanner} onClose={() => { setModalOpen(false); setEditingBanner(null) }} onSaved={handleSaved} />}

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
