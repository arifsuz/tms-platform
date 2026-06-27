import * as z from "zod";
import { TournamentType } from "@/generated/prisma/enums";

export const tournamentWizardSchema = z.object({
  metadata: z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100),
    description: z.string().max(500).optional(),
    game: z.string().min(2, "Game must be specified").max(50),
    timezone: z.string(),
    logo: z.string().optional(),
  }),
  format: z.object({
    engineType: z.nativeEnum(TournamentType),
    participantLimit: z.number().int().min(2).max(512),
  }),
  rules: z.object({
    winPoints: z.number().int(),
    lossPoints: z.number().int(),
    drawPoints: z.number().int(),
    tieBreaker: z.string(),
  }),
});

export type TournamentWizardPayload = z.infer<typeof tournamentWizardSchema>;

export const createTournamentSchema = tournamentWizardSchema.extend({
  organizationId: z.string().cuid(),
});

export type CreateTournamentPayload = z.infer<typeof createTournamentSchema>;
