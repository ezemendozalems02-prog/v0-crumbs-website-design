import { getBannersForPage } from "@/lib/public-content"
import { ContactoClient } from "@/components/contacto-client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

// ISR: revalida cada 60s. Los cambios del admin (banners) se reflejan al
// instante vía revalidatePath(), sin esperar la ventana de ISR.
export const revalidate = 60

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
