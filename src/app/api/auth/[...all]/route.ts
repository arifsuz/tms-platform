import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth catch-all API route handler.
 * Handles: /api/auth/sign-in, /api/auth/sign-up, /api/auth/sign-out, etc.
 */
export const { POST, GET } = toNextJsHandler(auth);
