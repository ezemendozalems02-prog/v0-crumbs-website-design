// Tipos y constantes para Horarios de reserva
// Sin "use server" - puede importarse desde cualquier lugar

export type MealType = "almuerzo" | "cena"

export type ReservationTime = {
  id: string
  time: string
  meal_type: MealType
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type ReservationTimeInput = {
  time: string
  meal_type: MealType
  is_active: boolean
  sort_order: number
}

export const MEAL_TYPE_OPCIONES: { value: MealType; label: string }[] = [
  { value: "almuerzo", label: "Almuerzo" },
  { value: "cena", label: "Cena" },
]

export const HORARIO_FORMATO_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/
