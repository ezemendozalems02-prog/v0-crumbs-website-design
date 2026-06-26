"use client"

import type { ReservationTime } from "@/lib/admin-horarios-types"
import { MEAL_TYPE_OPCIONES } from "@/lib/admin-horarios-types"

interface TimeSelectorProps {
  horarios: ReservationTime[]
  selected: string
  onSelect: (h: string) => void
  error?: string
}

export function TimeSelector({ horarios, selected, onSelect, error }: TimeSelectorProps) {
  return (
    <div>
      <div className="space-y-6">
        {MEAL_TYPE_OPCIONES.map(({ value, label }) => {
          const times = horarios
            .filter((h) => h.meal_type === value)
            .sort((a, b) => a.sort_order - b.sort_order || a.time.localeCompare(b.time))
            .map((h) => h.time)

          if (times.length === 0) return null

          return (
            <TimeGroup
              key={value}
              label={label}
              times={times}
              selected={selected}
              onSelect={onSelect}
            />
          )
        })}
      </div>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  )
}

function TimeGroup({
  label,
  times,
  selected,
  onSelect,
}: {
  label: string
  times: string[]
  selected: string
  onSelect: (h: string) => void
}) {
  return (
    <div>
      <p className="text-xs font-medium text-foreground/40 uppercase tracking-widest mb-3">{label}</p>
      <div className="flex flex-wrap gap-3">
        {times.map((h) => {
          const active = selected === h
          return (
            <button
              key={h}
              onClick={() => onSelect(h)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-card border border-primary/15 text-foreground hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {h}
            </button>
          )
        })}
      </div>
    </div>
  )
}
