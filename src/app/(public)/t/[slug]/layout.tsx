import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TournamentType } from "@/generated/prisma/client";
import { CalendarDays, Swords, ListOrdered, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function PublicTournamentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { slug },
  });

  if (!tournament) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Tournament Header */}
      <div className="bg-card border rounded-lg p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">{tournament.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
              <Badge variant="secondary">{tournament.game}</Badge>
              <Badge variant="outline">{tournament.type}</Badge>
              <span className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {tournament.startDate ? new Date(tournament.startDate).toLocaleDateString() : "TBD"}
              </span>
            </div>
          </div>
          <div>
            <Badge 
              variant={tournament.status === "COMPLETED" ? "default" : "secondary"}
              className={tournament.status === "COMPLETED" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
            >
              {tournament.status}
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 border-b overflow-x-auto pb-1">
          <Link 
            href={`/t/${tournament.slug}`}
            className="flex items-center gap-2 text-sm font-medium pb-2 border-b-2 border-transparent hover:text-primary transition-colors"
          >
            Overview
          </Link>
          <Link 
            href={`/t/${tournament.slug}/bracket`}
            className="flex items-center gap-2 text-sm font-medium pb-2 border-b-2 border-transparent hover:text-primary transition-colors"
          >
            <Swords className="w-4 h-4" />
            Bracket
          </Link>
          {(tournament.type === TournamentType.ROUND_ROBIN || tournament.type === TournamentType.LEAGUE) && (
            <Link 
              href={`/t/${tournament.slug}/standings`}
              className="flex items-center gap-2 text-sm font-medium pb-2 border-b-2 border-transparent hover:text-primary transition-colors"
            >
              <ListOrdered className="w-4 h-4" />
              Standings
            </Link>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {children}
      </div>
    </div>
  );
}
