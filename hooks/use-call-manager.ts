import { useAction } from "convex/react";
import { useCallback, useState } from "react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface UseCallManagerProps {
  userId: string | undefined;
  isConnected: boolean;
  startCall: () => void;
  onRateLimitUpdate?: (remaining: number, reset: number) => void;
}

export function useCallManager({
  userId,
  isConnected,
  startCall,
  onRateLimitUpdate,
}: UseCallManagerProps) {
  const [showEndConversationDialog, setShowEndConversationDialog] =
    useState(false);

  const checkRateLimit = useAction(api.rateLimit.checkAndConsumeRateLimit);

  const toggleListening = useCallback(async () => {
    if (!isConnected) {
      // Check if user is authenticated
      if (!userId) {
        // Don't show toast - let the LoginPromptCard handle this
        return;
      }

      // Check rate limit before starting the call
      try {
        const result = await checkRateLimit({ userId });

        if (!result.allowed) {
          toast.error(
            `Daily limit reached. You have ${result.remaining} of ${result.limit} calls remaining today.`
          );
          return;
        }

        // Update remaining calls and reset time
        onRateLimitUpdate?.(result.remaining, result.reset);

        // Start the call
        startCall();
      } catch (error) {
        console.error("Rate limit check failed:", error);
        toast.error("Failed to check rate limit. Please try again.");
      }
    } else {
      setShowEndConversationDialog(true);
    }
  }, [isConnected, userId, checkRateLimit, startCall, onRateLimitUpdate]);

  const handleContinueConversation = useCallback(() => {
    setShowEndConversationDialog(false);
  }, []);

  const handleEndConversation = useCallback(() => {
    setShowEndConversationDialog(false);
  }, []);

  return {
    showEndConversationDialog,
    toggleListening,
    handleContinueConversation,
    handleEndConversation,
  };
}
