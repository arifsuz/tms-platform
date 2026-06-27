"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

/**
 * Dashboard Sign Out button (client component).
 * Extracted because the dashboard layout is a Server Component.
 */
export function DashboardSignOut() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut className="h-4 w-4" />
      Keluar
    </button>
  );
}
