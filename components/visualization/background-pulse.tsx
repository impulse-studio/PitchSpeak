"use client";

import { useEffect, useRef } from "react";

interface BackgroundPulseProps {
  isListening: boolean;
  isResponding: boolean;
  isInConversation: boolean;
  spherePosition?: { x: number; y: number };
}

export default function BackgroundPulse({
  isListening,
  isResponding,
  isInConversation,
  spherePosition = { x: 0.5, y: 0.5 },
}: BackgroundPulseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const pulseWavesRef = useRef<
    Array<{
      radius: number;
      maxRadius: number;
      alpha: number;
      life: number;
      maxLife: number;
      amplitude: number;
      frequency: number;
      speed: number;
    }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to full viewport size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const createPulseWave = () => {
      // Calculate max radius to cover entire screen from sphere position
      // Adjust Y position when in conversation (same -120px offset as the sphere)
      const yOffset = isInConversation ? -120 : 0;
      const centerX = window.innerWidth * spherePosition.x;
      const centerY = window.innerHeight * spherePosition.y + yOffset;

      const maxRadius =
        Math.sqrt(
          Math.max(centerX, window.innerWidth - centerX) ** 2 +
            Math.max(centerY, window.innerHeight - centerY) ** 2
        ) + 200;

      const wave = {
        radius: 80,
        maxRadius,
        alpha: 0.6,
        life: 0,
        maxLife: 300,
        amplitude: 15 + Math.random() * 10,
        frequency: 0.02 + Math.random() * 0.01,
        speed: 2.5,
      };
      pulseWavesRef.current.push(wave);
    };

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const yOffset = isInConversation ? -120 : 0;
      const centerX = canvas.width * spherePosition.x;
      const centerY = canvas.height * spherePosition.y + yOffset;
      time += 0.005;

      // Create pulse waves only when idle (at rest)
      if (!isListening && !isResponding) {
        if (Math.floor(time * 1000) % 500 === 0) {
          createPulseWave();
        }
      }

      // Update and render pixelated waves
      pulseWavesRef.current = pulseWavesRef.current.filter((wave) => {
        wave.life++;
        wave.radius += wave.speed;

        // Fade out as wave expands
        const lifeProgress = wave.life / wave.maxLife;
        const radiusProgress = (wave.radius - 80) / (wave.maxRadius - 80);
        wave.alpha = 0.6 * (1 - lifeProgress) * (1 - radiusProgress * 0.9);

        // Remove wave when it's too faded or reached max radius
        if (wave.alpha <= 0.02 || wave.radius >= wave.maxRadius) {
          return false;
        }

        // Render pixelated wave using individual squares
        const pixelSize = 8;
        const stepAngle = (Math.PI * 2) / 120; // Number of pixels around the circle

        for (let angle = 0; angle < Math.PI * 2; angle += stepAngle) {
          // Create wave distortion
          const waveOffset =
            Math.sin(angle * 8 + time * 3) *
            wave.amplitude *
            (1 - radiusProgress);
          const currentRadius = wave.radius + waveOffset;

          // Calculate pixel position
          const x = centerX + Math.cos(angle) * currentRadius;
          const y = centerY + Math.sin(angle) * currentRadius;

          // Only render if within canvas bounds
          if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
            // Calculate alpha based on distance and wave position
            const distanceFromCenter = Math.sqrt(
              (x - centerX) ** 2 + (y - centerY) ** 2
            );
            const distanceFactor = Math.max(
              0,
              1 - Math.abs(distanceFromCenter - wave.radius) / 30
            );

            const pixelAlpha = wave.alpha * distanceFactor;

            if (pixelAlpha > 0.01) {
              // Create color variation based on position
              const colorVariation = Math.sin(angle * 3 + time * 2) * 0.2 + 0.8;
              const r = Math.floor(99 * colorVariation);
              const g = Math.floor(102 * colorVariation);
              const b = Math.floor(241 * colorVariation);

              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${pixelAlpha})`;

              // Draw pixelated square
              const pixelX = Math.floor(x / pixelSize) * pixelSize;
              const pixelY = Math.floor(y / pixelSize) * pixelSize;
              ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);

              // Add inner glow effect for more depth
              if (distanceFactor > 0.7) {
                ctx.fillStyle = `rgba(${r + 50}, ${g + 50}, ${b}, ${pixelAlpha * 0.5})`;
                ctx.fillRect(
                  pixelX + 2,
                  pixelY + 2,
                  pixelSize - 4,
                  pixelSize - 4
                );
              }
            }
          }
        }

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    isListening,
    isResponding,
    isInConversation,
    spherePosition.x,
    spherePosition.y,
  ]);

  // Only render when idle
  if (isListening || isResponding) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        background: "transparent",
      }}
    />
  );
}
