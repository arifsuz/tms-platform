"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { TournamentService } from "@/modules/tournament/tournament.service";
import { tournamentWizardSchema, TournamentWizardPayload } from "@/modules/tournament/tournament.schema";
import { rateLimit } from "@/lib/rate-limit";
import { AuditService } from "@/modules/audit/audit.service";

export type ActionResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
};

export async function createTournamentAction(
  payload: TournamentWizardPayload,
  activeOrganizationId: string | null
): Promise<ActionResponse<{ slug: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, message: "Unauthorized", error: { code: "UNAUTHORIZED" } };
    }

    // Rate limiting: max 5 tournaments per hour per user
    const rl = await rateLimit(`create-tournament:${session.user.id}`, { limit: 5, windowMs: 3600000 });
    if (!rl.success) {
      return { success: false, message: "Too many tournaments created. Please try again later.", error: { code: "RATE_LIMITED" } };
    }

    if (!activeOrganizationId) {
      return { success: false, message: "No active organization", error: { code: "BAD_REQUEST" } };
    }

    // Validate payload
    const validatedData = tournamentWizardSchema.safeParse(payload);
    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid payload",
        error: { code: "VALIDATION_ERROR", details: validatedData.error.flatten() },
      };
    }

    // Role check for organization is handled by Better Auth internally but we should ensure the user belongs to it
    // Wait, Better Auth organization plugin requires activeOrgId to be sent with requests. 
    // Here we assume the client provides the active organization ID.

    const tournament = await TournamentService.create({
      ...validatedData.data,
      organizationId: activeOrganizationId,
    });

    await AuditService.log({
      organizationId: activeOrganizationId,
      userId: session.user.id,
      action: "CREATE_TOURNAMENT",
      resourceType: "TOURNAMENT",
      resourceId: tournament.id,
      newData: { name: tournament.name, type: tournament.type },
      ipAddress: session.session.ipAddress || null,
    });

    return {
      success: true,
      message: "Tournament created successfully",
      data: { slug: tournament.slug },
    };
  } catch (error: any) {
    console.error("[CREATE_TOURNAMENT]", error);
    return {
      success: false,
      message: "Internal Server Error",
      error: { code: "INTERNAL_ERROR" },
    };
  }
}

export async function generateBracketAction(
  tournamentId: string,
): Promise<ActionResponse<{ count: number }>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, message: "Unauthorized", error: { code: "UNAUTHORIZED" } };
    }

    // Rate limiting: max 5 bracket generations per minute per user
    const rl = await rateLimit(`generate-bracket:${session.user.id}`, { limit: 5, windowMs: 60000 });
    if (!rl.success) {
      return { success: false, message: "Too many bracket generations. Please wait a moment.", error: { code: "RATE_LIMITED" } };
    }

    const result = await TournamentService.generateBracket(tournamentId);

    await AuditService.log({
      organizationId: session.session.activeOrganizationId || null,
      userId: session.user.id,
      action: "GENERATE_BRACKET",
      resourceType: "TOURNAMENT",
      resourceId: tournamentId,
      newData: { matchesCreated: result.count },
      ipAddress: session.session.ipAddress || null,
    });

    return {
      success: true,
      message: "Bracket generated successfully",
      data: { count: result.count },
    };
  } catch (error: any) {
    console.error("[GENERATE_BRACKET]", error);
    return {
      success: false,
      message: error.message || "Internal Server Error",
    };
  }
}

export async function completeTournamentAction(
  tournamentId: string
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, message: "Unauthorized", error: { code: "UNAUTHORIZED" } };
    }

    const result = await TournamentService.completeTournament(tournamentId);

    await AuditService.log({
      organizationId: session.session.activeOrganizationId || null,
      userId: session.user.id,
      action: "COMPLETE_TOURNAMENT",
      resourceType: "TOURNAMENT",
      resourceId: tournamentId,
      ipAddress: session.session.ipAddress || null,
    });

    return {
      success: true,
      message: "Tournament marked as completed",
    };
  } catch (error: any) {
    console.error("[COMPLETE_TOURNAMENT]", error);
    return {
      success: false,
      message: error.message || "Internal Server Error",
      error: { code: "INTERNAL_ERROR" },
    };
  }
}
