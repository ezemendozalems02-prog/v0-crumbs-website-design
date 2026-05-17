import { getBannersForPage } from "@/lib/public-content"
import { ContactoClient } from "@/components/contacto-client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export const dynamic = "force-dynamic"

export default async function ContactoPage() {
  const banners = await getBannersForPage("contacto")
  const bannerImageUrl = banners[0]?.imagen_url ?? null
  return (
    <main className="min-h-screen page-content">
      <Navigation />
      <ContactoClient bannerImageUrl={bannerImageUrl} />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
