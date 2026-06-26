"use client"

import { useState, useEffect, useTransition } from "react"
import { X, Loader2 } from "lucide-react"
import { createHorario, updateHorario } from "@/lib/admin-horarios"
import type { ReservationTime, ReservationTimeInput, MealType } from "@/lib/admin-horarios-types"
import { MEAL_TYPE_OPCIONES, HORARIO_FORMATO_REGEX } from "@/lib/admin-horarios-types"

interface HorarioFormModalProps {
  horario?: ReservationTime | null
  existentes: ReservationTime[]
  onClose: () => void
  onSaved: () => void
}

const EMPTY: ReservationTimeInput = {
  time: "",
  meal_type: "almuerzo",
  is_active: true,
  sort_order: 0,
}

export function HorarioFormModal({ horario, existentes, onClose, onSaved }: HorarioFormModalProps) {
  const [form, setForm] = useState<ReservationTimeInput>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (horario) {
      setForm({
        time: horario.time,
        meal_type: horario.meal_type,
        is_active: horario.is_active,
        sort_order: horario.sort_order,
      })
    } else {
      setForm(EMPTY)
    }
    setError(null)
  }, [horario])

  const set = <K extends keyof ReservationTimeInput>(key: K, value: ReservationTimeInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = () => {
    setError(null)

    if (!HORARIO_FORMATO_REGEX.test(form.time)) {
      setError("El horario debe tener el formato HH:mm (ej: 20:30)")
      return
    }

    const duplicado = existentes.some(
      (h) => h.id !== horario?.id && h.meal_type === form.meal_type && h.time === form.time
    )
    if (duplicado) {
      setError("Ya existe un horario igual para ese turno")
      return
    }

    startTransition(async () => {
      const result = horario
        ? await updateHorario(horario.id, form)
        : await createHorario(form)

      if (!result.success) {
        setError(result.error ?? "Error al guardar el horario")
        return
      }
      onSaved()
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-dm-serif)] text-xl text-primary">
            {horario ? "Editar horario" : "Nuevo horario"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-foreground/60" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground/50 uppercase tracking-wide">Hora</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-background border border-border/40 rounded-xl text-foreground outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground/50 uppercase tracking-wide">Turno</label>
            <select
              value={form.meal_type}
              onChange={(e) => set("meal_type", e.target.value as MealType)}
              className="w-full px-3 py-2.5 text-sm bg-background border border-border/40 rounded-xl text-foreground outline-none focus:border-primary/50 transition-colors"
            >
              {MEAL_TYPE_OPCIONES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground/50 uppercase tracking-wide">Orden</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => set("sort_order", Number(e.target.value))}
              className="w-full px-3 py-2.5 text-sm bg-background border border-border/40 rounded-xl text-foreground outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => set("is_active", e.target.checked)}
              className="w-4 h-4 rounded accent-primary"
            />
            Horario activo
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-foreground/70 hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
