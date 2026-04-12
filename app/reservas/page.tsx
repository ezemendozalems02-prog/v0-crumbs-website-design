import { getBannersForPage } from "@/lib/public-content"
import { ReservasClient } from "@/components/reservas/reservas-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ReservasPage() {
  const banners = await getBannersForPage("reservas")
  const bannerImageUrl = banners[0]?.imagen_url ?? null
  return <ReservasClient bannerImageUrl={bannerImageUrl} />
}
