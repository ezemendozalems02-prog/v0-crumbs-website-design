import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { HomepageClient } from "@/components/homepage-client"
import { getBannersForPage, getSeccionByClave } from "@/lib/public-content"

// ISR: revalida cada 60s. Los cambios del admin (banners/secciones) se
// reflejan al instante vía revalidatePath(), sin esperar la ventana de ISR.
export const revalidate = 60

export default async function HomePage() {
  // Fetch data on the server
  const [banners, highlightsSection] = await Promise.all([
    getBannersForPage("inicio").catch(() => []),
    getSeccionByClave("home-highlights").catch(() => null),
  ])

  return (
    <main className="min-h-screen page-content">
      <Navigation />
      <HomepageClient
        mainBanner={banners.length > 0 ? banners[0] : null}
        highlightsSection={highlightsSection}
      />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
