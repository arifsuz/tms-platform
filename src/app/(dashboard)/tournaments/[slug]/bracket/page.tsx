import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, ListOrdered, Trophy } from "lucide-react";
import { BracketDiagram } from "@/modules/tournament/components/bracket-diagram";
import { MatchesList } from "@/modules/tournament/components/matches-list";
import { TournamentType } from "@/generated/prisma/client";
import { StandingsService } from "@/modules/tournament/standings.service";

export const metadata = {
  title: "Tournament Bracket | TMS",
  description: "View tournament bracket and matches",
};

export default async function BracketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const tournament = await prisma.tournament.findUnique({
    where: { slug },
    include: {
      matches: {
        orderBy: [
          { roundNumber: 'asc' },
          { bracketPosition: 'asc' }
        ],
        include: {
          homeParticipant: true,
          awayParticipant: true,
        }
      }
    }
  });

  if (!tournament) {
    notFound();
  }

  // Find final winner if tournament is completed
  let finalWinnerName: string | null = null;
  
  if (tournament.status === "COMPLETED") {
    if (tournament.type === TournamentType.ROUND_ROBIN || tournament.type === TournamentType.LEAGUE) {
      const standings = await StandingsService.getStandings(tournament.id);
      if (standings.length > 0) {
        finalWinnerName = standings[0].name;
      }
    } else if (tournament.matches.length > 0) {
      const finalMatch = tournament.matches[tournament.matches.length - 1]; // last match is the final
      if (finalMatch.status === "COMPLETED") {
        if (finalMatch.homeScore !== null && finalMatch.awayScore !== null) {
          if (finalMatch.homeScore > finalMatch.awayScore) {
            finalWinnerName = finalMatch.homeParticipant?.name || null;
          } else if (finalMatch.awayScore > finalMatch.homeScore) {
            finalWinnerName = finalMatch.awayParticipant?.name || null;
          }
        }
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bracket / Matches</h1>
          <p className="text-muted-foreground">
            Manage matches for <strong>{tournament.name}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/tournaments/${tournament.slug}/participants`}>
              <Users className="w-4 h-4 mr-2" />
              View Participants
            </Link>
          </Button>
          {(tournament.type === TournamentType.ROUND_ROBIN || tournament.type === TournamentType.LEAGUE) && (
            <Button asChild variant="outline">
              <Link href={`/tournaments/${tournament.slug}/standings`}>
                <ListOrdered className="w-4 h-4 mr-2" />
                Standings
              </Link>
            </Button>
          )}
        </div>
      </div>

      {tournament.status === "COMPLETED" && finalWinnerName && (
        <div className="bg-emerald-50 border-emerald-200 border rounded-lg p-6 flex flex-col items-center justify-center text-center text-emerald-900 mb-6 shadow-sm">
          <div className="bg-emerald-100 p-3 rounded-full mb-3">
            <Trophy className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Tournament Champion</h2>
          <p className="text-lg mt-1 font-semibold">{finalWinnerName}</p>
        </div>
      )}

      <div className="bg-card border rounded-lg p-6 shadow-sm overflow-hidden">
        <h3 className="text-xl font-bold mb-6">Visual Bracket</h3>
        <BracketDiagram matches={tournament.matches} />
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm overflow-hidden">
        <h3 className="text-lg font-medium mb-4">Matches to Update ({tournament.matches.length})</h3>
        <MatchesList matches={tournament.matches} tournamentStatus={tournament.status} />
      </div>
    </div>
  );
}
