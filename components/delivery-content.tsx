"use client"

import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { Plus, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import type { MenuCategory } from "@/lib/menu-publico"
import type { Producto, Variante } from "@/lib/admin-productos"
import { ProductoOptionsModal } from "@/components/producto-options-modal"

// Static fallback items for delivery
const staticDeliveryItems: { category: string; products: { id: string; name: string; description: string; price: number; image: string }[] }[] = [
  {
    category: "Wraps", products: [
      { id: "wrap-caesar", name: "Wrap Caesar", description: "Pollo, lechuga, queso sardo y salsa caesar", price: 15400, image: "/images/wrap-caesar.jpg" },
      { id: "wrap-pollo-palta", name: "Wrap Pollo Palta", description: "Pollo, palta, tomate cherry, espinaca y alioli", price: 17000, image: "/images/wrap-caesar.jpg" },
      { id: "wrap-hongos", name: "Wrap Hongos", description: "Hongos, queso, tomate asado, espinaca, repollo y alioli", price: 16000, image: "/images/wrap-caesar.jpg" },
    ],
  },
  {
    category: "Hamburguesas", products: [
      { id: "burger-clasica", name: "Hamburguesa Clásica", description: "Carne, cheddar, lechuga, tomate y salsa especial", price: 15800, image: "/images/hamburguesa.jpg" },
      { id: "burger-bacon", name: "Bacon Lover", description: "Carne, cheddar, panceta crocante y cebolla caramelizada", price: 18200, image: "/images/hamburguesa.jpg" },
      { id: "burger-crumbs", name: "CRUMBS Burger", description: "Doble carne, doble cheddar, panceta, huevo y todas las salsas", price: 21500, image: "/images/hamburguesa.jpg" },
    ],
  },
  {
    category: "Bowls", products: [
      { id: "buddha-bowl", name: "Buddha Bowl", description: "Quinoa, garbanzos, palta, tomate cherry, zanahoria y hummus", price: 16500, image: "/images/buddha-bowl.jpg" },
      { id: "poke-bowl", name: "Poke Bowl", description: "Base de arroz, salmón, palta, edamame, mango y salsa ponzu", price: 19800, image: "/images/buddha-bowl.jpg" },
    ],
  },
  {
    category: "Entradas", products: [
      { id: "papas-fritas", name: "Papas Fritas", description: "Papas fritas crocantes con sal marina", price: 7000, image: "/images/papas-fritas.jpg" },
      { id: "papas-bar", name: "Papas Bar", description: "Con cheddar, panceta y cebolla de verdeo", price: 11900, image: "/images/papas-fritas.jpg" },
      { id: "nuggets", name: "Nuggets", description: "Con salsa de miel mostaza", price: 13200, image: "/images/papas-fritas.jpg" },
    ],
  },
]

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  useEffect(() => {
    // Start as visible on first render to avoid hydration mismatch and layout shift
    setIsInView(true)
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); observer.disconnect() }
    }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, isInView }
}

import type { Extra, Variante } from "@/lib/admin-productos"

interface CardItem { id: string; name: string; description: string; price: number; image: string; extras?: Extra[]; variantes?: Variante[] }

