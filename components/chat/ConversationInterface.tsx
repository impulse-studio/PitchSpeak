"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Footer from "@/app/(auth)/_components/footer";
import Header from "@/app/(auth)/_components/header";
import DocumentGenerationLoader from "@/components/chat/DocumentGenerationLoader";
import { LoginPromptCard } from "@/components/chat/LoginPromptCard";
import { MicrophoneButton } from "@/components/chat/MicrophoneButton";
import EndConversationDialog from "@/components/common/EndConversationDialog";
import BackgroundPulse from "@/components/visualization/background-pulse";
import VoxelSphere from "@/components/visualization/voxel-sphere";
import {
  ANIMATION_DURATIONS,
  AUDIO_VOLUME,
  DROP_SHADOWS,
  SCROLL_THRESHOLD,
  TIME_UPDATE_INTERVAL,
} from "@/constants/chat";

interface ConversationInterfaceProps {
  isListening: boolean;
  isResponding: boolean;
  isInConversation: boolean;
  isConnecting: boolean;
  showEndConversationDialog: boolean;
  isSaving: boolean;
  isGeneratingDocument: boolean;
  /**
   * Progress of document generation (0-100)
   * @default 0
   */
  generationProgress?: number;
  onToggleListening: () => void;
  onEndConversation: () => void;
  onContinueConversation: () => void;
  remainingCalls: number | null;
  resetTime: number | null;
  isAuthenticated: boolean;
}

const formatTimeRemaining = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return `Resets in ${hours}h ${minutes}m`;
  if (minutes > 0) return `Resets in ${minutes}m`;
  return "";
};

const useThrottle = (callback: () => void, delay: number) => {
  const lastRun = useRef(Date.now());

  return useCallback(() => {
    const now = Date.now();
    if (now - lastRun.current >= delay) {
      callback();
      lastRun.current = now;
    }
  }, [callback, delay]);
};

