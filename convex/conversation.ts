"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

/**
 * Summarize a VAPI conversation and extract project details and estimation
 */
export const summarizeConversation = action({
  args: {
    transcripts: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("assistant")),
        text: v.string(),
        timestamp: v.number(),
      })
    ),
  },
  returns: v.object({
    projectSummary: v.string(),
    estimation: v.object({
      timeframe: v.optional(v.string()),
      complexity: v.optional(v.string()),
      cost: v.optional(v.string()),
      features: v.array(v.string()),
    }),
    fullSummary: v.string(),
  }),
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY not found in environment variables");
    }

    // Format the conversation
    const conversationText = args.transcripts
      .map((t) => `${t.role === "user" ? "User" : "Assistant"}: ${t.text}`)
      .join("\n");

    // Generate the summary using AI SDK v5
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze this conversation between a user and an AI assistant about a project.

Conversation:
${conversationText}

Please provide a structured summary in the following JSON format:
{
  "projectSummary": "Brief description of the project discussed",
  "estimation": {
    "timeframe": "Estimated time to complete (e.g., '2-3 weeks')",
    "complexity": "Project complexity (e.g., 'Simple', 'Medium', 'Complex')",
    "cost": "Estimated cost if discussed (optional)",
    "features": ["List of key features discussed"]
  },
  "fullSummary": "Detailed summary of the entire conversation"
}

Respond ONLY with valid JSON, no additional text.`,
    });

    // Parse the JSON response (remove markdown code blocks if present)
    try {
      let cleanedText = text.trim();

      // Remove markdown code blocks (```json ... ``` or ``` ... ```)
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      const summary = JSON.parse(cleanedText);
      return summary;
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${text}`);
    }
  },
});
