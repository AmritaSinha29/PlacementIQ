"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, Bell, Settings, GraduationCap } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Portfolio Overview", icon: BarChart3 },
  { href: "/dashboard/students", label: "At-Risk Students", icon: Users },
  { href: "/dashboard/alerts", label: "Alert Inbox", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white dark:bg-slate-900 hidden md:flex flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center border-b px-4 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              PlacementIQ
            </span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <NavLink key={href} href={href} label={label} Icon={Icon} />
          ))}
        </nav>

        {/* Switch portal */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <Link
            href="/student"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium bg-indigo-50 text-indigo-700 transition-all hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
          >
            <GraduationCap className="h-4 w-4" />
            Switch to Student View
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 items-center gap-4 border-b bg-white dark:bg-slate-900 px-4 md:px-6 shrink-0">
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">Lender Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Demo Lender Admin
            </span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              DL
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

// Active-link-aware nav item
function NavLink({ href, label, Icon }: { href: string; label: string; Icon: React.ElementType }) {
  const pathname = usePathname();
  // Exact match for dashboard root, prefix match for sub-pages
  const isActive =
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}
