import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { nombre, telefono, email, puesto, mensaje, cvUrl } = await request.json()

    // Validaciones
    if (!nombre || !telefono || !email || !puesto || !cvUrl) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 })
    }

    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      console.error("[EMAIL] RESEND_API_KEY no está configurada")
      return NextResponse.json(
        { error: "Configuración de email no disponible" },
        { status: 500 }
      )
    }

    // Construir el email
    const emailHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Nueva postulación laboral – CRUMBS</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .field {
              margin-bottom: 20px;
            }
            .field-label {
              font-weight: 600;
              color: #666;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
            }
            .field-value {
              font-size: 16px;
              color: #1a1a1a;
            }
            .cv-button {
              display: inline-block;
              background: #1a1a1a;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🍞 Nueva postulación laboral – CRUMBS</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">Nombre completo</div>
              <div class="field-value">${nombre}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Teléfono</div>
              <div class="field-value">${telefono}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Email</div>
              <div class="field-value">${email}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Puesto de interés</div>
              <div class="field-value">${puesto}</div>
            </div>
            
            ${
              mensaje
                ? `
            <div class="field">
              <div class="field-label">Mensaje adicional</div>
              <div class="field-value">${mensaje}</div>
            </div>
            `
                : ""
            }
            
            <div class="field">
              <div class="field-label">Curriculum Vitae</div>
              <a href="${cvUrl}" class="cv-button">📄 Descargar CV</a>
            </div>
          </div>
          
          <div class="footer">
            Postulación recibida el ${new Date().toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </body>
      </html>
    `

    // Enviar con Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CRUMBS Postulaciones <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL || "admin@crumbs.com",
        subject: "Nueva postulación laboral – CRUMBS",
        html: emailHTML,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[EMAIL] Error de Resend:", errorData)
      throw new Error("Error al enviar el email")
    }

    const data = await response.json()
    console.log("[EMAIL] Email enviado exitosamente:", data.id)

    return NextResponse.json({ success: true, emailId: data.id })
  } catch (error) {
    console.error("[EMAIL] Error al procesar postulación:", error)
    return NextResponse.json({ error: "Error al enviar la postulación" }, { status: 500 })
  }
}