// Modal para seleccionar variantes
function VariantesModal({
  isOpen,
  onClose,
  product,
  onSelectVariante,
}: {
  isOpen: boolean
  onClose: () => void
  product: CardItem
  onSelectVariante: (variante: Variante) => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-dm-serif)] text-2xl text-primary">{product.name}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-background transition-colors"
          >
            <X className="w-5 h-5 text-foreground/60" />
          </button>
        </div>

        <p className="text-sm text-foreground/70 mb-6">{product.description}</p>

        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground/60 uppercase mb-3">Elige tu variante:</p>
          {product.variantes?.map((variante) => (
            <button
              key={variante.id}
              onClick={() => onSelectVariante(variante)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-background hover:bg-primary/5 hover:border-primary/40 transition-colors duration-300 text-left"
            >
              <span className="font-medium text-primary">{variante.nombre}</span>
              <span className="font-medium text-accent">${variante.precio.toLocaleString("es-AR")}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: CardItem }) {
  const { addItem, items } = useCart()
  const [showVariantesModal, setShowVariantesModal] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [selectedVariante, setSelectedVariante] = useState<Variante | null>(null)
  const itemInCart = items.find((item) => item.id === product.id || item.id.startsWith(product.id + "_"))
  const cartCount = items.filter((item) => item.id === product.id || item.id.startsWith(product.id + "_")).reduce((sum, i) => sum + i.quantity, 0)
  const hasExtras = product.extras && product.extras.length > 0
  const hasVariantes = product.variantes && product.variantes.length > 0
  
  // Mostrar solo el precio más bajo
  let priceDisplay = `$${product.price.toLocaleString("es-AR")}`
  if (hasVariantes) {
    const variantePrices = product.variantes.map(v => v.precio)
    const minPrice = Math.min(product.price, ...variantePrices)
    priceDisplay = `$${minPrice.toLocaleString("es-AR")}`
  }
  
  const handleAdd = () => {
    // Si hay variantes, mostrar selector primero
    if (hasVariantes) {
      setShowVariantesModal(true)
    } else if (hasExtras) {
      // Si solo hay extras, abrir modal de extras
      setShowOptionsModal(true)
    } else {
      // Sin variantes ni extras: agregar directo
      addItem({ id: product.id, name: product.name, price: product.price, image: product.image, precioUnitario: product.price })
    }
  }

  const handleVarianteSelected = (variante: Variante) => {
    setSelectedVariante(variante)
    setShowVariantesModal(false)
    
    // Si hay extras, abrir modal de extras con la variante seleccionada
    if (hasExtras) {
      setShowOptionsModal(true)
    } else {
      // Sin extras: agregar directo con la variante
      const itemId = `${product.id}_${variante.id}`
      addItem({
        id: itemId,
        name: `${product.name} - ${variante.nombre}`,
        price: variante.precio,
        image: product.image,
        precioUnitario: variante.precio,
        variante: variante.nombre,
      })
      setSelectedVariante(null)
    }
  }
  
  return (
    <>
      <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="relative w-full bg-background">
          <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden">
            <Image src={product.image} alt={product.name} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-500" />
          </div>
          {cartCount > 0 && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
              {cartCount} en carrito
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="font-[family-name:var(--font-dm-serif)] text-base sm:text-lg text-primary mb-1 sm:mb-2">{product.name}</h3>
          <p className="text-xs sm:text-sm text-foreground/60 mb-2 line-clamp-2">{product.description}</p>
          {hasExtras && (
            <p className="text-xs text-accent/80 mb-3 font-medium">
              Personalizable — elige tus opciones
            </p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="font-medium text-accent text-base sm:text-lg">{priceDisplay}</span>
            <button
              onClick={handleAdd}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all duration-300 bg-primary text-primary-foreground hover:bg-secondary"
              title={hasVariantes ? "Elegir variante" : hasExtras ? "Personalizar" : "Agregar"}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de variantes */}
      {hasVariantes && (
        <VariantesModal
          isOpen={showVariantesModal}
          onClose={() => setShowVariantesModal(false)}
          product={product}
          onSelectVariante={handleVarianteSelected}
        />
      )}

      {/* Modal de opciones/extras — con variante preseleccionada si aplica */}
      {hasExtras && (
        <ProductoOptionsModal
          isOpen={showOptionsModal}
          onClose={() => {
            setShowOptionsModal(false)
            setSelectedVariante(null)
          }}
          producto={{
            id: product.id,
            nombre: product.name,
            precio: selectedVariante ? selectedVariante.precio : product.price,
            imagen_url: product.image,
            extras: product.extras,
          }}
          varianteSeleccionada={selectedVariante?.nombre}
          onFinish={() => setSelectedVariante(null)}
        />
      )}
    </>
  )
}

// Sanitizar string para ID válido en CSS (remover acentos y caracteres especiales)
function sanitizeId(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "") // Remover caracteres especiales
}

function CategorySection({ category, products }: { category: string; products: CardItem[] }) {
  const { ref, isInView } = useInView()
  return (
    <div
      ref={ref}
      id={sanitizeId(category)}
      className="scroll-mt-32"
    >
      <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl text-primary mb-8">{category}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  )
}

function mapMenuToCards(menu: MenuCategory[]): { category: string; products: CardItem[] }[] {
  return menu.map((cat) => ({
    category: cat.nombre,
    products: cat.productos.map((p: Producto) => ({
      id: p.id,
      name: p.nombre,
      description: p.descripcion ?? "",
      price: p.precio,
      image: p.imagen_url ?? "/images/wrap-caesar.jpg",
      extras: p.extras ?? [],
      variantes: p.variantes ?? [],
    })),
  })).filter((c) => c.products.length > 0)
}

interface Props { liveMenu: MenuCategory[]; bannerImageUrl?: string | null }

export function DeliveryContent({ liveMenu, bannerImageUrl }: Props) {
  const sections = liveMenu.length > 0 ? mapMenuToCards(liveMenu) : staticDeliveryItems
  const categories = sections.map((s) => s.category)
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "")
  const heroImage = bannerImageUrl ?? "/images/delivery-hero.jpg"

  return (
    <div>
      {bannerImageUrl ? (
        <div className="w-full overflow-hidden" style={{ maxHeight: "520px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="Delivery CRUMBS"
            width={1440}
            height={480}
            className="w-full h-auto block"
            style={{ maxHeight: "520px", objectFit: "cover", objectPosition: "center 70%" }}
            fetchPriority="high"
          />
        </div>
      ) : (
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src={heroImage} alt="Delivery CRUMBS" fill className="object-cover" priority unoptimized />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <span className="font-[family-name:var(--font-caveat)] text-2xl text-card/90 mb-4 block animate-fade-in">Comida rica, sin salir de casa</span>
            <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl md:text-6xl lg:text-7xl text-card leading-tight animate-fade-in-up">Pedido Delivery</h1>
          </div>
        </section>
      )}

      <nav className="sticky z-30 bg-card border-b border-primary/10 shadow-sm" style={{ top: "var(--header-height)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${sanitizeId(category)}`}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors duration-300 ${activeCategory === category ? "bg-primary text-primary-foreground" : "bg-background text-foreground/70 hover:bg-primary/10 hover:text-primary"}`}
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {sections.map((s) => <CategorySection key={s.category} category={s.category} products={s.products} />)}
        </div>
      </section>

    </div>
  )
}
