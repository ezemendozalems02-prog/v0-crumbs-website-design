"use client"

import type { Reserva } from "@/lib/admin-reservas"
import { EstadoBadge } from "./estado-badge"
import { Calendar, Clock, Users, ChevronRight } from "lucide-react"

interface ReservasQuickListProps {
  reservas: Reserva[]
  titulo: string
  subtitulo?: string
  onDetalle: (r: Reserva) => void
}

export function ReservasQuickList({ reservas, titulo, subtitulo, onDetalle }: ReservasQuickListProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/40 overflow-hidden">
      <div className="px-5 py-4 border-b border-border/20">
        <h3 className="font-semibold text-foreground">{titulo}</h3>
        {subtitulo && <p className="text-xs text-foreground/50 mt-0.5">{subtitulo}</p>}
      </div>

      {reservas.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-foreground/40">Sin reservas</div>
      ) : (
        <div className="divide-y divide-border/20">
          {reservas.map((r) => (
            <button
              key={r.id}
              onClick={() => onDetalle(r)}
              className="w-full px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-background/60 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground truncate">{r.nombre}</span>
                  <EstadoBadge estado={r.estado} />
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-foreground/50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(r.fecha_reserva + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {r.horario}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {r.cantidad_personas}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-foreground/30 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
