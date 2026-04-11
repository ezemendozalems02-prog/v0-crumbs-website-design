import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { pagina } = await request.json()
    
    console.log("[revalidate-banners] Revalidating:", pagina || "todas las páginas")
    
    // Revalidar todas las páginas si no se especifica
    if (!pagina) {
      console.log("[revalidate-banners] Revalidating ALL pages")
      revalidatePath("/", "layout")
      revalidatePath("/cafeteria", "layout")
      revalidatePath("/cocina", "layout")
    } else {
      // Revalidar layout completo de la página específica
      if (pagina === "inicio") {
        console.log("[revalidate-banners] Revalidating inicio")
        revalidatePath("/", "layout")
      }
      if (pagina === "cafeteria") {
        console.log("[revalidate-banners] Revalidating cafeteria")
        revalidatePath("/cafeteria", "layout")
      }
      if (pagina === "cocina") {
        console.log("[revalidate-banners] Revalidating cocina")
        revalidatePath("/cocina", "layout")
      }
    }
    
    // También revalidar el admin
    revalidatePath("/admin/banners", "page")
    
    console.log("[revalidate-banners] Revalidation complete")
    
    return NextResponse.json({ 
      success: true, 
      message: `Revalidadas páginas para: ${pagina || 'todas'}`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[revalidate-banners] Error:", error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}

