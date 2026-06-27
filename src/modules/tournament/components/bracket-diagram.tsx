import { MatchStatus } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

interface ParticipantInfo {
  name: string;
  logo?: string | null;
}

interface MatchNode {
  id: string;
  roundNumber: number | null;
  bracketPosition: string | null;
  homeParticipant: ParticipantInfo | null;
  awayParticipant: ParticipantInfo | null;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
}

interface BracketDiagramProps {
  matches: MatchNode[];
}

export function BracketDiagram({ matches }: BracketDiagramProps) {
  // Group matches by roundNumber
  const roundsMap = new Map<number, MatchNode[]>();
  
  for (const match of matches) {
    if (match.roundNumber === null) continue;
    const existing = roundsMap.get(match.roundNumber) || [];
    existing.push(match);
    roundsMap.set(match.roundNumber, existing);
  }

  // Sort rounds ascending
  const roundNumbers = Array.from(roundsMap.keys()).sort((a, b) => a - b);

  if (roundNumbers.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto py-8 px-4 bg-muted/10 rounded-xl border mb-8 relative">
      <div className="flex gap-16 min-w-max relative">
        {roundNumbers.map((roundNumber, roundIndex) => {
          const roundMatches = roundsMap.get(roundNumber)!;
          // Sort by bracket position
          roundMatches.sort((a, b) => (a.bracketPosition || "").localeCompare(b.bracketPosition || ""));
          
          return (
            <div key={roundNumber} className="flex flex-col justify-around gap-6 w-[280px] relative">
              <div className="text-center font-bold text-sm text-muted-foreground mb-4 uppercase tracking-wider">
                Round {roundNumber}
                {roundIndex === roundNumbers.length - 1 && " (Final)"}
              </div>
              
              <div className="flex flex-col justify-around flex-1 gap-6 relative">
                {roundMatches.map((match) => (
                  <div key={match.id} className="relative z-10 flex flex-col bg-card border border-border/60 rounded-lg shadow-sm text-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* Home Team */}
                    <div className={cn(
                      "flex justify-between items-center px-4 py-3 border-b",
                      match.status === "COMPLETED" && match.homeScore! > match.awayScore! && "font-bold bg-primary/10",
                      match.status === "COMPLETED" && match.homeScore! < match.awayScore! && "text-muted-foreground opacity-70"
                    )}>
                      <span className="truncate pr-2 font-medium">
                        {match.homeParticipant?.name || <span className="text-muted-foreground font-normal italic">TBD</span>}
                      </span>
                      <span className="tabular-nums font-semibold">
                        {match.homeScore !== null ? match.homeScore : "-"}
                      </span>
                    </div>

                    {/* Away Team */}
                    <div className={cn(
                      "flex justify-between items-center px-4 py-3",
                      match.status === "COMPLETED" && match.awayScore! > match.homeScore! && "font-bold bg-primary/10",
                      match.status === "COMPLETED" && match.awayScore! < match.homeScore! && "text-muted-foreground opacity-70"
                    )}>
                      <span className="truncate pr-2 font-medium">
                        {match.awayParticipant?.name || <span className="text-muted-foreground font-normal italic">TBD</span>}
                      </span>
                      <span className="tabular-nums font-semibold">
                        {match.awayScore !== null ? match.awayScore : "-"}
                      </span>
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
