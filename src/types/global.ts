/**
 * Standardized return pattern for all Server Actions and API Routes.
 * Ensures consistent response structure across the entire application.
 * Reference: docs/04_API_SPECIFICATION.md, docs/06_AGENT.md
 */
export type ActionResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  error?: {
    code: ErrorCode;
    details?: Record<string, string>[];
  };
};

/**
 * Pagination metadata for list endpoints.
 */
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/**
 * Standardized error codes used across the application.
 */
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "TOURNAMENT_LOCKED"
  | "MAX_PARTICIPANTS_REACHED";
