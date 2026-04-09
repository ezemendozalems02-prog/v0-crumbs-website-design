"use client"

import { useState, useEffect, useTransition } from "react"
import { getConfiguracionMesas, crearConfiguracionMesa, actualizarConfiguracionMesa, eliminarConfiguracionMesa, type ConfiguracionMesa } from "@/lib/mesas"
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MesasPage() {
  const [mesas, setMesas] = useState<ConfiguracionMesa[]>([])
  const [isLoading, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ capacidad: "", cantidad: "", descripcion: "" })
  const { toast } = useToast()

  const loadMesas = () => {
    startTransition(async () => {
      try {
        const data = await getConfiguracionMesas()
        setMesas(data)
      } catch (error) {
        toast({ title: "Error", description: "No se pudieron cargar las mesas", variant: "destructive" })
      }
    })
  }

  useEffect(() => {
    loadMesas()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        const capacidad = parseInt(formData.capacidad)
        const cantidad = parseInt(formData.cantidad)

        if (editingId) {
          await actualizarConfiguracionMesa(editingId, {
            capacidad,
            cantidad,
            descripcion: formData.descripcion || undefined,
          })
          toast({ title: "Éxito", description: "Mesa actualizada" })
        } else {
          await crearConfiguracionMesa(capacidad, cantidad, formData.descripcion)
          toast({ title: "Éxito", description: "Mesa creada" })
        }

        setFormData({ capacidad: "", cantidad: "", descripcion: "" })
        setEditingId(null)
        setShowForm(false)
        loadMesas()
      } catch (error) {
        toast({ title: "Error", description: "Ocurrió un error", variant: "destructive" })
      }
    })
  }

  const handleEdit = (mesa: ConfiguracionMesa) => {
    setEditingId(mesa.id)
    setFormData({
      capacidad: mesa.capacidad.toString(),
      cantidad: mesa.cantidad.toString(),
      descripcion: mesa.descripcion || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta configuración de mesa?")) return
    startTransition(async () => {
      try {
        await eliminarConfiguracionMesa(id)
        toast({ title: "Éxito", description: "Mesa eliminada" })
        loadMesas()
      } catch (error) {
        toast({ title: "Error", description: "No se pudo eliminar", variant: "destructive" })
      }
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground hidden lg:block sticky top-0 z-30 border-b border-primary-foreground/10">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/10 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10l8-4M7 11l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-dm-serif)] text-xl">Configuración de Mesas</h1>
              <p className="text-xs text-primary-foreground/60">Definí el inventario de mesas del restaurante</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadMesas} disabled={isLoading} className="flex items-center gap-2 px-3 py-2 bg-primary-foreground/10 rounded-xl text-sm hover:bg-primary-foreground/20 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ capacidad: "", cantidad: "", descripcion: "" }); }} className="flex items-center gap-2 px-4 py-2 bg-primary-foreground text-primary rounded-xl text-sm font-semibold hover:bg-primary-foreground/90 transition-colors">
              <Plus className="w-4 h-4" />
              Nueva mesa
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card rounded-2xl border border-border/40 p-4">
            <div className="text-xs text-foreground/60 font-medium mb-1">Total mesas</div>
            <div className="text-2xl font-bold text-foreground">{mesas.reduce((sum, m) => sum + m.cantidad, 0)}</div>
          </div>
          <div className="bg-card rounded-2xl border border-border/40 p-4">
            <div className="text-xs text-foreground/60 font-medium mb-1">Capacidades</div>
            <div className="text-2xl font-bold text-foreground">{mesas.length}</div>
          </div>
          <div className="bg-card rounded-2xl border border-border/40 p-4">
            <div className="text-xs text-foreground/60 font-medium mb-1">Pax totales</div>
            <div className="text-2xl font-bold text-foreground">{mesas.reduce((sum, m) => sum + m.cantidad * m.capacidad, 0)}</div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card rounded-2xl border border-border/40 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">{editingId ? "Editar mesa" : "Nueva mesa"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-foreground/60 block mb-2">Capacidad (personas)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacidad}
                    onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg text-sm focus:outline-none focus:border-primary/60"
                    placeholder="2, 4, 6..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground/60 block mb-2">Cantidad disponible</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg text-sm focus:outline-none focus:border-primary/60"
                    placeholder="5, 10, 3..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground/60 block mb-2">Descripción (opcional)</label>
                  <input
                    type="text"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border/40 rounded-lg text-sm focus:outline-none focus:border-primary/60"
                    placeholder="Junto a la ventana..."
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); setFormData({ capacidad: "", cantidad: "", descripcion: "" }); }}
                  className="px-4 py-2 bg-background border border-border/40 rounded-lg text-sm hover:bg-background/80 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {editingId ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-card rounded-2xl border border-border/40 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Inventario de mesas</h2>
          {mesas.length === 0 ? (
            <div className="text-center py-8 text-foreground/40">
              <p>No hay configuraciones de mesas. Crea una para comenzar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border/20">
                  <tr>
                    <th className="text-left py-3 px-3 font-semibold text-foreground/60">Capacidad</th>
                    <th className="text-left py-3 px-3 font-semibold text-foreground/60">Cantidad</th>
                    <th className="text-left py-3 px-3 font-semibold text-foreground/60">Pax totales</th>
                    <th className="text-left py-3 px-3 font-semibold text-foreground/60">Descripción</th>
                    <th className="text-right py-3 px-3 font-semibold text-foreground/60">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mesas.map((mesa) => (
                    <tr key={mesa.id} className="border-b border-border/10 hover:bg-background transition-colors">
                      <td className="py-3 px-3 font-medium text-foreground">{mesa.capacidad}</td>
                      <td className="py-3 px-3 text-foreground/70">{mesa.cantidad}</td>
                      <td className="py-3 px-3 text-foreground/70 font-medium">{mesa.capacidad * mesa.cantidad}</td>
                      <td className="py-3 px-3 text-foreground/60 text-xs">{mesa.descripcion || "—"}</td>
                      <td className="py-3 px-3 text-right flex gap-2 justify-end">
                        <button onClick={() => handleEdit(mesa)} className="p-2 hover:bg-background rounded-lg transition-colors">
                          <Pencil className="w-4 h-4 text-foreground/60" />
                        </button>
                        <button onClick={() => handleDelete(mesa.id)} className="p-2 hover:bg-background rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
