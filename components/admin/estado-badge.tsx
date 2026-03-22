"use client"

import type { EstadoReserva } from "@/lib/admin-reservas"

const CONFIG: Record<EstadoReserva, { label: string; classes: string; dot: string }> = {
  pendiente: {
    label: "Pendiente",
    classes: "bg-amber-100 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  confirmada: {
    label: "Aceptada",
    classes: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  cancelada: {
    label: "Cancelada",
    classes: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-400",
  },
}

export function EstadoBadge({ estado }: { estado: EstadoReserva }) {
  const c = CONFIG[estado]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}
