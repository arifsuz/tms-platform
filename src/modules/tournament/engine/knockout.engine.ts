import { Participant, Tournament } from "@/generated/prisma/client";
import { MatchInput, TournamentEngine } from "./types";
import { v4 as uuidv4 } from "uuid";

export class KnockOutEngine implements TournamentEngine {
  generateMatches(tournament: Tournament, participants: Participant[]): MatchInput[] {
    const N = participants.length;
    if (N < 2) {
      throw new Error("Knockout tournament requires at least 2 participants.");
    }

    // 1. Calculate bracket size (next power of 2)
    const P = Math.pow(2, Math.ceil(Math.log2(N)));
    const byes = P - N;
    const totalRounds = Math.log2(P);

    // 2. Generate standard seeding array (1 to P)
    // Example for P=4: [1, 4, 2, 3]
    let seeds = [1, 2];
    for (let round = 1; round < totalRounds; round++) {
      const nextSeeds: number[] = [];
      const currentSize = seeds.length * 2;
      for (const seed of seeds) {
        nextSeeds.push(seed);
        nextSeeds.push(currentSize + 1 - seed);
      }
      seeds = nextSeeds;
    }

    // 3. Map seeds to participants (Seed 1 = index 0, Seed 2 = index 1, etc.)
    // Seeds greater than N are Byes (represented as null)
    const seededParticipants: (Participant | null)[] = seeds.map((seed) => {
      if (seed <= N) {
        return participants[seed - 1];
      }
      return null; // Bye
    });

    // 4. Build the matches bottom-up (from Round 1 to Final)
    const matches: MatchInput[] = [];
    
    // Create Round 1 matches
    let previousRoundMatches: MatchInput[] = [];
    for (let i = 0; i < P / 2; i++) {
      const p1 = seededParticipants[i * 2];
      const p2 = seededParticipants[i * 2 + 1];
      
      const isBye = p1 === null || p2 === null;
      
      const match: MatchInput = {
        id: uuidv4(),
        tournamentId: tournament.id,
        roundNumber: 1,
        bracketPosition: `WB-R1-M${i + 1}`,
        homeParticipantId: p1 ? p1.id : null,
        awayParticipantId: p2 ? p2.id : null,
        status: isBye ? "COMPLETED" : "PENDING",
        nextMatchId: null, // Will be set in next round
      };
      
      matches.push(match);
      previousRoundMatches.push(match);
    }

    // 5. Create subsequent rounds
    for (let roundNumber = 2; roundNumber <= totalRounds; roundNumber++) {
      const currentRoundMatches: MatchInput[] = [];
      const matchesInRound = previousRoundMatches.length / 2;

      for (let i = 0; i < matchesInRound; i++) {
        const match1 = previousRoundMatches[i * 2];
        const match2 = previousRoundMatches[i * 2 + 1];

        const match: MatchInput = {
          id: uuidv4(),
          tournamentId: tournament.id,
          roundNumber: roundNumber,
          bracketPosition: `WB-R${roundNumber}-M${i + 1}`,
          // If the previous match was a Bye, automatically advance the participant
          homeParticipantId: match1.status === "COMPLETED" 
            ? (match1.homeParticipantId || match1.awayParticipantId) 
            : null,
          awayParticipantId: match2.status === "COMPLETED"
            ? (match2.homeParticipantId || match2.awayParticipantId)
            : null,
          status: "PENDING",
          nextMatchId: null,
        };

        // Link previous round matches to this match
        match1.nextMatchId = match.id;
        match2.nextMatchId = match.id;

        matches.push(match);
        currentRoundMatches.push(match);
      }
      
      previousRoundMatches = currentRoundMatches;
    }

    // If a round 2 match has both participants forwarded from byes (rare, but mathematically possible if >50% byes), 
    // it technically wouldn't automatically resolve here. But our bracket requires N >= 2, and max byes is P/2 - 1, 
    // so a Round 2 match will never have TWO byes feeding into it.

    return matches;
  }
}
