import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { Auth } from "@/lib/auth";

/**
 * Better Auth client instance for React components.
 * Provides hooks for authentication state and actions.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    organizationClient(),
    inferAdditionalFields<Auth>(),
  ],
});

/** Destructured exports for convenience. */
export const {
  useSession,
  signIn,
  signUp,
  signOut,
  organization,
} = authClient;
