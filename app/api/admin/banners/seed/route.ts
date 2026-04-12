import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const banners = [
    {
      titulo: 'Trabaja con nosotros',
      subtitulo: 'Únete a nuestro equipo',
      descripcion: 'Estamos buscando talento para crecer juntos',
      imagen_url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-12-taTa8KD6rEoCJrbQVZhry1Z2d7C5wg.jpg',
      texto_boton: 'Ver oportunidades',
      link_boton: '/empleos',
      pagina: 'inicio',
      orden: 1,
      activo: true,
    },
    {
      titulo: 'Contacto',
      subtitulo: 'Nos gustaría saber de ti',
      descripcion: 'Ponte en contacto con nosotros',
      imagen_url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-13-WKAIDE69MnYmj4zPVNsZSZPtWNSz5t.jpg',
      texto_boton: 'Contactar',
      link_boton: '/contacto',
      pagina: 'inicio',
      orden: 2,
      activo: true,
    },
    {
      titulo: 'Reservá tu mesa',
      subtitulo: 'Elegí la mesa ideal, seleccioná fecha y horario, y aseguná tu lugar en CRUMBS.',
      descripcion: '',
      imagen_url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-11-fkyPTUbjLyWyNrlPzcPrBM1sXwEkfp.jpg',
      texto_boton: 'Reservar',
      link_boton: '/reservas',
      pagina: 'inicio',
      orden: 3,
      activo: true,
    },
    {
      titulo: 'Delivery',
      subtitulo: 'Pedí online y recibí en tu casa',
      descripcion: '',
      imagen_url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-09-8ZPN7xJIi5isDMpXujGgD4ld9pdTuf.jpg',
      texto_boton: 'Pedir ahora',
      link_boton: '/delivery',
      pagina: 'inicio',
      orden: 4,
      activo: true,
    },
    {
      titulo: 'Almuerzo & Cena',
      subtitulo: 'Experimenta nuestros mejores platos',
      descripcion: '',
      imagen_url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-08-oGfWdGdC5R7LvlPcAASGXvMbsNC8gX.jpg',
      texto_boton: 'Ver menú',
      link_boton: '/almuerzo-cena',
      pagina: 'cafeteria',
      orden: 1,
      activo: true,
    },
    {
      titulo: 'Cafetería',
      subtitulo: 'Disfrutá del mejor café y repostería',
      descripcion: '',
      imagen_url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Banners-10-AlxorkL1rSXH2JjCa4QjrUZ6qzMP2G.jpg',
      texto_boton: 'Explorar',
      link_boton: '/cafeteria',
      pagina: 'cafeteria',
      orden: 2,
      activo: true,
    },
  ]

  try {
    // Delete existing banners first
    const { error: deleteError } = await supabase
      .from('banners')
      .delete()
      .gte('id', 0)

    if (deleteError) {
      console.error('[v0] Delete error:', deleteError)
    }

    // Insert new banners
    const { data, error } = await supabase
      .from('banners')
      .insert(banners)
      .select()

    if (error) {
      console.error('[v0] Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Inserted ${data?.length || 0} banners`,
      data,
    })
  } catch (err) {
    console.error('[v0] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
