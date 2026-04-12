import { getBannersForPage } from "@/lib/public-content"
import { ContactoClient } from "@/components/contacto-client"

export const dynamic = "force-dynamic"

export default async function ContactoPage() {
  const banners = await getBannersForPage("contacto")
  const bannerImageUrl = banners[0]?.imagen_url ?? null
  return <ContactoClient bannerImageUrl={bannerImageUrl} />
}
