"use client"

import { useCart } from "@/lib/cart-context"
import { X, Plus, Minus, ShoppingBag, MessageCircle, User, MapPin, Check, Truck, Store } from "lucide-react"
import { useState } from "react"
import { whatsappUrl } from "@/lib/whatsapp"

export function Cart({ deliveryCost: DELIVERY_COST = 1000 }: { deliveryCost?: number }) {
  const { items, totalItems, totalPrice, isCartOpen, setIsCartOpen, updateQuantity, removeItem, clearCart } = useCart()

  const [nombre, setNombre] = useState("")
  const [direccion, setDireccion] = useState("")
  const [deliveryType, setDeliveryType] = useState<"retiro" | "envio">("retiro")
  const [errors, setErrors] = useState<{ nombre?: string; direccion?: string }>({})

  const deliveryCost = deliveryType === "envio" ? DELIVERY_COST : 0
  const finalTotal = totalPrice + deliveryCost

  const nombreCompleto = nombre.trim().length > 0
  const direccionRequired = deliveryType === "envio"
  const direccionCompleta = !direccionRequired || direccion.trim().length > 0
  const canCheckout = items.length > 0 && nombreCompleto && direccionCompleta

  const handleFinalize = () => {
    // Read values from local variables immediately — never from stale React state
    const trimmedNombre = nombre.trim()
    const trimmedDireccion = direccion.trim()
    const snapshot = [...items]

    // Validate synchronously before any state mutation
    const newErrors: { nombre?: string; direccion?: string } = {}
    if (!trimmedNombre) newErrors.nombre = "Completá tu nombre"
    if (deliveryType === "envio" && !trimmedDireccion) newErrors.direccion = "Completá tu dirección"
    if (snapshot.length === 0) return

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Build the full message before touching any state
    const itemsList = snapshot
      .map(
        (item) =>
          `- ${item.name} x ${item.quantity} — $${(item.price * item.quantity).toLocaleString("es-AR")}`
      )
      .join("\n")

    const orderSubtotal = snapshot.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const deliveryLine = deliveryType === "envio" ? `\nCargo por envío: $${DELIVERY_COST.toLocaleString("es-AR")}` : ""
    const orderTotal = orderSubtotal + deliveryCost

    const deliveryTypeText = deliveryType === "retiro" ? "Retiro en local" : "Envío a domicilio"
    const deliveryInfo = deliveryType === "retiro" ? "(Retiro en local)" : `(Envío a: ${trimmedDireccion})`

    const message =
      `Hola Crumbs, quiero hacer este pedido:\n` +
      `Nombre: ${trimmedNombre}\n` +
      `Método de entrega: ${deliveryTypeText} ${deliveryInfo}\n\n` +
      `Pedido:\n${itemsList}\n` +
      `Subtotal: $${orderSubtotal.toLocaleString("es-AR")}${deliveryLine}\n\n` +
      `Total: $${orderTotal.toLocaleString("es-AR")}`

    // Use location.href so Safari iOS never blocks it as a popup.
    // This must happen before any setState call to stay within the user gesture.
    const url = `https://wa.me/5491172476661?text=${encodeURIComponent(message)}`
    window.location.href = url

    // State cleanup after navigation is triggered
    setErrors({})
    clearCart()
    setNombre("")
    setDireccion("")
  }

  if (!isCartOpen) {
    return (
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        aria-label="Ver carrito"
      >
        <ShoppingBag className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-scale-in">
            {totalItems}
          </span>
        )}
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/50 z-40 animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Panel — uses 100dvh so mobile browser chrome is never included */}
      <div
        className="fixed top-0 right-0 w-full max-w-md bg-card z-50 shadow-2xl flex flex-col animate-slide-in-right"
        style={{ height: "100dvh" }}
      >
        {/* Header — fixed at top */}
        <div className="flex-none flex items-center justify-between p-6 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="font-[family-name:var(--font-dm-serif)] text-xl text-primary">
              Tu Pedido
            </h2>
            {totalItems > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-foreground/60 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body — takes all remaining space between header and footer */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* Cart Items */}
          <div className="p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingBag className="w-16 h-16 text-foreground/20 mb-4" />
                <p className="text-foreground/60">Tu carrito está vacío</p>
                <p className="text-sm text-foreground/40 mt-2">
                  Agregá productos para hacer tu pedido
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-background rounded-xl transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm leading-tight">{item.name}</h4>
                      <p className="text-sm text-accent mt-0.5">
                        ${item.price.toLocaleString("es-AR")}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-foreground/40 hover:text-destructive transition-colors shrink-0"
                      aria-label="Eliminar producto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Data Form */}
          {items.length > 0 && (
            <div className="px-6 pb-6">
              <div className="border-t border-primary/10 pt-6">
                <p className="font-[family-name:var(--font-dm-serif)] text-base text-primary mb-4">
                  Datos para el pedido
                </p>

                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => {
                          setNombre(e.target.value)
                          if (e.target.value.trim()) setErrors((prev) => ({ ...prev, nombre: undefined }))
                        }}
                        placeholder="Escribí tu nombre"
                        className={`w-full pl-10 pr-10 py-3 bg-background border rounded-xl text-sm text-foreground placeholder:text-foreground/40 outline-none transition-colors duration-200 focus:border-primary/60 ${
                          errors.nombre
                            ? "border-red-400"
                            : nombreCompleto
                            ? "border-primary/30"
                            : "border-primary/15"
                        }`}
                      />
                      {nombreCompleto && (
                        <Check className="absolute right-3.5 w-4 h-4 text-emerald-500 pointer-events-none" />
                      )}
                    </div>
                    {errors.nombre && (
                      <p className="text-xs text-red-400 mt-1.5 pl-1">{errors.nombre}</p>
                    )}
                  </div>

                  {/* Método de entrega */}
                  <div>
                    <label className="text-xs font-medium text-foreground/70 mb-2 block">Método de entrega</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryType("retiro")
                          setErrors((prev) => ({ ...prev, direccion: undefined }))
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          deliveryType === "retiro"
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-background border border-primary/20 text-foreground hover:border-primary/40"
                        }`}
                      >
                        <Store className="w-4 h-4" />
                        Retiro en local
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType("envio")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          deliveryType === "envio"
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-background border border-primary/20 text-foreground hover:border-primary/40"
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        Envío
                      </button>
                    </div>
                  </div>

                  {/* Dirección — solo si es envío */}
                  {deliveryType === "envio" && (
                    <div>
                      <div className="relative flex items-center">
                        <MapPin className="absolute left-3.5 w-4 h-4 text-foreground/40 pointer-events-none" />
                        <input
                          type="text"
                          value={direccion}
                          onChange={(e) => {
                            setDireccion(e.target.value)
                            if (e.target.value.trim()) setErrors((prev) => ({ ...prev, direccion: undefined }))
                          }}
                          placeholder="Escribí tu dirección"
                          className={`w-full pl-10 pr-10 py-3 bg-background border rounded-xl text-sm text-foreground placeholder:text-foreground/40 outline-none transition-colors duration-200 focus:border-primary/60 ${
                            errors.direccion
                              ? "border-red-400"
                              : direccionCompleta
                              ? "border-primary/30"
                              : "border-primary/15"
                          }`}
                        />
                        {direccionCompleta && direccion.trim().length > 0 && (
                          <Check className="absolute right-3.5 w-4 h-4 text-emerald-500 pointer-events-none" />
                        )}
                      </div>
                      {errors.direccion && (
                        <p className="text-xs text-red-400 mt-1.5 pl-1">{errors.direccion}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky footer — always visible, respects safe area on notched phones */}
        {items.length > 0 && (
          <div
            className="flex-none border-t border-primary/10 bg-card px-6 pt-5 space-y-4"
            style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/70">Subtotal</span>
                <span className="text-foreground">${totalPrice.toLocaleString("es-AR")}</span>
              </div>
              {deliveryType === "envio" && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">Cargo por envío</span>
                  <span className="text-accent">+${DELIVERY_COST.toLocaleString("es-AR")}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-foreground/70 font-medium">Total</span>
              <span className="font-[family-name:var(--font-dm-serif)] text-2xl text-primary">
                ${finalTotal.toLocaleString("es-AR")}
              </span>
            </div>

            <button
              onClick={handleFinalize}
              disabled={!canCheckout}
              style={{ minHeight: "54px", touchAction: "manipulation" }}
              className={`w-full rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-3 relative z-10 ${
                canCheckout
                  ? "bg-[#25D366] text-white hover:bg-[#20BD5A] active:bg-[#1aab50] shadow-md hover:shadow-lg"
                  : "bg-foreground/10 text-foreground/30 cursor-not-allowed"
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              FINALIZAR PEDIDO
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
