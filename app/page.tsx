"use client"

import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Coffee, UtensilsCrossed, Wine, MapPin, Clock, ArrowRight } from "lucide-react"
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

export default function HomePage() {
  const experienceSection = useInView()
  const highlightsSection = useInView()
  const locationSection = useInView()

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-brunch.jpg"
            alt="Brunch en CRUMBS"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="font-[family-name:var(--font-caveat)] text-xl md:text-2xl lg:text-3xl text-card/80 mb-6 block animate-fade-in tracking-wide">
            Ciudad Jardín, Buenos Aires
          </span>
          <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl md:text-6xl lg:text-7xl text-card leading-tight mb-6 animate-fade-in-up">
            Cafe de especialidad & cocina todo el día
          </h1>
          <p className="text-lg md:text-xl text-card/90 mb-10 animate-fade-in-up delay-200">
            Para arrancar el día, cortar la tarde y cerrar la noche.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300 flex-wrap">
            <Link
              href="/cafeteria"
              className="group bg-card text-primary px-8 py-4 rounded-full font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center gap-2"
            >
              Ver carta de cafetería
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/cocina"
              className="group bg-transparent border-2 border-card text-card px-8 py-4 rounded-full font-medium hover:bg-card hover:text-primary transition-all duration-300 flex items-center gap-2"
            >
              Ver carta de cocina
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/delivery"
              className="group bg-accent text-accent-foreground px-8 py-4 rounded-full font-medium hover:bg-secondary transition-all duration-300 flex items-center gap-2"
            >
              Pedir delivery
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/reservas"
              className="group bg-transparent border-2 border-accent text-card px-8 py-4 rounded-full font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center gap-2"
            >
              Reservas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:flex flex-col items-center gap-2">
          <p className="text-card/60 text-xs tracking-widest uppercase font-medium">Desplazá</p>
          <div className="w-5 h-8 border-2 border-card/40 rounded-full flex justify-center hover:border-card/60 transition-colors">
            <div className="w-1 h-2.5 bg-card/40 rounded-full mt-1.5 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section 
        ref={experienceSection.ref}
        className="py-24 md:py-32 bg-card"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-700 ${experienceSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="font-[family-name:var(--font-caveat)] text-xl text-accent">
              Nuestra experiencia
            </span>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-5xl text-primary mt-2">
              Un lugar para cada momento
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: Coffee,
                title: "Café de especialidad",
                description: "Granos seleccionados, preparaciones cuidadas y una pausa para disfrutar sin apuro.",
                delay: 0,
              },
              {
                icon: UtensilsCrossed,
                title: "Cocina fresca",
                description: "Platos ricos, recetas de autor y una propuesta variada para disfrutar desde el desayuno hasta la cena.",
                delay: 100,
              },
              {
                icon: Wine,
                title: "Coctelería de autor",
                description: "Sabores frescos, combinaciones originales y una excusa perfecta para quedarse un rato más",
                delay: 200,
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`group text-center p-8 rounded-2xl bg-background hover:bg-primary hover:shadow-xl transition-all duration-500 cursor-default ${
                  experienceSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${item.delay + 200}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-card/20 mb-6 transition-colors duration-500">
                  <item.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                </div>
                <h3 className="font-[family-name:var(--font-dm-serif)] text-xl text-primary group-hover:text-primary-foreground mb-4 transition-colors duration-500">
                  {item.title}
                </h3>
                <p className="text-foreground/70 group-hover:text-primary-foreground/80 leading-relaxed transition-colors duration-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section 
        ref={highlightsSection.ref}
        className="py-24 md:py-32 bg-background"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-700 ${highlightsSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="font-[family-name:var(--font-caveat)] text-xl text-accent">
              Destacados
            </span>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-5xl text-primary mt-2">
              Lo que nos hace únicos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                image: "/images/hamburguesa.jpg", 
                title: "Hamburguesas", 
                subtitle: "Para comer con ganas",
                link: "/cocina"
              },
              { 
                image: "/images/brunch.jpg", 
                title: "Brunch", 
                subtitle: "Un clasico para compartir",
                link: "/cafeteria"
              },
              { 
                image: "/images/cocktail.jpg", 
                title: "Coctelería", 
                subtitle: "Para quedarse un rato más",
                link: "/cocina"
              },
              { 
                image: "/images/cafe.jpg", 
                title: "Café", 
                subtitle: "La pausa favorita de todos",
                link: "/cafeteria"
              },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className={`group relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-700 ${
                  highlightsSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="font-[family-name:var(--font-caveat)] text-lg text-card/80">
                    {item.subtitle}
                  </span>
                  <h3 className="font-[family-name:var(--font-dm-serif)] text-2xl text-card">
                    {item.title}
                  </h3>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-card/30 rounded-2xl transition-colors duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section 
        ref={locationSection.ref}
        className="py-24 md:py-32 bg-card"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Map */}
            <div className={`aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-lg transition-all duration-700 cursor-pointer group ${locationSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <a
                href="https://maps.app.goo.gl/NcWSJQM2me4j25RK9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-colors duration-300"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.9449622372753!2d-58.45068!3d-34.604587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5c8b5c5c5c5%3A0x5c5c5c5c5c5c5c5c!2sCiudad%20Jard%C3%ADn%2C%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1704067200000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de CRUMBS en Ciudad Jardín"
                  className="pointer-events-none"
                />
              </a>
            </div>

            {/* Info */}
            <div className={`space-y-8 transition-all duration-700 delay-200 ${locationSection.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div>
                <span className="font-[family-name:var(--font-caveat)] text-xl text-accent">
                  Visitanos
                </span>
                <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-5xl text-primary mt-2">
                  Encontranos en Ciudad Jardín
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 rounded-xl bg-background">
                  <MapPin className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-primary mb-1">Dirección</h4>
                    <p className="text-foreground/70">Ciudad Jardín, Buenos Aires</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-background">
                  <Clock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-primary mb-3">Horarios</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-foreground">Cafetería</span>
                        <p className="text-foreground/70">9 a 20 hs</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">Cocina</span>
                        <p className="text-foreground/70">12 a 15:30 hs / 20 a 23:30 hs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/NcWSJQM2me4j25RK9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-secondary transition-colors duration-300 group"
              >
                Cómo llegar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
