import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { pagina } = await request.json()
    
    // Revalidar según la página
    if (pagina === "inicio" || !pagina) revalidatePath("/")
    if (pagina === "cafeteria" || !pagina) revalidatePath("/cafeteria")
    if (pagina === "cocina" || !pagina) revalidatePath("/cocina")
    
    return NextResponse.json({ 
      success: true, 
      message: `Revalidadas páginas para: ${pagina || 'todas'}` 
    })
  } catch (error) {
    console.error("[revalidate-banners] Error:", error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
