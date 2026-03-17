"use client"

import { useState } from "react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ReservasHero } from "@/components/reservas/hero"
import { TableSelector } from "@/components/reservas/table-selector"
import { DateSelector } from "@/components/reservas/date-selector"
import { TimeSelector } from "@/components/reservas/time-selector"
import { ReservationForm } from "@/components/reservas/reservation-form"
import { ReservationSummary } from "@/components/reservas/reservation-summary"
import { AvailabilityBadge } from "@/components/reservas/availability-badge"

export type TableOption = {
  id: "2" | "4" | "6" | "8+"
  label: string
  description: string
  capacity: string
  maxPersons: number
  minPersons: number
  image: string
}

export const TABLE_OPTIONS: TableOption[] = [
  {
    id: "2",
    label: "Mesa para 2",
    description: "Ideal para encuentros íntimos o charlas tranquilas",
    capacity: "Hasta 2 personas",
    maxPersons: 2,
    minPersons: 1,
    image: "/images/mesa-2.jpg",
  },
  {
    id: "4",
    label: "Mesa para 4",
    description: "Ideal para grupos pequeños",
    capacity: "Hasta 4 personas",
    maxPersons: 4,
    minPersons: 3,
    image: "/images/mesa-4.jpg",
  },
  {
    id: "6",
    label: "Mesa para 6",
    description: "Ideal para reuniones o familias",
    capacity: "Hasta 6 personas",
    maxPersons: 6,
    minPersons: 5,
    image: "/images/mesa-6.jpg",
  },
  {
    id: "8+",
    label: "Mesa para 8 o más",
    description: "Ideal para celebraciones o grupos grandes",
    capacity: "De 8 a 15 personas",
    maxPersons: 15,
    minPersons: 8,
    image: "/images/mesa-8.jpg",
  },
]

export const HORARIOS = [
  "12:00", "12:30", "13:00", "13:30",
  "20:00", "20:30", "21:00", "21:30", "22:00",
]

export const STOCK_TOTAL = 100

// Simulated reserved covers per date (key: "YYYY-MM-DD")
// In production this comes from the database
const MOCK_RESERVED: Record<string, number> = {}

