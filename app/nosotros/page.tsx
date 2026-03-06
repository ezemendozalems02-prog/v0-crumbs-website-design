"use client"

import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Coffee, Leaf, Heart, Users } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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

export default function NosotrosPage() {
  const storySection = useInView()
  const valuesSection = useInView()

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/nosotros-hero.jpg"
            alt="Interior de CRUMBS"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="font-[family-name:var(--font-caveat)] text-2xl text-card/90 mb-4 block animate-fade-in">
            Nuestra historia
          </span>
          <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl md:text-6xl lg:text-7xl text-card leading-tight animate-fade-in-up">
            Sobre Nosotros
          </h1>
        </div>
      </section>

      {/* Story Section */}
      <section 
        ref={storySection.ref}
        className="py-24 bg-card"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className={`space-y-8 transition-all duration-700 ${storySection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="font-[family-name:var(--font-caveat)] text-xl text-accent">
              Desde Ciudad Jardín
            </span>
            
            <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-4xl text-primary">
              Un espacio donde el café de especialidad y la cocina de calidad se encuentran
            </h2>
            
            <div className="prose prose-lg text-foreground/70 space-y-6">
              <p>
                CRUMBS nació en Ciudad Jardín con la idea de crear un espacio donde el café de especialidad y la cocina de calidad se encuentren en un ambiente cálido, moderno y relajado.
              </p>
              
              <p>
                Desde nuestros inicios, nos propusimos ofrecer una experiencia gastronómica completa: comenzando con el mejor café de la mañana, pasando por almuerzos frescos y creativos, hasta terminar el día con una cena acompañada de coctelería de autor.
              </p>
              
              <p>
                Cada detalle en CRUMBS está pensado para que disfrutes: desde la selección de granos de café de origen único, hasta los ingredientes de estación que inspiran nuestros platos.
              </p>
              
              <p>
                Nuestro equipo está formado por apasionados de la gastronomía y la hospitalidad, comprometidos con brindarte la mejor experiencia en cada visita.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section 
        ref={valuesSection.ref}
        className="py-24 bg-background"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-700 ${valuesSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="font-[family-name:var(--font-caveat)] text-xl text-accent">
              Lo que nos define
            </span>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-4xl text-primary mt-2">
              Nuestros Valores
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Coffee,
                title: "Calidad",
                description: "Seleccionamos los mejores ingredientes y trabajamos con proveedores locales de confianza.",
              },
              {
                icon: Leaf,
                title: "Frescura",
                description: "Cocinamos con productos de estación, privilegiando lo fresco y lo local.",
              },
              {
                icon: Heart,
                title: "Pasión",
                description: "Amamos lo que hacemos y eso se refleja en cada taza de café y cada plato.",
              },
              {
                icon: Users,
                title: "Comunidad",
                description: "Somos parte de Ciudad Jardín y queremos ser un punto de encuentro para el barrio.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className={`text-center p-8 rounded-2xl bg-card transition-all duration-700 ${
                  valuesSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-[family-name:var(--font-dm-serif)] text-xl text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="font-[family-name:var(--font-caveat)] text-xl text-primary-foreground/80">
            Te esperamos
          </span>
          <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-4xl mt-2 mb-8">
            Vení a conocernos
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Estamos en Ciudad Jardín, Buenos Aires. Abrimos todos los días para que disfrutes del mejor café y la mejor cocina del barrio.
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 bg-card text-primary px-8 py-4 rounded-full font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
          >
            Ver ubicación y contacto
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
