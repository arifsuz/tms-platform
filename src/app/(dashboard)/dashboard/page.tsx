import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Swords, Users, Trophy, TrendingUp } from "lucide-react";

/**
 * Dashboard home page — Welcome message + metric cards.
 * This is a placeholder for Phase 1 that will be enhanced in Phase 2.
 */
export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const stats = [
    {
      label: "Total Turnamen",
      value: "0",
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Pertandingan Aktif",
      value: "0",
      icon: Swords,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      label: "Total Peserta",
      value: "0",
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Tingkat Partisipasi",
      value: "—",
      icon: TrendingUp,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Selamat datang, {session?.user?.name || "User"}! 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          Kelola turnamen Anda dari sini. Buat organisasi baru untuk memulai.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/20"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor}`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">Belum ada turnamen</h2>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          Buat organisasi terlebih dahulu, lalu mulai buat turnamen pertama Anda
          dengan berbagai format kompetisi.
        </p>
      </div>
    </div>
  );
}
