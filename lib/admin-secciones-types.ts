// Tipos y constantes para Secciones
// Sin "use server" - puede importarse desde cualquier lugar

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
