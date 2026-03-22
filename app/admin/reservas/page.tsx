"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  getReservasAdmin,
  getMetricasAdmin,
  getDisponibilidadAdmin,
  eliminarReserva,
  type Reserva,
  type FiltrosAdmin,
  type MetricasAdmin,
  type DisponibilidadAdmin,
} from "@/lib/admin-reservas"
import { MetricasCards } from "@/components/admin/metricas-cards"
import { DisponibilidadCard } from "@/components/admin/disponibilidad-card"
import { RefreshCw, Trash2, Eye } from "lucide-react"
import { AdminLogoutButton } from "@/components/admin/logout-button"

const today = () => new Date().toISOString().split("T")[0]

type Toast = { id: number; message: string; type: "success" | "error" }

export default function AdminReservasPage() {
  const [fecha, setFecha] = useState(today())
  const [reservas, setReservas] = useState<Reserva[]>([])
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
      const [r, m, d] = await Promise.all([
        getReservasAdmin({ fecha }),
        getMetricasAdmin(fecha),
        getDisponibilidadAdmin(fecha),
      ])

      setReservas(r)
      setMetricas(m)
      setDisponibilidad(d)
    } catch (error) {
      console.error("Error loading data:", error)
      addToast("Error al cargar datos", "error")
    } finally {
      setIsRefreshing(false)
    }
  }, [fecha])

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              🍽️
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Panel de Reservas</h1>
              <p className="text-xs text-foreground/60">Gestiona todas tus reservas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
        {/* Selector de fecha */}
        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium text-foreground/60">Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="px-4 py-2 bg-background border border-border/40 rounded-xl text-sm"
          />
        </div>

        {/* Métricas */}
        <MetricasCards metricas={metricas} />

        {/* Disponibilidad */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Listado de reservas */}
            <div className="bg-card rounded-2xl border border-border/40 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Reservas del {fecha}</h2>

              {reservas.length === 0 ? (
                <p className="text-center text-foreground/40 py-8">No hay reservas para este día</p>
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
                                <div className="text-xs text-foreground/60 mt-1 flex gap-3">
                                  <span>{r.cantidad_personas} personas</span>
                                  <span>{r.tipo_mesa}</span>
                                  {r.requerimiento_especial && <span>⭐ {r.requerimiento_especial}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEliminar(r.id)
                                  }}
                                  disabled={loadingId === r.id}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Eliminar reserva"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
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
            <DisponibilidadCard disponibilidad={disponibilidad} />

            {/* Detalle */}
            {detalle && (
              <div className="bg-card rounded-2xl border border-border/40 p-6">
                <h3 className="font-semibold text-foreground mb-4">Detalles</h3>
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
                </div>
              </div>
            )}
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
