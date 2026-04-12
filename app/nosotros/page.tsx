import { getBannersForPage } from "@/lib/public-content"
import { NosotrosClient } from "@/components/nosotros-client"

export const dynamic = "force-dynamic"

export default async function NosotrosPage() {
  const banners = await getBannersForPage("nosotros")
  const bannerImageUrl = banners[0]?.imagen_url ?? null
  return <NosotrosClient bannerImageUrl={bannerImageUrl} />
}
