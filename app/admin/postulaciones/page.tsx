'use client'

import { useEffect, useState } from 'react'
import { getPostulaciones, cambiarEstadoPostulacion, eliminarPostulacion } from '@/lib/postulaciones'
import type { Postulacion } from '@/lib/postulaciones'

export const dynamic = 'force-dynamic'
import { Download, Trash2, CheckCircle2, Clock } from 'lucide-react'

export default function PostulacionesAdmin() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([])
  const [loading, setLoading] = useState(true)
  const [detalleId, setDetalleId] = useState<string | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<string>('todas')

  useEffect(() => {
    loadPostulaciones()
  }, [])

  const loadPostulaciones = async () => {
    setLoading(true)
    const data = await getPostulaciones()
    setPostulaciones(data)
    setLoading(false)
  }

  const handleCambiarEstado = async (id: string, nuevoEstado: string) => {
    await cambiarEstadoPostulacion(id, nuevoEstado)
    await loadPostulaciones()
  }

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta postulación?')) return
    await eliminarPostulacion(id)
    await loadPostulaciones()
    setDetalleId(null)
  }

  const postulacionesFiltradas = filtroEstado === 'todas' 
    ? postulaciones 
    : postulaciones.filter(p => p.estado === filtroEstado)

  const detalle = postulaciones.find(p => p.id === detalleId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border/40 p-6">
        <h1 className="text-3xl font-bold text-foreground">Postulaciones Laborales</h1>
        <p className="text-foreground/60">Total: {postulaciones.length}</p>
      </div>

      <div className="flex gap-6 p-6">
        {/* Lista */}
        <div className="flex-1 space-y-3">
          {/* Filtros */}
          <div className="flex gap-2 mb-4">
            {['todas', 'nueva', 'revisada', 'seleccionada'].map(estado => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filtroEstado === estado
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground border border-border/40 hover:bg-card/80'
                }`}
              >
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </button>
            ))}
          </div>

          {/* Postulaciones */}
          <div className="space-y-2">
            {postulacionesFiltradas.map(post => (
              <div
                key={post.id}
                onClick={() => setDetalleId(post.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  detalleId === post.id
                    ? 'bg-primary/10 border-primary/50'
                    : 'bg-card border-border/40 hover:bg-card/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{post.nombre}</h3>
                    <p className="text-sm text-foreground/60">{post.puesto}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.estado === 'nueva' && <Clock className="w-4 h-4 text-amber-600" />}
                    {post.estado === 'seleccionada' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    <span className="text-xs px-2 py-1 rounded bg-border/40 text-foreground/60">
                      {post.estado}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-foreground/50 mt-2">
                  {new Date(post.created_at).toLocaleDateString('es-AR')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detalle */}
        {detalle && (
          <div className="w-80 bg-card rounded-lg border border-border/40 p-6 sticky top-6 h-fit space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">Detalles</h2>
              <button
                onClick={() => handleEliminar(detalle.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-foreground/60">Nombre</p>
                <p className="font-medium text-foreground">{detalle.nombre}</p>
              </div>

              <div>
                <p className="text-foreground/60">Teléfono</p>
                <p className="font-medium text-foreground">{detalle.telefono}</p>
              </div>

              <div>
                <p className="text-foreground/60">Email</p>
                <p className="font-medium text-foreground break-all">{detalle.email}</p>
              </div>

              <div>
                <p className="text-foreground/60">Puesto</p>
                <p className="font-medium text-foreground">{detalle.puesto}</p>
              </div>

              {detalle.mensaje && (
                <div>
                  <p className="text-foreground/60">Mensaje</p>
                  <p className="text-foreground whitespace-pre-wrap">{detalle.mensaje}</p>
                </div>
              )}

              {detalle.cv_url && (
                <a
                  href={detalle.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  <Download className="w-4 h-4" />
                  Ver CV
                </a>
              )}

              <div className="pt-4 border-t border-border/40 space-y-2">
                <p className="text-foreground/60 text-xs">Cambiar estado</p>
                <div className="space-y-2">
                  {['nueva', 'revisada', 'seleccionada'].map(estado => (
                    <button
                      key={estado}
                      onClick={() => handleCambiarEstado(detalle.id, estado)}
                      className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
                        detalle.estado === estado
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-border/20 text-foreground hover:bg-border/30'
                      }`}
                    >
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
