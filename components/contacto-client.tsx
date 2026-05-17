"use client"

import Image from "next/image"
import { MapPin, Clock, Phone, Instagram, MessageCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { whatsappUrl } from "@/lib/whatsapp"

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

interface ContactoClientProps {
  bannerImageUrl: string | null
}

export function ContactoClient({ bannerImageUrl }: ContactoClientProps) {
  const contactSection = useInView()
  const heroImage = bannerImageUrl ?? "/images/nosotros-hero.jpg"

  return (
    <div>
      {/* Hero Section */}
      {bannerImageUrl ? (
        <div className="w-full overflow-hidden" style={{ maxHeight: "520px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerImageUrl}
            alt="Contacto CRUMBS"
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
            <Image
              src={heroImage}
              alt="Contacto CRUMBS"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <span className="font-[family-name:var(--font-caveat)] text-2xl text-card/90 mb-4 block animate-fade-in">
              Encontranos
            </span>
            <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl md:text-6xl lg:text-7xl text-card leading-tight animate-fade-in-up">
              Contacto
            </h1>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section ref={contactSection.ref} className="py-24 bg-card">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div
              className={`aspect-square lg:aspect-auto lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg transition-all duration-700 cursor-pointer group ${
                contactSection.isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
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

            {/* Contact Info */}
            <div
              className={`space-y-8 transition-all duration-700 delay-200 ${
                contactSection.isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              <div>
                <span className="font-[family-name:var(--font-caveat)] text-xl text-accent">
                  Te esperamos
                </span>
                <h2 className="font-[family-name:var(--font-dm-serif)] text-3xl md:text-4xl text-primary mt-2">
                  Información de Contacto
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 rounded-xl bg-background">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">Dirección</h4>
                    <p className="text-foreground/70">Ciudad Jardín</p>
                    <p className="text-foreground/70">Buenos Aires, Argentina</p>
                    <a
                      href="https://maps.app.goo.gl/NcWSJQM2me4j25RK9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-primary mt-2 inline-block text-sm font-medium"
                    >
                      Ver en Google Maps
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-background">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
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

                <div className="flex items-start gap-4 p-6 rounded-xl bg-background">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">Teléfono</h4>
                    <p className="text-foreground/70">+54 11 1234-5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-xl bg-background">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">Instagram</h4>
                    <a
                      href="https://instagram.com/crumbs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/70 hover:text-primary transition-colors"
                    >
                      @crumbs
                    </a>
                  </div>
                </div>
              </div>

              <a
                href={whatsappUrl("Hola! Me gustaría hacer una consulta sobre CRUMBS.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-medium hover:bg-[#20BD5A] transition-colors duration-300 w-full"
              >
                <MessageCircle className="w-5 h-5" />
                Escribinos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
