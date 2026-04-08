'use server'

import { cookies } from 'next/headers'
import crypto from 'crypto'
import { redirect } from 'next/navigation'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 horas

export async function loginAdmin(password: string) {
  if (!ADMIN_PASSWORD) {
    console.error('[v0] ADMIN_PASSWORD not configured')
    return { success: false, error: 'Configuración incorrecta' }
  }

  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Contraseña incorrecta' }
  }

  // Crear sesión
  const cookieStore = await cookies()
  const sessionToken = crypto.randomBytes(32).toString('hex')
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION,
    path: '/',
  })

  return { success: true }
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function checkAdminAuth() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
  return !!sessionToken
}
