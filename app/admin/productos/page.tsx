"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
import {
  getProductos, deleteProducto, toggleProductoDisponible, getMetricasProductos, getCategorias, reorderProductos,
  type Producto, type Categoria,
} from "@/lib/admin-productos"
import { ProductoFormModal } from "@/components/admin/producto-form-modal"
import { Plus, Search, RefreshCw, UtensilsCrossed, ToggleLeft, ToggleRight, Pencil, Trash2, Star, Package, SlidersHorizontal, X, ArrowUpDown, ChevronUp, ChevronDown, GripVertical } from "lucide-react"

const TIPO_LABEL: Record<string, string> = {
  desayuno: "Desayunos",
  almuerzo_cena: "Almuerzo & Cenas",
  delivery: "Delivery",
  todos: "Todos",
}

type Toast = { id: number; message: string; type: "success" | "error" }

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [metricas, setMetricas] = useState({ total: 0, disponibles: 0, no_disponibles: 0, destacados: 0 })
  const [search, setSearch] = useState("")
  const [filterDisp, setFilterDisp] = useState<"todos" | "disponible" | "no_disponible">("todos")
  const [filterTipo, setFilterTipo] = useState<"todos" | "carta" | "delivery">("todos")
  const [filterCategoria, setFilterCategoria] = useState<string>("todas")
  const [filterDestacado, setFilterDestacado] = useState<"todos" | "destacado" | "no_destacado">("todos")
  const [sortBy, setSortBy] = useState<"orden" | "nombre_asc" | "nombre_desc" | "precio_asc" | "precio_desc" | "destacados">("orden")
  const [showFiltros, setShowFiltros] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [reorderingId, setReorderingId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isLoading, startTransition] = useTransition()

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const loadData = useCallback(() => {
    startTransition(async () => {
      const filters: { disponible?: boolean; search?: string; tipo_menu?: string } = {}
      if (filterDisp === "disponible") filters.disponible = true
      if (filterDisp === "no_disponible") filters.disponible = false
      if (search.trim()) filters.search = search.trim()
      if (filterTipo !== "todos") {
        if (filterTipo === "delivery") filters.tipo_menu = "delivery"
        if (filterTipo === "carta") filters.tipo_menu = "carta"
      }
      const [p, m, c] = await Promise.all([getProductos(filters), getMetricasProductos(), getCategorias()])

      setProductos(p)
      setMetricas(m)
      setCategorias(c)
    })
  }, [filterDisp, search, filterTipo])

  useEffect(() => { loadData() }, [loadData])

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return
    setDeletingId(id)
    const r = await deleteProducto(id)
    setDeletingId(null)
    if (r.success) { addToast("Producto eliminado", "success"); loadData() }
    else addToast(r.error ?? "Error al eliminar", "error")
  }

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id)
    const r = await toggleProductoDisponible(id, !current)
    setTogglingId(null)
    if (r.success) { addToast(!current ? "Producto activado" : "Producto desactivado", "success"); loadData() }
    else addToast(r.error ?? "Error", "error")
  }

  const handleSaved = () => { setModalOpen(false); setEditingProducto(null); addToast("Producto guardado", "success"); loadData() }

  // Mueve un producto una posición arriba o abajo dentro de su lista (carta o delivery)
  const handleReorder = async (lista: Producto[], id: string, direction: "up" | "down") => {
    const idx = lista.findIndex((p) => p.id === id)
    if (idx < 0) return
    if (direction === "up" && idx === 0) return
    if (direction === "down" && idx === lista.length - 1) return
    const newLista = [...lista]
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    ;[newLista[idx], newLista[swapIdx]] = [newLista[swapIdx], newLista[idx]]
    // Asigna órdenes consecutivos basados en la posición actual en el array
    const items = newLista.map((p, i) => ({ id: p.id, orden: i + 1 }))
    setReorderingId(id)
    // Actualiza optimistamente el estado local para respuesta inmediata
    setProductos((prev) => {
      const updated = [...prev]
      items.forEach(({ id: pid, orden }) => {
        const found = updated.find((p) => p.id === pid)
        if (found) found.orden = orden
      })
      return updated
    })
    const r = await reorderProductos(items)
    setReorderingId(null)
    if (!r.success) {
      addToast(r.error ?? "Error al reordenar", "error")
      loadData() // revertir si falla
    }
  }

  // Aplicar filtro de tipo antes de aplicar otros filtros
  const productosFiltroPorTipo = productos.filter((p) => {
    if (filterTipo === "todos") return true
    if (filterTipo === "carta") return p.categoria?.tipo_menu === "desayuno" || p.categoria?.tipo_menu === "almuerzo_cena"
    if (filterTipo === "delivery") return p.categoria?.tipo_menu === "delivery"
    return true
  })

  // Separar productos por tipo
  const productosDeCartaFilters = (p: Producto) => {
    const tipo = p.categoria?.tipo_menu
    return (tipo === "desayuno" || tipo === "almuerzo_cena") && 
           (filterDisp === "todos" || (filterDisp === "disponible" && p.disponible) || (filterDisp === "no_disponible" && !p.disponible)) &&
           (!search.trim() || p.nombre.toLowerCase().includes(search.toLowerCase()))
  }

  const productosDeDeliveryFilters = (p: Producto) => {
    const tipo = p.categoria?.tipo_menu
    return tipo === "delivery" && 
           (filterDisp === "todos" || (filterDisp === "disponible" && p.disponible) || (filterDisp === "no_disponible" && !p.disponible)) &&
           (!search.trim() || p.nombre.toLowerCase().includes(search.toLowerCase()))
  }

  const categoriasDelivery = categorias.filter(c => c.tipo_menu === "delivery")
  const categoriasCarta = categorias.filter(c => c.tipo_menu === "desayuno" || c.tipo_menu === "almuerzo_cena")

  // Función de ordenamiento
  const sortProductos = (arr: Producto[]) => {
    const sorted = [...arr]
    switch (sortBy) {
      case "nombre_asc": return sorted.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
      case "nombre_desc": return sorted.sort((a, b) => b.nombre.localeCompare(a.nombre, "es"))
      case "precio_asc": return sorted.sort((a, b) => a.precio - b.precio)
      case "precio_desc": return sorted.sort((a, b) => b.precio - a.precio)
      case "destacados": return sorted.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0))
      default: return sorted.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    }
  }

  // Filtro adicional por categoría y destacado
  const applyExtraFilters = (arr: Producto[]) => arr.filter(p => {
    if (filterCategoria !== "todas" && p.categoria_id !== filterCategoria) return false
    if (filterDestacado === "destacado" && !p.destacado) return false
    if (filterDestacado === "no_destacado" && p.destacado) return false
    return true
  })

  const hasActiveFilters = search || filterDisp !== "todos" || filterTipo !== "todos" || filterCategoria !== "todas" || filterDestacado !== "todos" || sortBy !== "orden"

  const productosCarta = sortProductos(applyExtraFilters(productos.filter(productosDeCartaFilters)))
  const productosDelivery = sortProductos(applyExtraFilters(productos.filter(productosDeDeliveryFilters)))

  const clearFiltros = () => {
    setSearch("")
    setFilterDisp("todos")
    setFilterTipo("todos")
    setFilterCategoria("todas")
    setFilterDestacado("todos")
    setSortBy("orden")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground hidden lg:block sticky top-0 z-30 border-b border-primary-foreground/10">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/10 rounded-xl">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-xl">Productos</h1>
              <p className="text-xs text-primary-foreground/60">Gestioná Carta y Delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} disabled={isLoading} className="flex items-center gap-2 px-3 py-2 bg-primary-foreground/10 rounded-xl text-sm hover:bg-primary-foreground/20 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
            <button onClick={() => { setEditingProducto(null); setModalOpen(true) }} className="flex items-center gap-2 px-4 py-2 bg-primary-foreground text-primary rounded-xl text-sm font-semibold hover:bg-primary-foreground/90 transition-colors">
              <Plus className="w-4 h-4" />
              Nuevo producto
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total productos", value: metricas.total, color: "bg-primary/10 text-primary" },
            { label: "Disponibles", value: metricas.disponibles, color: "bg-emerald-100 text-emerald-700" },
            { label: "No disponibles", value: metricas.no_disponibles, color: "bg-red-100 text-red-600" },
            { label: "Destacados", value: metricas.destacados, color: "bg-amber-100 text-amber-700" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-card rounded-2xl border border-border/40 p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${color}`}>
                {value}
              </div>
              <p className="text-sm text-foreground/70 font-medium leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-card rounded-2xl border border-border/40 p-4 space-y-3">
          {/* Barra principal */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre..."
                className="w-full pl-9 pr-4 py-2.5 bg-background border border-border/40 rounded-xl text-sm text-foreground placeholder:text-foreground/40 outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFiltros((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFiltros || hasActiveFilters ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border/40 text-foreground/60 hover:border-primary/40"}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {hasActiveFilters && (
                <span className="w-5 h-5 rounded-full bg-primary-foreground/20 text-xs flex items-center justify-center font-bold">
                  {[search, filterDisp !== "todos", filterTipo !== "todos", filterCategoria !== "todas", filterDestacado !== "todos", sortBy !== "orden"].filter(Boolean).length}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button onClick={clearFiltros} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border/40 text-sm text-foreground/50 hover:text-red-600 hover:border-red-200 transition-colors">
                <X className="w-3.5 h-3.5" />
                Limpiar
              </button>
            )}
            <button onClick={() => { setEditingProducto(null); setModalOpen(true) }} className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">
              <Plus className="w-4 h-4" />
              Nuevo
            </button>
          </div>

          {/* Panel expandible */}
          {showFiltros && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-border/30">
              {/* Tipo */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">Tipo</label>
                <select
                  value={filterTipo}
                  onChange={(e) => { setFilterTipo(e.target.value as any); setFilterCategoria("todas") }}
                  className="w-full px-3 py-2.5 bg-background border border-border/40 rounded-xl text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="todos">Todos</option>
                  <option value="carta">Carta</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>

              {/* Categoría */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">Categoría</label>
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="w-full px-3 py-2.5 bg-background border border-border/40 rounded-xl text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="todas">Todas</option>
                  {filterTipo !== "delivery" && categoriasCarta.length > 0 && (
                    <optgroup label="Carta">
                      {categoriasCarta.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </optgroup>
                  )}
                  {filterTipo !== "carta" && categoriasDelivery.length > 0 && (
                    <optgroup label="Delivery">
                      {categoriasDelivery.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Disponibilidad */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">Disponibilidad</label>
                <select
                  value={filterDisp}
                  onChange={(e) => setFilterDisp(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-background border border-border/40 rounded-xl text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="todos">Todos</option>
                  <option value="disponible">Disponibles</option>
                  <option value="no_disponible">No disponibles</option>
                </select>
              </div>

              {/* Destacado */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">Destacado</label>
                <select
                  value={filterDestacado}
                  onChange={(e) => setFilterDestacado(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-background border border-border/40 rounded-xl text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="todos">Todos</option>
                  <option value="destacado">Solo destacados</option>
                  <option value="no_destacado">Sin destacar</option>
                </select>
              </div>

              {/* Ordenar */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3" />
                  Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-background border border-border/40 rounded-xl text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="orden">Orden por defecto</option>
                  <option value="nombre_asc">Nombre A → Z</option>
                  <option value="nombre_desc">Nombre Z → A</option>
                  <option value="precio_asc">Precio menor → mayor</option>
                  <option value="precio_desc">Precio mayor → menor</option>
                  <option value="destacados">Destacados primero</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="bg-card rounded-2xl border border-border/40 p-16 flex items-center justify-center gap-3 text-foreground/40">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando productos…</span>
          </div>
        ) : (
          <>
            {/* SECCIÓN: PRODUCTOS DE CARTA */}
            {(filterTipo === "todos" || filterTipo === "carta") && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UtensilsCrossed className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-foreground">Productos de Carta</h2>
                  <p className="text-xs text-foreground/50">Desayunos, Almuerzos y Cenas</p>
                </div>
                <div className="ml-auto text-sm font-medium text-primary">{productosCarta.length} productos</div>
              </div>

              {productosCarta.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border/40 p-12 text-center">
                  <UtensilsCrossed className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
                  <p className="text-foreground/50 font-medium">No hay productos de carta</p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden lg:block bg-card rounded-2xl border border-border/40 overflow-hidden">
                    <ProductosTable
                      productos={productosCarta}
                      deletingId={deletingId}
                      togglingId={togglingId}
                      reorderingId={reorderingId}
                      onEdit={(p) => { setEditingProducto(p); setModalOpen(true) }}
                      onDelete={handleDelete}
                      onToggle={handleToggle}
                      onReorder={(id, dir) => handleReorder(productosCarta, id, dir)}
                    />
                  </div>

                  {/* Mobile cards */}
                  <div className="lg:hidden space-y-3">
                    {productosCarta.map((p, idx) => (
                      <ProductoCard
                        key={p.id}
                        producto={p}
                        deletingId={deletingId}
                        togglingId={togglingId}
                        reorderingId={reorderingId}
                        isFirst={idx === 0}
                        isLast={idx === productosCarta.length - 1}
                        onEdit={() => { setEditingProducto(p); setModalOpen(true) }}
                        onDelete={() => handleDelete(p.id, p.nombre)}
                        onToggle={() => handleToggle(p.id, p.disponible)}
                        onReorder={(dir) => handleReorder(productosCarta, p.id, dir)}
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
            )}

            {/* SECCIÓN: PRODUCTOS DE DELIVERY */}
            {(filterTipo === "todos" || filterTipo === "delivery") && (
            <section className="space-y-4 pt-6 border-t border-border/30">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Package className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-foreground">Productos de Delivery</h2>
                  <p className="text-xs text-foreground/50">Solo para entregas a domicilio</p>
                </div>
                <div className="ml-auto text-sm font-medium text-accent">{productosDelivery.length} productos</div>
              </div>

              {productosDelivery.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border/40 p-12 text-center">
                  <Package className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
                  <p className="text-foreground/50 font-medium">No hay productos de delivery</p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden lg:block bg-card rounded-2xl border border-border/40 overflow-hidden">
                    <ProductosTable
                      productos={productosDelivery}
                      deletingId={deletingId}
                      togglingId={togglingId}
                      reorderingId={reorderingId}
                      onEdit={(p) => { setEditingProducto(p); setModalOpen(true) }}
                      onDelete={handleDelete}
                      onToggle={handleToggle}
                      onReorder={(id, dir) => handleReorder(productosDelivery, id, dir)}
                    />
                  </div>

                  {/* Mobile cards */}
                  <div className="lg:hidden space-y-3">
                    {productosDelivery.map((p, idx) => (
                      <ProductoCard
                        key={p.id}
                        producto={p}
                        deletingId={deletingId}
                        togglingId={togglingId}
                        reorderingId={reorderingId}
                        isFirst={idx === 0}
                        isLast={idx === productosDelivery.length - 1}
                        onEdit={() => { setEditingProducto(p); setModalOpen(true) }}
                        onDelete={() => handleDelete(p.id, p.nombre)}
                        onToggle={() => handleToggle(p.id, p.disponible)}
                        onReorder={(dir) => handleReorder(productosDelivery, p.id, dir)}
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
            )}

            {/* Empty state */}
            {productosCarta.length === 0 && productosDelivery.length === 0 && (
              <div className="bg-card rounded-2xl border border-border/40 p-16 text-center">
                <UtensilsCrossed className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
                <p className="text-foreground/50 font-medium">No hay productos</p>
                <p className="text-sm text-foreground/30 mt-1">Agregá el primero con el botón de arriba</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProductoFormModal
          producto={editingProducto}
          categorias={categorias}
          onClose={() => { setModalOpen(false); setEditingProducto(null) }}
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

// Componente tabla reutilizable
function ProductosTable({
  productos,
  deletingId,
  togglingId,
  reorderingId,
  onEdit,
  onDelete,
  onToggle,
  onReorder,
}: {
  productos: Producto[]
  deletingId: string | null
  togglingId: string | null
  reorderingId: string | null
  onEdit: (p: Producto) => void
  onDelete: (id: string, nombre: string) => void
  onToggle: (id: string, current: boolean) => void
  onReorder: (id: string, dir: "up" | "down") => void
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border/30 bg-background/50">
          {["Orden", "Producto", "Categoría", "Precio", "Variantes", "Estado", ""].map((h) => (
            <th key={h} className="text-left px-4 py-3.5 font-semibold text-foreground/60 text-xs uppercase tracking-wide last:text-right">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border/20">
        {productos.map((p, idx) => (
          <tr key={p.id} className="hover:bg-background/60 transition-colors">
            {/* Orden */}
            <td className="px-4 py-3 w-16">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => onReorder(p.id, "up")}
                  disabled={idx === 0 || reorderingId === p.id}
                  className="p-0.5 rounded text-foreground/30 hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Subir"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onReorder(p.id, "down")}
                  disabled={idx === productos.length - 1 || reorderingId === p.id}
                  className="p-0.5 rounded text-foreground/30 hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Bajar"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </td>
            <td className="px-4 py-4">
              <div className="flex items-center gap-3">
                {p.imagen_url ? (
                  <img src={p.imagen_url} alt={p.nombre} className="w-10 h-10 rounded-xl object-cover bg-background shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <UtensilsCrossed className="w-4 h-4 text-primary/50" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-foreground">{p.nombre}</span>
                    {p.destacado && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                  </div>
                  {p.descripcion && <p className="text-xs text-foreground/50 mt-0.5 line-clamp-1">{p.descripcion}</p>}
                </div>
              </div>
            </td>
            <td className="px-4 py-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {p.categoria?.nombre ?? "—"}
              </span>
            </td>
            <td className="px-4 py-4 font-medium text-foreground">
              ${p.precio.toLocaleString("es-AR")}
            </td>
            <td className="px-4 py-4 text-foreground/60">
              {p.variantes && p.variantes.length > 0 ? (
                <span className="text-xs bg-background border border-border/40 rounded-lg px-2 py-1">
                  {p.variantes.length} variante{p.variantes.length !== 1 ? "s" : ""}
                </span>
              ) : "—"}
            </td>
            <td className="px-4 py-4">
              <button
                onClick={() => onToggle(p.id, p.disponible)}
                disabled={togglingId === p.id}
                className="flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-40"
              >
                {p.disponible ? (
                  <><ToggleRight className="w-5 h-5 text-emerald-600" /><span className="text-emerald-700">Disponible</span></>
                ) : (
                  <><ToggleLeft className="w-5 h-5 text-foreground/40" /><span className="text-foreground/50">No disponible</span></>
                )}
              </button>
            </td>
            <td className="px-4 py-4">
              <div className="flex items-center justify-end gap-1.5">
                <button onClick={() => onEdit(p)} className="p-1.5 rounded-lg text-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors" title="Editar">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(p.id, p.nombre)} disabled={deletingId === p.id} className="p-1.5 rounded-lg text-foreground/40 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40" title="Eliminar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// Componente card reutilizable para mobile
function ProductoCard({
  producto: p,
  deletingId,
  togglingId,
  reorderingId,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onToggle,
  onReorder,
}: {
  producto: Producto
  deletingId: string | null
  togglingId: string | null
  reorderingId: string | null
  isFirst: boolean
  isLast: boolean
  onEdit: () => void
  onDelete: () => void
  onToggle: () => void
  onReorder: (dir: "up" | "down") => void
}) {
  return (
    <div className="bg-card rounded-2xl border border-border/40 p-4">
      <div className="flex items-start gap-3">
        {p.imagen_url ? (
          <img src={p.imagen_url} alt={p.nombre} className="w-12 h-12 rounded-xl object-cover shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-5 h-5 text-primary/50" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-foreground truncate">{p.nombre}</p>
            {p.destacado && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
          </div>
          <p className="text-sm text-foreground/60">{p.categoria?.nombre}</p>
          <p className="text-sm font-medium text-primary mt-0.5">${p.precio.toLocaleString("es-AR")}</p>
        </div>
        {/* Reorder buttons mobile */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            onClick={() => onReorder("up")}
            disabled={isFirst || reorderingId === p.id}
            className="p-1 rounded text-foreground/30 hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-20"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onReorder("down")}
            disabled={isLast || reorderingId === p.id}
            className="p-1 rounded text-foreground/30 hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-20"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/20">
        <button onClick={onToggle} disabled={togglingId === p.id} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl transition-colors ${p.disponible ? "bg-emerald-50 text-emerald-700" : "bg-background text-foreground/50"}`}>
          {p.disponible ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          {p.disponible ? "Disponible" : "No disponible"}
        </button>
        <button onClick={onEdit} className="p-2 rounded-xl bg-primary/10 text-primary"><Pencil className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-2 rounded-xl bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
      </div>
    </div>
  )
}

