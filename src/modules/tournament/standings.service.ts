import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/redis";
import { TournamentType } from "@/generated/prisma/client";

export interface StandingEntry {
  participantId: string;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export class StandingsService {
  /**
   * Retrieves standings for a given tournament.
   * Uses Redis caching to ensure fast reads.
   */
  static async getStandings(tournamentId: string): Promise<StandingEntry[]> {
    const cacheKey = `tournament:${tournamentId}:standings`;
    const cached = await getCache<StandingEntry[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const standings = await this.calculateStandings(tournamentId);
    await setCache(cacheKey, standings, 60 * 5); // Cache for 5 minutes

    return standings;
  }

  /**
   * Calculates standings from scratch by reading the database.
   */
  private static async calculateStandings(tournamentId: string): Promise<StandingEntry[]> {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        participants: true,
        matches: {
          where: { status: "COMPLETED" },
        },
      },
    });

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    if (tournament.type !== TournamentType.ROUND_ROBIN && tournament.type !== TournamentType.LEAGUE) {
      throw new Error("Standings are only supported for ROUND_ROBIN or LEAGUE tournaments");
    }

    // Initialize standings map
    const standingsMap = new Map<string, StandingEntry>();

    for (const participant of tournament.participants) {
      standingsMap.set(participant.id, {
        participantId: participant.id,
        name: participant.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
      });
    }

    // Process all completed matches
    for (const match of tournament.matches) {
      if (!match.homeParticipantId || !match.awayParticipantId) continue;
      if (match.homeScore === null || match.awayScore === null) continue;

      const home = standingsMap.get(match.homeParticipantId);
      const away = standingsMap.get(match.awayParticipantId);

      if (!home || !away) continue;

      home.played += 1;
      away.played += 1;

      home.goalsFor += match.homeScore;
      home.goalsAgainst += match.awayScore;
      away.goalsFor += match.awayScore;
      away.goalsAgainst += match.homeScore;

      if (match.homeScore > match.awayScore) {
        home.won += 1;
        home.points += 3;
        away.lost += 1;
      } else if (match.homeScore < match.awayScore) {
        away.won += 1;
        away.points += 3;
        home.lost += 1;
      } else {
        home.drawn += 1;
        home.points += 1;
        away.drawn += 1;
        away.points += 1;
      }
    }

    // Calculate GD and convert to array
    const standings = Array.from(standingsMap.values()).map(entry => {
      entry.goalDifference = entry.goalsFor - entry.goalsAgainst;
      return entry;
    });

    // Sort standings
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.name.localeCompare(b.name);
    });

    return standings;
  }
}
