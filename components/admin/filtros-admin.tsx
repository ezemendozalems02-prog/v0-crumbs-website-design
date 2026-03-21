"use client"

import type { EstadoReserva, FiltrosAdmin } from "@/lib/admin-reservas"
import { Search, X, SlidersHorizontal } from "lucide-react"

const HORARIOS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30",
]

const ESTADOS: { value: EstadoReserva | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "cancelada", label: "Cancelada" },
]

interface FiltrosAdminProps {
  filtros: FiltrosAdmin
  onChange: (filtros: FiltrosAdmin) => void
}

export function FiltrosAdmin({ filtros, onChange }: FiltrosAdminProps) {
  const hasActiveFilters =
    filtros.estado !== "todos" || filtros.horario || filtros.nombre || filtros.telefono

  const clear = () =>
    onChange({ fecha: filtros.fecha, estado: "todos", horario: "", nombre: "", telefono: "" })

  return (
    <div className="bg-card rounded-2xl border border-border/40 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground/70">
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
        </div>
        {hasActiveFilters && (
          <button
            onClick={clear}
            className="text-xs text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Fecha */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground/50 uppercase tracking-wide">Fecha</label>
          <input
            type="date"
            value={filtros.fecha ?? ""}
            onChange={(e) => onChange({ ...filtros, fecha: e.target.value })}
            className="w-full px-3 py-2.5 text-sm bg-background border border-border/40 rounded-xl text-foreground outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Estado */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground/50 uppercase tracking-wide">Estado</label>
          <select
            value={filtros.estado ?? "todos"}
            onChange={(e) => onChange({ ...filtros, estado: e.target.value as EstadoReserva | "todos" })}
            className="w-full px-3 py-2.5 text-sm bg-background border border-border/40 rounded-xl text-foreground outline-none focus:border-primary/50 transition-colors"
          >
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>

        {/* Horario */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground/50 uppercase tracking-wide">Horario</label>
          <select
            value={filtros.horario ?? ""}
            onChange={(e) => onChange({ ...filtros, horario: e.target.value })}
            className="w-full px-3 py-2.5 text-sm bg-background border border-border/40 rounded-xl text-foreground outline-none focus:border-primary/50 transition-colors"
          >
            <option value="">Todos los horarios</option>
            {HORARIOS.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        {/* Buscar */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground/50 uppercase tracking-wide">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Nombre o teléfono…"
              value={filtros.nombre ?? ""}
              onChange={(e) => onChange({ ...filtros, nombre: e.target.value, telefono: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-background border border-border/40 rounded-xl text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
