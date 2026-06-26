"use client"

import { useState, useEffect, useTransition, useCallback } from "react"
import { getHorarios, deleteHorario, toggleHorarioActivo } from "@/lib/admin-horarios"
import type { ReservationTime } from "@/lib/admin-horarios-types"
import { MEAL_TYPE_OPCIONES } from "@/lib/admin-horarios-types"
import { HorarioFormModal } from "@/components/admin/horario-form-modal"
import {
  Plus, RefreshCw, Clock, Pencil, Trash2, ToggleLeft, ToggleRight,
} from "lucide-react"

type Toast = { id: number; message: string; type: "success" | "error" }

export default function AdminHorariosPage() {
  const [horarios, setHorarios] = useState<ReservationTime[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingHorario, setEditingHorario] = useState<ReservationTime | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [isLoading, startTransition] = useTransition()

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const loadData = useCallback(() => {
    startTransition(async () => {
      const data = await getHorarios()
      setHorarios(data)
    })
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleDelete = async (id: string, time: string) => {
    if (!confirm(`¿Eliminar el horario "${time}"? Esta acción no se puede deshacer.`)) return
    setDeletingId(id)
    const r = await deleteHorario(id)
    setDeletingId(null)
    if (r.success) { addToast("Horario eliminado", "success"); loadData() }
    else addToast(r.error ?? "Error al eliminar", "error")
  }

  const handleToggle = async (id: string, activo: boolean) => {
    setTogglingId(id)
    const r = await toggleHorarioActivo(id, !activo)
    setTogglingId(null)
    if (r.success) { addToast(activo ? "Horario desactivado" : "Horario activado", "success"); loadData() }
    else addToast(r.error ?? "Error", "error")
  }

  const handleSaved = () => {
    setModalOpen(false)
    setEditingHorario(null)
    addToast(editingHorario ? "Horario actualizado" : "Horario creado", "success")
    loadData()
  }

  const grouped = MEAL_TYPE_OPCIONES.reduce<Record<string, ReservationTime[]>>((acc, m) => {
    const items = horarios
      .filter((h) => h.meal_type === m.value)
      .sort((a, b) => a.sort_order - b.sort_order || a.time.localeCompare(b.time))
    if (items.length > 0) acc[m.value] = items
    return acc
  }, {})

  const totalActivos = horarios.filter((h) => h.is_active).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-dm-serif)] text-2xl text-primary">Horarios</h1>
          <p className="text-sm text-foreground/60 mt-0.5">Gestioná los horarios disponibles en la página de reservas</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-foreground/60 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => { setEditingHorario(null); setModalOpen(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo horario
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total horarios", value: horarios.length, icon: Clock },
          { label: "Activos", value: totalActivos, icon: ToggleRight },
          { label: "Inactivos", value: horarios.length - totalActivos, icon: ToggleLeft },
          { label: "Turnos con horarios", value: Object.keys(grouped).length, icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl shrink-0">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-foreground/60">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lista */}
      {isLoading && horarios.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 text-primary/40 animate-spin" />
        </div>
      ) : horarios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-primary/10 rounded-2xl mb-4">
            <Clock className="w-8 h-8 text-primary/60" />
          </div>
          <p className="text-foreground/60 text-sm">No hay horarios todavía</p>
          <button
            onClick={() => { setEditingHorario(null); setModalOpen(true) }}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Crear el primer horario
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {MEAL_TYPE_OPCIONES.map(({ value, label }) => {
            const items = grouped[value]
            if (!items) return null
            return (
              <div key={value}>
                <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">
                  {label} ({items.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((h) => (
                    <div
                      key={h.id}
                      className={`bg-card rounded-2xl border border-border p-4 flex items-center gap-4 transition-opacity ${!h.is_active ? "opacity-60" : ""}`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-foreground">{h.time}</p>
                          {!h.is_active && (
                            <span className="px-1.5 py-0.5 bg-foreground/10 text-foreground/50 text-xs rounded-md shrink-0">Inactivo</span>
                          )}
                        </div>
                        <p className="text-xs text-foreground/40 mt-0.5">Orden: {h.sort_order}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggle(h.id, h.is_active)}
                          disabled={togglingId === h.id}
                          className="p-2 rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
                          title={h.is_active ? "Desactivar" : "Activar"}
                        >
                          {h.is_active
                            ? <ToggleRight className="w-4 h-4 text-primary" />
                            : <ToggleLeft className="w-4 h-4 text-foreground/40" />
                          }
                        </button>
                        <button
                          onClick={() => { setEditingHorario(h); setModalOpen(true) }}
                          className="p-2 rounded-xl hover:bg-muted transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4 text-foreground/60" />
                        </button>
                        <button
                          onClick={() => handleDelete(h.id, h.time)}
                          disabled={deletingId === h.id}
                          className="p-2 rounded-xl hover:bg-destructive/10 transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-destructive/70" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <HorarioFormModal
          horario={editingHorario}
          existentes={horarios}
          onClose={() => { setModalOpen(false); setEditingHorario(null) }}
          onSaved={handleSaved}
        />
      )}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
              t.type === "success" ? "bg-primary text-primary-foreground" : "bg-destructive text-white"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}
