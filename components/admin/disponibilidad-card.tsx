"use client"

import type { DisponibilidadAdmin } from "@/lib/admin-reservas"
import { Utensils, AlertTriangle } from "lucide-react"

interface DisponibilidadCardProps {
  disponibilidad: DisponibilidadAdmin
}

export function DisponibilidadCard({ disponibilidad }: DisponibilidadCardProps) {
  const { cubiertos_usados, cubiertos_disponibles, porcentaje_ocupacion, fecha } = disponibilidad
  const pocaDisponibilidad = cubiertos_disponibles < 20
  const barWidth = Math.min(100, Math.max(0, Number(porcentaje_ocupacion)))

  const fechaLabel = new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="bg-primary text-primary-foreground rounded-2xl p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-primary-foreground/60 text-sm font-medium">Disponibilidad</p>
          <h3 className="font-[family-name:var(--font-serif)] text-xl mt-0.5">{fechaLabel}</h3>
        </div>
        <div className="p-2.5 bg-primary-foreground/10 rounded-xl">
          <Utensils className="w-5 h-5 text-primary-foreground/70" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-primary-foreground/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold">100</p>
          <p className="text-xs text-primary-foreground/60 mt-0.5">Totales</p>
        </div>
        <div className="bg-primary-foreground/10 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold">{cubiertos_usados}</p>
          <p className="text-xs text-primary-foreground/60 mt-0.5">Ocupados</p>
        </div>
        <div className={`rounded-xl p-3 text-center ${pocaDisponibilidad ? "bg-red-400/30" : "bg-primary-foreground/10"}`}>
          <p className="text-2xl font-bold">{cubiertos_disponibles}</p>
          <p className="text-xs text-primary-foreground/60 mt-0.5">Libres</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-primary-foreground/70">Ocupación</span>
          <span className="font-semibold">{barWidth}%</span>
        </div>
        <div className="h-2.5 bg-primary-foreground/20 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              barWidth >= 80 ? "bg-red-400" : barWidth >= 60 ? "bg-amber-400" : "bg-emerald-400"
            }`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      {/* Alert */}
      {pocaDisponibilidad && (
        <div className="flex items-center gap-2.5 bg-red-400/20 border border-red-400/30 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-red-300 shrink-0" />
          <p className="text-sm text-red-200">Poca disponibilidad para esta fecha</p>
        </div>
      )}
    </div>
  )
}
