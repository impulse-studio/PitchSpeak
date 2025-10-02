"use client";

import { Mic, MicOff, Phone } from "lucide-react";
import { motion } from "motion/react";
import { forwardRef, useMemo } from "react";
import * as Button from "@/components/ui/button";
import "./microphone-button.css";

interface MicrophoneButtonProps {
  isInConversation: boolean;
  isListening: boolean;
  isConnecting: boolean;
  isSaving: boolean;
  isDisabled: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export const MicrophoneButton = forwardRef<
  HTMLButtonElement,
  MicrophoneButtonProps
>(function MicrophoneButton(
  {
    isInConversation,
    isListening,
    isConnecting,
    isSaving,
    isDisabled,
    onClick,
    ariaLabel,
  },
  ref
) {
  const icon = useMemo(() => {
    if (isConnecting) {
      return (
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
      );
    }

    if (isInConversation) {
      return <Button.Icon as={isListening ? Mic : MicOff} />;
    }
    return <Button.Icon as={Mic} />;
  }, [isConnecting, isInConversation, isListening]);

  const defaultAriaLabel = isInConversation
    ? isListening
      ? "Mute microphone"
      : "Unmute microphone"
    : "Start conversation";

  const wrapperClasses = [
    "liquidGlass-wrapper mic-button",
    isInConversation && "in-conversation",
    isListening && "listening",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <Button.Root
        type="button"
        aria-label={ariaLabel || defaultAriaLabel}
        className={wrapperClasses}
        onClick={onClick}
        disabled={isDisabled || isConnecting || isSaving}
        ref={ref}
      >
        <div className="liquidGlass-effect" />
        <div className="liquidGlass-tint" />
        <div className="liquidGlass-shine" />
        <div className="liquidGlass-text">{icon}</div>
      </Button.Root>

      <svg style={{ display: "none" }}>
        <title>Glass distortion filter</title>
        <filter
          id="glass-distortion"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="1"
            seed="5"
            result="turbulence"
          />

          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>

          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />

          <feSpecularLighting
            in="softMap"
            surfaceScale="5"
            specularConstant="1"
            specularExponent="100"
            lightingColor="white"
            result="specLight"
          >
            <fePointLight x="-200" y="-200" z="300" />
          </feSpecularLighting>

          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="150"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </>
  );
});
