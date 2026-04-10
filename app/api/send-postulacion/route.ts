import { guardarPostulacion } from '@/lib/postulaciones'
import { type NextRequest, NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'crumbsc38@gmail.com'
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev' // Email verificado en Resend

export async function POST(request: NextRequest) {
  console.log('[SEND POSTULACION] ===== INICIO =====')
  console.log('[SEND POSTULACION] ADMIN_EMAIL configurado:', ADMIN_EMAIL)
  console.log('[SEND POSTULACION] RESEND_API_KEY presente:', !!RESEND_API_KEY)
  
  try {
    const body = await request.json()
    console.log('[SEND POSTULACION] Body recibido:', {
      nombre: body.nombre,
      telefono: body.telefono,
      email: body.email,
      puesto: body.puesto,
      tieneMensaje: !!body.mensaje,
      tieneCVUrl: !!body.cvUrl,
    })

    const { nombre, telefono, email, puesto, mensaje, cvUrl, cvNombreArchivo } = body

    // Validar campos
    if (!nombre || !telefono || !email || !puesto) {
      console.log('[SEND POSTULACION] ERROR: Faltan campos requeridos')
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    console.log('[SEND POSTULACION] Validación OK, guardando en BD...')

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

    console.log('[SEND POSTULACION] Resultado BD:', dbResult)

    if (!dbResult.success) {
      console.log('[SEND POSTULACION] ERROR BD:', dbResult.error)
      return NextResponse.json({ error: 'Error al guardar postulación: ' + dbResult.error }, { status: 500 })
    }

    console.log('[SEND POSTULACION] ✓ Guardado en BD exitoso, ID:', dbResult.id)

    // Enviar email al admin si Resend está configurado
    if (RESEND_API_KEY) {
      console.log('[SEND POSTULACION] Enviando emails...')
      console.log('[SEND POSTULACION] API Key length:', RESEND_API_KEY.length)
      console.log('[SEND POSTULACION] FROM_EMAIL:', FROM_EMAIL)
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

        console.log('[SEND POSTULACION] Enviando email al admin:', ADMIN_EMAIL)
        
        const adminEmailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `Nueva postulación: ${nombre} - ${puesto}`,
            html: emailHTML,
          }),
        })

        if (!adminEmailRes.ok) {
          const errorData = await adminEmailRes.json().catch(() => adminEmailRes.text())
          console.error('[SEND POSTULACION] ✗ Error enviando email admin:', {
            status: adminEmailRes.status,
            statusText: adminEmailRes.statusText,
            error: errorData
          })
        } else {
          console.log('[SEND POSTULACION] ✓ Email al admin enviado')
        }

        console.log('[SEND POSTULACION] Enviando confirmación al candidato:', email)

        // Enviar confirmación al candidato
        const candidateEmailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: email,
            subject: 'Hemos recibido tu postulación - CRUMBS',
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #1a1a1a; color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">¡Gracias por tu postulación!</h1>
                </div>
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
                  <p>Hola <strong>${nombre}</strong>,</p>
                  <p>Hemos recibido tu postulación para el puesto de <strong>${puesto}</strong> en CRUMBS.</p>
                  <p>Revisaremos tu CV y nos pondremos en contacto contigo pronto si estamos interesados.</p>
                  <p>Gracias por tu interés en formar parte de nuestro equipo.</p>
                  <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                    Este es un email automático. Por favor no responder a este mensaje.
                  </p>
                </div>
              </div>
            `,
          }),
        })

        if (!candidateEmailRes.ok) {
          const errorData = await candidateEmailRes.json().catch(() => candidateEmailRes.text())
          console.error('[SEND POSTULACION] ✗ Error enviando email candidato:', {
            status: candidateEmailRes.status,
            statusText: candidateEmailRes.statusText,
            error: errorData
          })
        } else {
          console.log('[SEND POSTULACION] ✓ Email al candidato enviado')
        }
      } catch (emailError) {
        console.error('[SEND POSTULACION] ✗ Error enviando emails:', emailError)
        console.error('[SEND POSTULACION] Stack trace:', emailError instanceof Error ? emailError.stack : 'No stack')
        // No fallar si el email no se envía - la postulación ya está guardada
      }
    } else {
      console.log('[SEND POSTULACION] ⚠ RESEND_API_KEY no configurada, no se enviarán emails')
    }

    console.log('[SEND POSTULACION] ===== FIN EXITOSO =====')
    return NextResponse.json({ success: true, id: dbResult.id })
  } catch (error) {
    console.error('[SEND POSTULACION] ✗✗✗ ERROR FATAL:', error)
    console.error('[SEND POSTULACION] Stack trace:', error instanceof Error ? error.stack : 'No stack available')
    return NextResponse.json({ 
      error: 'Error al procesar postulación: ' + (error instanceof Error ? error.message : 'Error desconocido')
    }, { status: 500 })
  }
}
