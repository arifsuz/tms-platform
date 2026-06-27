import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { prisma } from "@/lib/prisma";

/**
 * Better Auth server instance.
 * Handles authentication, session management, and organization RBAC.
 * Reference: docs/02_SYSTEM_ARCHITECTURE.md (Section 5)
 * Reference: docs/09_SECURITY_GUIDELINE.md
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  /** Email + Password authentication enabled. */
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  /** Custom user fields — adds systemRole to the User model. */
  user: {
    additionalFields: {
      systemRole: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false, // Cannot be set by the user during registration
      },
    },
  },

  /** Session configuration. */
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes client-side cache
    },
  },

  /** Plugins. */
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
    }),
  ],
});

/** Export the auth type for client inference. */
export type Auth = typeof auth;
