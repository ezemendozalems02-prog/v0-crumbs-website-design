"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical } from "lucide-react"
import type { Extra, ExtraInput, ExtraOpcion } from "@/lib/admin-productos"

interface ExtrasEditorProps {
  extras: ExtraInput[]
  onChange: (extras: ExtraInput[]) => void
}

export function ExtrasEditor({ extras, onChange }: ExtrasEditorProps) {
  const addExtra = () => {
    onChange([
      ...extras,
      {
        nombre: "",
        tipo: "select",
        requerido: false,
        orden: extras.length,
        opciones: [],
      },
    ])
  }

  const removeExtra = (idx: number) => {
    onChange(extras.filter((_, i) => i !== idx))
  }

  const updateExtra = (idx: number, field: keyof ExtraInput, value: any) => {
    onChange(
      extras.map((e, i) =>
        i === idx ? { ...e, [field]: value } : e
      )
    )
  }

  const addOpcion = (extraIdx: number) => {
    onChange(
      extras.map((e, i) =>
        i === extraIdx
          ? {
              ...e,
              opciones: [
                ...e.opciones,
                { nombre: "", precio_adicional: 0, orden: e.opciones.length },
              ],
            }
          : e
      )
    )
  }

  const removeOpcion = (extraIdx: number, opcionIdx: number) => {
    onChange(
      extras.map((e, i) =>
        i === extraIdx
          ? { ...e, opciones: e.opciones.filter((_, oi) => oi !== opcionIdx) }
          : e
      )
    )
  }

  const updateOpcion = (
    extraIdx: number,
    opcionIdx: number,
    field: "nombre" | "precio_adicional",
    value: any
  ) => {
    onChange(
      extras.map((e, i) =>
        i === extraIdx
          ? {
              ...e,
              opciones: e.opciones.map((op, oi) =>
                oi === opcionIdx
                  ? {
                      ...op,
                      [field]:
                        field === "precio_adicional" ? Number(value) : value,
                    }
                  : op
              ),
            }
          : e
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-foreground">
          Opcionales/Extras
        </h4>
        <button
          onClick={addExtra}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar Extra
        </button>
      </div>

      {extras.length === 0 && (
        <div className="text-center py-6 rounded-lg border border-dashed border-border/40 text-foreground/50 text-sm">
          Sin extras configurados. Agrega opciones como salsa, tamaño, etc.
        </div>
      )}

      <div className="space-y-3">
        {extras.map((extra, extraIdx) => (
          <div
            key={extraIdx}
            className="border border-border/40 rounded-lg p-4 bg-background/50"
          >
            {/* Extra header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={extra.nombre}
                  onChange={(e) =>
                    updateExtra(extraIdx, "nombre", e.target.value)
                  }
                  placeholder="Nombre del extra (ej: Salsa, Tamaño)"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-foreground/70">
                      Tipo
                    </label>
                    <select
                      value={extra.tipo}
                      onChange={(e) =>
                        updateExtra(extraIdx, "tipo", e.target.value)
                      }
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="select">Selección única</option>
                      <option value="radio">Radio (una opción)</option>
                      <option value="checkbox">Múltiples</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-foreground/70 mt-5">
                      <input
                        type="checkbox"
                        checked={extra.requerido}
                        onChange={(e) =>
                          updateExtra(extraIdx, "requerido", e.target.checked)
                        }
                        className="rounded"
                      />
                      Requerido
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={() => removeExtra(extraIdx)}
                className="p-2 rounded-lg text-foreground/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Eliminar extra"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Opciones */}
            <div className="border-t border-border/20 pt-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                  Opciones
                </label>
                <button
                  onClick={() => addOpcion(extraIdx)}
                  className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  + Opción
                </button>
              </div>

              <div className="space-y-2">
                {extra.opciones.map((opcion, opcionIdx) => (
                  <div
                    key={opcionIdx}
                    className="flex items-end gap-2 bg-background rounded border border-border/30 p-2"
                  >
                    <input
                      type="text"
                      value={opcion.nombre}
                      onChange={(e) =>
                        updateOpcion(
                          extraIdx,
                          opcionIdx,
                          "nombre",
                          e.target.value
                        )
                      }
                      placeholder="Nombre opción (ej: Barbecue)"
                      className="flex-1 px-2 py-1.5 rounded border border-border bg-card text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />

                    <div className="flex items-end gap-2">
                      <div>
                        <label className="text-xs text-foreground/60 block mb-0.5">
                          +$
                        </label>
                        <input
                          type="number"
                          value={opcion.precio_adicional}
                          onChange={(e) =>
                            updateOpcion(
                              extraIdx,
                              opcionIdx,
                              "precio_adicional",
                              e.target.value
                            )
                          }
                          placeholder="0"
                          className="w-16 px-2 py-1.5 rounded border border-border bg-card text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>

                      <button
                        onClick={() => removeOpcion(extraIdx, opcionIdx)}
                        className="p-1.5 rounded text-foreground/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar opción"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {extra.opciones.length === 0 && (
                  <div className="text-xs text-foreground/40 text-center py-2">
                    Sin opciones
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
