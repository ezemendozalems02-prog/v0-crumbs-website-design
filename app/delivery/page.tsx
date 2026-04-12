import { getMenuByTipo } from "@/lib/menu-publico"
import { DeliveryContent } from "@/components/delivery-content"
import { getBannersForPage } from "@/lib/public-content"

export const dynamic = 'force-dynamic'

export default async function DeliveryPage() {
  const [liveMenu, banners] = await Promise.all([
    getMenuByTipo("delivery"),
    getBannersForPage("delivery"),
  ])
  const bannerImageUrl = banners[0]?.imagen_url ?? null
  return <DeliveryContent liveMenu={liveMenu} bannerImageUrl={bannerImageUrl} />
}
