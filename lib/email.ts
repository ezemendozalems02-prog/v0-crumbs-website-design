export const RESEND_API_KEY = process.env.RESEND_API_KEY
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'crumbsc38@gmail.com'
export const RESEND_FROM_EMAIL = 'noreply@crumbs.ar'

export async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY not configured')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[EMAIL] Error sending email:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('[EMAIL] Exception:', error)
    return { success: false, error: String(error) }
  }
}

export function getReservaConfirmationEmail(data: {
  nombre: string
  fecha: string
  horario: string
  cantidadPersonas: number
  tipoMesa: string
  telefonoContacto?: string
}) {
  const fechaFormatted = new Date(data.fecha + 'T12:00:00').toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmación de Reserva - CRUMBS</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 40px; border-radius: 8px 8px 0 0; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .content { background: #f9f9f9; padding: 40px; border-radius: 0 0 8px 8px; }
          .reservation-details { background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #8b4513; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #666; font-size: 14px; }
          .detail-value { color: #1a1a1a; font-size: 14px; }
          .button { display: inline-block; background: #8b4513; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Reserva Confirmada</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${data.nombre}</strong>,</p>
            <p>Tu reserva en CRUMBS ha sido confirmada. Nos vemos pronto!</p>
            
            <div class="reservation-details">
              <div class="detail-row">
                <span class="detail-label">📅 Fecha</span>
                <span class="detail-value">${fechaFormatted}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🕐 Hora</span>
                <span class="detail-value">${data.horario}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">👥 Personas</span>
                <span class="detail-value">${data.cantidadPersonas}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🪑 Mesa</span>
                <span class="detail-value">${data.tipoMesa}</span>
              </div>
              ${data.telefonoContacto ? `<div class="detail-row">
                <span class="detail-label">📞 Contacto</span>
                <span class="detail-value">${data.telefonoContacto}</span>
              </div>` : ''}
            </div>

            <p style="margin-top: 30px; color: #666;">
              Si necesitas cambiar o cancelar tu reserva, contáctanos al <strong>(+54) 11 3110-1739</strong>.
            </p>
            
            <div class="footer">
              <p>Este es un email automático. Por favor no responder a este mensaje.</p>
              <p>© 2026 CRUMBS Restaurant. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}
