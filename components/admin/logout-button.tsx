'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { clearAdminSession } from '@/lib/admin-auth'

export function AdminLogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await clearAdminSession()
    router.push('/admin/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/60 hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
      title="Cerrar sesión"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Cerrar sesión</span>
    </button>
  )
}
