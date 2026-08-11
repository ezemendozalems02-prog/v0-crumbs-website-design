import { getBannersForPage } from "@/lib/public-content"
import { NosotrosClient } from "@/components/nosotros-client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

// ISR: revalida cada 60s. Los cambios del admin (banners) se reflejan al
// instante vía revalidatePath(), sin esperar la ventana de ISR.
export const revalidate = 60

export default async function NosotrosPage() {
  const banners = await getBannersForPage("nosotros")
  const bannerImageUrl = banners[0]?.imagen_url ?? null
  return (
    <main className="min-h-screen page-content">
      <Navigation />
      <NosotrosClient bannerImageUrl={bannerImageUrl} />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
