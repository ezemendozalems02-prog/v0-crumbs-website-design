import { getBannersForPage } from "@/lib/public-content"
import { getHorariosActivos } from "@/lib/admin-horarios"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ReservasClient } from "@/components/reservas/reservas-client"

// ISR: revalida cada 60s. Los cambios del admin (banners/horarios) se
// reflejan al instante vía revalidatePath(), sin esperar la ventana de ISR.
export const revalidate = 60

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
