import { Match, Participant, Tournament, MatchStatus } from "@/generated/prisma/client";

export interface MatchInput {
  id: string;
  tournamentId: string;
  roundNumber: number;
  bracketPosition: string;
  homeParticipantId?: string | null;
  awayParticipantId?: string | null;
  nextMatchId?: string | null;
  status: MatchStatus;
}

export interface TournamentEngine {
  /**
   * Generates the matches for a given tournament based on the participants.
   * Returns an array of MatchInput ready for bulk insertion.
   */
  generateMatches(tournament: Tournament, participants: Participant[]): MatchInput[];
}
