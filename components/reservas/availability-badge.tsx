"use client"

import { Utensils, AlertTriangle } from "lucide-react"

interface AvailabilityBadgeProps {
  available: number
  total: number
}

export function AvailabilityBadge({ available, total }: AvailabilityBadgeProps) {
  const pct = available / total
  const isLow = pct <= 0.3
  const isEmpty = available <= 0

  if (isEmpty) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-50 border border-red-200 text-red-600">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">Sin cupos disponibles para esta fecha</span>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-full border ${
      isLow
        ? "bg-amber-50 border-amber-200 text-amber-700"
        : "bg-primary/5 border-primary/20 text-primary"
    }`}>
      <Utensils className="w-4 h-4 shrink-0" />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {isLow ? "Quedan " : ""}
          <strong>{available}</strong> cubiertos disponibles para esta fecha
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          isLow ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
        }`}>
          {available} / {total}
        </span>
      </div>
    </div>
  )
}
