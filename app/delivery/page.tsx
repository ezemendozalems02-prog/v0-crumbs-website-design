import { getMenuByTipo } from "@/lib/menu-publico"
import { DeliveryContent } from "@/components/delivery-content"

export default async function DeliveryPage() {
  const liveMenu = await getMenuByTipo("delivery")
  return <DeliveryContent liveMenu={liveMenu} />
}
