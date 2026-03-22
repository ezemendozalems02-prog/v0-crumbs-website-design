"use client"

import { useRef, useEffect, useState } from "react"
import type { MenuCategory } from "@/lib/menu-publico"
import type { Producto } from "@/lib/admin-productos"
import { Star } from "lucide-react"

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); observer.disconnect() }
    }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, isInView }
}

function ProductoRow({ producto }: { producto: Producto }) {
  const hasVariantes = producto.variantes && producto.variantes.length > 0
  return (
    <div className="group flex items-start justify-between gap-4 py-3 hover:bg-background/50 rounded-lg px-3 -mx-3 transition-colors duration-300">
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
            {producto.nombre}
            {producto.destacado && <Star className="w-3 h-3 text-amber-500 fill-amber-500 inline-block" />}
          </span>
          <span className="flex-1 border-b border-dotted border-foreground/20" />
        </div>
        {producto.descripcion && (
          <p className="text-sm text-foreground/60 mt-1">{producto.descripcion}</p>
        )}
        {producto.etiquetas && producto.etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {producto.etiquetas.map((e) => (
              <span key={e} className="text-xs bg-primary/8 text-primary/80 px-2 py-0.5 rounded-full">{e}</span>
            ))}
          </div>
        )}
        {hasVariantes && (
          <div className="flex flex-wrap gap-2 mt-2">
            {producto.variantes!.map((v) => (
              <span key={v.id} className="text-xs text-foreground/60 bg-background border border-border/40 rounded-lg px-2 py-1">
                {v.nombre}: ${v.precio.toLocaleString("es-AR")}
              </span>
            ))}
          </div>
        )}
      </div>
      {!hasVariantes && (
        <span className="font-medium text-accent whitespace-nowrap">
          ${producto.precio.toLocaleString("es-AR")}
        </span>
      )}
    </div>
  )
}

interface Props {
  category: MenuCategory
  index: number
}

export function MenuCategorySection({ category, index }: Props) {
  const { ref, isInView } = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      <h3 className="font-[family-name:var(--font-dm-serif)] text-2xl text-primary mb-6 pb-3 border-b border-primary/20">
        {category.nombre}
      </h3>
      <div className="space-y-1">
        {category.productos.map((producto) => (
          <ProductoRow key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  )
}
