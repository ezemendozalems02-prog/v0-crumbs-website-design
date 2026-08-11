import { getBannersForPage } from "@/lib/public-content"
import { TrabajarClient } from "@/components/trabajar-client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

// ISR: revalida cada 60s. Los cambios del admin (banners) se reflejan al
// instante vía revalidatePath(), sin esperar la ventana de ISR.
export const revalidate = 60

export default async function TrabajaConNosotrosPage() {
  const banners = await getBannersForPage("trabajar")
  const bannerImageUrl = banners[0]?.imagen_url ?? null
  return (
    <main className="min-h-screen page-content">
      <Navigation />
      <TrabajarClient bannerImageUrl={bannerImageUrl} />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