export default function ReservasPage() {
  const [selectedTable, setSelectedTable] = useState<TableOption | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [personas, setPersonas] = useState<number>(0)
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [requerimiento, setRequerimiento] = useState("")
  const [tolerancia, setTolerancia] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const dateKey = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : null

  const reservedCovers = dateKey ? (MOCK_RESERVED[dateKey] ?? 0) : 0
  const availableCovers = STOCK_TOTAL - reservedCovers

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!selectedTable) e.table = "Elegí un tipo de mesa"
    if (!selectedDate) e.date = "Seleccioná una fecha"
    if (!selectedTime) e.time = "Elegí un horario"
    if (!personas || personas < 1) e.personas = "Indicá la cantidad de personas"
    if (selectedTable && personas > selectedTable.maxPersons)
      e.personas = `Máximo ${selectedTable.maxPersons} personas para esta mesa`
    if (selectedTable && personas < selectedTable.minPersons)
      e.personas = `Mínimo ${selectedTable.minPersons} personas para esta mesa`
    if (selectedTable?.id === "8+" && personas > 15)
      e.personas = "Máximo 15 personas"
    if (!nombre.trim()) e.nombre = "Completá tu nombre y apellido"
    if (!telefono.trim()) e.telefono = "Completá tu teléfono"
    if (!/^[\d\s\+\-\(\)]{6,}$/.test(telefono.trim()))
      e.telefono = "Ingresá un teléfono válido"
    if (!tolerancia) e.tolerancia = "Debés aceptar el tiempo de tolerancia"
    if (personas > availableCovers)
      e.stock = `No hay cubiertos suficientes para esta fecha. Disponibles: ${availableCovers}`
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleReservar() {
    if (!validate()) return

    const fechaStr = selectedDate!.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const req = requerimiento.trim() || "Sin requerimientos especiales"

    const message =
      `Hola CRUMBS, quiero hacer una reserva.\n\n` +
      `Datos de mi reserva:\n` +
      `Nombre: ${nombre.trim()}\n` +
      `Teléfono: ${telefono.trim()}\n` +
      `Mesa: ${selectedTable!.label}\n` +
      `Cantidad de personas: ${personas}\n` +
      `Fecha: ${fechaStr}\n` +
      `Horario: ${selectedTime}\n` +
      `Requerimiento especial: ${req}\n\n` +
      `Confirmo que leí y acepto el tiempo de tolerancia de la reserva.\n\n` +
      `Por favor, confirmen disponibilidad. Gracias.`

    window.location.href = `https://wa.me/5491136634236?text=${encodeURIComponent(message)}`
  }

  const isFormReady =
    !!selectedTable && !!selectedDate && !!selectedTime &&
    personas >= 1 && nombre.trim() && telefono.trim() && tolerancia

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <ReservasHero />

      <div className="max-w-4xl mx-auto px-6 pb-24 space-y-16">

        {/* 1 — Selector de mesa */}
        <section>
          <SectionLabel number="01" title="Elegí tu mesa" />
          <TableSelector
            options={TABLE_OPTIONS}
            selected={selectedTable}
            onSelect={(t) => {
              setSelectedTable(t)
              setPersonas(0)
              setErrors((e) => ({ ...e, table: "", personas: "" }))
            }}
            error={errors.table}
          />
        </section>

        {/* 2 — Fecha y disponibilidad */}
        <section>
          <SectionLabel number="02" title="Seleccioná la fecha" />
          <DateSelector
            selected={selectedDate}
            onSelect={(d) => {
              setSelectedDate(d)
              setErrors((e) => ({ ...e, date: "" }))
            }}
            error={errors.date}
          />
          {selectedDate && (
            <div className="mt-4">
              <AvailabilityBadge available={availableCovers} total={STOCK_TOTAL} />
            </div>
          )}
          {errors.stock && (
            <p className="mt-3 text-sm text-red-500">{errors.stock}</p>
          )}
        </section>

        {/* 3 — Horario */}
        <section>
          <SectionLabel number="03" title="Elegí un horario" />
          <TimeSelector
            horarios={HORARIOS}
            selected={selectedTime}
            onSelect={(h) => {
              setSelectedTime(h)
              setErrors((e) => ({ ...e, time: "" }))
            }}
            error={errors.time}
          />
        </section>

        {/* 4 — Formulario */}
        <section>
          <SectionLabel number="04" title="Completá tus datos" />
          <ReservationForm
            table={selectedTable}
            personas={personas}
            nombre={nombre}
            telefono={telefono}
            requerimiento={requerimiento}
            tolerancia={tolerancia}
            onPersonasChange={(v) => { setPersonas(v); setErrors((e) => ({ ...e, personas: "" })) }}
            onNombreChange={(v) => { setNombre(v); setErrors((e) => ({ ...e, nombre: "" })) }}
            onTelefonoChange={(v) => { setTelefono(v); setErrors((e) => ({ ...e, telefono: "" })) }}
            onRequerimientoChange={setRequerimiento}
            onToleranciaChange={(v) => { setTolerancia(v); setErrors((e) => ({ ...e, tolerancia: "" })) }}
            errors={errors}
          />
        </section>

        {/* 5 — Resumen + botón */}
        {isFormReady && (
          <section>
            <SectionLabel number="05" title="Confirmá tu reserva" />
            <ReservationSummary
              table={selectedTable!}
              personas={personas}
              date={selectedDate!}
              time={selectedTime}
              nombre={nombre}
              telefono={telefono}
              requerimiento={requerimiento}
              onReservar={handleReservar}
            />
          </section>
        )}

        {/* Botón siempre visible al final */}
        {!isFormReady && (
          <div className="flex justify-center">
            <button
              onClick={handleReservar}
              className="flex items-center gap-3 bg-primary/20 text-primary/50 px-8 py-4 rounded-full font-medium cursor-not-allowed text-sm"
              disabled
            >
              <WhatsAppIcon />
              Reservar por WhatsApp
            </button>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-8">
      <span className="font-[family-name:var(--font-caveat)] text-accent text-xl leading-none">{number}</span>
      <h2 className="font-[family-name:var(--font-dm-serif)] text-2xl md:text-3xl text-primary text-balance">
        {title}
      </h2>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
