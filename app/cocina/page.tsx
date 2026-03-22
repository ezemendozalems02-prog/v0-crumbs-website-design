import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { getMenuByTipo } from "@/lib/menu-publico"
import { MenuCategorySection } from "@/components/menu-category-section"
import type { MenuCategory } from "@/lib/menu-publico"

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
  const menuData = liveMenu.length > 0 ? liveMenu : staticMenuData

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/cocina-hero.jpg" alt="Cocina CRUMBS" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="font-[family-name:var(--font-caveat)] text-2xl text-card/90 mb-4 block animate-fade-in">Nuestra carta</span>
          <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl md:text-6xl lg:text-7xl text-card leading-tight animate-fade-in-up">Almuerzos & Cenas</h1>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-[family-name:var(--font-caveat)] text-xl text-accent">Cocina de estación</span>
            <p className="text-foreground/70 mt-4 max-w-2xl mx-auto">
              Platos preparados con ingredientes frescos y de estación. Una experiencia gastronómica completa en Ciudad Jardín.
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

interface MenuItem {
  name: string
  price: number
  description?: string
}

interface MenuCategory {
  name: string
  items: MenuItem[]
}

const menuData: MenuCategory[] = [
  {
    name: "Entradas",
    items: [
      { name: "Papas Fritas", price: 7000 },
      { name: "Papas a Caballo", price: 9400, description: "Con huevos fritos" },
      { name: "Papas Bar", price: 11900, description: "Con cheddar, panceta y cebolla de verdeo" },
      { name: "Nuggets", price: 13200, description: "Con salsa de miel mostaza" },
      { name: "Bastones de Mozzarella", price: 12500, description: "Con salsa marinara" },
      { name: "Tabla de Quesos", price: 18500, description: "Selección de quesos con frutos secos y miel" },
      { name: "Bruschetta Clásica", price: 9800, description: "Tomate, albahaca, ajo y aceite de oliva" },
    ],
  },
  {
    name: "Hamburguesas",
    items: [
      { name: "Clásica", price: 15800, description: "Carne, cheddar, lechuga, tomate y salsa especial" },
      { name: "Bacon Lover", price: 18200, description: "Carne, cheddar, panceta crocante y cebolla caramelizada" },
      { name: "BBQ", price: 17500, description: "Carne, cheddar, panceta, onion rings y salsa BBQ" },
      { name: "Crispy Chicken", price: 16800, description: "Pollo crocante, coleslaw y salsa ranch" },
      { name: "Veggie", price: 15200, description: "Medallón de legumbres, guacamole y vegetales" },
      { name: "CRUMBS Burger", price: 21500, description: "Doble carne, doble cheddar, panceta, huevo y todas las salsas" },
    ],
  },
  {
    name: "Bowls",
    items: [
      { name: "Buddha Bowl", price: 16500, description: "Quinoa, garbanzos, palta, tomate cherry, zanahoria y hummus" },
      { name: "Poke Bowl", price: 19800, description: "Base de arroz, salmón, palta, edamame, mango y salsa ponzu" },
      { name: "Protein Bowl", price: 18200, description: "Arroz integral, pollo grillado, huevo, espinaca y semillas" },
      { name: "Mediterranean Bowl", price: 17500, description: "Cuscús, falafel, tomate, pepino, feta y tzatziki" },
    ],
  },
  {
    name: "Ensaladas",
    items: [
      { name: "Caesar", price: 14500, description: "Lechuga romana, pollo, parmesano, croutons y aderezo caesar" },
      { name: "Caprese", price: 13800, description: "Tomate, mozzarella fresca, albahaca y reducción de balsámico" },
      { name: "CRUMBS Salad", price: 16200, description: "Mix de verdes, pollo, palta, tomate cherry, huevo y semillas" },
      { name: "Burrata", price: 18500, description: "Burrata, tomate, rúcula, jamón crudo y aceite de trufa" },
    ],
  },
  {
    name: "Pizzas Individuales",
    items: [
      { name: "Margherita", price: 12800, description: "Salsa de tomate, mozzarella y albahaca fresca" },
      { name: "Pepperoni", price: 14500, description: "Salsa de tomate, mozzarella y pepperoni" },
      { name: "Cuatro Quesos", price: 15200, description: "Mozzarella, gorgonzola, parmesano y provolone" },
      { name: "Prosciutto", price: 16800, description: "Mozzarella, jamón crudo, rúcula y parmesano" },
      { name: "Vegetariana", price: 14200, description: "Verduras grilladas, mozzarella y pesto" },
    ],
  },
  {
    name: "Sandwiches",
    items: [
      { name: "Club Sandwich", price: 14800, description: "Pollo, panceta, lechuga, tomate y mayonesa" },
      { name: "Pulled Pork", price: 16500, description: "Cerdo desmechado, coleslaw y salsa BBQ" },
      { name: "Philly Cheese", price: 17200, description: "Carne, cebolla, morrón y queso fundido" },
      { name: "Veggie", price: 13800, description: "Vegetales grillados, hummus y queso de cabra" },
    ],
  },
  {
    name: "Wraps",
    items: [
      { name: "Wrap Caesar", price: 15400, description: "Pollo, lechuga, queso sardo y salsa caesar de la casa" },
      { name: "Wrap Pollo Palta", price: 17000, description: "Pollo, palta, tomate cherry, espinaca y alioli" },
      { name: "Wrap Hongos", price: 16000, description: "Hongos, queso, tomate asado, espinaca, repollo y alioli" },
      { name: "Wrap Falafel", price: 15800, description: "Falafel, hummus, vegetales frescos y salsa tahini" },
    ],
  },
  {
    name: "Al Plato",
    items: [
      { name: "Lomo a la Parrilla", price: 28500, description: "Con papas rústicas y vegetales grillados" },
      { name: "Salmón", price: 32000, description: "A la plancha con puré de papa y espárragos" },
      { name: "Pollo Grillado", price: 21500, description: "Con ensalada y papas al horno" },
      { name: "Milanesa Napolitana", price: 19800, description: "Con papas fritas" },
      { name: "Bife de Chorizo", price: 26500, description: "Con guarnición a elección" },
    ],
  },
  {
    name: "Pastas",
    items: [
      { name: "Spaghetti", price: 14500, description: "Con salsa a elección" },
      { name: "Ravioles de Ricotta", price: 16800, description: "Con salsa a elección" },
      { name: "Ñoquis", price: 15200, description: "Con salsa a elección" },
      { name: "Fetuccini Alfredo", price: 17500, description: "Con pollo y parmesano" },
      { name: "Lasagna", price: 18200, description: "Capas de pasta, carne, bechamel y queso" },
    ],
  },
  {
    name: "Salsas",
    items: [
      { name: "Bolognesa", price: 0, description: "Carne, tomate, cebolla y especias" },
      { name: "Filetto", price: 0, description: "Tomate fresco, ajo y albahaca" },
      { name: "Crema", price: 0, description: "Crema de leche con queso parmesano" },
      { name: "Pesto", price: 500, description: "Albahaca, piñones, parmesano y aceite de oliva" },
      { name: "Cuatro Quesos", price: 500, description: "Mozzarella, gorgonzola, parmesano y fontina" },
    ],
  },
]

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

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

