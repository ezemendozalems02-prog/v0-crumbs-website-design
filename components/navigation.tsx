"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, LayoutDashboard } from "lucide-react"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/delivery", label: "Delivery" },
  { href: "/reservas", label: "Reservas", highlight: true },
  { href: "/contacto", label: "Contacto" },
  { href: "/trabaja-con-nosotros", label: "Trabajá con nosotros" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-primary/10">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <span className="font-[family-name:var(--font-dm-serif)] text-2xl md:text-3xl text-primary tracking-wide">
              CRUMBS
            </span>
            <span className="block font-[family-name:var(--font-caveat)] text-sm text-accent -mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              café & cocina
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary hover:after:w-full after:transition-all after:duration-300 ${
                  link.highlight
                    ? "text-primary font-semibold"
                    : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/reservas"
              className="flex items-center gap-1.5 text-xs font-medium text-foreground/50 hover:text-primary border border-border/40 hover:border-primary/40 px-3 py-1.5 rounded-full transition-all duration-300"
              title="Panel Admin"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-primary/10 pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-foreground/80 hover:text-primary transition-colors duration-300 py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin/reservas"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors py-2 text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                Panel Admin
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
