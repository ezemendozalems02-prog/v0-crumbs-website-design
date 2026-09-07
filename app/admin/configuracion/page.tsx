"use client"

import { useState, useEffect, useCallback } from "react"
import { getConfiguracionCompleta, updateConfiguracionBulk, type ConfigItem } from "@/lib/admin-configuracion"
import { Clock, MapPin, Instagram, Phone, Mail, Save, CheckCircle, AlertCircle, Loader2, Settings, Truck } from "lucide-react"

type Campo = { id: string; label: string; placeholder: string; type?: "text" | "number" }

const GRUPOS: { titulo: string; icono: typeof Clock; campos: Campo[] }[] = [
  {
    titulo: "Horarios",
    icono: Clock,
    campos: [
      { id: "horario_cafeteria", label: "Cafetería", placeholder: "Ej: 8:30 a 20 hs" },
      { id: "horario_cocina", label: "Cocina", placeholder: "Ej: 12 a 15:30 hs / 20 a 23:30 hs" },
    ],
  },
  {
    titulo: "Ubicación",
    icono: MapPin,
    campos: [
      { id: "direccion", label: "Dirección", placeholder: "Ej: Ciudad Jardín, Buenos Aires, Argentina" },
    ],
  },
  {
    titulo: "Delivery",
    icono: Truck,
    campos: [
      { id: "costo_envio", label: "Costo de envío ($)", placeholder: "Ej: 1000", type: "number" as const },
    ],
  },
  {
    titulo: "Redes y Contacto",
    icono: Instagram,
    campos: [
      { id: "instagram", label: "Instagram", placeholder: "Ej: @crumbs" },
      { id: "whatsapp", label: "WhatsApp", placeholder: "Ej: +5491112345678" },
      { id: "email_contacto", label: "Email", placeholder: "Ej: hola@crumbs.com.ar" },
    ],
  },
]

type Estado = "idle" | "guardando" | "ok" | "error"

export default function AdminConfiguracionPage() {
  const [config, setConfig] = useState<Record<string, string>>({})
  const [original, setOriginal] = useState<Record<string, string>>({})
  const [estado, setEstado] = useState<Estado>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const cargar = useCallback(async () => {
    setIsLoading(true)
    try {
      const items: ConfigItem[] = await getConfiguracionCompleta()
      const mapa = Object.fromEntries(items.map((i) => [i.id, i.valor]))
      setConfig(mapa)
      setOriginal(mapa)
    } catch {
      setErrorMsg("Error al cargar la configuración")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const hayCambios = Object.keys(config).some((k) => config[k] !== original[k])

  const handleChange = (id: string, valor: string) => {
    setConfig((prev) => ({ ...prev, [id]: valor }))
    if (estado === "ok" || estado === "error") setEstado("idle")
  }

  const handleGuardar = async () => {
    setEstado("guardando")
    setErrorMsg("")

    const cambios: Record<string, string> = {}
    Object.keys(config).forEach((k) => {
      if (config[k] !== original[k]) cambios[k] = config[k]
    })

    try {
      const result = await updateConfiguracionBulk(cambios)
      if (!result.success) {
        setEstado("error")
        setErrorMsg(result.error ?? "Error desconocido")
        return
      }
      setOriginal({ ...config })
      setEstado("ok")
      setTimeout(() => setEstado("idle"), 3000)
    } catch {
      setEstado("error")
      setErrorMsg("Error de conexión al guardar")
    }
  }

  const handleDescartar = () => {
    setConfig({ ...original })
    setEstado("idle")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Configuración del sitio</h1>
            <p className="text-sm text-foreground/50">Los cambios se reflejan en el sitio al guardar</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          {hayCambios && (
            <button
              onClick={handleDescartar}
              disabled={estado === "guardando"}
              className="px-4 py-2 text-sm text-foreground/60 hover:text-foreground border border-border/40 rounded-xl transition-colors"
            >
              Descartar
            </button>
          )}
          <button
            onClick={handleGuardar}
            disabled={!hayCambios || estado === "guardando"}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              !hayCambios || estado === "guardando"
                ? "bg-primary/30 text-primary-foreground/50 cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            }`}
          >
            {estado === "guardando" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {estado === "guardando" ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>

      {/* Feedback */}
      {estado === "ok" && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-xl text-sm border border-green-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Cambios guardados correctamente. El sitio se actualizó.
        </div>
      )}
      {estado === "error" && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Grupos de campos */}
      {GRUPOS.map(({ titulo, icono: Icono, campos }) => (
        <div key={titulo} className="bg-card rounded-2xl border border-border/40 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Icono className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">{titulo}</h2>
          </div>
          {campos.map(({ id, label, placeholder, type }) => (
            <div key={id}>
              <label className="text-xs font-medium text-foreground/60 block mb-1.5">{label}</label>
              <input
                type={type ?? "text"}
                min={type === "number" ? 0 : undefined}
                value={config[id] ?? ""}
                onChange={(e) => handleChange(id, e.target.value)}
                placeholder={placeholder}
                className={`w-full px-3 py-2.5 bg-background border rounded-xl text-sm text-foreground outline-none transition-colors ${
                  config[id] !== original[id]
                    ? "border-primary/60 ring-1 ring-primary/20"
                    : "border-border/40 focus:border-primary/60"
                }`}
              />
              {config[id] !== original[id] && (
                <p className="text-xs text-primary/70 mt-1">Modificado — recordá guardar</p>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Indicador de cambios pendientes */}
      {hayCambios && (
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          <span>Hay cambios sin guardar</span>
          <button
            onClick={handleGuardar}
            disabled={estado === "guardando"}
            className="font-medium underline hover:no-underline"
          >
            Guardar ahora
          </button>
        </div>
      )}
    </div>
  )
}
