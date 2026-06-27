"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ParticipantService } from "@/modules/participant/participant.service";
import { addParticipantSchema, AddParticipantPayload } from "@/modules/participant/participant.schema";
import { ActionResponse } from "@/server/actions/tournament.actions";
import { revalidatePath } from "next/cache";

export async function addParticipantAction(
  payload: AddParticipantPayload
): Promise<ActionResponse<{ id: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, message: "Unauthorized", error: { code: "UNAUTHORIZED" } };
    }

    const validatedData = addParticipantSchema.safeParse(payload);
    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid payload",
        error: { code: "VALIDATION_ERROR", details: validatedData.error.flatten() },
      };
    }

    const participant = await ParticipantService.add(validatedData.data);
    
    // Revalidate the participants page
    revalidatePath(`/tournaments/[slug]/participants`, "page");

    return {
      success: true,
      message: "Participant added successfully",
      data: { id: participant.id },
    };
  } catch (error: any) {
    console.error("[ADD_PARTICIPANT]", error);
    return {
      success: false,
      message: error.message || "Internal Server Error",
      error: { code: "INTERNAL_ERROR" },
    };
  }
}
