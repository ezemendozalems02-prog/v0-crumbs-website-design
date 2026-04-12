"use client"

import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Cart } from "@/components/cart"
import { CartProvider, useCart } from "@/lib/cart-context"
import { Plus, Check } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import type { MenuCategory } from "@/lib/menu-publico"
import type { Producto } from "@/lib/admin-productos"

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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); observer.disconnect() }
    }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, isInView }
}

interface CardItem { id: string; name: string; description: string; price: number; image: string }

function ProductCard({ product }: { product: CardItem }) {
  const { addItem, items } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const itemInCart = items.find((item) => item.id === product.id)
  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1000)
  }
  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        {itemInCart && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
            {itemInCart.quantity} en carrito
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-[family-name:var(--font-dm-serif)] text-lg text-primary mb-2">{product.name}</h3>
        <p className="text-sm text-foreground/60 mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-medium text-accent text-lg">${product.price.toLocaleString("es-AR")}</span>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${isAdded ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground hover:bg-secondary"}`}
          >
            {isAdded ? <><Check className="w-4 h-4" />Agregado</> : <><Plus className="w-4 h-4" />Agregar</>}
          </button>
        </div>
      </div>
    </div>
  )
}

function CategorySection({ category, products }: { category: string; products: CardItem[] }) {
  const { ref, isInView } = useInView()
  return (
    <div
      ref={ref}
      id={category.toLowerCase().replace(/\s+/g, "-")}
      className={`scroll-mt-32 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl text-primary mb-8">{category}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    })),
  })).filter((c) => c.products.length > 0)
}

interface Props { liveMenu: MenuCategory[]; bannerImageUrl?: string | null }

function DeliveryInner({ liveMenu, bannerImageUrl }: Props) {
  const sections = liveMenu.length > 0 ? mapMenuToCards(liveMenu) : staticDeliveryItems
  const categories = sections.map((s) => s.category)
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "")
  const heroImage = bannerImageUrl ?? "/images/delivery-hero.jpg"

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroImage} alt="Delivery CRUMBS" fill className="object-cover" priority unoptimized />
          {!bannerImageUrl && <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />}
        </div>
        {!bannerImageUrl && (
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <span className="font-[family-name:var(--font-caveat)] text-2xl text-card/90 mb-4 block animate-fade-in">Comida rica, sin salir de casa</span>
            <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl md:text-6xl lg:text-7xl text-card leading-tight animate-fade-in-up">Pedido Delivery</h1>
          </div>
        )}
      </section>

      <nav className="sticky top-[73px] z-30 bg-card border-b border-primary/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
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

      <Footer />
      <Cart />
    </main>
  )
}

export function DeliveryContent({ liveMenu, bannerImageUrl }: Props) {
  return (
    <CartProvider>
      <DeliveryInner liveMenu={liveMenu} bannerImageUrl={bannerImageUrl} />
    </CartProvider>
  )
}
