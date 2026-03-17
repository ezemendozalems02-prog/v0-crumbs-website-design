"use client"

interface TimeSelectorProps {
  horarios: string[]
  selected: string
  onSelect: (h: string) => void
  error?: string
}

const TURNO_ALMUERZO = ["12:00", "12:30", "13:00", "13:30"]
const TURNO_CENA = ["20:00", "20:30", "21:00", "21:30", "22:00"]

export function TimeSelector({ horarios, selected, onSelect, error }: TimeSelectorProps) {
  return (
    <div>
      <div className="space-y-6">
        <TimeGroup
          label="Almuerzo"
          times={TURNO_ALMUERZO}
          selected={selected}
          onSelect={onSelect}
        />
        <TimeGroup
          label="Cena"
          times={TURNO_CENA}
          selected={selected}
          onSelect={onSelect}
        />
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
