import Image from "next/image"
import Link from "next/link"
import { Instagram, MapPin, Clock } from "lucide-react"
import { getConfiguracion } from "@/lib/admin-configuracion"

export async function Footer() {
  const config = await getConfiguracion()

  const horarioCafeteria = config["horario_cafeteria"] ?? "8:30 a 20 hs"
  const horarioCocina = config["horario_cocina"] ?? "12 a 15:30 hs / 20 a 23:30 hs"
  const direccion = config["direccion"] ?? "Ciudad Jardín, Buenos Aires, Argentina"
  const instagram = config["instagram"] ?? "@crumbs"
  const instagramHandle = instagram.startsWith("@") ? instagram : `@${instagram}`
  const instagramUrl = `https://instagram.com/${instagramHandle.replace("@", "")}`

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <Image
              src="/images/logo.png"
              alt="CRUMBS Logo"
              width={150}
              height={60}
              priority
              className="h-16 w-auto"
            />
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
              <Link href="/trabaja-con-nosotros" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Trabaja con nosotros
              </Link>
            </nav>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="font-[family-name:var(--font-dm-serif)] text-lg">Ubicación</h4>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 text-accent" />
              <div>
                <p className="text-sm text-primary-foreground/90">{direccion}</p>
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
                  <p className="text-sm text-primary-foreground/70">{horarioCafeteria}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-foreground/90">Cocina</p>
                  <p className="text-sm text-primary-foreground/70">{horarioCocina}</p>
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
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          >
            <Instagram className="w-5 h-5" />
            {instagramHandle}
          </a>
        </div>
      </div>
    </footer>
  )
}
