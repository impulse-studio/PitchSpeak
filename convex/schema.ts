import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  conversationSummaries: defineTable({
    userId: v.optional(v.string()), // For future auth integration
    projectSummary: v.string(),
    estimation: v.object({
      timeframe: v.optional(v.string()),
      complexity: v.optional(v.string()),
      cost: v.optional(v.string()),
      features: v.array(v.string()),
    }),
    fullSummary: v.string(),
    transcripts: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        text: v.string(),
        timestamp: v.number(),
      })
    ),
  }).index("by_userId", ["userId"]),
});
