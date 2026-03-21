"use client"

import type { Reserva } from "@/lib/admin-reservas"
import { EstadoBadge } from "./estado-badge"
import { X, Phone, Calendar, Clock, Users, Utensils, MessageSquare, CheckCircle2, AlertTriangle } from "lucide-react"

const MESA_LABEL: Record<string, string> = {
  mesa_2: "Mesa para 2 personas",
  mesa_4: "Mesa para 4 personas",
  mesa_6: "Mesa para 6 personas",
  mesa_8_plus: "Mesa para 8 o más personas",
}

interface DetalleModalProps {
  reserva: Reserva
  onClose: () => void
  onConfirmar: (id: string) => void
  onCancelar: (id: string) => void
  loadingId: string | null
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/20 last:border-0">
      <div className="mt-0.5 text-foreground/40 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-foreground/50 font-medium uppercase tracking-wide">{label}</p>
        <div className="text-foreground font-medium mt-0.5">{value}</div>
      </div>
    </div>
  )
}

export function DetalleModal({ reserva, onClose, onConfirmar, onCancelar, loadingId }: DetalleModalProps) {
  const isLoading = loadingId === reserva.id

  const fechaReserva = new Date(reserva.fecha_reserva + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  const fechaCreacion = new Date(reserva.created_at).toLocaleDateString("es-AR", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  })

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-md bg-card rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/20">
          <div>
            <h2 className="font-[family-name:var(--font-serif)] text-xl text-foreground">
              {reserva.nombre}
            </h2>
            <div className="mt-1">
              <EstadoBadge estado={reserva.estado} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-foreground/40 hover:text-foreground hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <Row icon={<Phone className="w-4 h-4" />} label="Teléfono" value={reserva.telefono} />
          <Row
            icon={<Calendar className="w-4 h-4" />}
            label="Fecha"
            value={<span className="capitalize">{fechaReserva}</span>}
          />
          <Row icon={<Clock className="w-4 h-4" />} label="Horario" value={reserva.horario} />
          <Row icon={<Utensils className="w-4 h-4" />} label="Tipo de mesa" value={MESA_LABEL[reserva.tipo_mesa] ?? reserva.tipo_mesa} />
          <Row
            icon={<Users className="w-4 h-4" />}
            label="Cantidad de personas"
            value={`${reserva.cantidad_personas} persona${reserva.cantidad_personas > 1 ? "s" : ""}`}
          />
          <Row
            icon={<CheckCircle2 className="w-4 h-4" />}
            label="Tolerancia aceptada"
            value={reserva.tolerancia_aceptada ? "Sí, acepta 15 min de tolerancia" : "No indicó tolerancia"}
          />
          {reserva.requerimiento_especial && (
            <div className="mt-3 bg-accent/8 border border-accent/20 rounded-xl p-4 flex gap-3">
              <MessageSquare className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-accent font-semibold uppercase tracking-wide">Requerimiento especial</p>
                <p className="text-sm text-foreground mt-1">{reserva.requerimiento_especial}</p>
              </div>
            </div>
          )}
          <div className="mt-4 pt-3 border-t border-border/20">
            <p className="text-xs text-foreground/40">Reserva creada el {fechaCreacion}</p>
            <p className="text-xs text-foreground/40 mt-0.5">ID: {reserva.id.slice(0, 8)}…</p>
          </div>
        </div>

        {/* Actions */}
        {(reserva.estado === "pendiente" || reserva.estado === "confirmada") && (
          <div className="px-6 py-4 border-t border-border/20 flex gap-3" style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}>
            {reserva.estado === "pendiente" && (
              <button
                onClick={() => onConfirmar(reserva.id)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirmar
              </button>
            )}
            <button
              onClick={() => onCancelar(reserva.id)}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
