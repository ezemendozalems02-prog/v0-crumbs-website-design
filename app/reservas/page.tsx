import { getBannersForPage } from "@/lib/public-content"
import { getHorariosActivos } from "@/lib/admin-horarios"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ReservasClient } from "@/components/reservas/reservas-client"

export const dynamic = "force-dynamic"

export default async function ReservasPage() {
  const [banners, horarios] = await Promise.all([
    getBannersForPage("reservas"),
    getHorariosActivos(),
  ])
  const bannerImageUrl = banners[0]?.imagen_url ?? null

  return (
    <main className="min-h-screen page-content">
      <Navigation />
      <ReservasClient bannerImageUrl={bannerImageUrl} horarios={horarios} />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
