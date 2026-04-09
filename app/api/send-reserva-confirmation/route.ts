import { type NextRequest, NextResponse } from 'next/server'
import { sendEmail, getReservaConfirmationEmail, ADMIN_EMAIL } from '@/lib/email'

export async function POST(request: NextRequest) {
  console.log('[RESERVA EMAIL] ===== INICIO =====')
  
  try {
    const body = await request.json()
    console.log('[RESERVA EMAIL] Datos recibidos:', {
      nombre: body.nombre,
      email: body.email,
      fecha: body.fecha,
      horario: body.horario,
    })

    const { nombre, email, fecha, horario, cantidadPersonas, tipoMesa, telefono } = body

    // Validar campos
    if (!nombre || !email || !fecha || !horario) {
      console.log('[RESERVA EMAIL] ERROR: Faltan campos requeridos')
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Enviar confirmación al cliente
    const confirmationHtml = getReservaConfirmationEmail({
      nombre,
      fecha,
      horario,
      cantidadPersonas: cantidadPersonas || 0,
      tipoMesa: tipoMesa || 'Estándar',
      telefonoContacto: telefono,
    })

    const clientEmailResult = await sendEmail(
      email,
      'Tu reserva en CRUMBS - Confirmada',
      confirmationHtml
    )

    console.log('[RESERVA EMAIL] Email cliente:', clientEmailResult)

    // Enviar notificación al admin
    const adminNotificationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Nueva Reserva - CRUMBS</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin: 10px 0; }
            .label { font-weight: 600; color: #666; font-size: 12px; }
            .value { font-size: 14px; color: #1a1a1a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>Nueva Reserva Recibida</h1></div>
            <div class="content">
              <div class="field"><div class="label">Nombre</div><div class="value">${nombre}</div></div>
              <div class="field"><div class="label">Email</div><div class="value">${email}</div></div>
              <div class="field"><div class="label">Teléfono</div><div class="value">${telefono || 'No proporcionado'}</div></div>
              <div class="field"><div class="label">Fecha</div><div class="value">${fecha}</div></div>
              <div class="field"><div class="label">Hora</div><div class="value">${horario}</div></div>
              <div class="field"><div class="label">Personas</div><div class="value">${cantidadPersonas}</div></div>
              <div class="field"><div class="label">Tipo de Mesa</div><div class="value">${tipoMesa}</div></div>
            </div>
          </div>
        </body>
      </html>
    `

    const adminEmailResult = await sendEmail(
      ADMIN_EMAIL,
      `Nueva Reserva - ${nombre} para ${fecha}`,
      adminNotificationHtml
    )

    console.log('[RESERVA EMAIL] Email admin:', adminEmailResult)
    console.log('[RESERVA EMAIL] ===== FIN EXITOSO =====')

    return NextResponse.json({
      success: true,
      clientEmailSent: clientEmailResult.success,
      adminEmailSent: adminEmailResult.success,
    })
  } catch (error) {
    console.error('[RESERVA EMAIL] ✗✗✗ ERROR:', error)
    return NextResponse.json(
      { error: 'Error al enviar confirmación: ' + (error instanceof Error ? error.message : 'Error desconocido') },
      { status: 500 }
    )
  }
}
