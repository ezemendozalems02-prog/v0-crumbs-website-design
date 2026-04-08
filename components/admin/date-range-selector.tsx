"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DateRangeSelectorProps {
  startDate: Date | null
  endDate: Date | null
  onRangeChange: (start: Date | null, end: Date | null) => void
}

export function DateRangeSelector({ startDate, endDate, onRangeChange }: DateRangeSelectorProps) {
  const [viewMonth, setViewMonth] = useState(new Date())

  const monthStart = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1)
  const monthEnd = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0)
  
  const getDaysInMonth = (date: Date) => {
    const days = []
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d))
    }
    return days
  }

  const handleDayClick = (day: Date) => {
    const clickedDate = new Date(day)
    
    if (!startDate || (startDate && endDate)) {
      // Iniciar nueva selección
      onRangeChange(clickedDate, null)
    } else if (startDate && !endDate) {
      // Completar rango
      if (clickedDate < startDate) {
        onRangeChange(clickedDate, startDate)
      } else {
        onRangeChange(startDate, clickedDate)
      }
    }
  }

  const handleClear = () => {
    onRangeChange(null, null)
  }

  const handlePrevMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1))
  }

  const daysInMonth = getDaysInMonth(viewMonth)
  const firstDayOfWeek = monthStart.getDay()
  
  // Obtener días del mes anterior para llenar
  const prevMonthEnd = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 0)
  const daysFromPrevMonth = []
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    daysFromPrevMonth.unshift(new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), prevMonthEnd.getDate() - i))
  }

  // Obtener días del mes siguiente
  const lastDayOfWeek = monthEnd.getDay()
  const daysFromNextMonth = []
  for (let i = 1; i < 7 - lastDayOfWeek; i++) {
    daysFromNextMonth.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, i))
  }

  const allDays = [...daysFromPrevMonth, ...daysInMonth, ...daysFromNextMonth]

  const isInRange = (day: Date): boolean => {
    if (!startDate || !endDate) return false
    return day >= startDate && day <= endDate
  }

  const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate()
  }

  const isStartDay = (day: Date): boolean => startDate ? isSameDay(day, startDate) : false
  const isEndDay = (day: Date): boolean => endDate ? isSameDay(day, endDate) : false

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${day}/${month}`
  }

  const monthName = viewMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })

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
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-medium">
              {formatDate(startDate)}
            </span>
            {endDate && (
              <>
                <span className="text-foreground/40">→</span>
                <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-medium">
                  {formatDate(endDate)}
                </span>
              </>
            )}
            {!endDate && <span className="text-foreground/60 text-xs">selecciona fecha final...</span>}
          </div>
        )}

        {/* Calendario */}
        <div className="bg-background rounded-xl p-4 border border-border/40">
          {/* Navegación mes */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-foreground/60 hover:bg-background/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h4 className="font-semibold text-sm capitalize">{monthName}</h4>
            <button
              onClick={handleNextMonth}
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
                    ${!isCurrentMonth ? "text-foreground/30 bg-transparent cursor-default" : ""}
                    ${isCurrentMonth && !isStart && !isEnd && !inRange ? "text-foreground hover:bg-background/60 cursor-pointer" : ""}
                    ${inRange && !isStart && !isEnd ? "bg-primary/20 text-primary" : ""}
                    ${(isStart || isEnd) ? "bg-primary text-primary-foreground" : ""}
                    ${isToday && !isStart && !isEnd ? "border border-primary" : ""}
                  `}
                >
                  {day.getDate()}
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
