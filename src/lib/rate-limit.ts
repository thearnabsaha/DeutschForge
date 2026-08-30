/**
 * Simple in-memory rate limiter for serverless environments.
 * Tracks requests per IP with a sliding window.
 * NOTE: In a multi-instance deployment, use Redis-based rate limiting instead.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // seconds
}

/**
 * Check and consume a rate limit token.
 * @param key - Unique identifier (usually IP + route)
 * @param maxRequests - Max requests allowed in the window
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: Math.ceil(windowMs / 1000) };
  }

  if (entry.count >= maxRequests) {
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, resetIn };
  }

  entry.count++;
  const resetIn = Math.ceil((entry.resetTime - now) / 1000);
  return { allowed: true, remaining: maxRequests - entry.count, resetIn };
}
