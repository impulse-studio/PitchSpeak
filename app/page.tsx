"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import ConversationInterface from "@/components/chat/ConversationInterface";
import { useCallManager } from "@/hooks/use-call-manager";
import { useConversationSave } from "@/hooks/use-conversation-save";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { useVapi } from "@/hooks/use-vapi";
import { authClient } from "@/lib/auth/client";

export default function VoiceEstimationTool() {
  const session = authClient.useSession();
  const userId = session.data?.user?.id;

  const [remainingCalls, setRemainingCalls] = useState<number | null>(null);
  const [resetTime, setResetTime] = useState<number | null>(null);

  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  if (!assistantId) {
    throw new Error("Configuration error: Missing assistant ID");
  }

  const handleVapiError = useCallback((error: Error) => {
    console.error("Vapi error:", error);
    toast.error("Voice assistant error. Please try again.");
  }, []);

  const {
    isListening,
    isResponding,
    isConnected,
    isConnecting,
    startCall,
    stopCall,
    transcripts,
    vapi,
  } = useVapi({
    assistantId,
    onCallEnd: () => {},
    onError: handleVapiError,
  });

  const rateLimitState = useRateLimit(userId);

  if (rateLimitState.remaining !== null && remainingCalls === null) {
    setRemainingCalls(rateLimitState.remaining);
    setResetTime(rateLimitState.reset);
  }

  const {
    showEndConversationDialog,
    toggleListening,
    handleContinueConversation,
    handleEndConversation: closeEndDialog,
  } = useCallManager({
    userId,
    isConnected,
    startCall,
    onRateLimitUpdate: (remaining, reset) => {
      setRemainingCalls(remaining);
      setResetTime(reset);
    },
  });

  const {
    isSaving,
    isGeneratingDocument,
    generationProgress,
    handleEndConversation: saveConversation,
  } = useConversationSave({
    stopCall,
    transcripts,
  });

  const handleEndConversation = useCallback(async () => {
    closeEndDialog();
    await saveConversation();
  }, [closeEndDialog, saveConversation]);

  return (
    <ConversationInterface
      isListening={isListening}
      isResponding={isResponding}
      isInConversation={isConnected || isGeneratingDocument}
      isConnecting={isConnecting}
      showEndConversationDialog={showEndConversationDialog}
      isSaving={isSaving}
      isGeneratingDocument={isGeneratingDocument}
      generationProgress={generationProgress}
      onToggleListening={toggleListening}
      onEndConversation={handleEndConversation}
      onContinueConversation={handleContinueConversation}
      remainingCalls={remainingCalls}
      resetTime={resetTime}
      isAuthenticated={!!userId}
      vapi={vapi}
      transcripts={transcripts}
    />
  );
}
