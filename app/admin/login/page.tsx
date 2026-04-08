'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, AlertCircle } from 'lucide-react'
import { validateAdminPassword, createAdminSession } from '@/lib/admin-auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const isValid = await validateAdminPassword(password)
      if (!isValid) {
        setError('Contraseña incorrecta')
        setIsLoading(false)
        return
      }

      await createAdminSession()
      router.push('/admin/reservas')
    } catch (err) {
      setError('Error al iniciar sesión')
      console.error('[v0] Login error:', err)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F3B2D] to-[#2E5A42] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-2xl p-8 border border-primary/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-[family-name:var(--font-dm-serif)] text-2xl text-primary mb-2">
              Panel Admin
            </h1>
            <p className="text-sm text-foreground/60">
              Acceso restringido a reservas
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Ingresá la contraseña"
                className={`w-full mt-2 px-4 py-3 rounded-xl border outline-none transition-colors duration-200 bg-background ${
                  error
                    ? 'border-red-400/50 focus:border-red-400'
                    : 'border-primary/15 focus:border-primary/50'
                }`}
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-400/20">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className={`w-full mt-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading || !password.trim()
                  ? 'bg-primary/40 text-primary-foreground/50 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-foreground/40 text-center mt-6">
            Acceso solo para administradores de CRUMBS
          </p>
        </div>
      </div>
    </div>
  )
}
