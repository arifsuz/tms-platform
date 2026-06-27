"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MatchService, UpdateScorePayload } from "@/modules/match/match.service";
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

export async function updateMatchScoreAction(
  matchId: string,
  payload: UpdateScorePayload
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, message: "Unauthorized", error: { code: "UNAUTHORIZED" } };
    }

    // Rate limiting: max 10 updates per 10 seconds per user
    const rl = await rateLimit(`update-score:${session.user.id}`, { limit: 10, windowMs: 10000 });
    if (!rl.success) {
      return { success: false, message: "Too many requests. Please slow down.", error: { code: "RATE_LIMITED" } };
    }

    await MatchService.updateMatchScore(matchId, payload, session.user.id);

    await AuditService.log({
      organizationId: session.session.activeOrganizationId || null,
      userId: session.user.id,
      action: "UPDATE_MATCH_SCORE",
      resourceType: "MATCH",
      resourceId: matchId,
      newData: payload,
      ipAddress: session.session.ipAddress || null,
    });

    return {
      success: true,
      message: "Match score updated successfully",
    };
  } catch (error: any) {
    console.error("[UPDATE_MATCH_SCORE]", error);
    return {
      success: false,
      message: error.message || "Internal Server Error",
      error: { code: "INTERNAL_ERROR" },
    };
  }
}
