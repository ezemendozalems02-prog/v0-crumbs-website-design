"use client"

import { useCart } from "@/lib/cart-context"
import { X, Plus, Minus, ShoppingBag, MessageCircle } from "lucide-react"
import { useState } from "react"

export function Cart() {
  const { items, totalItems, totalPrice, isCartOpen, setIsCartOpen, updateQuantity, removeItem, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleWhatsAppOrder = () => {
    const phoneNumber = "5491112345678" // Replace with actual phone number
    
    const itemsList = items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join("\n")
    
    const message = encodeURIComponent(
      `Hola! Quiero hacer un pedido de CRUMBS.\n\nPedido:\n${itemsList}\n\nTotal: $${totalPrice.toLocaleString("es-AR")}`
    )
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
    clearCart()
    setIsCheckingOut(false)
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

      {/* Cart Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-card z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10">
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

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-foreground/20 mb-4" />
              <p className="text-foreground/60">Tu carrito está vacío</p>
              <p className="text-sm text-foreground/40 mt-2">
                Agregá productos para hacer tu pedido
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-background rounded-xl transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.name}</h4>
                    <p className="text-sm text-accent">
                      ${item.price.toLocaleString("es-AR")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-foreground/40 hover:text-destructive transition-colors"
                    aria-label="Eliminar producto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-primary/10 space-y-4">
            {!isCheckingOut ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/70">Total</span>
                  <span className="font-[family-name:var(--font-dm-serif)] text-2xl text-primary">
                    ${totalPrice.toLocaleString("es-AR")}
                  </span>
                </div>
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-secondary transition-colors duration-300"
                >
                  FINALIZAR PEDIDO
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-sm text-foreground/70 mb-2">
                    Tu pedido será enviado por WhatsApp
                  </p>
                  <div className="flex items-center justify-between py-3 border-t border-b border-primary/10">
                    <span className="text-foreground/70">Total a pagar</span>
                    <span className="font-[family-name:var(--font-dm-serif)] text-2xl text-primary">
                      ${totalPrice.toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-[#25D366] text-white py-4 rounded-full font-medium hover:bg-[#20BD5A] transition-colors duration-300 flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  PEDIR POR WHATSAPP
                </button>
                <button
                  onClick={() => setIsCheckingOut(false)}
                  className="w-full bg-transparent text-foreground/60 py-2 font-medium hover:text-foreground transition-colors"
                >
                  Volver al carrito
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
