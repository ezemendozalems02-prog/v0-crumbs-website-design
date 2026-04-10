import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL
  const adminEmail = process.env.ADMIN_EMAIL

  console.log('[TEST EMAIL] Verificando configuración:')
  console.log('[TEST EMAIL] RESEND_API_KEY presente:', !!apiKey)
  console.log('[TEST EMAIL] RESEND_API_KEY longitud:', apiKey?.length || 0)
  console.log('[TEST EMAIL] FROM_EMAIL:', fromEmail || 'onboarding@resend.dev (default)')
  console.log('[TEST EMAIL] ADMIN_EMAIL:', adminEmail || 'crumbsc38@gmail.com (default)')

  if (!apiKey) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY no está configurada' },
      { status: 400 }
    )
  }

  try {
    // Test simple: enviar email de test
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail || 'onboarding@resend.dev',
        to: adminEmail || 'crumbsc38@gmail.com',
        subject: 'Test Email - CRUMBS',
        html: '<h1>Email de prueba</h1><p>Si recibes este email, Resend está funcionando correctamente.</p>',
      }),
    })

    const data = await response.json()

    console.log('[TEST EMAIL] Status:', response.status)
    console.log('[TEST EMAIL] Response:', data)

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Error sending test email',
          status: response.status,
          details: data
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email de prueba enviado exitosamente',
      config: {
        apiKeyLength: apiKey.length,
        fromEmail: fromEmail || 'onboarding@resend.dev (default)',
        adminEmail: adminEmail || 'crumbsc38@gmail.com (default)',
      },
      emailResponse: data,
    })
  } catch (error) {
    console.error('[TEST EMAIL] Error:', error)
    return NextResponse.json(
      { error: 'Test error: ' + String(error) },
      { status: 500 }
    )
  }
}
