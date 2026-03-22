"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  getReservasAdmin,
  getMetricasAdmin,
  getDisponibilidadAdmin,
  eliminarReserva,
  getUltimasReservas,
  type Reserva,
  type FiltrosAdmin,
  type MetricasAdmin,
  type DisponibilidadAdmin,
} from "@/lib/admin-reservas"
import { MetricasCards } from "@/components/admin/metricas-cards"
import { DisponibilidadCard } from "@/components/admin/disponibilidad-card"
import { RefreshCw, Trash2, Search, X } from "lucide-react"
import { AdminLogoutButton } from "@/components/admin/logout-button"

const today = () => new Date().toISOString().split("T")[0]

type Toast = { id: number; message: string; type: "success" | "error" }

export default function AdminReservasPage() {
  // Filtros
  const [fecha, setFecha] = useState(today())
  const [busqueda, setBusqueda] = useState("")
  const [horarioFiltro, setHorarioFiltro] = useState("")

  // Datos
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [ultimasReservas, setUltimasReservas] = useState<Reserva[]>([])
  const [metricas, setMetricas] = useState<MetricasAdmin>({
    total: 0,
    cubiertos_ocupados: 0,
    cubiertos_disponibles: 100,
  })
  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadAdmin>({
    cubiertos_usados: 0,
    cubiertos_disponibles: 100,
    porcentaje_ocupacion: 0,
    fecha: today(),
  })

  // UI
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [detalleId, setDetalleId] = useState<string | null>(null)

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const loadData = useCallback(async () => {
    setIsRefreshing(true)
    try {
      // Construir filtros dinámicos
      const filtros: FiltrosAdmin = { fecha }
      if (horarioFiltro) filtros.horario = horarioFiltro

      // Si hay búsqueda, intenta primero por nombre, si no encuentra por teléfono
      if (busqueda) {
        const esNumero = /^\d+$/.test(busqueda)
        if (esNumero) {
          filtros.telefono = busqueda
        } else {
          filtros.nombre = busqueda
        }
      }

      const [r, m, d, u] = await Promise.all([
        getReservasAdmin(filtros),
        getMetricasAdmin(fecha),
        getDisponibilidadAdmin(fecha),
        getUltimasReservas(5),
      ])

      setReservas(r)
      setMetricas(m)
      setDisponibilidad(d)
      setUltimasReservas(u)
    } catch (error) {
      console.error("Error loading data:", error)
      addToast("Error al cargar datos", "error")
    } finally {
      setIsRefreshing(false)
    }
  }, [fecha, horarioFiltro, busqueda])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminar esta reserva?")) return

    setLoadingId(id)
    const result = await eliminarReserva(id)

    if (result.success) {
      addToast("Reserva eliminada", "success")
      setDetalleId(null)
      await loadData()
    } else {
      addToast(result.error ?? "Error al eliminar", "error")
    }

    setLoadingId(null)
  }

  const detalle = reservas.find((r) => r.id === detalleId) || null

  // Agrupar por horario
  const gruposHorario = useMemo(() => {
    const grupos: Record<string, Reserva[]> = {}
    reservas.forEach((r) => {
      if (!grupos[r.horario]) grupos[r.horario] = []
      grupos[r.horario].push(r)
    })
    return grupos
  }, [reservas])

  // Obtener horarios únicos para el select
  const horariosUnicos = useMemo(() => {
    const horarios = new Set(ultimasReservas.map((r) => r.horario))
    return Array.from(horarios).sort()
  }, [ultimasReservas])

  // Formatear fecha para mostrar
  const fechaFormato = new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              🍽️
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Panel de Reservas</h1>
              <p className="text-xs text-foreground/60">Gestiona todas tus reservas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-xl text-sm hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Métricas */}
        <MetricasCards metricas={metricas} />

        {/* Filtros */}
        <div className="mt-6 bg-card rounded-2xl border border-border/40 p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Fecha */}
            <div>
              <label className="text-xs font-medium text-foreground/60 block mb-2">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg text-sm focus:outline-none focus:border-primary/60"
              />
            </div>

            {/* Horario */}
            <div>
              <label className="text-xs font-medium text-foreground/60 block mb-2">Horario</label>
              <select
                value={horarioFiltro}
                onChange={(e) => setHorarioFiltro(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg text-sm focus:outline-none focus:border-primary/60"
              >
                <option value="">Todos los horarios</option>
                {horariosUnicos.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Buscador */}
            <div className="md:col-span-2 lg:col-span-2">
              <label className="text-xs font-medium text-foreground/60 block mb-2">Buscar (nombre o teléfono)</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Juan, 1131101739..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-background border border-border/40 rounded-lg text-sm focus:outline-none focus:border-primary/60"
                />
                {busqueda && (
                  <button
                    onClick={() => setBusqueda("")}
                    className="absolute right-3 top-3 text-foreground/40 hover:text-foreground/60"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Listado principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Disponibilidad */}
            <DisponibilidadCard disponibilidad={disponibilidad} />

            {/* Reservas filtradas */}
            <div className="bg-card rounded-2xl border border-border/40 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Reservas del {fechaFormato}
                {busqueda && <span className="text-sm font-normal text-foreground/60"> • "{busqueda}"</span>}
                {horarioFiltro && <span className="text-sm font-normal text-foreground/60"> • {horarioFiltro}</span>}
              </h2>

              {reservas.length === 0 ? (
                <div className="text-center py-8 text-foreground/40">
                  <p>No hay reservas que coincidan con los filtros</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(gruposHorario).map(([horario, grupo]) => (
                    <div key={horario} className="border-t border-border/20 pt-4 first:border-t-0 first:pt-0">
                      <div className="text-sm font-medium text-foreground/60 mb-3">{horario}</div>
                      <div className="space-y-2">
                        {grupo.map((r) => (
                          <div
                            key={r.id}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${
                              detalleId === r.id
                                ? "bg-primary/10 border-primary/40"
                                : "bg-background border-border/40 hover:border-border/60"
                            }`}
                            onClick={() => setDetalleId(r.id)}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-foreground">{r.nombre}</div>
                                <div className="text-xs text-foreground/60 mt-1 flex gap-3 flex-wrap">
                                  <span>{r.cantidad_personas} personas</span>
                                  <span>{r.tipo_mesa}</span>
                                  {r.requerimiento_especial && <span>⭐ {r.requerimiento_especial}</span>}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEliminar(r.id)
                                }}
                                disabled={loadingId === r.id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                                title="Eliminar reserva"
                              >
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
          </div>

          {/* Sidebar derecho */}
          <div className="space-y-6">
            {/* Detalles */}
            {detalle && (
              <div className="bg-card rounded-2xl border border-border/40 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Detalles</h3>
                  <button
                    onClick={() => handleEliminar(detalle.id)}
                    disabled={loadingId === detalle.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Eliminar reserva"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-foreground/60">Nombre</div>
                    <div className="font-medium text-foreground">{detalle.nombre}</div>
                  </div>
                  <div>
                    <div className="text-foreground/60">Teléfono</div>
                    <div className="font-medium text-foreground">{detalle.telefono}</div>
                  </div>
                  <div>
                    <div className="text-foreground/60">Hora</div>
                    <div className="font-medium text-foreground">{detalle.horario}</div>
                  </div>
                  <div>
                    <div className="text-foreground/60">Personas</div>
                    <div className="font-medium text-foreground">{detalle.cantidad_personas}</div>
                  </div>
                  <div>
                    <div className="text-foreground/60">Mesa</div>
                    <div className="font-medium text-foreground">{detalle.tipo_mesa}</div>
                  </div>
                  {detalle.requerimiento_especial && (
                    <div>
                      <div className="text-foreground/60">Requerimiento</div>
                      <div className="font-medium text-foreground">{detalle.requerimiento_especial}</div>
                    </div>
                  )}
                  {detalle.tolerancia_aceptada && (
                    <div className="pt-2 border-t border-border/20">
                      <div className="text-xs text-emerald-600 font-medium">✓ Tolerancia aceptada</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Últimas reservas */}
            <div className="bg-card rounded-2xl border border-border/40 p-6">
              <h3 className="font-semibold text-foreground mb-4">Últimas reservas</h3>
              {ultimasReservas.length === 0 ? (
                <p className="text-sm text-foreground/40">No hay reservas aún</p>
              ) : (
                <div className="space-y-3">
                  {ultimasReservas.map((r) => {
                    const fechaRes = new Date(r.fecha_reserva + "T12:00:00").toLocaleDateString("es-AR", {
                      month: "short",
                      day: "numeric",
                    })
                    return (
                      <div
                        key={r.id}
                        className="p-3 bg-background border border-border/20 rounded-lg cursor-pointer hover:border-border/40 transition-colors"
                        onClick={() => {
                          setFecha(r.fecha_reserva)
                          setDetalleId(r.id)
                        }}
                      >
                        <div className="font-medium text-foreground text-sm">{r.nombre}</div>
                        <div className="text-xs text-foreground/60 mt-1 flex justify-between">
                          <span>
                            {fechaRes} • {r.horario}
                          </span>
                          <span>{r.cantidad_personas} pers.</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Toast notifications */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-lg animate-fade-in-up pointer-events-auto ${
              t.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}
