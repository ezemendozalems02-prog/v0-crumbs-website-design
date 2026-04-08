import { cookies } from 'next/headers'
import crypto from 'crypto'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 horas

export async function validateAdminPassword(password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD) {
    console.error('[v0] ADMIN_PASSWORD not configured')
    return false
  }
  return password === ADMIN_PASSWORD
}

export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionToken = crypto.randomBytes(32).toString('hex')
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION,
    path: '/',
  })
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
  return !!sessionToken
}
