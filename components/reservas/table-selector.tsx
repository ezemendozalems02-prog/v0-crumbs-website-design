"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import type { TableOption } from "@/components/reservas/reservas-client"

interface TableSelectorProps {
  options: TableOption[]
  selected: TableOption | null
  onSelect: (t: TableOption) => void
  error?: string
}

export function TableSelector({ options, selected, onSelect, error }: TableSelectorProps) {
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map((opt) => {
          const isActive = selected?.id === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt)}
              className={`group relative rounded-2xl overflow-hidden text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActive
                  ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                  : "ring-1 ring-primary/10 hover:ring-primary/40 hover:shadow-md hover:scale-[1.01]"
              }`}
            >
              {/* Image */}
              <div className={`relative aspect-[4/3] overflow-hidden flex items-center justify-center transition-colors duration-300 ${
                isActive ? "bg-primary/10" : "bg-muted/60 group-hover:bg-muted"
              }`}>
                <Image
                  src={opt.image}
                  alt={opt.label}
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Selected check */}
                {isActive && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md animate-scale-in z-10">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className={`p-4 transition-colors duration-300 ${
                isActive ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}>
                <p className={`font-[family-name:var(--font-dm-serif)] text-base leading-tight mb-1 ${
                  isActive ? "text-primary-foreground" : "text-primary"
                }`}>
                  {opt.label}
                </p>
                <p className={`text-xs leading-relaxed mb-2 ${
                  isActive ? "text-primary-foreground/70" : "text-foreground/60"
                }`}>
                  {opt.description}
                </p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-primary/10 text-primary"
                }`}>
                  {opt.capacity}
                </span>
              </div>
            </button>
          )
        })}
      </div>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  )
}
