"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import * as ProgressCircle from "@/components/ui/progress-circle";

interface DocumentGenerationLoaderProps {
  progress?: number;
}

export default function DocumentGenerationLoader({
  progress = 0,
}: DocumentGenerationLoaderProps) {
  const isComplete = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.5 }}
      className="absolute top-full left-0 right-0 -mt-32 flex justify-center"
    >
      <div className="flex items-center justify-center gap-4 px-12 py-4 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-auto">
        <span className="relative inline-block text-neutral-500 text-base font-medium tracking-tight whitespace-nowrap">
          {isComplete ? "Document generated" : "Generating your document"}
          <motion.span
            className="absolute inset-0 bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, transparent 0%, transparent 40%, white 50%, transparent 60%, transparent 100%)",
              backgroundSize: "200% 200%",
            }}
            animate={{
              backgroundPosition: ["200% 200%", "0% 0%"],
            }}
            transition={{
              duration: 2,
              repeat: isComplete ? 0 : Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {isComplete ? "Document generated" : "Generating your document"}
          </motion.span>
        </span>

        <ProgressCircle.Root value={Math.round(progress)} size="24">
          {isComplete && <Check className="size-3 text-white" />}
        </ProgressCircle.Root>
      </div>
    </motion.div>
  );
}
