// Tipos y constantes compartidos para banners y secciones
// Sin directiva "use server" para poder importarse desde Client Components

export type Banner = {
  id: string
  titulo: string
  subtitulo: string | null
  descripcion: string | null
  imagen_url: string | null
  boton_texto: string | null
  boton_link: string | null
  pagina: string
  activo: boolean
  orden: number
  created_at: string
  updated_at: string
}

export type BannerInput = {
  titulo: string
  subtitulo?: string
  descripcion?: string
  imagen_url?: string
  boton_texto?: string
  boton_link?: string
  pagina: string
  activo: boolean
  orden: number
}

export type Seccion = {
  id: string
  clave: string
  nombre: string
  titulo: string | null
  subtitulo: string | null
  descripcion: string | null
  imagen_url: string | null
  pagina: string
  activo: boolean
  created_at: string
  updated_at: string
}

export type SeccionInput = {
  clave: string
  nombre: string
  titulo?: string
  subtitulo?: string
  descripcion?: string
  imagen_url?: string
  pagina: string
  activo: boolean
}

export const PAGINAS_OPCIONES = [
  { value: "inicio", label: "Inicio" },
  { value: "cafeteria", label: "Cafetería" },
  { value: "cocina", label: "Cocina" },
  { value: "delivery", label: "Delivery" },
  { value: "contacto", label: "Contacto" },
  { value: "nosotros", label: "Nosotros" },
]
