"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DateSelectorProps {
  selected: Date | null
  onSelect: (d: Date) => void
  error?: string
}

const DAYS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

export function DateSelector({ selected, onSelect, error }: DateSelectorProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
  })

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  function prevMonth() {
    const d = new Date(year, month - 1, 1)
    if (d >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setViewDate(d)
    }
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1))
  }

  function isSelected(day: number) {
    if (!selected) return false
    return (
      selected.getFullYear() === year &&
      selected.getMonth() === month &&
      selected.getDate() === day
    )
  }

  function isPast(day: number) {
    const d = new Date(year, month, day)
    return d < today
  }

  function isToday(day: number) {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    )
  }

  const canGoPrev = new Date(year, month - 1, 1) >= new Date(today.getFullYear(), today.getMonth(), 1)

  // Build grid cells: empty slots + days
  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div>
      <div className="bg-card rounded-2xl p-6 border border-primary/10 max-w-sm">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
          <span className="font-[family-name:var(--font-dm-serif)] text-primary text-lg">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-foreground/40 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />
            const past = isPast(day)
            const sel = isSelected(day)
            const tod = isToday(day)
            return (
              <button
                key={day}
                onClick={() => !past && onSelect(new Date(year, month, day))}
                disabled={past}
                className={`
                  mx-auto w-9 h-9 rounded-full text-sm transition-all duration-200 flex items-center justify-center
                  ${sel ? "bg-primary text-primary-foreground font-semibold shadow-md" : ""}
                  ${!sel && tod ? "ring-1 ring-primary text-primary font-semibold" : ""}
                  ${!sel && !past ? "hover:bg-primary/10 text-foreground" : ""}
                  ${past ? "text-foreground/20 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  )
}
