import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { HomepageClient } from "@/components/homepage-client"
import { getBannersForPage, getSeccionByClave } from "@/lib/public-content"

// ISR: cachear por 1 hora, pero invalidar on-demand cuando el admin guarda
// Esto reduce egress de 2000 queries/día a ~5-10
export const revalidate = 3600

export default async function HomePage() {
  // Fetch data on the server with ISR tags para on-demand revalidation
  const [banners, highlightsSection] = await Promise.all([
    getBannersForPage("inicio", { tags: ['banners', 'banners-inicio'] }).catch(() => []),
    getSeccionByClave("home-highlights", { tags: ['secciones', 'secciones-highlights'] }).catch(() => null),
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
