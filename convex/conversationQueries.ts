import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Save a conversation summary to the database
 */
export const saveConversationSummary = mutation({
  args: {
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
    userId: v.optional(v.string()),
  },
  returns: v.id("conversationSummaries"),
  handler: async (ctx, args) => {
    const conversationId = await ctx.db.insert("conversationSummaries", {
      userId: args.userId,
      projectSummary: args.projectSummary,
      estimation: args.estimation,
      fullSummary: args.fullSummary,
      transcripts: args.transcripts,
    });
    return conversationId;
  },
});

/**
 * Get all conversation summaries for a user (or all if no userId provided)
 */
export const getConversationHistory = query({
  args: {
    userId: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id("conversationSummaries"),
      _creationTime: v.number(),
      userId: v.optional(v.string()),
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
    })
  ),
  handler: async (ctx, args) => {
    if (args.userId) {
      return await ctx.db
        .query("conversationSummaries")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .order("desc")
        .collect();
    } else {
      // Get all conversations ordered by creation time (default order)
      return await ctx.db
        .query("conversationSummaries")
        .order("desc")
        .collect();
    }
  },
});

/**
 * Get a single conversation summary by ID
 */
export const getConversationById = query({
  args: {
    conversationId: v.id("conversationSummaries"),
  },
  returns: v.union(
    v.object({
      _id: v.id("conversationSummaries"),
      _creationTime: v.number(),
      userId: v.optional(v.string()),
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
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});
