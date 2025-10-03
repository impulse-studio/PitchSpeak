"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import type { Transcript } from "@/types/transcript";

interface UseVapiOptions {
  assistantId?: string;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onError?: (error: Error) => void;
  onTranscript?: (transcript: Transcript) => void;
}

export function useVapi({
  assistantId,
  onSpeechStart,
  onSpeechEnd,
  onCallStart,
  onCallEnd,
  onError,
  onTranscript,
}: UseVapiOptions = {}) {
  const vapiRef = useRef<Vapi | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

    if (!publicKey) {
      return;
    }

    if (vapiRef.current) {
      return;
    }

    vapiRef.current = new Vapi(publicKey);

    const vapi = vapiRef.current;

    vapi.on("call-start", () => {
      setIsConnecting(false);
      setIsConnected(true);
      setIsResponding(true);
      setIsListening(false);
      setTranscripts([]);
      onCallStart?.();
    });

    vapi.on("call-end", () => {
      setIsConnecting(false);
      setIsConnected(false);
      setIsListening(false);
      setIsResponding(false);
      onCallEnd?.();
    });

    // speech-start = assistant starts speaking
    vapi.on("speech-start", () => {
      setIsResponding(true);
      setIsListening(false);
      onSpeechStart?.();
    });

    // speech-end = assistant stops speaking
    vapi.on("speech-end", () => {
      setIsResponding(false);
      onSpeechEnd?.();
    });

    vapi.on("message", (message) => {
      if (
        message.type === "speech-update" &&
        message.status === "started" &&
        message.role === "user"
      ) {
        setIsListening(true);
        setIsResponding(false);
      }

      // User stops speaking
      if (
        message.type === "speech-update" &&
        message.status === "stopped" &&
        message.role === "user"
      ) {
        setIsListening(false);
      }

      // Track transcripts
      if (message.type === "transcript") {
        if (message.role === "user" && message.transcriptType === "partial") {
          setIsListening(true);
        }

        if (message.role === "user" && message.transcriptType === "final") {
          setIsListening(false);
        }

        // Store final transcripts
        if (message.transcriptType === "final") {
          const transcript: Transcript = {
            role: message.role,
            text: message.transcript,
            timestamp: Date.now(),
          };
          setTranscripts((prev) => [...prev, transcript]);
          onTranscript?.(transcript);
        }
      }

      // User interrupted the assistant
      if (message.type === "user-interrupted") {
        setIsResponding(false);
        setIsListening(true);
      }
    });

    vapi.on("volume-level", (level: number) => {
      setAudioLevel(level);
    });

    vapi.on("error", (error: Error) => {
      console.error("Vapi error:", error);
      onError?.(error);
    });

    // Cleanup
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, []);

  const startCall = useCallback(async () => {
    if (!vapiRef.current) {
      console.error("Vapi instance not initialized");
      onError?.(new Error("Vapi instance not initialized"));
      return;
    }

    if (!assistantId) {
      console.error("No assistant ID provided to start the call");
      onError?.(new Error("Assistant ID is required to start a call"));
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      console.error("Microphone permission denied:", error);
      onError?.(new Error("Microphone permission is required to start a call"));
      return;
    }

    try {
      setIsConnecting(true);
      await vapiRef.current.start(assistantId);
    } catch (error) {
      console.error("Failed to start call:", error);
      setIsConnecting(false);
      onError?.(error as Error);
    }
  }, [assistantId, onError]);

  const stopCall = useCallback(() => {
    if (!vapiRef.current) return;
    vapiRef.current.stop();
  }, []);

  const toggleCall = useCallback(() => {
    if (isConnected) {
      stopCall();
    } else {
      startCall();
    }
  }, [isConnected, startCall, stopCall]);

  return {
    isListening,
    isResponding,
    audioLevel,
    isConnected,
    isConnecting,
    startCall,
    stopCall,
    toggleCall,
    vapi: vapiRef.current,
    transcripts,
  };
}
