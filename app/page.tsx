"use client";

import { useState } from "react";
import ConversationInterface from "@/components/chat/ConversationInterface";

export default function VoiceEstimationTool() {
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [isInConversation, setIsInConversation] = useState(false);
  const [showEndConversationDialog, setShowEndConversationDialog] =
    useState(false);

  const toggleListening = () => {
    if (!isInConversation) {
      setIsInConversation(true);
      setIsListening(true);
    } else {
      if (isListening) {
        setShowEndConversationDialog(true);
      } else {
        setIsListening(true);
      }
    }
  };

  const handleEndConversation = () => {
    setIsInConversation(false);
    setIsListening(false);
    setIsResponding(false);
    setShowEndConversationDialog(false);
  };

  const handleContinueConversation = () => {
    setShowEndConversationDialog(false);
  };

  return (
    <ConversationInterface
      isListening={isListening}
      isResponding={isResponding}
      audioLevel={0}
      isInConversation={isInConversation}
      showEndConversationDialog={showEndConversationDialog}
      onToggleListening={toggleListening}
      onEndConversation={handleEndConversation}
      onContinueConversation={handleContinueConversation}
    />
  );
}
