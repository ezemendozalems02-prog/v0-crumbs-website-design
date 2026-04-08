import { guardarPostulacion } from '@/lib/postulaciones'
import { type NextRequest, NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'crumbsc38@gmail.com'

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

    const { nombre, telefono, email, puesto, mensaje, cvUrl, cvPathname, cvNombreArchivo } = body

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
      cvPathname,
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
                  ${cvPathname ? `<div class="field"><a href="/api/descargar-cv?pathname=${encodeURIComponent(cvPathname)}" class="button">Descargar CV</a></div>` : ''}
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
            from: 'onboarding@resend.dev',
            to: ADMIN_EMAIL,
            subject: `Nueva postulación: ${nombre} - ${puesto}`,
            html: emailHTML,
          }),
        })

        if (!adminEmailRes.ok) {
          const errorText = await adminEmailRes.text()
          console.error('[SEND POSTULACION] ✗ Error enviando email admin:', errorText)
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
            from: 'onboarding@resend.dev',
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

        if (!candidateEmailRes.ok) {
          const errorText = await candidateEmailRes.text()
          console.error('[SEND POSTULACION] ✗ Error enviando email candidato:', errorText)
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
