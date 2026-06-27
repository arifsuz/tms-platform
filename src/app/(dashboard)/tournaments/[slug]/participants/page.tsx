import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ParticipantList } from "@/modules/participant/components/participant-list";
import { AddParticipantModal } from "@/modules/participant/components/add-participant-modal";
import { GenerateBracketButton } from "@/modules/tournament/components/generate-bracket-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, ListOrdered } from "lucide-react";
import { TournamentType } from "@/generated/prisma/client";

export const metadata = {
  title: "Manage Participants | TMS",
  description: "Manage tournament participants",
};

export default async function ParticipantsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const tournament = await prisma.tournament.findUnique({
    where: { slug },
    include: {
      participants: {
        orderBy: { registeredAt: "asc" },
      },
      _count: {
        select: { participants: true }
      }
    },
  });

  if (!tournament) {
    notFound();
  }

  const rulesConfig = tournament.rulesConfig as { participantLimit?: number };
  const limit = rulesConfig?.participantLimit || 512;
  const count = tournament._count.participants;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Participants</h1>
          <p className="text-muted-foreground">
            Manage teams or players for <strong>{tournament.name}</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {count} / {limit} participants registered
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tournament.status === "DRAFT" && (
            <GenerateBracketButton 
              tournamentId={tournament.id} 
              tournamentSlug={tournament.slug} 
              participantCount={count} 
            />
          )}
          {tournament.status !== "DRAFT" && (
            <>
              {(tournament.type === TournamentType.ROUND_ROBIN || tournament.type === TournamentType.LEAGUE) && (
                <Button asChild variant="outline">
                  <Link href={`/tournaments/${tournament.slug}/standings`}>
                    <ListOrdered className="w-4 h-4 mr-2" />
                    Standings
                  </Link>
                </Button>
              )}
              <Button asChild variant="default">
                <Link href={`/tournaments/${tournament.slug}/bracket`}>
                  <Trophy className="w-4 h-4 mr-2" />
                  View Bracket
                </Link>
              </Button>
            </>
          )}
          {count < limit && tournament.status === "DRAFT" && (
            <AddParticipantModal tournamentId={tournament.id} />
          )}
        </div>
      </div>

      <ParticipantList participants={tournament.participants} />
    </div>
  );
}
