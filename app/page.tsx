"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConversationInterface from "@/components/chat/ConversationInterface";
import { api } from "@/convex/_generated/api";
import { useConversationSummary } from "@/hooks/use-conversation-summary";
import { useVapi } from "@/hooks/use-vapi";

export default function VoiceEstimationTool() {
  const router = useRouter();
  const [showEndConversationDialog, setShowEndConversationDialog] =
    useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { generateSummary } = useConversationSummary();
  const saveConversation = useMutation(
    api.conversationQueries.saveConversationSummary
  );

  const {
    isListening,
    isResponding,
    audioLevel,
    isConnected,
    isConnecting,
    startCall,
    stopCall,
    transcripts,
  } = useVapi({
    assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
    onCallEnd: () => {
      setShowEndConversationDialog(false);
    },
    onError: (error) => {
      console.error("Vapi error:", error);
    },
  });

  const toggleListening = () => {
    if (!isConnected) {
      startCall();
    } else {
      setShowEndConversationDialog(true);
    }
  };

  const handleEndConversation = async () => {
    stopCall();
    setShowEndConversationDialog(false);
    setIsSaving(true);

    if (transcripts.length > 0) {
      try {
        const summary = await generateSummary(transcripts);

        const conversationId = await saveConversation({
          projectSummary: summary.projectSummary,
          estimation: summary.estimation,
          fullSummary: summary.fullSummary,
          transcripts: transcripts,
        });

        router.push(`/summary?id=${conversationId}`);
      } catch (error) {
        console.error("❌ Failed to process conversation:", error);
        alert("Failed to save conversation. Please try again.");
        setIsSaving(false);
      }
    } else {
      setIsSaving(false);
    }
  };

  const handleContinueConversation = () => {
    setShowEndConversationDialog(false);
  };

  return (
    <ConversationInterface
      isListening={isListening}
      isResponding={isResponding}
      audioLevel={audioLevel}
      isInConversation={isConnected}
      isConnecting={isConnecting}
      showEndConversationDialog={showEndConversationDialog}
      isSaving={isSaving}
      onToggleListening={toggleListening}
      onEndConversation={handleEndConversation}
      onContinueConversation={handleContinueConversation}
    />
  );
}
