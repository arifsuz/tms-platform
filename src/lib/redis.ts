import Redis from "ioredis";

/**
 * Redis client with graceful fallback.
 * Used for: Standings cache, Rate limiting, Session storage.
 * Reference: docs/02_SYSTEM_ARCHITECTURE.md (Section 6)
 */

const REDIS_URL = process.env.REDIS_URL;

/** Default TTL for cache entries (30 seconds for standings). */
const DEFAULT_TTL_SECONDS = 30;

function createRedisClient(): Redis | null {
  if (!REDIS_URL) {
    console.warn(
      "[Redis] REDIS_URL not configured. Running without cache (fallback to DB)."
    );
    return null;
  }

  try {
    const client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        // Exponential backoff: 200ms, 400ms, 800ms, then stop
        if (times > 3) return null;
        return Math.min(times * 200, 800);
      },
      lazyConnect: true,
    });

    client.on("error", (err) => {
      console.error("[Redis] Connection error:", err.message);
    });

    client.on("connect", () => {
      console.log("[Redis] Connected successfully.");
    });

    return client;
  } catch (error) {
    console.error("[Redis] Failed to create client:", error);
    return null;
  }
}

/** Global Redis client instance. */
const globalForRedis = globalThis as unknown as {
  redis: Redis | null | undefined;
};

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

// ==========================================
// Cache Helper Functions
// ==========================================

/**
 * Get a cached value from Redis.
 * Returns null if Redis is unavailable or key doesn't exist.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null;

  try {
    const cached = await redis.get(key);
    if (!cached) return null;
    return JSON.parse(cached) as T;
  } catch (error) {
    console.error(`[Redis] getCache error for key "${key}":`, error);
    return null;
  }
}

/**
 * Set a value in Redis cache with TTL.
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<void> {
  if (!redis) return;

  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    console.error(`[Redis] setCache error for key "${key}":`, error);
  }
}

/**
 * Delete a cache key (used for cache invalidation).
 */
export async function deleteCache(key: string): Promise<void> {
  if (!redis) return;

  try {
    await redis.del(key);
  } catch (error) {
    console.error(`[Redis] deleteCache error for key "${key}":`, error);
  }
}

/**
 * Delete all cache keys matching a pattern.
 * Example: deletePattern("standings:*") clears all standings caches.
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  if (!redis) return;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error(`[Redis] deleteCachePattern error for "${pattern}":`, error);
  }
}
