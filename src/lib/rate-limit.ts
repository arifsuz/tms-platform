import { redis } from "./redis";

interface RateLimitConfig {
  limit: number;      // Maximum requests
  windowMs: number;   // Time window in milliseconds
}

/**
 * A basic Fixed Window Rate Limiter using Redis.
 * Useful for limiting Server Actions and API Routes.
 */
export async function rateLimit(identifier: string, config: RateLimitConfig): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const { limit, windowMs } = config;
  
  const currentWindow = Math.floor(Date.now() / windowMs);
  const key = `ratelimit:${identifier}:${currentWindow}`;
  
  if (!redis) {
    // If Redis is not configured (e.g., local dev without Redis), bypass rate limiting
    return { success: true, limit, remaining: limit, reset: 0 };
  }

  // Use a transaction/pipeline to increment and set expiry atomically
  const pipeline = redis.pipeline();
  pipeline.incr(key);
  pipeline.pexpire(key, windowMs);
  
  const results = await pipeline.exec();
  
  let currentCount = 0;
  if (results && results[0] && results[0][1] !== null) {
    currentCount = results[0][1] as number;
  }
  
  const success = currentCount <= limit;
  const remaining = Math.max(0, limit - currentCount);
  const reset = (currentWindow + 1) * windowMs;

  return {
    success,
    limit,
    remaining,
    reset
  };
}
