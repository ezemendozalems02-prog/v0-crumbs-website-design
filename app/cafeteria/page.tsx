"use client"

import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useEffect, useRef, useState } from "react"

interface MenuItem {
  name: string
  price: number
  description?: string
}

interface MenuCategory {
  name: string
  items: MenuItem[]
}

const menuData: MenuCategory[] = [
  {
    name: "Cafés Clásicos",
    items: [
      { name: "Espresso", price: 2800 },
      { name: "Lungo", price: 2800 },
      { name: "Cortado", price: 2800 },
      { name: "Americano", price: 3900 },
      { name: "Flat White", price: 4600 },
      { name: "Latte", price: 5000 },
      { name: "Capuccino", price: 4600 },
      { name: "Mocaccino", price: 5300 },
    ],
  },
  {
    name: "Cafés Especiales",
    items: [
      { name: "Latte Vainilla", price: 5800 },
      { name: "Latte Caramelo", price: 5800 },
      { name: "Latte Avellana", price: 5800 },
      { name: "Dirty Chai", price: 6200 },
      { name: "Affogato", price: 6500 },
      { name: "Irish Coffee", price: 8500 },
    ],
  },
  {
    name: "Cafés Fríos",
    items: [
      { name: "Iced Latte", price: 5400 },
      { name: "Iced Americano", price: 4200 },
      { name: "Cold Brew", price: 5000 },
      { name: "Frapuccino Café", price: 6800 },
      { name: "Frapuccino Mocca", price: 7200 },
    ],
  },
  {
    name: "Sin Café",
    items: [
      { name: "Chocolate Caliente", price: 5000 },
      { name: "Submarino", price: 5500 },
      { name: "Matcha Latte", price: 5800 },
      { name: "Golden Milk", price: 5200 },
      { name: "Chai Latte", price: 5000 },
    ],
  },
  {
    name: "Té en Hebras",
    items: [
      { name: "English Breakfast", price: 3800 },
      { name: "Earl Grey", price: 3800 },
      { name: "Green Tea", price: 3800 },
      { name: "Chamomile", price: 3800 },
      { name: "Mint", price: 3800 },
      { name: "Frutos Rojos", price: 4200 },
    ],
  },
  {
    name: "Frappuccinos",
    items: [
      { name: "Frapuccino Clásico", price: 6500 },
      { name: "Frapuccino Dulce de Leche", price: 7000 },
      { name: "Frapuccino Oreo", price: 7200 },
      { name: "Frapuccino Berries", price: 7000 },
    ],
  },
  {
    name: "Licuados",
    items: [
      { name: "Banana", price: 5500 },
      { name: "Frutilla", price: 5800 },
      { name: "Mixto", price: 6000 },
      { name: "Tropical", price: 6200, description: "Mango, ananá, naranja" },
      { name: "Verde", price: 6500, description: "Espinaca, manzana, jengibre" },
    ],
  },
  {
    name: "Milkshakes",
    items: [
      { name: "Vainilla", price: 6800 },
      { name: "Chocolate", price: 6800 },
      { name: "Frutilla", price: 6800 },
      { name: "Oreo", price: 7200 },
      { name: "Dulce de Leche", price: 7200 },
    ],
  },
  {
    name: "Bebidas",
    items: [
      { name: "Agua Mineral", price: 2500 },
      { name: "Agua con Gas", price: 2500 },
      { name: "Jugo de Naranja", price: 4500 },
      { name: "Limonada", price: 4200 },
      { name: "Limonada con Jengibre", price: 4800 },
      { name: "Gaseosas", price: 3200 },
    ],
  },
]

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

function MenuCategorySection({ category, index }: { category: MenuCategory; index: number }) {
  const sectionRef = useInView()

  return (
    <div
      ref={sectionRef.ref}
      className={`transition-all duration-700 ${
        sectionRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      <h3 className="font-[family-name:var(--font-dm-serif)] text-2xl text-primary mb-6 pb-3 border-b border-primary/20">
        {category.name}
      </h3>
      <div className="space-y-4">
        {category.items.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className="group flex items-start justify-between gap-4 py-3 hover:bg-background/50 rounded-lg px-3 -mx-3 transition-colors duration-300"
          >
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </span>
                <span className="flex-1 border-b border-dotted border-foreground/20" />
              </div>
              {item.description && (
                <p className="text-sm text-foreground/60 mt-1">{item.description}</p>
              )}
            </div>
            <span className="font-medium text-accent whitespace-nowrap">
              ${item.price.toLocaleString("es-AR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CafeteriaPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/cafeteria-hero.jpg"
            alt="Cafetería CRUMBS"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="font-[family-name:var(--font-caveat)] text-2xl text-card/90 mb-4 block animate-fade-in">
            Nuestra carta
          </span>
          <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl md:text-6xl lg:text-7xl text-card leading-tight animate-fade-in-up">
            Desayunos & Cafetería
          </h1>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-24 bg-card">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-[family-name:var(--font-caveat)] text-xl text-accent">
              Café de especialidad
            </span>
            <p className="text-foreground/70 mt-4 max-w-2xl mx-auto">
              Cada taza es preparada con granos seleccionados y tostados con cuidado.
              Disfrutá del mejor café de especialidad en Ciudad Jardín.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {menuData.map((category, index) => (
              <MenuCategorySection key={index} category={category} index={index} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-foreground/50">
              Los precios pueden variar. Consultá por opciones sin TACC y alternativas vegetarianas.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
