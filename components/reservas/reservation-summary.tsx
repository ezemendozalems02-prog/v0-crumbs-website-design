"use client"

import { CalendarDays, Clock, Users, User, Phone, FileText, CheckCircle2, Armchair } from "lucide-react"
import type { TableOption } from "@/components/reservas/reservas-client"

interface ReservationSummaryProps {
  table: TableOption
  personas: number
  date: Date
  time: string
  nombre: string
  telefono: string
  requerimiento: string
  onReservar: () => void
  isLoading?: boolean
}

export function ReservationSummary({
  table,
  personas,
  date,
  time,
  nombre,
  telefono,
  requerimiento,
  onReservar,
  isLoading = false,
}: ReservationSummaryProps) {
  const fechaStr = date.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="bg-primary rounded-2xl p-6 md:p-8 text-primary-foreground shadow-xl animate-fade-in-up">
      <p className="font-[family-name:var(--font-caveat)] text-accent text-lg mb-2">tu reserva</p>
      <h3 className="font-[family-name:var(--font-dm-serif)] text-2xl mb-6">
        Resumen
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <SummaryRow icon={<Armchair className="w-4 h-4" />} label="Mesa" value={table.label} />
        <SummaryRow icon={<Users className="w-4 h-4" />} label="Personas" value={`${personas} persona${personas > 1 ? "s" : ""}`} />
        <SummaryRow icon={<CalendarDays className="w-4 h-4" />} label="Fecha" value={fechaStr} />
        <SummaryRow icon={<Clock className="w-4 h-4" />} label="Horario" value={time} />
        <SummaryRow icon={<User className="w-4 h-4" />} label="Nombre" value={nombre} />
        <SummaryRow icon={<Phone className="w-4 h-4" />} label="Teléfono" value={telefono} />
        {requerimiento.trim() && (
          <div className="md:col-span-2">
            <SummaryRow
              icon={<FileText className="w-4 h-4" />}
              label="Requerimiento"
              value={requerimiento.trim()}
            />
          </div>
        )}
        <div className="md:col-span-2">
          <SummaryRow
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            label="Tolerancia"
            value="Aceptada — 15 min máximo"
          />
        </div>
      </div>

      <button
        onClick={onReservar}
        disabled={isLoading}
        style={{ touchAction: "manipulation", minHeight: "56px" }}
        className={`w-full flex items-center justify-center gap-3 rounded-full font-semibold text-base transition-all duration-300 shadow-lg px-8 ${
          isLoading
            ? "bg-[#25D366]/60 text-white/80 cursor-wait"
            : "bg-[#25D366] text-white hover:bg-[#20BD5A] active:bg-[#1aab50] hover:shadow-xl"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Guardando reserva...
          </>
        ) : (
          <>
            <WhatsAppIcon />
            Reservar por WhatsApp
          </>
        )}
      </button>

      <p className="text-center text-xs text-primary-foreground/40 mt-4">
        Al tocar el botón se abrirá WhatsApp con tu reserva precargada.
      </p>
    </div>
  )
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-primary-foreground/50 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-primary-foreground/50 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-primary-foreground font-medium leading-snug capitalize">{value}</p>
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
