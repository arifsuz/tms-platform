import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  LayoutDashboard,
  Users,
  Swords,
  Settings,
  FileText,
  LogOut,
} from "lucide-react";
import { DashboardSignOut } from "./dashboard-sign-out";
import { OrganizationSwitcher } from "@/modules/organization/components/organization-switcher";

/**
 * Dashboard layout — Auth-protected with sidebar + topbar.
 * Redirect to /login if no valid session.
 * Reference: docs/05_UI_UX_GUIDELINE.md (Section 5.2)
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Tournaments", href: "/tournaments", icon: Swords },
    { label: "Teams", href: "/teams", icon: Users },
    { label: "Audit Logs", href: "/audit-logs", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Trophy className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">TMS</span>
        </div>

        {/* Organization Switcher */}
        <div className="p-3 pb-0">
          <OrganizationSwitcher />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium">
                {session.user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>
          <DashboardSignOut />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">TMS</span>
          </div>
          <div className="w-48">
            <OrganizationSwitcher />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden min-w-0">{children}</main>
      </div>
    </div>
  );
}
