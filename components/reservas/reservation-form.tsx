"use client"

import { Users, User, Phone, Mail, FileText, Clock } from "lucide-react"
import type { TableOption } from "@/components/reservas/reservas-client"

interface ReservationFormProps {
  table: TableOption | null
  personas: number
  nombre: string
  telefono: string
  email: string
  requerimiento: string
  tolerancia: boolean
  onPersonasChange: (v: number) => void
  onNombreChange: (v: string) => void
  onTelefonoChange: (v: string) => void
  onEmailChange: (v: string) => void
  onRequerimientoChange: (v: string) => void
  onToleranciaChange: (v: boolean) => void
  errors: Record<string, string>
}

export function ReservationForm({
  table,
  personas,
  nombre,
  telefono,
  email,
  requerimiento,
  tolerancia,
  onPersonasChange,
  onNombreChange,
  onTelefonoChange,
  onEmailChange,
  onRequerimientoChange,
  onToleranciaChange,
  errors,
}: ReservationFormProps) {
  const maxPersonas = table?.maxPersons ?? 15
  const minPersonas = table?.minPersons ?? 1

  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 border border-primary/10 space-y-6">

      {/* Cantidad de personas */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-3">
          <Users className="w-4 h-4 text-accent" />
          Cantidad de personas
          {table && (
            <span className="ml-auto text-xs text-foreground/40">
              {table.id === "8+" ? "8 – 15 personas" : `1 – ${table.maxPersons} personas`}
            </span>
          )}
        </label>

        {table ? (
          <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
            {Array.from(
              { length: maxPersonas - minPersonas + 1 },
              (_, i) => i + minPersonas
            ).map((n) => (
              <button
                key={n}
                onClick={() => onPersonasChange(n)}
                className={`relative px-3 py-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center min-h-[44px] ${
                  personas === n
                    ? "border-primary bg-primary/10 scale-105 text-primary"
                    : "border-primary/20 bg-background hover:border-primary/50 text-foreground"
                }`}
              >
                <span className="text-sm font-semibold">{n}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground/40 italic">Primero elegí un tipo de mesa</p>
        )}
        {errors.personas && <p className="mt-2 text-sm text-red-500">{errors.personas}</p>}
      </div>

      {/* Nombre */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-2">
          <User className="w-4 h-4 text-accent" />
          Nombre y apellido
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => onNombreChange(e.target.value)}
          placeholder="Tu nombre completo"
          className={`w-full px-4 py-3 rounded-xl bg-background border text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors duration-200 focus:border-primary/60 ${
            errors.nombre ? "border-red-400" : "border-primary/15"
          }`}
        />
        {errors.nombre && <p className="mt-1.5 text-sm text-red-500">{errors.nombre}</p>}
      </div>

      {/* Teléfono */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-2">
          <Phone className="w-4 h-4 text-accent" />
          Teléfono
        </label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => onTelefonoChange(e.target.value)}
          placeholder="Ej: 11 5555-5555"
          className={`w-full px-4 py-3 rounded-xl bg-background border text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors duration-200 focus:border-primary/60 ${
            errors.telefono ? "border-red-400" : "border-primary/15"
          }`}
        />
        {errors.telefono && <p className="mt-1.5 text-sm text-red-500">{errors.telefono}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-2">
          <Mail className="w-4 h-4 text-accent" />
          Email
          <span className="ml-auto text-xs text-foreground/30">Opcional - Para confirmación</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="tu@email.com"
          className={`w-full px-4 py-3 rounded-xl bg-background border text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors duration-200 focus:border-primary/60 ${
            errors.email ? "border-red-400" : "border-primary/15"
          }`}
        />
        {errors.email && <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Requerimiento especial */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-2">
          <FileText className="w-4 h-4 text-accent" />
          Requerimiento especial
          <span className="ml-auto text-xs text-foreground/30">Opcional</span>
        </label>
        <textarea
          value={requerimiento}
          onChange={(e) => onRequerimientoChange(e.target.value)}
          placeholder="Escribí acá cualquier detalle importante para tu reserva: cumpleaños, aniversario, mesa cerca de ventana, alergia alimentaria, silla para bebé..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-background border border-primary/15 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors duration-200 focus:border-primary/60 resize-none"
        />
      </div>

      {/* Tolerancia */}
      <div className={`p-4 rounded-xl border transition-colors duration-200 ${
        tolerancia ? "border-primary/30 bg-primary/5" : "border-primary/10 bg-background"
      } ${errors.tolerancia ? "border-red-300" : ""}`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={tolerancia}
              onChange={(e) => onToleranciaChange(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                tolerancia ? "bg-primary border-primary" : "border-primary/30 bg-background"
              }`}
            >
              {tolerancia && (
                <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Confirmo que leí y acepto el tiempo de tolerancia de la reserva.
            </p>
            <p className="text-xs text-foreground/50 mt-1 leading-relaxed flex items-start gap-1.5">
              <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent" />
              La reserva tiene una tolerancia máxima de 15 minutos. Pasado ese tiempo, la mesa puede liberarse según disponibilidad.
            </p>
          </div>
        </label>
        {errors.tolerancia && <p className="mt-2 text-sm text-red-500">{errors.tolerancia}</p>}
      </div>

    </div>
  )
}
