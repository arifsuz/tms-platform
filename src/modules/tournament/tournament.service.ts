import { prisma } from "@/lib/prisma";
import { CreateTournamentPayload } from "./tournament.schema";
import { TournamentStatus } from "@/generated/prisma/client";

export class TournamentService {
  /**
   * Creates a new tournament in DRAFT status.
   */
  static async create(payload: CreateTournamentPayload) {
    // Generate a unique slug
    let baseSlug = payload.metadata.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure slug is unique
    while (await prisma.tournament.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const tournament = await prisma.tournament.create({
      data: {
        organizationId: payload.organizationId,
        name: payload.metadata.name,
        slug,
        description: payload.metadata.description,
        game: payload.metadata.game,
        type: payload.format.engineType,
        status: TournamentStatus.DRAFT,
        timezone: payload.metadata.timezone,
        rulesConfig: {
          participantLimit: payload.format.participantLimit,
          winPoints: payload.rules.winPoints,
          lossPoints: payload.rules.lossPoints,
          drawPoints: payload.rules.drawPoints,
          tieBreaker: payload.rules.tieBreaker,
        },
      },
    });

    return tournament;
  }

  /**
   * Generates bracket/matches for a tournament and updates status to IN_PROGRESS.
   */
  static async generateBracket(tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        participants: true,
      },
    });

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    if (tournament.status !== TournamentStatus.DRAFT) {
      throw new Error("Only DRAFT tournaments can generate a bracket");
    }

    if (tournament.participants.length < 2) {
      throw new Error("Not enough participants to start the tournament");
    }

    // Dynamic import to avoid circular dependencies if any
    const { TournamentEngineFactory } = await import("./engine/factory");
    const engine = TournamentEngineFactory.getEngine(tournament.type);
    const matches = engine.generateMatches(tournament, tournament.participants);

    // Execute transaction to bulk create matches and update status
    await prisma.$transaction([
      prisma.match.createMany({
        data: matches,
      }),
      prisma.tournament.update({
        where: { id: tournamentId },
        data: { status: TournamentStatus.IN_PROGRESS },
      }),
    ]);

    return { count: matches.length };
  }

  static async completeTournament(tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    if (tournament.status === TournamentStatus.COMPLETED) {
      throw new Error("Tournament is already completed");
    }

    await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        status: TournamentStatus.COMPLETED,
        endDate: new Date(),
      },
    });

    return { success: true };
  }
}
