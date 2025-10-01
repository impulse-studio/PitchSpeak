"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Transcript } from "@/types/transcript";

interface ConversationSummary {
  projectSummary: string;
  estimation: {
    timeframe?: string;
    complexity?: string;
    cost?: string;
    features: string[];
  };
  fullSummary: string;
}

export function useConversationSummary() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<ConversationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const summarizeAction = useAction(api.conversation.summarizeConversation);

  const generateSummary = async (transcripts: Transcript[]) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await summarizeAction({ transcripts });
      setSummary(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate summary";
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async (summary: ConversationSummary) => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(summary),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Create a blob from the response
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `project-estimation-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to download PDF";
      setError(errorMessage);
      throw err;
    }
  };

  return {
    isGenerating,
    summary,
    error,
    generateSummary,
    downloadPDF,
  };
}
