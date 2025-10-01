"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { Redis } from "@upstash/redis";
import { DAILY_LIMIT } from "@/lib/constants";

const WINDOW_SIZE_SECONDS = 24 * 60 * 60;

const createRedis = () => {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
};

const CONSUME_CALL_SCRIPT = `
  local key = KEYS[1]
  local limit = tonumber(ARGV[1])
  local ttl_seconds = tonumber(ARGV[2])

  local current = redis.call('GET', key)
  current = current and tonumber(current) or 0

  local new_val = redis.call('INCR', key)
  local remaining_ttl
  if new_val == 1 then
    redis.call('EXPIRE', key, ttl_seconds)
    remaining_ttl = ttl_seconds
  else
    remaining_ttl = redis.call('TTL', key)
  end

  local was_allowed = current < limit
  return {was_allowed and 1 or 0, new_val, math.max(0, limit - new_val), remaining_ttl}
`;

const CHECK_CALLS_SCRIPT = `
  local key = KEYS[1]
  local limit = tonumber(ARGV[1])

  local current = redis.call('GET', key)
  current = current and tonumber(current) or 0

  local remaining_ttl = redis.call('TTL', key)
  if remaining_ttl < 0 then
    remaining_ttl = tonumber(ARGV[2])
  end

  return {current, math.max(0, limit - current), remaining_ttl}
`;

export const checkAndConsumeRateLimit = action({
  args: {
    userId: v.string(),
  },
  returns: v.object({
    allowed: v.boolean(),
    remaining: v.number(),
    limit: v.number(),
    reset: v.number(),
  }),
  handler: async (ctx, args) => {
    const redis = createRedis();
    const key = `ai-call:${args.userId}`;

    try {
      const result = (await redis.eval(
        CONSUME_CALL_SCRIPT,
        [key],
        [DAILY_LIMIT.toString(), WINDOW_SIZE_SECONDS.toString()]
      )) as [number, number, number, number];

      const [allowedFlag, currentUsage, remaining, ttlSeconds] = result;
      const allowed = allowedFlag === 1;

      const resetTime =
        ttlSeconds > 0
          ? Date.now() + ttlSeconds * 1000
          : Date.now() + WINDOW_SIZE_SECONDS * 1000;

      return {
        allowed,
        remaining: Math.max(0, remaining),
        limit: DAILY_LIMIT,
        reset: resetTime,
      };
    } catch (error) {
      console.error("Failed to consume rate limit:", error);
      return {
        allowed: true,
        remaining: DAILY_LIMIT,
        limit: DAILY_LIMIT,
        reset: Date.now() + WINDOW_SIZE_SECONDS * 1000,
      };
    }
  },
});

export const getRemainingCalls = action({
  args: {
    userId: v.string(),
  },
  returns: v.object({
    remaining: v.number(),
    limit: v.number(),
    reset: v.number(),
  }),
  handler: async (ctx, args) => {
    const redis = createRedis();
    const key = `ai-call:${args.userId}`;

    try {
      const result = (await redis.eval(
        CHECK_CALLS_SCRIPT,
        [key],
        [DAILY_LIMIT.toString(), WINDOW_SIZE_SECONDS.toString()]
      )) as [number, number, number];

      const [currentUsage, remaining, ttlSeconds] = result;

      const resetTime =
        ttlSeconds > 0
          ? Date.now() + ttlSeconds * 1000
          : Date.now() + WINDOW_SIZE_SECONDS * 1000;

      return {
        remaining: Math.max(0, remaining),
        limit: DAILY_LIMIT,
        reset: resetTime,
      };
    } catch (error) {
      console.error("Failed to get remaining calls:", error);
      return {
        remaining: DAILY_LIMIT,
        limit: DAILY_LIMIT,
        reset: Date.now() + WINDOW_SIZE_SECONDS * 1000,
      };
    }
  },
});
