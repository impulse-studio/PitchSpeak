import { useMutation, useQuery } from "convex/react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useConversationSummary } from "@/hooks/use-conversation-summary";
import { toast } from "sonner";
import type { Transcript } from "@/types/transcript";

interface UseConversationSaveProps {
  stopCall: () => void;
  transcripts: Transcript[];
}

export function useConversationSave({
  stopCall,
  transcripts,
}: UseConversationSaveProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);

  const { generateSummary, progress } = useConversationSummary();
  const saveConversation = useMutation(
    api.conversationQueries.saveConversationSummary
  );
  const currentUser = useQuery(api.auth.getCurrentUser);

  const handleEndConversation = useCallback(async () => {
    stopCall();

    if (transcripts.length === 0) {
      return;
    }

    // Si l'utilisateur n'est pas connecté, on redirige vers la page d'accueil
    if (!currentUser) {
      router.push("/");
      return;
    }

    setIsSaving(true);
    setIsGeneratingDocument(true);

    try {
      const summary = await generateSummary(transcripts);

      const conversationId = await saveConversation({
        projectSummary: summary.projectSummary,
        estimation: summary.estimation,
        fullSummary: summary.fullSummary,
        transcripts,
        userId: currentUser._id,
      });

      router.push(`/summary?id=${conversationId}`);
    } catch (error) {
      console.error("Failed to process conversation:", error);
      toast.error("Failed to save conversation. Please try again.");
      setIsSaving(false);
      setIsGeneratingDocument(false);
    }
  }, [stopCall, transcripts, generateSummary, saveConversation, router, currentUser]);

  return {
    isSaving,
    isGeneratingDocument,
    generationProgress: progress,
    handleEndConversation,
  };
}
