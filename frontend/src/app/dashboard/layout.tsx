import Link from "next/link"
import { BarChart3, Users, Bell, Settings } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white dark:bg-slate-900 hidden md:block">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">PlacementIQ</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">
            <BarChart3 className="h-4 w-4" />
            Portfolio Overview
          </Link>
          <Link href="/dashboard/students" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">
            <Users className="h-4 w-4" />
            At-Risk Students
          </Link>
          <Link href="/dashboard/alerts" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800 transition-colors font-medium">
            <Bell className="h-4 w-4" />
            Alert Inbox
          </Link>
          <Link href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800 transition-colors font-medium mt-auto">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-white dark:bg-slate-900 px-4 md:px-6">
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">Lender Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Demo Lender Admin</span>
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
