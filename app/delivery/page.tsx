import { getMenuByTipo } from "@/lib/menu-publico"
import { getBannersForPage } from "@/lib/public-content"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Cart } from "@/components/cart"
import { CartProvider } from "@/lib/cart-context"
import { DeliveryContent } from "@/components/delivery-content"

export const dynamic = "force-dynamic"

export default async function DeliveryPage() {
  const [liveMenu, banners] = await Promise.all([
    getMenuByTipo("delivery"),
    getBannersForPage("delivery"),
  ])
  const bannerImageUrl = banners[0]?.imagen_url ?? null

  return (
    <CartProvider>
      <main className="min-h-screen page-content">
        <Navigation />
        <DeliveryContent liveMenu={liveMenu} bannerImageUrl={bannerImageUrl} />
        <Footer />
        <Cart />
      </main>
    </CartProvider>
  )
}
