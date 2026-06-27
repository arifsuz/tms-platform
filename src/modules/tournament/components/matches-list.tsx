"use client";

import { useState } from "react";
import { UpdateScoreModal } from "@/modules/match/components/update-score-modal";
import { Button } from "@/components/ui/button";
import { MatchStatus, TournamentStatus } from "@/generated/prisma/client";

interface ParticipantInfo {
  name: string;
  logo?: string | null;
}

interface MatchNode {
  id: string;
  roundNumber: number | null;
  bracketPosition: string | null;
  homeParticipantId: string | null;
  awayParticipantId: string | null;
  homeParticipant: ParticipantInfo | null;
  awayParticipant: ParticipantInfo | null;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
}

interface MatchesListProps {
  matches: MatchNode[];
  tournamentStatus: TournamentStatus;
}

export function MatchesList({ matches, tournamentStatus }: MatchesListProps) {
  const [selectedRound, setSelectedRound] = useState<number | "ALL">("ALL");

  if (matches.length === 0) {
    return <p className="text-muted-foreground">No matches have been generated yet.</p>;
  }

  // Group matches by round
  const roundsMap = new Map<number, MatchNode[]>();
  for (const match of matches) {
    if (match.roundNumber === null) continue;
    const existing = roundsMap.get(match.roundNumber) || [];
    existing.push(match);
    roundsMap.set(match.roundNumber, existing);
  }
  const roundNumbers = Array.from(roundsMap.keys()).sort((a, b) => a - b);

  // Filter matches based on selected tab
  const displayedRounds = selectedRound === "ALL" ? roundNumbers : [selectedRound];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={selectedRound === "ALL" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRound("ALL")}
          className="whitespace-nowrap"
        >
          All Rounds
        </Button>
        {roundNumbers.map((round) => (
          <Button
            key={round}
            variant={selectedRound === round ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRound(round)}
            className="whitespace-nowrap"
          >
            Round {round}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {displayedRounds.map((round) => {
          const matchesInRound = roundsMap.get(round)!;
          return (
            <div key={round} className="space-y-4">
              <h4 className="text-md font-semibold border-b pb-2">Round {round}</h4>
              <div className="grid gap-4">
                {matchesInRound.map((match) => (
                  <div key={match.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-muted-foreground mb-2">
                        Match: {match.bracketPosition}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex-1 bg-muted/50 p-2 rounded border text-center sm:text-left truncate">
                          <span className="font-medium">
                            {match.homeParticipant?.name || "TBD"}
                          </span>
                        </div>
                        <div className="text-muted-foreground text-sm font-bold text-center">VS</div>
                        <div className="flex-1 bg-muted/50 p-2 rounded border text-center sm:text-left truncate">
                          <span className="font-medium">
                            {match.awayParticipant?.name || "TBD"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:min-w-[120px]">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shrink-0">
                        {match.status}
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-lg font-bold bg-background border px-3 py-1 rounded">
                          {match.homeScore !== null ? match.homeScore : "-"} : {match.awayScore !== null ? match.awayScore : "-"}
                        </div>
                        {match.status !== "COMPLETED" && tournamentStatus !== "COMPLETED" && match.homeParticipantId && match.awayParticipantId && (
                          <UpdateScoreModal 
                            matchId={match.id}
                            homeName={match.homeParticipant!.name}
                            awayName={match.awayParticipant!.name}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
