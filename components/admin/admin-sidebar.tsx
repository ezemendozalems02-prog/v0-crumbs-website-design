"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, UtensilsCrossed, BookOpen, Tag, CalendarCheck, Briefcase, Grid3x3, Image as ImageIcon, LayoutTemplate, Settings } from "lucide-react"
import { AdminLogoutButton } from "@/components/admin/logout-button"

const navItems = [
  { href: "/admin/reservas",     label: "Reservas",          icon: CalendarCheck },
  { href: "/admin/productos",    label: "Productos",          icon: UtensilsCrossed },
  { href: "/admin/categorias",   label: "Categorías",         icon: Tag },
  { href: "/admin/mesas",        label: "Mesas",              icon: Grid3x3 },
  { href: "/admin/postulaciones",label: "Propuestas",         icon: Briefcase },
  { href: "/admin/banners",      label: "Banners",            icon: ImageIcon },
  { href: "/admin/secciones",    label: "Secciones",          icon: LayoutTemplate },
  { href: "/admin/configuracion",label: "Configuración",      icon: Settings },
]

export function AdminSidebar() {
  const path = usePathname()
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-primary text-primary-foreground min-h-screen sticky top-0">
      <div className="px-5 py-6 border-b border-primary-foreground/10">
        <Image
          src="/images/logo.png"
          alt="CRUMBS Logo"
          width={140}
          height={50}
          priority
          className="h-10 w-auto mb-2"
        />
        <p className="text-xs text-primary-foreground/50">Panel de administración</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/8"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-primary-foreground/10">
        <AdminLogoutButton variant="sidebar" />
      </div>
    </aside>
  )
}

export function AdminMobileNav() {
  const path = usePathname()
  return (
    <nav className="lg:hidden flex items-center gap-1 overflow-x-auto pb-0.5">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = path.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              active
                ? "bg-primary-foreground/15 text-primary-foreground"
                : "text-primary-foreground/60 hover:text-primary-foreground"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
