'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DatePickerCalendarProps {
  selectedDate: string // Format: YYYY-MM-DD
  onDateChange: (date: string) => void
}

export function DatePickerCalendar({ selectedDate, onDateChange }: DatePickerCalendarProps) {
  const [displayMonth, setDisplayMonth] = useState(() => {
    const [year, month] = selectedDate.split('-').map(Number)
    return new Date(year, month - 1, 1)
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const currentYear = displayMonth.getFullYear()
  const currentMonth = displayMonth.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay() // 0 = Sunday, 1 = Monday...

  // Create array of days to display
  const days: (number | null)[] = []
  
  // Add empty slots for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const handlePrevMonth = () => {
    setDisplayMonth(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setDisplayMonth(new Date(currentYear, currentMonth + 1, 1))
  }

  const handleSelectDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onDateChange(dateStr)
  }

  const isDateSelected = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return dateStr === selectedDate
  }

  const isToday = (day: number) => {
    const checkDate = new Date(currentYear, currentMonth, day)
    return checkDate.getTime() === today.getTime()
  }

  const monthName = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(displayMonth)

  return (
    <div className="bg-card rounded-2xl border border-border/40 p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-foreground capitalize">{monthName}</h3>
        <div className="flex gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-background rounded-lg transition-colors"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-foreground/60" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-background rounded-lg transition-colors"
            aria-label="Próximo mes"
          >
            <ChevronRight className="w-3.5 h-3.5 text-foreground/60" />
          </button>
        </div>
      </div>

      {/* Weekdays header */}
      <div className="grid grid-cols-7 gap-0.5">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className="h-6 flex items-center justify-center text-xs font-medium text-foreground/50">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-7" />
          }

          const isSelected = isDateSelected(day)
          const isTodayDate = isToday(day)

          return (
            <button
              key={day}
              onClick={() => handleSelectDay(day)}
              className={`h-7 rounded-lg text-xs font-medium transition-all flex items-center justify-center relative ${
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : isTodayDate
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'hover:bg-background text-foreground/70 hover:text-foreground'
              }`}
            >
              {day}
              {isTodayDate && !isSelected && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>

      {/* Info text */}
      <div className="text-xs text-foreground/50 text-center">
        <p className="text-xs">Toca un día para filtrar</p>
      </div>
    </div>
  )
}
