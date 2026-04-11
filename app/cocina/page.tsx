import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getMenuByTipo } from "@/lib/menu-publico"
import { MenuCategorySection } from "@/components/menu-category-section"
import type { MenuCategory } from "@/lib/menu-publico"
import { getBannersForPage, getSeccionByClave } from "@/lib/public-content"
import type { Banner } from "@/lib/admin-banners-types"

// Revalidar cada cambio (ISR con revalidación inmediata)
export const revalidate = 0
// Force dynamic rendering - sin caché estático
export const dynamic = 'force-dynamic'

const staticMenuData: MenuCategory[] = [
  {
    id: "sc-1", nombre: "Entradas", slug: "entradas", tipo_menu: "almuerzo_cena",
    productos: [
      { id: "c1", nombre: "Papas Fritas", precio: 7000, descripcion: null, disponible: true, destacado: false, orden: 0, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null },
      { id: "c2", nombre: "Papas Bar", precio: 11900, descripcion: "Con cheddar, panceta y cebolla de verdeo", disponible: true, destacado: false, orden: 1, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null },
      { id: "c3", nombre: "Nuggets", precio: 13200, descripcion: "Con salsa de miel mostaza", disponible: true, destacado: false, orden: 2, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null },
      { id: "c4", nombre: "Bastones de Mozzarella", precio: 12500, descripcion: "Con salsa marinara", disponible: true, destacado: false, orden: 3, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null },
      { id: "c5", nombre: "Tabla de Quesos", precio: 18500, descripcion: "Selección de quesos con frutos secos y miel", disponible: true, destacado: false, orden: 4, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null },
    ],
  },
  {
    id: "sc-2", nombre: "Hamburguesas", slug: "hamburguesas", tipo_menu: "almuerzo_cena",
    productos: [
      { id: "c6", nombre: "Clásica", precio: 15800, descripcion: "Carne, cheddar, lechuga, tomate y salsa especial", disponible: true, destacado: false, orden: 0, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null },
      { id: "c7", nombre: "Bacon Lover", precio: 18200, descripcion: "Carne, cheddar, panceta crocante y cebolla caramelizada", disponible: true, destacado: false, orden: 1, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null },
      { id: "c8", nombre: "CRUMBS Burger", precio: 21500, descripcion: "Doble carne, doble cheddar, panceta, huevo y todas las salsas", disponible: true, destacado: true, orden: 2, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null },
    ],
  },
  {
    id: "sc-3", nombre: "Ensaladas", slug: "ensaladas", tipo_menu: "almuerzo_cena",
    productos: [
      { id: "c9", nombre: "Caesar", precio: 14500, descripcion: "Lechuga romana, pollo, parmesano, croutons y aderezo caesar", disponible: true, destacado: false, orden: 0, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null },
      { id: "c10", nombre: "Burrata", precio: 18500, descripcion: "Burrata, tomate, rúcula, jamón crudo y aceite de trufa", disponible: true, destacado: true, orden: 1, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null },
    ],
  },
]

export default async function CocinaPage() {
  const liveMenu = await getMenuByTipo("almuerzo_cena")
  const banners = await getBannersForPage("cocina")
  const banner: Banner | null = banners.length > 0 ? banners[0] : null
  const seccion = await getSeccionByClave("cocina-intro")
  const menuData = liveMenu.length > 0 ? liveMenu : staticMenuData

  const heroImage = banner?.imagen_url || "/images/cocina-hero.jpg"
  const heroSubtitle = banner?.subtitulo || "Nuestra carta"
  const heroTitle = banner?.titulo || "Almuerzos & Cenas"
  const descriptionText = seccion?.descripcion || "Sabores, platos y buenos momentos para cuando pinta algo rico"

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroImage} alt="Cocina CRUMBS" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="font-[family-name:var(--font-caveat)] text-2xl text-card/90 mb-4 block animate-fade-in">{heroSubtitle}</span>
          <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl md:text-6xl lg:text-7xl text-card leading-tight animate-fade-in-up">{heroTitle}</h1>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-[family-name:var(--font-caveat)] text-xl text-accent">{seccion?.subtitulo || "Cocina de estación"}</span>
            <p className="text-foreground/70 mt-4 max-w-2xl mx-auto">
              {descriptionText}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {menuData.map((category, index) => (
              <MenuCategorySection key={category.id} category={category} index={index} />
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-sm text-foreground/50">Los precios pueden variar. Consultá por opciones sin TACC y alternativas vegetarianas.</p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
