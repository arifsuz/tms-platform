import { Participant, Tournament } from "@/generated/prisma/client";
import { MatchInput, TournamentEngine } from "./types";
import { v4 as uuidv4 } from "uuid";

export class RoundRobinEngine implements TournamentEngine {
  generateMatches(tournament: Tournament, participants: Participant[]): MatchInput[] {
    const N = participants.length;
    if (N < 2) {
      throw new Error("Round-robin tournament requires at least 2 participants.");
    }

    const matches: MatchInput[] = [];
    
    // Create a copy of participants array
    const players: (Participant | null)[] = [...participants];

    // If odd number of players, add a dummy player for "Bye"
    if (N % 2 !== 0) {
      players.push(null); // Dummy player
    }

    const numPlayers = players.length;
    const numRounds = numPlayers - 1;
    const matchesPerRound = numPlayers / 2;

    for (let round = 0; round < numRounds; round++) {
      for (let match = 0; match < matchesPerRound; match++) {
        const home = players[match];
        const away = players[numPlayers - 1 - match];

        // If either is null, it's a bye match, we can just skip creating the match entirely in Round Robin,
        // or we can create it as COMPLETED. It's better to not create matches for Byes in Round Robin, 
        // as they don't give points.
        if (home !== null && away !== null) {
          matches.push({
            id: uuidv4(),
            tournamentId: tournament.id,
            roundNumber: round + 1,
            bracketPosition: `RR-R${round + 1}-M${match + 1}`,
            homeParticipantId: home.id,
            awayParticipantId: away.id,
            status: "PENDING",
            nextMatchId: null, // Round Robin usually doesn't have a direct "nextMatch" link
          });
        }
      }

      // Rotate players for next round (Polygon method)
      // Keep first element fixed, rotate the rest clockwise
      players.splice(1, 0, players.pop() as Participant | null);
    }

    return matches;
  }
}
