import { prisma } from "@/lib/prisma";
import { MatchStatus, TournamentType } from "@/generated/prisma/client";
import { deleteCache } from "@/lib/redis";

export interface UpdateScorePayload {
  homeScore: number;
  awayScore: number;
}

export class MatchService {
  /**
   * Updates a match score and handles bracket progression.
   */
  static async updateMatchScore(
    matchId: string,
    payload: UpdateScorePayload,
    userId: string
  ) {
    // 1. Get the match with its tournament
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        tournament: true,
      },
    });

    if (!match) {
      throw new Error("Match not found");
    }

    if (match.status === MatchStatus.COMPLETED) {
      throw new Error("Match is already completed");
    }

    if (!match.homeParticipantId || !match.awayParticipantId) {
      throw new Error("Match does not have both participants set yet");
    }

    const { homeScore, awayScore } = payload;
    let winnerId: string | null = null;

    if (homeScore > awayScore) {
      winnerId = match.homeParticipantId;
    } else if (awayScore > homeScore) {
      winnerId = match.awayParticipantId;
    } else if (match.tournament.type === TournamentType.KNOCK_OUT) {
      // In Knockout, draws are typically not allowed unless handled by penalties (handled in UI by just submitting the final result)
      throw new Error("Knockout matches cannot end in a draw");
    }

    // 2. Perform the updates in a transaction
    await prisma.$transaction(async (tx) => {
      // Update current match
      const updatedMatch = await tx.match.update({
        where: { id: matchId },
        data: {
          homeScore,
          awayScore,
          status: MatchStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      // Bracket progression for Knockout
      if (match.tournament.type === TournamentType.KNOCK_OUT && match.nextMatchId && winnerId) {
        // Fetch next match to see which slot (home or away) is empty
        const nextMatch = await tx.match.findUnique({
          where: { id: match.nextMatchId },
        });

        if (nextMatch) {
          // Determine if we should fill home or away
          // A simple approach: if home is null, fill home. Else fill away.
          // Since our bracket generation creates previous matches in pairs, this works.
          const updateData: any = {};
          if (!nextMatch.homeParticipantId) {
            updateData.homeParticipantId = winnerId;
          } else if (!nextMatch.awayParticipantId) {
            updateData.awayParticipantId = winnerId;
          } else {
            console.warn(`Next match ${match.nextMatchId} is already full!`);
          }

          if (Object.keys(updateData).length > 0) {
            await tx.match.update({
              where: { id: match.nextMatchId },
              data: updateData,
            });
          }
        }
      }

      // Audit Log
      await tx.auditLog.create({
        data: {
          organizationId: match.tournament.organizationId,
          userId,
          action: "UPDATE_MATCH_SCORE",
          resourceType: "MATCH",
          resourceId: matchId,
          oldData: { status: match.status, homeScore: match.homeScore, awayScore: match.awayScore },
          newData: { status: MatchStatus.COMPLETED, homeScore, awayScore },
        },
      });
    });

    // 3. Cache Invalidation
    if (
      match.tournament.type === TournamentType.ROUND_ROBIN ||
      match.tournament.type === TournamentType.LEAGUE
    ) {
      const cacheKey = `tournament:${match.tournament.id}:standings`;
      await deleteCache(cacheKey);
    }

    return { success: true };
  }
}
