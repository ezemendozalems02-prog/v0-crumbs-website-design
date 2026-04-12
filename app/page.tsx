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
  // Fetch data on the server
  const [banners, experienceSection, locationSection] = await Promise.all([
    getBannersForPage("inicio").catch(() => []),
    getSeccionByClave("home-experience").catch(() => null),
    getSeccionByClave("home-location").catch(() => null),
  ])

  return (
    <main className="min-h-screen page-content">
      <Navigation />
      <HomepageClient
        mainBanner={banners.length > 0 ? banners[0] : null}
        experienceSection={experienceSection}
        locationSection={locationSection}
      />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
