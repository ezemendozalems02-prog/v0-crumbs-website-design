import Link from "next/link"
import { Instagram, MapPin, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <span className="font-[family-name:var(--font-dm-serif)] text-3xl tracking-wide">
              CRUMBS
            </span>
            <p className="font-[family-name:var(--font-caveat)] text-xl text-primary-foreground/80">
              café & cocina
            </p>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Café de especialidad y cocina de estación en Ciudad Jardín, Buenos Aires.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-[family-name:var(--font-dm-serif)] text-lg">Navegación</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Inicio
              </Link>
              <Link href="/nosotros" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Nosotros
              </Link>
              <Link href="/cafeteria" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Desayunos & Cafetería
              </Link>
              <Link href="/cocina" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Almuerzos & Cenas
              </Link>
              <Link href="/delivery" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Pedido Delivery
              </Link>
              <Link href="/reservas" className="text-sm text-primary-foreground font-medium hover:text-accent transition-colors">
                Reservas
              </Link>
              <Link href="/contacto" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Contacto
              </Link>
            </nav>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="font-[family-name:var(--font-dm-serif)] text-lg">Ubicación</h4>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 text-accent" />
              <div>
                <p className="text-sm text-primary-foreground/90">Ciudad Jardín</p>
                <p className="text-sm text-primary-foreground/70">Buenos Aires, Argentina</p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-[family-name:var(--font-dm-serif)] text-lg">Horarios</h4>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 mt-0.5 text-accent" />
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-primary-foreground/90">Cafetería</p>
                  <p className="text-sm text-primary-foreground/70">9 a 20 hs</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-foreground/90">Cocina</p>
                  <p className="text-sm text-primary-foreground/70">12 a 15:30 hs / 20 a 23:30 hs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} CRUMBS. Todos los derechos reservados.
          </p>
          <a
            href="https://instagram.com/crumbs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            <Instagram className="w-5 h-5" />
            @crumbs
          </a>
        </div>
      </div>
    </footer>
  )
}