function MenuCategorySection({ category, index }: { category: MenuCategory; index: number }) {
  const sectionRef = useInView()

  return (
    <div
      ref={sectionRef.ref}
      className={`transition-all duration-700 ${
        sectionRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${(index % 3) * 100}ms` }}
    >
      <h3 className="font-[family-name:var(--font-dm-serif)] text-2xl text-primary mb-6 pb-3 border-b border-primary/20">
        {category.name}
      </h3>
      <div className="space-y-4">
        {category.items.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className="group flex items-start justify-between gap-4 py-3 hover:bg-background/50 rounded-lg px-3 -mx-3 transition-colors duration-300"
          >
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </span>
                <span className="flex-1 border-b border-dotted border-foreground/20" />
              </div>
              {item.description && (
                <p className="text-sm text-foreground/60 mt-1">{item.description}</p>
              )}
            </div>
            <span className="font-medium text-accent whitespace-nowrap">
              {item.price === 0 ? "Incluida" : `$${item.price.toLocaleString("es-AR")}`}
              {item.price === 500 && " extra"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CocinaPage() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/cocina-hero.jpg"
            alt="Cocina CRUMBS"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary/70" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="font-[family-name:var(--font-caveat)] text-2xl text-card/90 mb-4 block animate-fade-in">
            Nuestra carta
          </span>
          <h1 className="font-[family-name:var(--font-dm-serif)] text-4xl md:text-6xl lg:text-7xl text-card leading-tight animate-fade-in-up">
            Almuerzos & Cenas
          </h1>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-24 bg-card">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-[family-name:var(--font-caveat)] text-xl text-accent">
              Cocina de estación
            </span>
            <p className="text-foreground/70 mt-4 max-w-2xl mx-auto">
              Platos preparados con ingredientes frescos y de estación.
              Una experiencia gastronómica completa en Ciudad Jardín.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {menuData.map((category, index) => (
              <MenuCategorySection key={index} category={category} index={index} />
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
