/**
 * Enterprise Rate Limiter
 *
 * Token-bucket algorithm with:
 * - Per-user rate limits
 * - Per-IP rate limits for unauthenticated requests
 * - Configurable tiers (free, standard, premium, enterprise)
 * - Sliding window for burst allowance
 * - No external dependencies
 */

interface Bucket {
  tokens: number
  lastRefill: number
}

interface RateLimitConfig {
  maxTokens: number      // Max burst capacity
  refillRate: number     // Tokens per second
  refillInterval: number // ms between refills
}

const TIER_LIMITS: Record<string, RateLimitConfig> = {
  free: { maxTokens: 10, refillRate: 1, refillInterval: 1000 },       // 10 req burst, 1 req/sec
  standard: { maxTokens: 30, refillRate: 3, refillInterval: 1000 },   // 30 req burst, 3 req/sec
  premium: { maxTokens: 100, refillRate: 10, refillInterval: 1000 },  // 100 req burst, 10 req/sec
  enterprise: { maxTokens: 500, refillRate: 50, refillInterval: 1000 }, // 500 req burst
  admin: { maxTokens: 1000, refillRate: 100, refillInterval: 1000 },
}

const buckets = new Map<string, Bucket>()

// Clean up stale buckets every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of buckets.entries()) {
    if (now - bucket.lastRefill > 60000) { // 1 minute stale
      buckets.delete(key)
    }
  }
}, 300000)

function getBucket(key: string, config: RateLimitConfig): Bucket {
  let bucket = buckets.get(key)
  if (!bucket) {
    bucket = { tokens: config.maxTokens, lastRefill: Date.now() }
    buckets.set(key, bucket)
  }
  return bucket
}

function refillBucket(bucket: Bucket, config: RateLimitConfig): void {
  const now = Date.now()
  const elapsed = now - bucket.lastRefill
  if (elapsed < config.refillInterval) return

  const tokensToAdd = Math.floor(elapsed / config.refillInterval) * config.refillRate
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(bucket.tokens + tokensToAdd, config.maxTokens)
    bucket.lastRefill = now
  }
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetMs: number
  tier: string
}

export function checkRateLimit(
  key: string,
  tier: string = "standard",
): RateLimitResult {
  const config = TIER_LIMITS[tier] || TIER_LIMITS.standard
  const bucket = getBucket(key, config)

  refillBucket(bucket, config)

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    return {
      allowed: true,
      remaining: bucket.tokens,
      resetMs: config.refillInterval,
      tier,
    }
  }

  const timeUntilRefill = config.refillInterval - (Date.now() - bucket.lastRefill)
  return {
    allowed: false,
    remaining: 0,
    resetMs: Math.max(timeUntilRefill, 0),
    tier,
  }
}

export function getUserTier(role?: string): string {
  switch (role) {
    case "admin": return "admin"
    case "enterprise": return "enterprise"
    case "premium": return "premium"
    default: return "standard"
  }
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.allowed ? 1 : 0),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetMs / 1000)),
    "X-RateLimit-Tier": result.tier,
  }
}
