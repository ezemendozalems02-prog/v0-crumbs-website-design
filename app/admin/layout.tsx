import Image from "next/image"
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
            <Image
              src="/images/logo.png"
              alt="CRUMBS Logo"
              width={100}
              height={40}
              priority
              className="h-8 w-auto"
            />
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
