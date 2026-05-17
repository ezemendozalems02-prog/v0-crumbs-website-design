import { getBannersForPage } from "@/lib/public-content"
import { NosotrosClient } from "@/components/nosotros-client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export const dynamic = "force-dynamic"

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
