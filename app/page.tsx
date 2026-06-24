import { unstable_noStore as noStore } from 'next/cache'
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { HomepageClient } from "@/components/homepage-client"
import { getBannersForPage, getSeccionByClave } from "@/lib/public-content"

// Revalidar cada cambio (ISR con revalidación inmediata)
export const revalidate = 0
// Force dynamic rendering - sin caché estático
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  noStore()
  // Fetch data on the server - SIEMPRE FRESCO
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
