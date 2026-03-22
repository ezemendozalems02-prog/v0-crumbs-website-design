"use client"

import type { MetricasAdmin } from "@/lib/admin-reservas"
import { Users, Utensils } from "lucide-react"

interface MetricasCardProps {
  metricas: MetricasAdmin
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div className={`bg-card rounded-2xl p-5 border border-border/40 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/60 font-medium">{label}</p>
        <div className={`p-2 rounded-xl ${color}`}>{icon}</div>
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
        {sub && <p className="text-xs text-foreground/50 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export function MetricasCards({ metricas }: MetricasCardProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard
        icon={<Users className="w-4 h-4 text-primary" />}
        label="Total reservas"
        value={metricas.total}
        color="bg-primary/10"
      />
      <MetricCard
        icon={<Utensils className="w-4 h-4 text-accent" />}
        label="Cubiertos ocupados"
        value={metricas.cubiertos_ocupados}
        sub="de 100"
        color="bg-accent/10"
      />
      <MetricCard
        icon={<Utensils className="w-4 h-4 text-emerald-600" />}
        label="Cubiertos disponibles"
        value={metricas.cubiertos_disponibles}
        sub={metricas.cubiertos_disponibles < 20 ? "⚠️ Poca disponibilidad" : undefined}
        color={metricas.cubiertos_disponibles < 20 ? "bg-red-50" : "bg-emerald-50"}
      />
    </div>
  )
}
