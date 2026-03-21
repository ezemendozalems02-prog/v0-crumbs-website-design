"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
import {
  getReservasAdmin,
  getMetricasAdmin,
  getDisponibilidadAdmin,
  actualizarEstadoReserva,
  getProximasReservas,
  getReservasPendientes,
  type Reserva,
  type FiltrosAdmin,
  type MetricasAdmin,
  type DisponibilidadAdmin,
} from "@/lib/admin-reservas"
import { MetricasCards } from "@/components/admin/metricas-cards"
import { DisponibilidadCard } from "@/components/admin/disponibilidad-card"
import { FiltrosAdmin as FiltrosPanel } from "@/components/admin/filtros-admin"
import { TablaReservas } from "@/components/admin/tabla-reservas"
import { DetalleModal } from "@/components/admin/detalle-modal"
import { ReservasQuickList } from "@/components/admin/reservas-quick-list"
import { RefreshCw, LayoutDashboard } from "lucide-react"

const today = () => new Date().toISOString().split("T")[0]

type Toast = { id: number; message: string; type: "success" | "error" }

export default function AdminReservasPage() {
  const [filtros, setFiltros] = useState<FiltrosAdmin>({ fecha: today(), estado: "todos" })
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [metricas, setMetricas] = useState<MetricasAdmin>({
    total: 0, pendientes: 0, confirmadas: 0, canceladas: 0, cubiertos_ocupados: 0, cubiertos_disponibles: 100,
  })
  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadAdmin>({
    cubiertos_usados: 0, cubiertos_disponibles: 100, porcentaje_ocupacion: 0, fecha: today(),
  })
  const [proximas, setProximas] = useState<Reserva[]>([])
  const [pendientes, setPendientes] = useState<Reserva[]>([])
  const [detalle, setDetalle] = useState<Reserva | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [isLoading, startTransition] = useTransition()
  const [toasts, setToasts] = useState<Toast[]>([])
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const loadData = useCallback(() => {
    startTransition(async () => {
      const [r, m, d, pr, pe] = await Promise.all([
        getReservasAdmin(filtros),
        getMetricasAdmin(filtros.fecha ?? today()),
        getDisponibilidadAdmin(filtros.fecha ?? today()),
        getProximasReservas(5),
        getReservasPendientes(),
      ])
      setReservas(r)
      setMetricas(m)
      setDisponibilidad(d)
      setProximas(pr)
      setPendientes(pe)
      setLastRefresh(new Date())
    })
  }, [filtros])

  useEffect(() => { loadData() }, [loadData])

  const handleConfirmar = async (id: string) => {
    setLoadingId(id)
    const result = await actualizarEstadoReserva(id, "confirmada")
    setLoadingId(null)
    if (result.success) {
      addToast("Reserva confirmada correctamente", "success")
      if (detalle?.id === id) setDetalle((prev) => prev ? { ...prev, estado: "confirmada" } : null)
      loadData()
    } else {
      addToast(result.error ?? "Error al actualizar la reserva", "error")
    }
  }

  const handleCancelar = async (id: string) => {
    setLoadingId(id)
    const result = await actualizarEstadoReserva(id, "cancelada")
    setLoadingId(null)
    if (result.success) {
      addToast("Reserva cancelada correctamente", "success")
      if (detalle?.id === id) setDetalle((prev) => prev ? { ...prev, estado: "cancelada" } : null)
      loadData()
    } else {
      addToast(result.error ?? "Error al actualizar la reserva", "error")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-30 border-b border-primary-foreground/10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/10 rounded-xl">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-serif)] text-xl leading-tight">Panel de Reservas</h1>
              <p className="text-xs text-primary-foreground/60 hidden sm:block">
                Gestioná reservas, disponibilidad y estados en tiempo real
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-primary-foreground/50 hidden md:block">
              Actualizado: {lastRefresh.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-primary-foreground/10 rounded-xl text-sm hover:bg-primary-foreground/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Metricas */}
        <MetricasCards metricas={metricas} fecha={filtros.fecha ?? today()} />

        {/* Main grid: filters + table | sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

          {/* Left: filters + table */}
          <div className="space-y-5 min-w-0">
            <FiltrosPanel filtros={filtros} onChange={setFiltros} />

            {/* Result count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground/60">
                {isLoading ? "Cargando reservas…" : (
                  reservas.length === 0
                    ? "No hay reservas para estos filtros"
                    : `${reservas.length} reserva${reservas.length !== 1 ? "s" : ""}`
                )}
              </p>
            </div>

            {isLoading ? (
              <div className="bg-card rounded-2xl border border-border/40 p-16 flex items-center justify-center gap-3 text-foreground/40">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="text-sm">Cargando reservas…</span>
              </div>
            ) : (
              <TablaReservas
                reservas={reservas}
                onConfirmar={handleConfirmar}
                onCancelar={handleCancelar}
                onDetalle={setDetalle}
                loadingId={loadingId}
              />
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            <DisponibilidadCard disponibilidad={disponibilidad} />
            <ReservasQuickList
              reservas={pendientes.slice(0, 5)}
              titulo="Pendientes de confirmar"
              subtitulo="Actuá rápido antes del servicio"
              onDetalle={setDetalle}
            />
            <ReservasQuickList
              reservas={proximas}
              titulo="Proximas reservas"
              subtitulo="Las siguientes 5 por fecha y horario"
              onDetalle={setDetalle}
            />
          </div>
        </div>
      </main>

      {/* Detail modal */}
      {detalle && (
        <DetalleModal
          reserva={detalle}
          onClose={() => setDetalle(null)}
          onConfirmar={handleConfirmar}
          onCancelar={handleCancelar}
          loadingId={loadingId}
        />
      )}

      {/* Toast notifications */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-lg animate-fade-in-up pointer-events-auto ${
              t.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}
