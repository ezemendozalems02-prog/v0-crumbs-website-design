"use client"

import { useState, useTransition } from "react"
import { createProducto, updateProducto, type Producto, type Categoria, type VarianteInput } from "@/lib/admin-productos"
import { ImageUploadField } from "./image-upload-field"
import { X, Plus, Trash2, Star, GripVertical } from "lucide-react"

interface Props {
  producto: Producto | null
  categorias: Categoria[]
  onClose: () => void
  onSaved: () => void
}

const TIPO_LABEL: Record<string, string> = {
  desayuno: "Desayunos",
  almuerzo_cena: "Almuerzo & Cenas",
  delivery: "Delivery",
  todos: "Todos",
}

const ETIQUETA_OPTIONS = ["Vegano", "Vegetariano", "Sin TACC", "Picante", "Nuevo", "Popular", "Sin lactosa"]

export function ProductoFormModal({ producto, categorias, onClose, onSaved }: Props) {
  const isEdit = !!producto
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [nombre, setNombre] = useState(producto?.nombre ?? "")
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "")
  const [precio, setPrecio] = useState(String(producto?.precio ?? ""))
  const [categoriaId, setCategoriaId] = useState(producto?.categoria_id ?? "")
  const [imagenUrl, setImagenUrl] = useState(producto?.imagen_url ?? "")
  const [disponible, setDisponible] = useState(producto?.disponible ?? true)
  const [destacado, setDestacado] = useState(producto?.destacado ?? false)
  const [etiquetas, setEtiquetas] = useState<string[]>(producto?.etiquetas ?? [])
  const [variantes, setVariantes] = useState<VarianteInput[]>(
    producto?.variantes?.map((v) => ({ nombre: v.nombre, precio: v.precio, disponible: v.disponible, orden: v.orden })) ?? []
  )

  const toggleEtiqueta = (e: string) => setEtiquetas((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e])
  const addVariante = () => setVariantes((prev) => [...prev, { nombre: "", precio: 0, disponible: true, orden: prev.length }])
  const removeVariante = (i: number) => setVariantes((prev) => prev.filter((_, idx) => idx !== i))
  const updateVariante = (i: number, field: keyof VarianteInput, value: any) =>
    setVariantes((prev) => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v))

  const handleSubmit = () => {
    if (!nombre.trim()) { setError("El nombre es requerido"); return }
    if (!categoriaId) { setError("Seleccioná una categoría"); return }
    if (!precio || isNaN(Number(precio))) { setError("El precio debe ser un número"); return }
    setError(null)

    startTransition(async () => {
      const input = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        precio: Number(precio),
        categoria_id: categoriaId,
        imagen_url: imagenUrl.trim() || undefined,
        disponible,
        destacado,
        orden: producto?.orden ?? 0,
        etiquetas,
      }
      const result = isEdit
        ? await updateProducto(producto!.id, input, variantes)
        : await createProducto(input, variantes)

      if (result.success) onSaved()
      else setError(result.error ?? "Error al guardar")
    })
  }

  // Group categories by tipo_menu
  const catsByTipo = categorias.reduce<Record<string, Categoria[]>>((acc, c) => {
    if (!acc[c.tipo_menu]) acc[c.tipo_menu] = []
    acc[c.tipo_menu].push(c)
    return acc
  }, {})

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/40 shrink-0">
          <h2 className="font-[family-name:var(--font-dm-serif)] text-xl text-foreground">
            {isEdit ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl text-foreground/40 hover:text-foreground hover:bg-background transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          {/* Nombre + Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Wrap de pollo palta"
                className="w-full px-4 py-3 bg-background border border-border/40 rounded-xl text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/60 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Categoría *</label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border/40 rounded-xl text-sm text-foreground outline-none focus:border-primary/60 transition-colors"
              >
                <option value="">Seleccionar…</option>
                {Object.entries(catsByTipo).map(([tipo, cats]) => (
                  <optgroup key={tipo} label={TIPO_LABEL[tipo] ?? tipo}>
                    {cats.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ingredientes, preparación, detalles..."
              rows={2}
              className="w-full px-4 py-3 bg-background border border-border/40 rounded-xl text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/60 transition-colors resize-none"
            />
          </div>

          {/* Precio + Imagen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Precio base (ARS) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 text-sm">$</span>
                <input
                  type="number"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full pl-7 pr-4 py-3 bg-background border border-border/40 rounded-xl text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/60 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Imagen */}
          <ImageUploadField 
            value={imagenUrl} 
            onChange={setImagenUrl}
            label="Imagen del producto"
          />

          {/* Switches */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => setDisponible((v) => !v)}
                className={`w-10 h-6 rounded-full transition-colors flex items-center ${disponible ? "bg-emerald-500" : "bg-foreground/20"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${disponible ? "translate-x-4" : "translate-x-0"}`} />
              </div>
              <span className="text-sm font-medium text-foreground">Disponible</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer" onClick={() => setDestacado((v) => !v)}>
              <Star className={`w-5 h-5 transition-colors ${destacado ? "text-amber-500 fill-amber-500" : "text-foreground/30"}`} />
              <span className="text-sm font-medium text-foreground">Destacado</span>
            </label>
          </div>

          {/* Etiquetas */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Etiquetas</label>
            <div className="flex flex-wrap gap-2">
              {ETIQUETA_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => toggleEtiqueta(e)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    etiquetas.includes(e)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground/60 border-border/40 hover:border-primary/40"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Variantes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">Variantes de precio</label>
                <p className="text-xs text-foreground/40 mt-0.5">Ej: Chico / Grande, Con / Sin extras</p>
              </div>
              <button
                type="button"
                onClick={addVariante}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-semibold hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar
              </button>
            </div>
            {variantes.length === 0 && (
              <p className="text-sm text-foreground/40 text-center py-4 bg-background rounded-xl border border-dashed border-border/40">
                Sin variantes — se usa el precio base
              </p>
            )}
            <div className="space-y-2">
              {variantes.map((v, i) => (
                <div key={i} className="flex items-center gap-2 bg-background rounded-xl border border-border/30 p-3">
                  <GripVertical className="w-4 h-4 text-foreground/20 shrink-0" />
                  <input
                    type="text"
                    value={v.nombre}
                    onChange={(e) => updateVariante(i, "nombre", e.target.value)}
                    placeholder="Nombre variante"
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/30 outline-none"
                  />
                  <div className="relative w-28 shrink-0">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-foreground/40 text-xs">$</span>
                    <input
                      type="number"
                      value={v.precio}
                      onChange={(e) => updateVariante(i, "precio", Number(e.target.value))}
                      min="0"
                      className="w-full pl-5 pr-2 py-1.5 bg-card border border-border/40 rounded-lg text-sm text-foreground outline-none focus:border-primary/50"
                    />
                  </div>
                  <div
                    onClick={() => updateVariante(i, "disponible", !v.disponible)}
                    className={`w-8 h-5 rounded-full cursor-pointer flex items-center shrink-0 transition-colors ${v.disponible ? "bg-emerald-500" : "bg-foreground/20"}`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full shadow mx-0.5 transition-transform ${v.disponible ? "translate-x-3" : "translate-x-0"}`} />
                  </div>
                  <button onClick={() => removeVariante(i)} className="p-1 text-foreground/30 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/40 shrink-0 flex items-center gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border/40 text-sm font-medium text-foreground/60 hover:bg-background transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {isPending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  )
}
