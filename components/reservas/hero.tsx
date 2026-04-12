"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface ReservasHeroProps {
  bannerImageUrl?: string | null
}

export function ReservasHero({ bannerImageUrl }: ReservasHeroProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Si hay imagen de banner, mostrarla directamente como hero
  if (bannerImageUrl) {
    return (
      <section className="relative w-full overflow-hidden" style={{ aspectRatio: "1440/480", maxHeight: "480px" }}>
        <Image
          src={bannerImageUrl}
          alt="Reservá tu mesa"
          fill
          className="object-contain object-center"
          priority
          unoptimized
        />
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-primary"
    >
      {/* Rotating brand seal — the distinctive identity element */}
      <div className="absolute right-8 top-8 md:right-16 md:top-12 opacity-10 pointer-events-none select-none">
        <div className="relative w-36 h-36 md:w-52 md:h-52 animate-spin-slow">
          <svg viewBox="0 0 200 200" className="w-full h-full fill-primary-foreground">
            <path
              id="circle-path"
              d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              fill="none"
            />
            <text fontSize="14" letterSpacing="8" fontFamily="serif">
              <textPath href="#circle-path">
                CRUMBS · CAFÉ & COCINA · CIUDAD JARDÍN · BUENOS AIRES ·
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      {/* Decorative grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div
          className="transition-all duration-700 ease-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)" }}
        >
          <span className="font-[family-name:var(--font-caveat)] text-accent text-xl tracking-wide block mb-4">
            reservas
          </span>
          <h1 className="font-[family-name:var(--font-dm-serif)] text-5xl md:text-7xl text-primary-foreground leading-tight text-balance mb-6">
            Reservá tu mesa
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed max-w-xl mb-3">
            Elegí la mesa ideal, seleccioná fecha y horario, y asegurá tu lugar en CRUMBS.
          </p>
          <p className="text-primary-foreground/50 text-sm leading-relaxed max-w-lg">
            Los cupos son limitados y la disponibilidad se actualiza según la capacidad diaria del local.
          </p>
        </div>
      </div>
    </section>
  )
}
