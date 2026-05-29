"use client"

import Image from "next/image"
import Link from "next/link"
import { Coffee, UtensilsCrossed, Wine, ArrowRight } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import type { Banner, Seccion } from "@/lib/admin-banners-types"
import type { Seccion as SeccionContent, SeccionItem } from "@/lib/admin-secciones-types"

interface HomepageClientProps {
  mainBanner: Banner | null
  experienceSection: Seccion | null
  highlightsSection: SeccionContent | null
}

export function HomepageClient({ mainBanner, experienceSection, highlightsSection }: Omit<HomepageClientProps, 'locationSection'>) {
  const experienceSectionInView = useInView()
  const highlightsSectionInView = useInView()

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
      {(() => {
        // Items: usar los de la BD o los defaults hardcodeados
        const defaultItems: SeccionItem[] = [
          { imagen_url: "/images/hamburguesa.jpg", titulo: "Hamburguesas", subtitulo: "Para comer con ganas" },
          { imagen_url: "/images/brunch.jpg", titulo: "Brunch", subtitulo: "Un clásico para compartir" },
          { imagen_url: "/images/cocktail.jpg", titulo: "Coctelería", subtitulo: "Para quedarse un rato más" },
          { imagen_url: "/images/cafe.jpg", titulo: "Café", subtitulo: "La pausa favorita de todos" },
        ]
        const items = highlightsSection?.items_json?.length ? highlightsSection.items_json : defaultItems
        const sectionTitulo = highlightsSection?.titulo ?? "Lo que nos hace únicos"
        const sectionSubtitulo = highlightsSection?.subtitulo ?? "Destacados"

        return (
          <section
            ref={highlightsSectionInView.ref}
            className="py-24 md:py-32 bg-background"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className={`text-center mb-16 transition-all duration-700 ${highlightsSectionInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="font-[family-name:var(--font-reenie-beanie)] text-xl text-accent">
                  {sectionSubtitulo}
                </span>
                <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-5xl text-primary mt-2">
                  {sectionTitulo}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item, index) => {
                  const inner = (
                    <>
                      <Image
                        src={item.imagen_url || "/images/hero-brunch.jpg"}
                        alt={item.titulo}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="font-[family-name:var(--font-reenie-beanie)] text-lg text-card/80">
                          {item.subtitulo}
                        </span>
                        <h3 className="font-[family-name:var(--font-dm-serif)] text-2xl text-card">
                          {item.titulo}
                        </h3>
                      </div>
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-card/30 rounded-2xl transition-colors duration-300" />
                    </>
                  )

                  const baseClass = `group relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-700 ${
                    highlightsSectionInView.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`

                  return item.link ? (
                    <Link
                      key={index}
                      href={item.link}
                      className={baseClass}
                      style={{ transitionDelay: `${index * 100 + 200}ms` }}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div
                      key={index}
                      className={baseClass}
                      style={{ transitionDelay: `${index * 100 + 200}ms` }}
                    >
                      {inner}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })()}
    </>
  )
}
