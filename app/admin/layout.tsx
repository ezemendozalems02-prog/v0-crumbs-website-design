'use client'

import { AdminSidebar, AdminMobileNav } from "@/components/admin/admin-sidebar"
import { AdminLogoutButton } from "@/components/admin/logout-button"
import { LayoutDashboard } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-primary text-primary-foreground sticky top-0 z-30 border-b border-primary-foreground/10">
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-foreground/10 rounded-lg">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <span className="font-[family-name:var(--font-dm-serif)] text-base">CRUMBS Admin</span>
            </div>
            <AdminLogoutButton />
          </div>
          <div className="px-4 pb-3">
            <AdminMobileNav />
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
