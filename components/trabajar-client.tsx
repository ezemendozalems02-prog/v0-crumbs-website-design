"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Upload, Send, FileText, Loader2 } from "lucide-react"

interface TrabajarClientProps {
  bannerImageUrl: string | null
}

export function TrabajarClient({ bannerImageUrl }: TrabajarClientProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    puesto: "",
    mensaje: "",
  })
  const [archivo, setArchivo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error"; texto: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.includes("pdf")) {
        setMensaje({ tipo: "error", texto: "Solo se permiten archivos PDF" })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setMensaje({ tipo: "error", texto: "El archivo no puede superar los 5MB" })
        return
      }
      setArchivo(file)
      setMensaje(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje(null)

    if (!formData.nombre || !formData.telefono || !formData.email || !formData.puesto) {
      setMensaje({ tipo: "error", texto: "Por favor completá todos los campos obligatorios" })
      return
    }
    if (!archivo) {
      setMensaje({ tipo: "error", texto: "Por favor adjuntá tu CV" })
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setMensaje({ tipo: "error", texto: "Por favor ingresá un email válido" })
      return
    }

    setLoading(true)
    setMensaje({ tipo: "success", texto: "Enviando postulación..." })

    try {
      const formDataBlob = new FormData()
      formDataBlob.append("file", archivo)

      const uploadRes = await fetch("/api/upload-cv-supabase", {
        method: "POST",
        body: formDataBlob,
      })
      if (!uploadRes.ok) {
        const errorText = await uploadRes.text()
        throw new Error("Error al subir el CV: " + errorText)
      }
      const uploadData = await uploadRes.json()
      const cvUrl = uploadData.url

      const emailRes = await fetch("/api/send-postulacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, cvUrl, cvNombreArchivo: archivo.name }),
      })
      if (!emailRes.ok) {
        const errorText = await emailRes.text()
        throw new Error("Error al enviar la postulación: " + errorText)
      }

      setMensaje({
        tipo: "success",
        texto: "Tu postulación fue enviada correctamente. Gracias por tu interés en CRUMBS.",
      })
      setFormData({ nombre: "", telefono: "", email: "", puesto: "", mensaje: "" })
      setArchivo(null)
      const fileInput = document.getElementById("cv-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: error instanceof Error ? error.message : "Hubo un problema al enviar tu postulación. Intentá nuevamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background page-content">
      <Navigation />

      {/* Hero banner */}
      {bannerImageUrl ? (
        <div className="w-full overflow-hidden" style={{ maxHeight: "520px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerImageUrl}
            alt="Trabajá con nosotros en CRUMBS"
            width={1440}
            height={480}
            className="w-full h-auto block"
            style={{ maxHeight: "520px", objectFit: "cover", objectPosition: "center 70%" }}
            fetchPriority="high"
          />
        </div>
      ) : (
        <div className="h-32 bg-primary" />
      )}

      <div className="container mx-auto px-4 py-20 max-w-3xl">
        {/* Header — solo si no hay banner */}
        {!bannerImageUrl && (
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Trabajá con nosotros
            </h1>
            <p className="text-lg text-foreground/70 text-pretty">
              Si te gustaría trabajar en un ambiente cálido, dinámico y con mucha onda, nos encantaría conocerte.
            </p>
          </div>
        )}

        {bannerImageUrl && (
          <div className="text-center mb-12 pt-4">
            <p className="text-lg text-foreground/70 text-pretty">
              Si te gustaría trabajar en un ambiente cálido, dinámico y con mucha onda, nos encantaría conocerte.
            </p>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-card rounded-3xl border border-border/40 shadow-sm p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-2">
                Nombre y apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text" id="nombre" name="nombre" value={formData.nombre}
                onChange={handleInputChange} required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-foreground mb-2">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel" id="telefono" name="telefono" value={formData.telefono}
                onChange={handleInputChange} required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="11 1234-5678"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email" id="email" name="email" value={formData.email}
                onChange={handleInputChange} required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="puesto" className="block text-sm font-medium text-foreground mb-2">
                Puesto de interés <span className="text-red-500">*</span>
              </label>
              <select
                id="puesto" name="puesto" value={formData.puesto}
                onChange={handleInputChange} required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">Seleccioná un puesto</option>
                <option value="Mozo/Moza">Mozo/Moza</option>
                <option value="Cocinero/Cocinera">Cocinero/Cocinera</option>
                <option value="Barista">Barista</option>
                <option value="Pastelero/Pastelera">Pastelero/Pastelera</option>
                <option value="Ayudante de cocina">Ayudante de cocina</option>
                <option value="Encargado/Encargada">Encargado/Encargada</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-sm font-medium text-foreground mb-2">
                Mensaje adicional (opcional)
              </label>
              <textarea
                id="mensaje" name="mensaje" value={formData.mensaje}
                onChange={handleInputChange} rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                placeholder="Contanos un poco sobre vos y por qué te gustaría trabajar en CRUMBS..."
              />
            </div>

            <div>
              <label htmlFor="cv-upload" className="block text-sm font-medium text-foreground mb-2">
                Adjuntá tu CV <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input type="file" id="cv-upload" onChange={handleFileChange} accept=".pdf" required className="sr-only" />
                <label
                  htmlFor="cv-upload"
                  className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-background cursor-pointer transition-all group"
                >
                  {archivo ? (
                    <>
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm text-foreground font-medium">{archivo.name}</span>
                      <span className="text-xs text-foreground/50 ml-auto">({(archivo.size / 1024).toFixed(0)} KB)</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-foreground/40 group-hover:text-primary transition-colors" />
                      <span className="text-sm text-foreground/60 group-hover:text-foreground transition-colors">
                        Hacé clic para seleccionar tu CV (PDF)
                      </span>
                    </>
                  )}
                </label>
              </div>
              <p className="text-xs text-foreground/50 mt-2">Tamaño máximo: 5 MB</p>
            </div>

            {mensaje && (
              <div className={`p-4 rounded-xl ${mensaje.tipo === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                <p className="text-sm font-medium">{mensaje.texto}</p>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /><span>Enviando...</span></>
              ) : (
                <><Send className="w-5 h-5" /><span>Enviar postulación</span></>
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  )
}
