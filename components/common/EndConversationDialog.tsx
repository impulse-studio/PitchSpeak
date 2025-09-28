"use client";

import { AnimatePresence, motion } from "motion/react";
import * as Button from "@/components/ui/button";

interface EndConversationDialogProps {
  isOpen: boolean;
  onEndConversation: () => void;
  onContinueConversation: () => void;
}

export default function EndConversationDialog({
  isOpen,
  onEndConversation,
  onContinueConversation,
}: EndConversationDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/70 via-black/50 to-black/70 backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-3xl border border-white/[0.08] rounded-2xl p-6 max-w-sm w-full mx-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:pointer-events-none relative overflow-hidden"
          >
            {/* Header */}
            <div className="text-center mb-8 relative z-10">
              <h3 className="text-lg font-medium text-white/95 tracking-tight">
                End Conversation
              </h3>
              <p className="text-sm text-white/70 mt-2 leading-relaxed">
                Would you like to end this session or continue chatting?
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 relative z-10">
              <Button.Root
                onClick={onContinueConversation}
                className="w-full h-11 bg-white/10 hover:bg-white/15 border border-white/10 text-white/90 rounded-xl font-medium tracking-tight transition-all duration-200 backdrop-blur-sm"
                size="xxsmall"
              >
                Continue
              </Button.Root>
              <Button.Root
                onClick={onEndConversation}
                className="w-full h-11 bg-white text-black hover:bg-white/90 rounded-xl font-medium tracking-tight transition-all duration-200"
                size="xxsmall"
              >
                End Session
              </Button.Root>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
