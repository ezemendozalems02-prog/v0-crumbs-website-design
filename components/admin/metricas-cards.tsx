"use client"

import type { MetricasAdmin } from "@/lib/admin-reservas"
import { Calendar, Users, Clock, CheckCircle2, XCircle, Utensils, TrendingDown } from "lucide-react"

interface MetricasCardProps {
  metricas: MetricasAdmin
  fecha: string
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

export function MetricasCards({ metricas, fecha }: MetricasCardProps) {
  const fechaLabel = new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground/50 font-medium capitalize">{fechaLabel}</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricCard
          icon={<Calendar className="w-4 h-4 text-primary" />}
          label="Reservas hoy"
          value={metricas.total}
          color="bg-primary/10"
        />
        <MetricCard
          icon={<Clock className="w-4 h-4 text-amber-600" />}
          label="Pendientes"
          value={metricas.pendientes}
          color="bg-amber-50"
        />
        <MetricCard
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          label="Confirmadas"
          value={metricas.confirmadas}
          color="bg-emerald-50"
        />
        <MetricCard
          icon={<XCircle className="w-4 h-4 text-red-500" />}
          label="Canceladas"
          value={metricas.canceladas}
          color="bg-red-50"
        />
        <MetricCard
          icon={<Utensils className="w-4 h-4 text-accent" />}
          label="Cubiertos ocupados"
          value={metricas.cubiertos_ocupados}
          sub="de 100 totales"
          color="bg-accent/10"
        />
        <MetricCard
          icon={<TrendingDown className="w-4 h-4 text-secondary" />}
          label="Cubiertos libres"
          value={metricas.cubiertos_disponibles}
          sub={metricas.cubiertos_disponibles < 20 ? "Poca disponibilidad" : undefined}
          color={metricas.cubiertos_disponibles < 20 ? "bg-red-50" : "bg-secondary/10"}
        />
      </div>
    </div>
  )
}
