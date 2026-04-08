import { guardarPostulacion } from '@/lib/postulaciones'
import { type NextRequest, NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@crumbs.com.ar'

export async function POST(request: NextRequest) {
  try {
    const { nombre, telefono, email, puesto, mensaje, cvUrl, cvNombreArchivo } = await request.json()

    // Validar campos
    if (!nombre || !telefono || !email || !puesto) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Guardar en BD
    const dbResult = await guardarPostulacion({
      nombre,
      telefono,
      email,
      puesto,
      mensaje,
      cvUrl,
      cvNombreArchivo,
    })

    if (!dbResult.success) {
      return NextResponse.json({ error: 'Error al guardar postulación' }, { status: 500 })
    }

    // Enviar email al admin si Resend está configurado
    if (RESEND_API_KEY) {
      try {
        const emailHTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Nueva postulación – CRUMBS</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1a1a1a; color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 20px; }
                .label { font-weight: 600; color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
                .value { font-size: 16px; color: #1a1a1a; }
                .button { display: inline-block; background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header"><h1>Nueva Postulación</h1></div>
                <div class="content">
                  <div class="field"><div class="label">Nombre</div><div class="value">${nombre}</div></div>
                  <div class="field"><div class="label">Teléfono</div><div class="value">${telefono}</div></div>
                  <div class="field"><div class="label">Email</div><div class="value">${email}</div></div>
                  <div class="field"><div class="label">Puesto</div><div class="value">${puesto}</div></div>
                  ${mensaje ? `<div class="field"><div class="label">Mensaje</div><div class="value">${mensaje.replace(/\n/g, '<br>')}</div></div>` : ''}
                  ${cvUrl ? `<div class="field"><a href="${cvUrl}" class="button">Descargar CV</a></div>` : ''}
                </div>
              </div>
            </body>
          </html>
        `

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'postulaciones@crumbs.com.ar',
            to: ADMIN_EMAIL,
            subject: `Nueva postulación: ${nombre} - ${puesto}`,
            html: emailHTML,
          }),
        })

        // Enviar confirmación al candidato
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'postulaciones@crumbs.com.ar',
            to: email,
            subject: 'Hemos recibido tu postulación - CRUMBS',
            html: `
              <h2>¡Gracias por tu postulación!</h2>
              <p>Hola ${nombre},</p>
              <p>Hemos recibido tu postulación para el puesto de <strong>${puesto}</strong>.</p>
              <p>Revisaremos tu CV y nos pondremos en contacto si estamos interesados.</p>
              <p>¡Esperamos poder trabajar contigo!</p>
            `,
          }),
        })
      } catch (emailError) {
        console.error('[postulaciones] Error enviando email:', emailError)
        // No fallar si el email no se envía
      }
    }

    return NextResponse.json({ success: true, id: dbResult.id })
  } catch (error) {
    console.error('[postulaciones] Error:', error)
    return NextResponse.json({ error: 'Error al procesar postulación' }, { status: 500 })
  }
}
