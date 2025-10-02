"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  const [progress, setProgress] = useState(0);

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const summarizeAction = useAction(api.conversation.summarizeConversation);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const generateSummary = useCallback(async (transcripts: Transcript[]) => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    // Start progress simulation
    const startTime = Date.now();
    const estimatedDuration = 8000; // 8 seconds estimated

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(95, (elapsed / estimatedDuration) * 100);
      setProgress(calculatedProgress);
    }, 100);

    try {
      const result = await summarizeAction({ transcripts });

      // Clear interval and set to 100%
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      setProgress(100);
      setSummary(result);
      return result;
    } catch (err) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setProgress(0);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate summary";
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [summarizeAction]);

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
    progress,
    generateSummary,
    downloadPDF,
  };
}
