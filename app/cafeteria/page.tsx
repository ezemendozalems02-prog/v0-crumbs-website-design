import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getMenuByTipo } from "@/lib/menu-publico"
import { MenuCategorySection } from "@/components/menu-category-section"
import { MenuSticker } from "@/components/menu-sticker"
import type { MenuCategory } from "@/lib/menu-publico"
import { getBannersForPage } from "@/lib/public-content"
import type { Banner } from "@/lib/admin-banners-types"

// Revalidar cada cambio (ISR con revalidación inmediata)
export const revalidate = 0
// Force dynamic rendering - sin caché estático
export const dynamic = 'force-dynamic'
const staticMenuData: MenuCategory[] = [
  {
    id: "static-1", nombre: "Cafés Clásicos", slug: "cafes-clasicos", tipo_menu: "desayuno",
    productos: [
      { id: "s1", nombre: "Espresso", precio: 2800, disponible: true, destacado: false, orden: 0, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s2", nombre: "Lungo", precio: 2800, disponible: true, destacado: false, orden: 1, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s3", nombre: "Cortado", precio: 2800, disponible: true, destacado: false, orden: 2, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s4", nombre: "Americano", precio: 3900, disponible: true, destacado: false, orden: 3, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s5", nombre: "Flat White", precio: 4600, disponible: true, destacado: false, orden: 4, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s6", nombre: "Latte", precio: 5000, disponible: true, destacado: false, orden: 5, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s7", nombre: "Capuccino", precio: 4600, disponible: true, destacado: false, orden: 6, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s8", nombre: "Mocaccino", precio: 5300, disponible: true, destacado: false, orden: 7, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
    ],
  },
  {
    id: "static-2", nombre: "Cafés Especiales", slug: "cafes-especiales", tipo_menu: "desayuno",
    productos: [
      { id: "s9", nombre: "Latte Vainilla", precio: 5800, disponible: true, destacado: false, orden: 0, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s10", nombre: "Latte Caramelo", precio: 5800, disponible: true, destacado: false, orden: 1, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s11", nombre: "Dirty Chai", precio: 6200, disponible: true, destacado: false, orden: 2, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s12", nombre: "Affogato", precio: 6500, disponible: true, destacado: false, orden: 3, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s13", nombre: "Irish Coffee", precio: 8500, disponible: true, destacado: false, orden: 4, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
    ],
  },
  {
    id: "static-3", nombre: "Sin Café", slug: "sin-cafe", tipo_menu: "desayuno",
    productos: [
      { id: "s14", nombre: "Chocolate Caliente", precio: 5000, disponible: true, destacado: false, orden: 0, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s15", nombre: "Matcha Latte", precio: 5800, disponible: true, destacado: false, orden: 1, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s16", nombre: "Chai Latte", precio: 5000, disponible: true, destacado: false, orden: 2, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
      { id: "s17", nombre: "Golden Milk", precio: 5200, disponible: true, destacado: false, orden: 3, categoria_id: "", etiquetas: [], created_at: "", updated_at: "", imagen_url: null, descripcion: null },
    ],
  },
]

export default async function CafeteriaPage() {
  const liveMenu = await getMenuByTipo("desayuno")
  const banners = await getBannersForPage("cafeteria")
  const banner: Banner | null = banners.length > 0 ? banners[0] : null
  const menuData = liveMenu.length > 0 ? liveMenu : staticMenuData

  const heroImage = banner?.imagen_url || "/images/cafeteria-hero.jpg"
  const heroSubtitle = banner?.subtitulo || "Nuestra carta"
  const heroTitle = banner?.titulo || "Desayunos & Cafetería"

  return (
    <main className="min-h-screen page-content">
      <Navigation />

      {/* Hero Section */}
      {banner?.imagen_url ? (
        <div className="w-full overflow-hidden" style={{ maxHeight: "520px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="Cafetería CRUMBS"
            width={1440}
            height={480}
            className="w-full h-auto block"
            style={{ maxHeight: "520px", objectFit: "cover", objectPosition: "center 70%" }}
            fetchPriority="high"
          />
        </div>
      ) : (
        <section className="relative h-[45vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src={heroImage} alt="Cafetería CRUMBS" fill className="object-cover" priority unoptimized />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <span className="font-[family-name:var(--font-reenie-beanie)] text-2xl text-card/90 mb-4 block animate-fade-in">
              {heroSubtitle}
            </span>
            <h1 className="font-[family-name:var(--font-work-sans)] font-black text-4xl md:text-6xl lg:text-7xl text-card leading-tight animate-fade-in-up uppercase" style={{ fontWeight: 900 }}>
              {heroTitle}
            </h1>
          </div>
        </section>
      )}

      {/* Menu Section */}
      <section className="py-24 bg-card relative">
        {/* Decorative stickers - only phrases */}
        <MenuSticker
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ilustraciones-cafeter%C3%ADa-17-DL93wckbaL4QXnqP8o3gYPUhFCRa6e.png"
          alt="mood jardinense"
          position="top-left"
          size="sm"
          opacity={0.07}
        />
        <MenuSticker
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ilustraciones-cafeter%C3%ADa-22-TMOr0qRmUyNXopNIF2q1sgo15UaU1e.png"
          alt="fresco frutal sin apuro"
          position="top-right"
          size="md"
          opacity={0.08}
        />
        <MenuSticker
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ilustraciones-cafeter%C3%ADa-24-PVHDAo3Pz9lG3eTBk1uF98fKkdQphf.png"
          alt="flecha decorativa"
          position="bottom-left"
          size="sm"
          opacity={0.07}
        />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="font-inter font-black text-xl text-accent uppercase">
              Café de especialidad
            </span>
            <p className="font-[family-name:var(--font-reenie-beanie)] text-foreground/70 mt-4 max-w-2xl mx-auto text-lg">
              Café, algo dulce y esos clasicos que siempre dan ganas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative">
            {menuData.map((category, index) => (
              <MenuCategorySection key={category.id} category={category} index={index} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-foreground/50">
              Los precios pueden variar. Consultá por opciones sin TACC y alternativas vegetarianas.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
