'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { clearAdminSession } from '@/lib/admin-auth'

interface Props { variant?: "default" | "sidebar" }

export function AdminLogoutButton({ variant = "default" }: Props) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await clearAdminSession()
      router.push('/admin/login')
    } catch (error) {
      console.error('[v0] Logout error:', error)
    }
  }

  if (variant === "sidebar") {
    return (
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/8 transition-all"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        Cerrar sesión
      </button>
    )
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors rounded-lg hover:bg-primary-foreground/10"
      title="Cerrar sesión"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Cerrar sesión</span>
    </button>
  )
}

