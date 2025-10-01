"use client";

import { Mic, MicOff, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Footer from "@/app/(auth)/_components/footer";
import Header from "@/app/(auth)/_components/header";
import EndConversationDialog from "@/components/common/EndConversationDialog";
import * as Button from "@/components/ui/button";
import BackgroundPulse from "@/components/visualization/background-pulse";
import VoxelSphere from "@/components/visualization/voxel-sphere";

interface ConversationInterfaceProps {
  isListening: boolean;
  isResponding: boolean;
  audioLevel: number;
  isInConversation: boolean;
  isConnecting: boolean;
  showEndConversationDialog: boolean;
  isSaving: boolean;
  onToggleListening: () => void;
  onEndConversation: () => void;
  onContinueConversation: () => void;
}

export default function ConversationInterface({
  isListening,
  isResponding,
  isInConversation,
  isConnecting,
  showEndConversationDialog,
  isSaving,
  onToggleListening,
  onEndConversation,
  onContinueConversation,
}: ConversationInterfaceProps) {
  const [showMicrophone, setShowMicrophone] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const isNearBottom = scrollY + windowHeight >= documentHeight - 800;
      setShowMicrophone(!isNearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;

    if (isConnecting) {
      audio = new Audio("/sounds/phone-call.wav");
      audio.loop = true;
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [isConnecting]);
  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
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

      <main className="flex flex-col items-center justify-center min-h-screen px-8 py-24">
        <div
          className={`text-center mb-12 sm:mb-16 max-w-4xl transition-opacity duration-500 ease-in-out ${!isInConversation ? "opacity-100" : "opacity-0"}`}
        >
          <h2 className="text-[2.5rem] sm:text-title-h1 md:text-[4rem] lg:text-[5rem] font-bold text-balance mb-6 sm:mb-8 leading-[0.9] sm:leading-[0.85] tracking-tight text-white/90">
            Creation Without{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Limitation
            </span>
          </h2>
          <p className="text-base sm:text-title-h6 text-pretty leading-relaxed max-w-2xl mx-auto text-white/60 backdrop-blur-sm">
            Describe your project naturally and receive intelligent cost and
            timeline estimates powered by advanced AI.
          </p>
        </div>

        <div
          className={`relative ${isInConversation ? "mb-0" : "mb-20"} flex justify-center items-center`}
          style={{ height: "300px", width: "300px", margin: "0 auto" }}
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity:
                isListening || isResponding || isInConversation
                  ? 1
                  : [0, 0.3, 0.8, 1],
              scale:
                isListening || isResponding || isInConversation
                  ? 1
                  : [0, 0.8, 1.1, 1],
              y: isInConversation ? -120 : 0,
              filter: isListening
                ? "drop-shadow(0 0 30px rgba(34, 197, 94, 0.6)) drop-shadow(0 0 60px rgba(34, 197, 94, 0.3))"
                : isResponding
                  ? "drop-shadow(0 0 30px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 60px rgba(168, 85, 247, 0.3))"
                  : isInConversation
                    ? "drop-shadow(0 0 20px rgba(120, 110, 200, 0.5))"
                    : "drop-shadow(0 0 15px rgba(99, 102, 241, 0.3))",
            }}
            transition={{
              duration:
                isListening || isResponding || isInConversation ? 0.8 : 2,
              times:
                isListening || isResponding || isInConversation
                  ? [0, 1]
                  : [0, 0.3, 0.7, 1],
              ease: "easeOut",
              delay: isListening || isResponding || isInConversation ? 0 : 0.3,
              y: {
                duration: isInConversation ? 1.2 : 0.8,
                ease: [0.4, 0, 0.2, 1],
                delay: 0,
              },
              filter: {
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
          >
            <VoxelSphere
              isListening={isListening}
              isResponding={isResponding}
              isConnected={isInConversation}
            />
          </motion.div>
        </div>
      </main>

      <div
        className={`fixed bottom-16 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ease-in-out ${
          showMicrophone ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Button.Root
          onClick={onToggleListening}
          disabled={isSaving}
          size="xsmall"
          className="rounded-full h-14 w-14 transition-all duration-300 backdrop-blur-2xl relative overflow-hidden hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isInConversation
              ? isListening
                ? `linear-gradient(135deg,
                    rgba(0, 0, 0, 0.1) 0%,
                    rgba(239, 68, 68, 0.05) 20%,
                    rgba(0, 0, 0, 0.3) 60%,
                    rgba(0, 0, 0, 0.8) 100%),
                   radial-gradient(circle at 30% 20%,
                    rgba(255, 255, 255, 0.2) 0%,
                    transparent 50%)`
                : `linear-gradient(135deg,
                      rgba(239, 68, 68, 0.1) 0%,
                      rgba(239, 68, 68, 0.05) 20%,
                      rgba(0, 0, 0, 0.3) 60%,
                      rgba(0, 0, 0, 0.8) 100%),
                     radial-gradient(circle at 30% 20%,
                      rgba(239, 68, 68, 0.2) 0%,
                      transparent 50%)`
              : `linear-gradient(135deg,
                  rgba(255, 255, 255, 0.1) 0%,
                  rgba(255, 255, 255, 0.05) 20%,
                  rgba(0, 0, 0, 0.3) 60%,
                  rgba(0, 0, 0, 0.8) 100%),
                 radial-gradient(circle at 30% 20%,
                  rgba(255, 255, 255, 0.3) 0%,
                  transparent 50%)`,
            border: isInConversation
              ? "1px solid rgba(239, 68, 68, 0.3)"
              : "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: isInConversation
              ? isListening
                ? `
                  inset 0 1px 2px rgba(255, 255, 255, 0.25),
                  inset 0 -1px 1px rgba(0, 0, 0, 0.6),
                  0 2px 4px rgba(0, 0, 0, 0.9),
                  0 8px 16px rgba(0, 0, 0, 0.8),
                  0 16px 32px rgba(0, 0, 0, 0.6),
                  0 0 0 1px rgba(255, 255, 255, 0.1),
                  0 0 20px rgba(239, 68, 68, 0.4),
                  0 0 40px rgba(239, 68, 68, 0.2)
                `
                : `
                  inset 0 1px 2px rgba(255, 255, 255, 0.2),
                  inset 0 -1px 1px rgba(0, 0, 0, 0.6),
                  0 2px 4px rgba(0, 0, 0, 0.9),
                  0 8px 16px rgba(0, 0, 0, 0.8),
                  0 16px 32px rgba(0, 0, 0, 0.6),
                  0 0 0 1px rgba(239, 68, 68, 0.1),
                  0 0 20px rgba(239, 68, 68, 0.3),
                  0 0 40px rgba(239, 68, 68, 0.15)
                `
              : `
                inset 0 1px 2px rgba(255, 255, 255, 0.3),
                inset 0 -1px 1px rgba(0, 0, 0, 0.6),
                0 2px 4px rgba(0, 0, 0, 0.9),
                0 8px 16px rgba(0, 0, 0, 0.8),
                0 16px 32px rgba(0, 0, 0, 0.6),
                0 0 0 1px rgba(255, 255, 255, 0.15),
                0 0 20px rgba(255, 255, 255, 0.1),
                0 0 40px rgba(255, 255, 255, 0.05)
              `,
            color: isInConversation
              ? "rgba(239, 68, 68, 1)"
              : "rgba(255, 255, 255, 0.9)",
            cursor: "pointer",
          }}
        >
          {isConnecting ? (
            <motion.div
              animate={{
                rotate: [0, -15, 15, -15, 15, 0],
                scale: [1, 1.1, 0.9, 1.1, 0.9, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Phone className="h-5 w-5" />
            </motion.div>
          ) : (
            <Button.Icon as={isInConversation ? MicOff : Mic} />
          )}
        </Button.Root>
      </div>

      {!isInConversation && (
        <div className="transition-opacity duration-500 ease-in-out opacity-100">
          <Footer />
        </div>
      )}
    </div>
  );
}
