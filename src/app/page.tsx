import Link from "next/link";
import {
  Trophy,
  Swords,
  Users,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";

/**
 * Landing Page — TMS Platform hero and feature showcase.
 * Replaces default Next.js boilerplate.
 */
export default function HomePage() {
  const features = [
    {
      icon: Swords,
      title: "6 Format Kompetisi",
      description:
        "Round-Robin, Knock-Out, Swiss, Hybrid, Ladder, dan League — semua dalam satu platform.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Users,
      title: "Multi-Organization",
      description:
        "Kelola beberapa organisasi dan turnamen secara terpisah dengan isolasi data penuh.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: BarChart3,
      title: "Live Standings",
      description:
        "Klasemen real-time dengan performa tinggi, di-cache menggunakan Redis untuk kecepatan maksimal.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Shield,
      title: "Audit Trail",
      description:
        "Setiap perubahan skor tercatat — siapa, kapan, skor lama, dan skor baru. Transparan dan akuntabel.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Zap,
      title: "Auto Bracket Generation",
      description:
        "Engine otomatis generate jadwal pertandingan berdasarkan format dan jumlah peserta.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Trophy,
      title: "Bracket Visualization",
      description:
        "Visualisasi bagan turnamen interaktif untuk format Knock-Out dan Hybrid.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">TMS</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Mulai Gratis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-secondary" />
            Platform Manajemen Turnamen Profesional
          </div>
          <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Kelola Turnamen{" "}
            <span className="text-primary">Olahraga</span> &{" "}
            <span className="text-accent">E-Sports</span>
            <br />
            dengan Mudah
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Buat organisasi, atur kompetisi dengan 6 format berbeda, generate
            jadwal otomatis, dan pantau klasemen secara real-time — semuanya
            dalam satu platform.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Mulai Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 text-base font-medium transition-colors hover:bg-card"
            >
              Masuk ke Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Semua yang Anda Butuhkan
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Fitur lengkap untuk menyelenggarakan kompetisi profesional
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.bgColor}`}
                >
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>Tournament Management System</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} TMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
