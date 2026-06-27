import * as z from "zod";

export const addParticipantSchema = z.object({
  tournamentId: z.string().cuid(),
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  logo: z.string().optional(),
});

export type AddParticipantPayload = z.infer<typeof addParticipantSchema>;
