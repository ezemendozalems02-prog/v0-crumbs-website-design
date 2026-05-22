"use client"

import { useState } from "react"
import { X, Plus, Minus } from "lucide-react"
import type { Extra } from "@/lib/admin-productos"
import { useCart } from "@/lib/cart-context"

interface ProductoOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  producto: {
    id: string
    nombre: string
    precio: number
    imagen_url?: string | null
    extras?: Extra[]
  }
}

export function ProductoOptionsModal({
  isOpen,
  onClose,
  producto,
}: ProductoOptionsModalProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState<
    Record<string, { extra_id: string; extra_nombre: string; opcion_id: string; opcion_nombre: string; precio_adicional: number }>
  >({})

  if (!isOpen) return null

  // Calcular precio total incluyendo extras
  const extrasPrice = Object.values(selectedExtras).reduce((sum, e) => sum + e.precio_adicional, 0)
  const totalPrice = producto.precio + extrasPrice
  const totalPrecioCarrito = totalPrice * quantity

  const handleSelectExtra = (extra: Extra, opcion: any) => {
    const key = extra.id
    if (selectedExtras[key]) {
      // Ya hay una opción seleccionada, reemplazarla
      setSelectedExtras((prev) => ({
        ...prev,
        [key]: {
          extra_id: extra.id,
          extra_nombre: extra.nombre,
          opcion_id: opcion.id,
          opcion_nombre: opcion.nombre,
          precio_adicional: opcion.precio_adicional,
        },
      }))
    } else {
      // Primera selección
      setSelectedExtras((prev) => ({
        ...prev,
        [key]: {
          extra_id: extra.id,
          extra_nombre: extra.nombre,
          opcion_id: opcion.id,
          opcion_nombre: opcion.nombre,
          precio_adicional: opcion.precio_adicional,
        },
      }))
    }
  }

  const handleToggleExtra = (extra: Extra, opcion: any) => {
    const key = extra.id
    if (selectedExtras[key]?.opcion_id === opcion.id) {
      // Deseleccionar
      setSelectedExtras((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    } else {
      // Seleccionar
      handleSelectExtra(extra, opcion)
    }
  }

  // Validar extras requeridos
  const allRequiredSelected = !producto.extras?.some((e) => e.requerido && !selectedExtras[e.id])

  const handleAddToCart = () => {
    if (!allRequiredSelected) {
      alert("Por favor completa todos los extras requeridos")
      return
    }

    addItem({
      id: `${producto.id}_${Object.values(selectedExtras)
        .map((e) => e.opcion_id)
        .join("_")}`,
      name: `${producto.nombre}${Object.values(selectedExtras).length > 0 ? ` (${Object.values(selectedExtras).map((e) => e.opcion_nombre).join(", ")})` : ""}`,
      price: producto.precio,
      image: producto.imagen_url ?? undefined,
      extras: Object.values(selectedExtras),
      precioUnitario: totalPrice,
    })

    onClose()
    setQuantity(1)
    setSelectedExtras({})
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-background rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border/20 px-6 py-4 flex items-start justify-between">
          <div>
            <h2 className="font-bold text-lg text-foreground">{producto.nombre}</h2>
            <p className="text-sm text-foreground/60">${producto.precio.toLocaleString("es-AR")}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Extras selector */}
        <div className="flex-1 px-6 py-6 space-y-6">
          {producto.extras && producto.extras.length > 0 ? (
            producto.extras.map((extra) => (
              <div key={extra.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-foreground">
                    {extra.nombre}
                  </h3>
                  {extra.requerido && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
                      Obligatorio
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {extra.tipo === "checkbox" ? (
                    // Múltiples selecciones
                    <div className="space-y-2">
                      {extra.opciones.map((opcion) => (
                        <button
                          key={opcion.id}
                          onClick={() => handleToggleExtra(extra, opcion)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-colors ${
                            selectedExtras[extra.id]?.opcion_id === opcion.id
                              ? "border-primary bg-primary/10"
                              : "border-border/40 bg-card hover:border-primary/50"
                          }`}
                        >
                          <span className="text-sm font-medium">{opcion.nombre}</span>
                          <span className="text-sm text-foreground/60">
                            +${opcion.precio_adicional.toLocaleString("es-AR")}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    // Selección única (select o radio)
                    <div className="space-y-2">
                      {extra.opciones.map((opcion) => (
                        <button
                          key={opcion.id}
                          onClick={() => handleSelectExtra(extra, opcion)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-colors ${
                            selectedExtras[extra.id]?.opcion_id === opcion.id
                              ? "border-primary bg-primary/10"
                              : "border-border/40 bg-card hover:border-primary/50"
                          }`}
                        >
                          <span className="text-sm font-medium">{opcion.nombre}</span>
                          <span className="text-sm text-foreground/60">
                            +${opcion.precio_adicional.toLocaleString("es-AR")}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-foreground/50">
              Sin opcionales disponibles para este producto
            </div>
          )}
        </div>

        {/* Quantity + Add to cart */}
        <div className="border-t border-border/20 px-6 py-6 space-y-4 sticky bottom-0 bg-background">
          {/* Quantity */}
          <div className="flex items-center justify-between bg-card rounded-lg px-4 py-3">
            <span className="text-sm font-medium text-foreground/70">Cantidad</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1 rounded hover:bg-background transition-colors"
              >
                <Minus className="w-4 h-4 text-foreground/60" />
              </button>
              <span className="w-8 text-center font-semibold text-foreground">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1 rounded hover:bg-background transition-colors"
              >
                <Plus className="w-4 h-4 text-foreground/60" />
              </button>
            </div>
          </div>

          {/* Price summary */}
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center justify-between text-foreground/60">
              <span>Precio base:</span>
              <span>${producto.precio.toLocaleString("es-AR")}</span>
            </div>
            {extrasPrice > 0 && (
              <div className="flex items-center justify-between text-foreground/60">
                <span>Extras:</span>
                <span>+${extrasPrice.toLocaleString("es-AR")}</span>
              </div>
            )}
            <div className="border-t border-border/20 pt-1.5 flex items-center justify-between font-bold text-foreground">
              <span>Total ({quantity}x):</span>
              <span>${totalPrecioCarrito.toLocaleString("es-AR")}</span>
            </div>
          </div>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={!allRequiredSelected}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar al carrito
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg border border-border/40 text-foreground/70 font-medium hover:bg-background transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
