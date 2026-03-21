"use client"

import type { Reserva, EstadoReserva } from "@/lib/admin-reservas"
import { EstadoBadge } from "./estado-badge"
import { CheckCircle2, XCircle, Eye, MessageSquare, Users, Utensils } from "lucide-react"

const MESA_LABEL: Record<string, string> = {
  mesa_2: "Mesa 2 pers.",
  mesa_4: "Mesa 4 pers.",
  mesa_6: "Mesa 6 pers.",
  mesa_8_plus: "Mesa 8+ pers.",
}

interface TablaReservasProps {
  reservas: Reserva[]
  onConfirmar: (id: string) => void
  onCancelar: (id: string) => void
  onDetalle: (reserva: Reserva) => void
  loadingId: string | null
}

export function TablaReservas({ reservas, onConfirmar, onCancelar, onDetalle, loadingId }: TablaReservasProps) {
  if (reservas.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border/40 p-16 text-center">
        <Utensils className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
        <p className="text-foreground/50 font-medium">No hay reservas para estos filtros</p>
        <p className="text-sm text-foreground/30 mt-1">Probá cambiando la fecha o los filtros</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block bg-card rounded-2xl border border-border/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30 bg-background/50">
              <th className="text-left px-5 py-3.5 font-semibold text-foreground/60 text-xs uppercase tracking-wide">Nombre</th>
              <th className="text-left px-4 py-3.5 font-semibold text-foreground/60 text-xs uppercase tracking-wide">Teléfono</th>
              <th className="text-left px-4 py-3.5 font-semibold text-foreground/60 text-xs uppercase tracking-wide">Fecha</th>
              <th className="text-left px-4 py-3.5 font-semibold text-foreground/60 text-xs uppercase tracking-wide">Horario</th>
              <th className="text-left px-4 py-3.5 font-semibold text-foreground/60 text-xs uppercase tracking-wide">Mesa</th>
              <th className="text-center px-4 py-3.5 font-semibold text-foreground/60 text-xs uppercase tracking-wide">Pers.</th>
              <th className="text-left px-4 py-3.5 font-semibold text-foreground/60 text-xs uppercase tracking-wide">Estado</th>
              <th className="text-right px-5 py-3.5 font-semibold text-foreground/60 text-xs uppercase tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {reservas.map((r) => (
              <tr key={r.id} className="hover:bg-background/60 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{r.nombre}</span>
                    {r.requerimiento_especial && (
                      <span title={r.requerimiento_especial}>
                        <MessageSquare className="w-3.5 h-3.5 text-accent" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-foreground/70">{r.telefono}</td>
                <td className="px-4 py-4 text-foreground/70">
                  {new Date(r.fecha_reserva + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                </td>
                <td className="px-4 py-4 font-medium text-foreground/80">{r.horario}</td>
                <td className="px-4 py-4 text-foreground/70">{MESA_LABEL[r.tipo_mesa] ?? r.tipo_mesa}</td>
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center justify-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-lg">
                    <Users className="w-3 h-3" />
                    {r.cantidad_personas}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <EstadoBadge estado={r.estado} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onDetalle(r)}
                      className="p-1.5 rounded-lg text-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {r.estado === "pendiente" && (
                      <button
                        onClick={() => onConfirmar(r.id)}
                        disabled={loadingId === r.id}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-40"
                        title="Confirmar"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {(r.estado === "pendiente" || r.estado === "confirmada") && (
                      <button
                        onClick={() => onCancelar(r.id)}
                        disabled={loadingId === r.id}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                        title="Cancelar"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {reservas.map((r) => (
          <div key={r.id} className="bg-card rounded-2xl border border-border/40 p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-foreground">{r.nombre}</p>
                  {r.requerimiento_especial && (
                    <MessageSquare className="w-3.5 h-3.5 text-accent" />
                  )}
                </div>
                <p className="text-sm text-foreground/60 mt-0.5">{r.telefono}</p>
              </div>
              <EstadoBadge estado={r.estado} />
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="bg-background rounded-xl p-2.5 text-center">
                <p className="text-foreground/50 text-xs">Fecha</p>
                <p className="font-medium text-foreground mt-0.5">
                  {new Date(r.fecha_reserva + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}
                </p>
              </div>
              <div className="bg-background rounded-xl p-2.5 text-center">
                <p className="text-foreground/50 text-xs">Horario</p>
                <p className="font-medium text-foreground mt-0.5">{r.horario}</p>
              </div>
              <div className="bg-background rounded-xl p-2.5 text-center">
                <p className="text-foreground/50 text-xs">Personas</p>
                <p className="font-medium text-foreground mt-0.5">{r.cantidad_personas}</p>
              </div>
            </div>

            <p className="text-xs text-foreground/50">{MESA_LABEL[r.tipo_mesa] ?? r.tipo_mesa}</p>

            {r.requerimiento_especial && (
              <div className="bg-accent/8 border border-accent/20 rounded-xl px-3 py-2">
                <p className="text-xs text-accent font-medium">Requerimiento especial</p>
                <p className="text-sm text-foreground/80 mt-0.5">{r.requerimiento_especial}</p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1 border-t border-border/20">
              <button
                onClick={() => onDetalle(r)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-foreground/60 hover:text-primary bg-background rounded-xl transition-colors"
              >
                <Eye className="w-4 h-4" />
                Detalle
              </button>
              {r.estado === "pendiente" && (
                <button
                  onClick={() => onConfirmar(r.id)}
                  disabled={loadingId === r.id}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors disabled:opacity-40"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmar
                </button>
              )}
              {(r.estado === "pendiente" || r.estado === "confirmada") && (
                <button
                  onClick={() => onCancelar(r.id)}
                  disabled={loadingId === r.id}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-40"
                >
                  <XCircle className="w-4 h-4" />
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
