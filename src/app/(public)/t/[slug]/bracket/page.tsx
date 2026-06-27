import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BracketDiagram } from "@/modules/tournament/components/bracket-diagram";
import { TournamentType } from "@/generated/prisma/client";
import { StandingsService } from "@/modules/tournament/standings.service";
import { Trophy } from "lucide-react";

export const metadata = {
  title: "Tournament Bracket | TMS",
  description: "View tournament bracket and matches",
};

export default async function PublicBracketPage({
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
      const finalMatch = tournament.matches[tournament.matches.length - 1];
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
      {tournament.status === "COMPLETED" && finalWinnerName && (
        <div className="bg-emerald-50 border-emerald-200 border rounded-lg p-6 flex flex-col items-center justify-center text-center text-emerald-900 shadow-sm">
          <div className="bg-emerald-100 p-3 rounded-full mb-3">
            <Trophy className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Tournament Champion</h2>
          <p className="text-lg mt-1 font-semibold">{finalWinnerName}</p>
        </div>
      )}

      <div className="bg-card border rounded-lg p-6 shadow-sm overflow-hidden">
        <h3 className="text-xl font-bold mb-6">Visual Bracket</h3>
        {tournament.matches.length > 0 ? (
          <BracketDiagram matches={tournament.matches} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No matches have been generated for this tournament yet.
          </div>
        )}
      </div>
    </div>
  );
}
