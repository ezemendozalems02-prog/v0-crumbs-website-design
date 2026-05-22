"use client"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pencil, Trash2, ToggleLeft, ToggleRight, Star, UtensilsCrossed } from "lucide-react"
import type { Producto } from "@/lib/admin-productos"

interface SortableProductosTableProps {
  productos: Producto[]
  deletingId: string | null
  togglingId: string | null
  onEdit: (p: Producto) => void
  onDelete: (id: string, nombre: string) => void
  onToggle: (id: string, current: boolean) => void
  onReorder: (items: { id: string; orden: number }[]) => void
}

// Componente para cada fila draggable
function SortableProductRow({
  producto: p,
  deletingId,
  togglingId,
  onEdit,
  onDelete,
  onToggle,
}: {
  producto: Producto
  deletingId: string | null
  togglingId: string | null
  onEdit: (p: Producto) => void
  onDelete: (id: string, nombre: string) => void
  onToggle: (id: string, current: boolean) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-background/60 transition-colors ${isDragging ? "bg-primary/10 border-2 border-primary" : ""}`}
    >
      {/* Grip handle */}
      <td className="px-4 py-4">
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded text-foreground/30 hover:text-primary hover:bg-primary/10 cursor-grab active:cursor-grabbing transition-colors"
          title="Arrastra para reordenar"
        >
          <GripVertical className="w-5 h-5" />
        </button>
      </td>

      {/* Producto info */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {p.imagen_url ? (
            <img src={p.imagen_url} alt={p.nombre} className="w-10 h-10 rounded-xl object-cover bg-background shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-4 h-4 text-primary/50" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">{p.nombre}</span>
              {p.destacado && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
            </div>
            {p.descripcion && <p className="text-xs text-foreground/50 mt-0.5 line-clamp-1">{p.descripcion}</p>}
          </div>
        </div>
      </td>

      {/* Categoría */}
      <td className="px-4 py-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {p.categoria?.nombre ?? "—"}
        </span>
      </td>

      {/* Precio */}
      <td className="px-4 py-4 font-medium text-foreground">${p.precio.toLocaleString("es-AR")}</td>

      {/* Variantes */}
      <td className="px-4 py-4 text-foreground/60">
        {p.variantes && p.variantes.length > 0 ? (
          <span className="text-xs bg-background border border-border/40 rounded-lg px-2 py-1">
            {p.variantes.length} variante{p.variantes.length !== 1 ? "s" : ""}
          </span>
        ) : (
          "—"
        )}
      </td>

      {/* Extras */}
      <td className="px-4 py-4 text-foreground/60">
        {p.extras && p.extras.length > 0 ? (
          <span className="text-xs bg-background border border-border/40 rounded-lg px-2 py-1">
            {p.extras.length} extra{p.extras.length !== 1 ? "s" : ""}
          </span>
        ) : (
          "—"
        )}
      </td>

      {/* Estado */}
      <td className="px-4 py-4">
        <button
          onClick={() => onToggle(p.id, p.disponible)}
          disabled={togglingId === p.id}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-40"
        >
          {p.disponible ? (
            <>
              <ToggleRight className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700">Disponible</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-5 h-5 text-foreground/40" />
              <span className="text-foreground/50">No disponible</span>
            </>
          )}
        </button>
      </td>

      {/* Acciones */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onEdit(p)}
            className="p-1.5 rounded-lg text-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(p.id, p.nombre)}
            disabled={deletingId === p.id}
            className="p-1.5 rounded-lg text-foreground/40 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// Componente tabla principal con drag & drop
export function SortableProductosTable({
  productos,
  deletingId,
  togglingId,
  onEdit,
  onDelete,
  onToggle,
  onReorder,
}: SortableProductosTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = productos.findIndex((p) => p.id === active.id)
      const newIndex = productos.findIndex((p) => p.id === over.id)

      const newOrder = arrayMove(productos, oldIndex, newIndex)
      const reorderItems = newOrder.map((p, idx) => ({
        id: p.id,
        orden: idx + 1,
      }))

      onReorder(reorderItems)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={productos.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30 bg-background/50">
              {["", "Producto", "Categoría", "Precio", "Variantes", "Extras", "Estado", ""].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3.5 font-semibold text-foreground/60 text-xs uppercase tracking-wide first:pl-4 last:text-right last:pr-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {productos.map((p) => (
              <SortableProductRow
                key={p.id}
                producto={p}
                deletingId={deletingId}
                togglingId={togglingId}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  )
}
