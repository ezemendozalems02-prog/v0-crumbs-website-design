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
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

interface NosotrosClientProps {
  bannerImageUrl: string | null
}

export function NosotrosClient({ bannerImageUrl }: NosotrosClientProps) {
  const storySection = useInView()
  const valuesSection = useInView()
  const heroImage = bannerImageUrl ?? "/images/nosotros-hero.jpg"

  return (
    <main className="min-h-screen page-content">
      <Navigation />

      {/* Hero Section */}
      {bannerImageUrl ? (
        <div className="w-full overflow-hidden" style={{ maxHeight: "520px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerImageUrl}
            alt="Interior de CRUMBS"
            width={1440}
            height={480}
            className="w-full h-auto block"
            style={{ maxHeight: "520px", objectFit: "cover", objectPosition: "center 70%" }}
            fetchPriority="high"
          />
        </div>
      ) : (
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Interior de CRUMBS"
              fill
              className="object-cover"
              priority
              unoptimized
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
      )}

      {/* Story Section */}
      <section ref={storySection.ref} className="py-24 bg-card">
        <div className="max-w-4xl mx-auto px-6">
          <div
            className={`space-y-8 transition-all duration-700 ${
              storySection.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="font-[family-name:var(--font-caveat)] text-xl text-accent">
              Desde Ciudad Jardín
            </span>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-4xl text-primary">
              Un espacio donde el café, la cocina y los buenos momentos van de la mano.
            </h2>
            <div className="prose prose-lg text-foreground/70 space-y-6">
              <p>
                Crumbs nació en Ciudad Jardín con una idea simple: crear un espacio cálido y relajado,
                donde siempre haya algo rico esperándote.
              </p>
              <p>
                En estos 9 años, se fue convirtiendo en ese plan al que volvés para arrancar el día con
                un buen café, cortar al mediodía, estirar la tarde o cerrar la noche con algo para comer
                y un buen trago.
              </p>
              <p>
                Acá, cada detalle está pensado para que te sientas cómodo, con una propuesta variada, un
                ambiente cálido y un equipo que siempre te recibe con buena onda.
              </p>
              <p>
                Somos café, cocina y encuentros. Un espacio para compartir, hacer una pausa y volver una
                y otra vez.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesSection.ref} className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              valuesSection.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
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
                description:
                  "Elegimos buenos ingredientes, trabajamos con productores y proveedores en los que confiamos.",
              },
              {
                icon: Leaf,
                title: "Frescura",
                description:
                  "Trabajamos con productos de estación y una propuesta pensada para cada momento del día.",
              },
              {
                icon: Heart,
                title: "Pasión",
                description: "Amamos lo que hacemos y eso se refleja en cada taza de café y cada plato.",
              },
              {
                icon: Users,
                title: "Comunidad",
                description:
                  "Somos parte de Ciudad Jardín y nos encanta ser el punto de encuentro para el barrio.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className={`text-center p-8 rounded-2xl bg-card transition-all duration-700 ${
                  valuesSection.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-[family-name:var(--font-dm-serif)] text-xl text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">{value.description}</p>
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
            Estamos en Ciudad Jardín, Buenos Aires. Abrimos todos los días para acompañarte con café,
            cocina y buenos momentos.
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
