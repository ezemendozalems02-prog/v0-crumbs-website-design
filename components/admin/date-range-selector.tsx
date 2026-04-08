"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, isAfter, isSameDay, isWithinInterval } from "date-fns"
import { es } from "date-fns/locale"

interface DateRangeSelectorProps {
  startDate: Date | null
  endDate: Date | null
  onRangeChange: (start: Date | null, end: Date | null) => void
}

export function DateRangeSelector({ startDate, endDate, onRangeChange }: DateRangeSelectorProps) {
  const [viewMonth, setViewMonth] = useState(new Date())
  const [isSelecting, setIsSelecting] = useState(false)

  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const handleDayClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Iniciar nueva selección
      onRangeChange(day, null)
      setIsSelecting(true)
    } else if (startDate && !endDate) {
      // Completar rango
      if (isBefore(day, startDate)) {
        onRangeChange(day, startDate)
      } else {
        onRangeChange(startDate, day)
      }
      setIsSelecting(false)
    }
  }

  const handleClear = () => {
    onRangeChange(null, null)
    setIsSelecting(false)
  }

  // Obtener días antes del mes para llenar la grilla
  const firstDayOfWeek = monthStart.getDay()
  const previousMonthEnd = addDays(monthStart, -1)
  const daysFromPreviousMonth = Array.from({ length: firstDayOfWeek }, (_, i) => 
    addDays(previousMonthEnd, i - firstDayOfWeek + 1)
  )

  // Obtener días después del mes
  const lastDayOfWeek = monthEnd.getDay()
  const daysFromNextMonth = Array.from({ length: 6 - lastDayOfWeek }, (_, i) => 
    addDays(monthEnd, i + 1)
  )

  const allDays = [...daysFromPreviousMonth, ...daysInMonth, ...daysFromNextMonth]

  const isInRange = (day: Date) => {
    if (!startDate || !endDate) return false
    return isWithinInterval(day, { start: startDate, end: endDate })
  }

  const isStartDay = (day: Date) => startDate && isSameDay(day, startDate)
  const isEndDay = (day: Date) => endDate && isSameDay(day, endDate)

  return (
    <div className="bg-card rounded-2xl border border-border/40 p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Seleccionar período</h3>
          {(startDate || endDate) && (
            <button
              onClick={handleClear}
              className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Rango seleccionado */}
        {startDate && (
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-medium">
              {format(startDate, "dd MMM", { locale: es })}
            </span>
            {endDate && (
              <>
                <span className="text-foreground/40">→</span>
                <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-medium">
                  {format(endDate, "dd MMM", { locale: es })}
                </span>
              </>
            )}
            {!endDate && <span className="text-foreground/60">selecciona fecha final...</span>}
          </div>
        )}

        {/* Calendario */}
        <div className="bg-background rounded-xl p-4 border border-border/40">
          {/* Navegación mes */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setViewMonth(addDays(viewMonth, -32))}
              className="p-1.5 rounded-lg text-foreground/60 hover:bg-background/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h4 className="font-semibold text-sm">
              {format(viewMonth, "MMMM yyyy", { locale: es })}
            </h4>
            <button
              onClick={() => setViewMonth(addDays(viewMonth, 32))}
              className="p-1.5 rounded-lg text-foreground/60 hover:bg-background/80 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((day) => (
              <div key={day} className="text-xs font-semibold text-foreground/50 text-center py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Días */}
          <div className="grid grid-cols-7 gap-2">
            {allDays.map((day, i) => {
              const isCurrentMonth = day.getMonth() === viewMonth.getMonth()
              const isStart = isStartDay(day)
              const isEnd = isEndDay(day)
              const inRange = isInRange(day)
              const isToday = isSameDay(day, new Date())

              return (
                <button
                  key={i}
                  onClick={() => handleDayClick(day)}
                  className={`
                    aspect-square rounded-lg text-xs font-medium transition-all
                    ${!isCurrentMonth ? "text-foreground/30 bg-transparent" : ""}
                    ${isCurrentMonth && !isStart && !isEnd && !inRange ? "text-foreground hover:bg-background/60" : ""}
                    ${inRange && !isStart && !isEnd ? "bg-primary/20 text-primary" : ""}
                    ${(isStart || isEnd) ? "bg-primary text-primary-foreground" : ""}
                    ${isToday && !isStart && !isEnd ? "border border-primary" : ""}
                  `}
                >
                  {format(day, "d")}
                </button>
              )
            })}
          </div>

          {/* Info */}
          <div className="mt-4 text-xs text-foreground/60">
            {startDate && endDate ? (
              <p>
                {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} noche{Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) !== 1 ? "s" : ""}
              </p>
            ) : startDate ? (
              <p>Toca la fecha final para completar el rango</p>
            ) : (
              <p>Toca un día para comenzar</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
