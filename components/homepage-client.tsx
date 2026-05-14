"use client"

import Image from "next/image"
import Link from "next/link"
import { Coffee, UtensilsCrossed, Wine, ArrowRight } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import type { Banner, Seccion } from "@/lib/admin-banners-types"

interface HomepageClientProps {
  mainBanner: Banner | null
  experienceSection: Seccion | null
  locationSection: Seccion | null
}

export function HomepageClient({ mainBanner, experienceSection, locationSection }: HomepageClientProps) {
  const experienceSectionInView = useInView()
  const highlightsSectionInView = useInView()
  const locationSectionInView = useInView()

  // Defaults
  const banner = mainBanner || {
    id: "",
    titulo: "Cafe de especialidad & cocina todo el día",
    subtitulo: "Ciudad Jardín, Buenos Aires",
    descripcion: "Para arrancar el día, cortar la tarde y cerrar la noche.",
    imagen_url: "/images/hero-brunch.jpg",
    boton_texto: "Ver carta de cafetería",
    boton_link: "/cafeteria",
    pagina: "inicio",
    activo: true,
    orden: 0,
    created_at: "",
    updated_at: "",
  }

  const locationData = locationSection || {
    id: "",
    clave: "home-location",
    nombre: "Ubicación",
    titulo: "Encontranos en Ciudad Jardín",
    subtitulo: "Nos encontrás en",
    descripcion: "Visítanos en nuestro local",
    imagen_url: null,
    pagina: "inicio",
    activo: true,
    created_at: "",
    updated_at: "",
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen md:h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
        <div className="absolute inset-0">
          <Image
            src={banner.imagen_url || "/images/hero-brunch.jpg"}
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full">
          <span className="font-[family-name:var(--font-reenie-beanie)] text-lg sm:text-2xl lg:text-3xl text-card/80 mb-4 sm:mb-6 block animate-fade-in tracking-wide">
            {banner.subtitulo}
          </span>
          <h1 className="font-[family-name:var(--font-dm-serif)] text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-card leading-tight mb-4 sm:mb-6 animate-fade-in-up">
            {banner.titulo}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-card/90 mb-8 sm:mb-10 animate-fade-in-up delay-200 line-clamp-3 sm:line-clamp-none">
            {banner.descripcion}
          </p>

          <div className="animate-fade-in-up delay-300 flex flex-col gap-3 sm:gap-4 w-full sm:w-auto items-center justify-center max-w-xs sm:max-w-none mx-auto">
            <Link
              href={banner.boton_link || "/cafeteria"}
              className="group bg-card text-primary px-6 sm:px-8 py-4 sm:py-5 rounded-full font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg w-full sm:w-auto"
            >
              {banner.boton_texto || "Ver carta"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform hidden sm:inline" />
            </Link>
            <Link
              href="/cocina"
              className="group bg-transparent border-2 border-card text-card px-6 sm:px-8 py-4 sm:py-5 rounded-full font-medium hover:bg-card hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg w-full sm:w-auto"
            >
              Ver carta de cocina
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform hidden sm:inline" />
            </Link>
            <Link
              href="/delivery"
              className="group bg-accent text-accent-foreground px-6 sm:px-8 py-4 sm:py-5 rounded-full font-medium hover:bg-secondary transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg w-full sm:w-auto"
            >
              Pedir delivery
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform hidden sm:inline" />
            </Link>
            <Link
              href="/reservas"
              className="group bg-transparent border-2 border-accent text-card px-6 sm:px-8 py-4 sm:py-5 rounded-full font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg w-full sm:w-auto"
            >
              Reservas
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform hidden sm:inline" />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:flex flex-col items-center gap-2">
          <p className="text-card/60 text-xs tracking-widest uppercase font-medium">Desplazá</p>
          <div className="w-5 h-8 border-2 border-card/40 rounded-full flex justify-center hover:border-card/60 transition-colors">
            <div className="w-1 h-2.5 bg-card/40 rounded-full mt-1.5 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        ref={experienceSectionInView.ref}
        className="py-24 md:py-32 bg-card"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-700 ${experienceSectionInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="font-[family-name:var(--font-reenie-beanie)] text-xl text-accent">
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
                  experienceSectionInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
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
        ref={highlightsSectionInView.ref}
        className="py-24 md:py-32 bg-background"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-700 ${highlightsSectionInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="font-[family-name:var(--font-reenie-beanie)] text-xl text-accent">
              Destacados
            </span>
            <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-5xl text-primary mt-2">
              Lo que nos hace únicos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { image: "/images/hamburguesa.jpg", title: "Hamburguesas", subtitle: "Para comer con ganas", link: "/cocina" },
              { image: "/images/brunch.jpg", title: "Brunch", subtitle: "Un clásico para compartir", link: "/cafeteria" },
              { image: "/images/cocktail.jpg", title: "Coctelería", subtitle: "Para quedarse un rato más", link: "/cocina" },
              { image: "/images/cafe.jpg", title: "Café", subtitle: "La pausa favorita de todos", link: "/cafeteria" },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className={`group relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-700 ${
                  highlightsSectionInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
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
                  <span className="font-[family-name:var(--font-reenie-beanie)] text-lg text-card/80">
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
        ref={locationSectionInView.ref}
        className="py-24 md:py-32 bg-card"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Map */}
            <div className={`aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-lg transition-all duration-700 cursor-pointer group ${locationSectionInView.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
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
            <div className={`space-y-8 transition-all duration-700 delay-200 ${locationSectionInView.isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div>
                <span className="font-[family-name:var(--font-reenie-beanie)] text-xl text-accent">
                  Visitanos
                </span>
                <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-5xl text-primary mt-2">
                  {locationData.titulo}
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 rounded-xl bg-background">
                  <span className="text-2xl text-accent">📍</span>
                  <div>
                    <h4 className="font-medium text-primary mb-1">Dirección</h4>
                    <p className="text-foreground/70">Ciudad Jardín, Buenos Aires</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-background">
                  <span className="text-2xl text-accent">🕐</span>
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
    </>
  )
}
