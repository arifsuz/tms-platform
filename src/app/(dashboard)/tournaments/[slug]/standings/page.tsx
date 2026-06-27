import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StandingsTable } from "@/modules/tournament/components/standings-table";
import { StandingsService } from "@/modules/tournament/standings.service";
import { TournamentType } from "@/generated/prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Swords } from "lucide-react";

export const metadata = {
  title: "Tournament Standings | TMS",
  description: "View tournament standings and leaderboard",
};

export default async function StandingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const tournament = await prisma.tournament.findUnique({
    where: { slug },
  });

  if (!tournament) {
    notFound();
  }

  if (tournament.type !== TournamentType.ROUND_ROBIN && tournament.type !== TournamentType.LEAGUE) {
    return (
      <div className="flex flex-col gap-6 items-center justify-center py-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Standings Not Applicable</h1>
        <p className="text-muted-foreground max-w-md">
          Standings and leaderboards are only available for Round Robin and League formats.
          Since <strong>{tournament.name}</strong> is a Knockout tournament, please refer to the Bracket.
        </p>
        <Button asChild className="mt-4">
          <Link href={`/tournaments/${tournament.slug}/bracket`}>
            <Swords className="w-4 h-4 mr-2" />
            View Bracket
          </Link>
        </Button>
      </div>
    );
  }

  const standings = await StandingsService.getStandings(tournament.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Standings / Leaderboard</h1>
          <p className="text-muted-foreground">
            Current rankings for <strong>{tournament.name}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/tournaments/${tournament.slug}/participants`}>
              <Users className="w-4 h-4 mr-2" />
              Participants
            </Link>
          </Button>
          <Button asChild variant="default">
            <Link href={`/tournaments/${tournament.slug}/bracket`}>
              <Swords className="w-4 h-4 mr-2" />
              Match List
            </Link>
          </Button>
        </div>
      </div>

      <StandingsTable standings={standings} />
    </div>
  );
}
