import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { TournamentType } from "@/generated/prisma/client";
import { StandingsService } from "@/modules/tournament/standings.service";
import { StandingsTable } from "@/modules/tournament/components/standings-table";

export const metadata = {
  title: "Tournament Standings | TMS",
  description: "View tournament standings and leaderboard",
};

export default async function PublicStandingsPage({
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
    redirect(`/t/${tournament.slug}/bracket`);
  }

  const standings = await StandingsService.getStandings(tournament.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">Leaderboard Standings</h3>
        </div>
        <StandingsTable standings={standings} />
      </div>
    </div>
  );
}
