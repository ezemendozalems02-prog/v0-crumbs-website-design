import { guardarPostulacion } from '@/lib/postulaciones'
import { type NextRequest, NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const ADMIN_EMAIL = 'crumbsc38@gmail.com'
const FROM_EMAIL = process.env.FROM_EMAIL

export async function POST(request: NextRequest) {
  console.log('[SEND POSTULACION] ===== INICIO =====')
  
  try {
    const body = await request.json()
    const { nombre, telefono, email, puesto, mensaje, cvUrl, cvNombreArchivo } = body

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
      return NextResponse.json({ error: 'Error al guardar postulación: ' + dbResult.error }, { status: 500 })
    }

    console.log('[SEND POSTULACION] ✓ Guardado en BD exitoso')

    // Enviar emails si Resend está configurado
    if (RESEND_API_KEY && FROM_EMAIL) {
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
                .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .section { margin-bottom: 25px; }
                .section-title { font-weight: 600; color: #1a1a1a; font-size: 14px; text-transform: uppercase; margin-bottom: 12px; border-bottom: 2px solid #ddd; padding-bottom: 8px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: 600; color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
                .value { font-size: 16px; color: #1a1a1a; line-height: 1.5; }
                .cv-section { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #8b4513; margin-top: 20px; }
                .button { display: inline-block; background: #8b4513; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 12px; text-align: center; }
                .button:hover { background: #6d3811; }
                .footer { margin-top: 25px; padding-top: 15px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header"><h1>🎯 Nueva Postulación Recibida</h1></div>
                <div class="content">
                  <div class="section">
                    <div class="section-title">Datos del Candidato</div>
                    <div class="field"><div class="label">Nombre</div><div class="value">${nombre}</div></div>
                    <div class="field"><div class="label">Teléfono</div><div class="value"><a href="tel:${telefono}" style="color: #8b4513; text-decoration: none;">${telefono}</a></div></div>
                    <div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${email}" style="color: #8b4513; text-decoration: none;">${email}</a></div></div>
                  </div>

                  <div class="section">
                    <div class="section-title">Posición Solicitada</div>
                    <div class="field"><div class="value" style="font-size: 18px; font-weight: 600;">${puesto}</div></div>
                  </div>

                  ${mensaje ? `
                  <div class="section">
                    <div class="section-title">Mensaje del Candidato</div>
                    <div class="field"><div class="value">${mensaje.replace(/\n/g, '<br>')}</div></div>
                  </div>
                  ` : ''}

                  ${cvUrl ? `
                  <div class="cv-section">
                    <div style="font-weight: 600; font-size: 14px; margin-bottom: 10px;">📄 Curriculum Vitae</div>
                    <p style="color: #666; font-size: 13px; margin: 0 0 12px 0;">El CV está disponible en Supabase Storage</p>
                    <a href="${cvUrl}" target="_blank" rel="noopener noreferrer" class="button">Descargar CV (PDF)</a>
                    <p style="color: #999; font-size: 11px; margin-top: 10px;">O abre el siguiente enlace:</p>
                    <p style="color: #8b4513; font-size: 11px; word-break: break-all; margin: 5px 0;">${cvUrl}</p>
                  </div>
                  ` : '<p style="color: #d9534f; font-weight: 600;">⚠️ No se adjuntó CV</p>'}

                  <div class="footer">
                    <p style="margin: 0;">Esta es una notificación automática de nuevas postulaciones. Por favor no responder a este mensaje.</p>
                    <p style="margin: 5px 0 0 0;">© 2026 CRUMBS. Todos los derechos reservados.</p>
                  </div>
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

        const adminResText = await adminEmailRes.text()
        console.log('[SEND POSTULACION] Admin email response:', adminEmailRes.status, adminResText.substring(0, 100))
        
        if (!adminEmailRes.ok) {
          console.error('[SEND POSTULACION] ✗ Error al admin')
        } else {
          console.log('[SEND POSTULACION] ✓ Email al admin enviado')
        }

        // Enviar confirmación al candidato
        const candidateEmailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: email.trim(),
            subject: 'Hemos recibido tu postulación - CRUMBS',
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #8b4513 0%, #6d3811 100%); color: white; padding: 40px; border-radius: 8px 8px 0 0; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">✓ ¡Gracias por tu postulación!</h1>
                </div>
                <div style="background: #f9f9f9; padding: 40px; border-radius: 0 0 8px 8px;">
                  <p>Hola <strong>${nombre}</strong>,</p>
                  <p>Hemos recibido tu postulación para el puesto de <strong>${puesto}</strong> en CRUMBS.</p>
                  
                  ${cvUrl ? `
                  <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #8b4513; margin: 25px 0;">
                    <p style="margin: 0 0 10px 0; font-weight: 600; font-size: 14px;">📄 Tu CV ha sido recibido</p>
                    <p style="margin: 0; color: #666; font-size: 13px;">Hemos guardado tu CV de forma segura en nuestros servidores. Los reclutadores lo revisarán próximamente.</p>
                  </div>
                  ` : ''}

                  <p style="margin-top: 30px; color: #666;">Revisaremos tu CV y nos pondremos en contacto contigo pronto si estamos interesados.</p>
                  
                  <p style="color: #666; font-size: 14px; margin-top: 25px; line-height: 1.6;">
                    <strong>Próximos pasos:</strong><br>
                    • Nos comunicaremos por teléfono o email<br>
                    • Ten listo tu CV para cualquier consulta<br>
                    • Mantén tus datos actualizados
                  </p>

                  <p style="margin-top: 30px;">Gracias por tu interés en formar parte de nuestro equipo.</p>

                  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                    <p style="margin: 0;">Este es un email automático. Por favor no responder a este mensaje.</p>
                    <p style="margin: 5px 0 0 0;">© 2026 CRUMBS Restaurant. Todos los derechos reservados.</p>
                  </div>
                </div>
              </div>
            `,
          }),
        })

        if (!candidateEmailRes.ok) {
          console.error('[SEND POSTULACION] ✗ Error al candidato')
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
