import { getBannersForPage } from "@/lib/public-content"
import { TrabajarClient } from "@/components/trabajar-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function TrabajarPage() {
  const banners = await getBannersForPage("trabajar")
  const bannerImageUrl = banners[0]?.imagen_url ?? null
  return <TrabajarClient bannerImageUrl={bannerImageUrl} />
}
