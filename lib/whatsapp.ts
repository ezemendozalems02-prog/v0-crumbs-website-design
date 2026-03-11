/**
 * Central WhatsApp configuration for CRUMBS.
 * ALL WhatsApp links across the site must import from here.
 */

export const WHATSAPP_NUMBER = "5491136634236"

/** Returns a wa.me URL with an optional pre-filled message */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}
