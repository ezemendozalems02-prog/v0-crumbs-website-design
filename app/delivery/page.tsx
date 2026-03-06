"use client"

import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Cart } from "@/components/cart"
import { CartProvider, useCart } from "@/lib/cart-context"
import { Plus, Check } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface DeliveryItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

const deliveryProducts: DeliveryItem[] = [
  // Wraps
  {
    id: "wrap-caesar",
    name: "Wrap Caesar",
    description: "Pollo, lechuga, queso sardo y salsa caesar de la casa",
    price: 15400,
    image: "/images/wrap-caesar.jpg",
    category: "Wraps",
  },
  {
    id: "wrap-pollo-palta",
    name: "Wrap Pollo Palta",
    description: "Pollo, palta, tomate cherry, espinaca y alioli",
    price: 17000,
    image: "/images/wrap-caesar.jpg",
    category: "Wraps",
  },
  {
    id: "wrap-hongos",
    name: "Wrap Hongos",
    description: "Hongos, queso, tomate asado, espinaca, repollo y alioli",
    price: 16000,
    image: "/images/wrap-caesar.jpg",
    category: "Wraps",
  },
  {
    id: "wrap-falafel",
    name: "Wrap Falafel",
    description: "Falafel, hummus, vegetales frescos y salsa tahini",
    price: 15800,
    image: "/images/wrap-caesar.jpg",
    category: "Wraps",
  },
  // Sandwiches
  {
    id: "pulled-pork",
    name: "Pulled Pork Sandwich",
    description: "Cerdo desmechado, coleslaw y salsa BBQ",
    price: 16500,
    image: "/images/pulled-pork.jpg",
    category: "Sandwiches",
  },
  {
    id: "club-sandwich",
    name: "Club Sandwich",
    description: "Pollo, panceta, lechuga, tomate y mayonesa",
    price: 14800,
    image: "/images/pulled-pork.jpg",
    category: "Sandwiches",
  },
  {
    id: "philly-cheese",
    name: "Philly Cheese",
    description: "Carne, cebolla, morrón y queso fundido",
    price: 17200,
    image: "/images/pulled-pork.jpg",
    category: "Sandwiches",
  },
  // Hamburguesas
  {
    id: "burger-clasica",
    name: "Hamburguesa Clásica",
    description: "Carne, cheddar, lechuga, tomate y salsa especial",
    price: 15800,
    image: "/images/hamburguesa.jpg",
    category: "Hamburguesas",
  },
  {
    id: "burger-bacon",
    name: "Bacon Lover",
    description: "Carne, cheddar, panceta crocante y cebolla caramelizada",
    price: 18200,
    image: "/images/hamburguesa.jpg",
    category: "Hamburguesas",
  },
  {
    id: "burger-crumbs",
    name: "CRUMBS Burger",
    description: "Doble carne, doble cheddar, panceta, huevo y todas las salsas",
    price: 21500,
    image: "/images/hamburguesa.jpg",
    category: "Hamburguesas",
  },
  // Bowls
  {
    id: "buddha-bowl",
    name: "Buddha Bowl",
    description: "Quinoa, garbanzos, palta, tomate cherry, zanahoria y hummus",
    price: 16500,
    image: "/images/buddha-bowl.jpg",
    category: "Bowls",
  },
  {
    id: "poke-bowl",
    name: "Poke Bowl",
    description: "Base de arroz, salmón, palta, edamame, mango y salsa ponzu",
    price: 19800,
    image: "/images/buddha-bowl.jpg",
    category: "Bowls",
  },
  {
    id: "protein-bowl",
    name: "Protein Bowl",
    description: "Arroz integral, pollo grillado, huevo, espinaca y semillas",
    price: 18200,
    image: "/images/buddha-bowl.jpg",
    category: "Bowls",
  },
  // Ensaladas
  {
    id: "ensalada-caesar",
    name: "Ensalada Caesar",
    description: "Lechuga romana, pollo, parmesano, croutons y aderezo caesar",
    price: 14500,
    image: "/images/ensalada-caesar.jpg",
    category: "Ensaladas",
  },
  {
    id: "ensalada-crumbs",
    name: "CRUMBS Salad",
    description: "Mix de verdes, pollo, palta, tomate cherry, huevo y semillas",
    price: 16200,
    image: "/images/ensalada-caesar.jpg",
    category: "Ensaladas",
  },
  {
    id: "ensalada-burrata",
    name: "Burrata",
    description: "Burrata, tomate, rúcula, jamón crudo y aceite de trufa",
    price: 18500,
    image: "/images/ensalada-caesar.jpg",
    category: "Ensaladas",
  },
  // Entradas
  {
    id: "papas-fritas",
    name: "Papas Fritas",
    description: "Papas fritas crocantes con sal marina",
    price: 7000,
    image: "/images/papas-fritas.jpg",
    category: "Entradas",
  },
  {
    id: "papas-bar",
    name: "Papas Bar",
    description: "Con cheddar, panceta y cebolla de verdeo",
    price: 11900,
    image: "/images/papas-fritas.jpg",
    category: "Entradas",
  },
  {
    id: "nuggets",
    name: "Nuggets",
    description: "Con salsa de miel mostaza",
    price: 13200,
    image: "/images/papas-fritas.jpg",
    category: "Entradas",
  },
]

const categories = [...new Set(deliveryProducts.map((p) => p.category))]

function ProductCard({ product }: { product: DeliveryItem }) {
  const { addItem, items } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  
  const itemInCart = items.find((item) => item.id === product.id)

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1000)
  }

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {itemInCart && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
            {itemInCart.quantity} en carrito
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-[family-name:var(--font-dm-serif)] text-lg text-primary mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-medium text-accent text-lg">
            ${product.price.toLocaleString("es-AR")}
          </span>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              isAdded
                ? "bg-secondary text-secondary-foreground"
                : "bg-primary text-primary-foreground hover:bg-secondary"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Agregado
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

function CategorySection({ category, products }: { category: string; products: DeliveryItem[] }) {
  const sectionRef = useInView()

  return (
    <div
      ref={sectionRef.ref}
      id={category.toLowerCase().replace(/\s+/g, "-")}
      className={`scroll-mt-32 transition-all duration-700 ${
        sectionRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl text-primary mb-8">
        {category}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

function DeliveryContent() {
  const [activeCategory, setActiveCategory] = useState(categories[0])

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/delivery-hero.jpg"
            alt="Delivery CRUMBS"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="font-[family-name:var(--font-caveat)] text-2xl text-card/90 mb-4 block animate-fade-in">
            Hacé tu pedido
          </span>
          <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl md:text-6xl lg:text-7xl text-card leading-tight animate-fade-in-up">
            Pedido Delivery
          </h1>
        </div>
      </section>

      {/* Category Navigation */}
      <nav className="sticky top-[73px] z-30 bg-card border-b border-primary/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors duration-300 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground/70 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Products */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {categories.map((category) => (
            <CategorySection
              key={category}
              category={category}
              products={deliveryProducts.filter((p) => p.category === category)}
            />
          ))}
        </div>
      </section>

      <Footer />
      <Cart />
      <WhatsAppButton />
    </main>
  )
}

export default function DeliveryPage() {
  return (
    <CartProvider>
      <DeliveryContent />
    </CartProvider>
  )
}