export default function ConversationInterface({
  isListening,
  isResponding,
  isInConversation,
  isConnecting,
  showEndConversationDialog,
  isSaving,
  isGeneratingDocument,
  generationProgress = 0,
  onToggleListening,
  onEndConversation,
  onContinueConversation,
  remainingCalls,
  resetTime,
  isAuthenticated,
}: ConversationInterfaceProps) {
  const router = useRouter();
  const [showMicrophone, setShowMicrophone] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const handleLoginClick = useCallback(() => {
    router.push("/sign-in");
  }, [router]);

  const updateMicrophoneVisibility = useCallback(() => {
    if (isInConversation) {
      setShowMicrophone(true);
      return;
    }

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isNearBottom =
      scrollY + windowHeight >= documentHeight - SCROLL_THRESHOLD;

    setShowMicrophone(!isNearBottom);
  }, [isInConversation]);

  const throttledScroll = useThrottle(updateMicrophoneVisibility, 100);

  useEffect(() => {
    updateMicrophoneVisibility();
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [throttledScroll, updateMicrophoneVisibility]);

  useEffect(() => {
    if (!resetTime) {
      setTimeRemaining("");
      return;
    }

    const updateTimeRemaining = () => {
      const diff = resetTime - Date.now();
      if (diff <= 0) {
        setTimeRemaining("");
        return;
      }
      setTimeRemaining(formatTimeRemaining(diff));
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, TIME_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [resetTime]);

  useEffect(() => {
    if (!isConnecting) return;

    let isMounted = true;
    const audio = new Audio("/sounds/phone-call.wav");
    audio.loop = true;
    audio.volume = AUDIO_VOLUME;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        if (isMounted) {
          console.warn("Audio playback failed:", error);
        }
      });
    }

    return () => {
      isMounted = false;
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    };
  }, [isConnecting]);

  const sphereAnimation = useMemo(() => {
    const isActive = isListening || isResponding || isInConversation;

    let filter: string = DROP_SHADOWS.idle;
    if (isGeneratingDocument) filter = DROP_SHADOWS.generating;
    else if (isListening) filter = DROP_SHADOWS.listening;
    else if (isResponding) filter = DROP_SHADOWS.responding;
    else if (isInConversation) filter = DROP_SHADOWS.conversation;

    return {
      initial: { opacity: 0, scale: 0 },
      animate: {
        opacity: isActive ? 1 : [0, 0.3, 0.8, 1],
        scale: isActive ? 1 : [0, 0.8, 1.1, 1],
        y: isInConversation ? -120 : 0,
        filter,
      },
      transition: {
        duration: isActive
          ? ANIMATION_DURATIONS.sphere.active
          : ANIMATION_DURATIONS.sphere.initial,
        times: isActive ? [0, 1] : [0, 0.3, 0.7, 1],
        ease: "easeOut" as const,
        delay: isActive ? 0 : 0.3,
        y: {
          duration: isInConversation
            ? ANIMATION_DURATIONS.position
            : ANIMATION_DURATIONS.sphere.active,
          ease: [0.4, 0, 0.2, 1] as const,
          delay: 0,
        },
        filter: {
          duration: ANIMATION_DURATIONS.filter,
          ease: [0.4, 0, 0.2, 1] as const,
        },
      },
    };
  }, [isListening, isResponding, isInConversation, isGeneratingDocument]);

  const safeProgress = generationProgress ?? 0;

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50" />

      {!isInConversation && (
        <BackgroundPulse
          isListening={isListening}
          isResponding={isResponding}
          isInConversation={isInConversation}
          spherePosition={{ x: 0.5, y: 0.65 }}
        />
      )}

      {!isInConversation && (
        <div className="transition-opacity duration-500 ease-in-out opacity-100">
          <Header />
        </div>
      )}

      <EndConversationDialog
        isOpen={showEndConversationDialog}
        onEndConversation={onEndConversation}
        onContinueConversation={onContinueConversation}
      />

      <main
        id="main-content"
        className="flex flex-col items-center justify-center min-h-screen px-8 py-24"
      >
        <div
          className={`text-center mb-12 sm:mb-16 max-w-4xl transition-opacity duration-500 ease-in-out ${!isInConversation ? "opacity-100" : "opacity-0"}`}
        >
          <h2 className="text-[2.5rem] sm:text-title-h1 md:text-[4rem] lg:text-[5rem] font-bold text-balance mb-6 sm:mb-8 leading-[0.9] sm:leading-[0.85] tracking-tight text-white/90">
            Creation Without{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Limitation
            </span>
          </h2>
          <p className="text-base sm:text-title-h6 text-pretty leading-relaxed max-w-2xl mx-auto text-white/70 backdrop-blur-sm">
            Describe your project naturally and receive intelligent cost and
            timeline estimates powered by advanced AI.
          </p>
        </div>

        <div
          className={`relative ${isInConversation ? "mb-0" : "mb-20"} flex justify-center items-center`}
          style={{ height: "300px", width: "300px", margin: "0 auto" }}
        >
          <motion.div className="relative" {...sphereAnimation}>
            <VoxelSphere
              isListening={isGeneratingDocument ? false : isListening}
              isResponding={isGeneratingDocument ? false : isResponding}
              isConnected={isInConversation}
            />
          </motion.div>

          {isGeneratingDocument && (
            <DocumentGenerationLoader progress={safeProgress} />
          )}
        </div>
      </main>

      <div
        className={`fixed bottom-16 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ease-in-out ${
          showMicrophone ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          {isAuthenticated && remainingCalls !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="text-white/60 text-sm font-medium backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10">
                {remainingCalls} call{remainingCalls !== 1 ? "s" : ""} remaining
                today
              </div>
              {remainingCalls === 0 && timeRemaining && (
                <div className="text-white/40 text-xs font-medium">
                  {timeRemaining}
                </div>
              )}
            </motion.div>
          )}

          {!isAuthenticated && !isInConversation ? (
            <LoginPromptCard
              onLoginClick={handleLoginClick}
              triggerElement={
                <MicrophoneButton
                  isInConversation={isInConversation}
                  isListening={isListening}
                  isConnecting={isConnecting}
                  isSaving={isSaving}
                  isDisabled={isAuthenticated && remainingCalls === 0}
                />
              }
            />
          ) : (
            <MicrophoneButton
              isInConversation={isInConversation}
              isListening={isListening}
              isConnecting={isConnecting}
              isSaving={isSaving}
              isDisabled={isAuthenticated && remainingCalls === 0}
              onClick={onToggleListening}
            />
          )}
        </div>
      </div>

      {!isInConversation && (
        <div className="transition-opacity duration-500 ease-in-out opacity-100">
          <Footer />
        </div>
      )}
    </div>
  );
}
