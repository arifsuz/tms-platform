import { prisma } from "@/lib/prisma";
import { AddParticipantPayload } from "./participant.schema";

export class ParticipantService {
  /**
   * Adds a participant to a tournament.
   * Enforces participant limit defined in rulesConfig.
   */
  static async add(payload: AddParticipantPayload) {
    return await prisma.$transaction(async (tx) => {
      // Check tournament status and limit
      const tournament = await tx.tournament.findUnique({
        where: { id: payload.tournamentId },
        include: { _count: { select: { participants: true } } },
      });

      if (!tournament) {
        throw new Error("Tournament not found");
      }

      if (tournament.status !== "DRAFT" && tournament.status !== "REGISTRATION") {
        throw new Error("Cannot add participants to a tournament that has already started.");
      }

      const rulesConfig = tournament.rulesConfig as { participantLimit?: number };
      const limit = rulesConfig?.participantLimit || 512;

      if (tournament._count.participants >= limit) {
        throw new Error(`Participant limit (${limit}) reached.`);
      }

      // Check for duplicate name
      const existing = await tx.participant.findUnique({
        where: {
          tournamentId_name: {
            tournamentId: payload.tournamentId,
            name: payload.name,
          },
        },
      });

      if (existing) {
        throw new Error("A participant with this name is already registered.");
      }

      // Add participant
      return await tx.participant.create({
        data: {
          tournamentId: payload.tournamentId,
          name: payload.name,
          logo: payload.logo,
        },
      });
    });
  }

  static async getByTournament(tournamentId: string) {
    return await prisma.participant.findMany({
      where: { tournamentId },
      orderBy: { registeredAt: "asc" },
    });
  }
}
