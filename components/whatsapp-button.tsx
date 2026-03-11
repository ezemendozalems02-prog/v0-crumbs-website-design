"use client"

import { MessageCircle } from "lucide-react"
import { whatsappUrl } from "@/lib/whatsapp"

export function WhatsAppButton() {
  const url = whatsappUrl("Hola! Me gustaría hacer una consulta sobre CRUMBS.")

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6 group-hover:animate-shake" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-foreground text-background text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Escribinos
      </span>
    </a>
  )
}
