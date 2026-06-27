import { Trophy } from "lucide-react";
import Link from "next/link";

/**
 * Auth layout — Centered card on dark background with TMS branding.
 * Used for: /login, /register
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-2xl font-bold tracking-tight"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Trophy className="h-5 w-5 text-primary-foreground" />
        </div>
        <span>TMS</span>
      </Link>

      {/* Auth card */}
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-border bg-card p-8 shadow-xl">
          {children}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Tournament Management System
      </p>
    </div>
  );
}
