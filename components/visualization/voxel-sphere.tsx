"use client";

import { useEffect, useRef } from "react";

interface VoxelSphereProps {
  isListening: boolean;
  isResponding: boolean;
  audioLevel?: number;
}

export default function VoxelSphere({
  isListening,
  isResponding,
  audioLevel = 0,
}: VoxelSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const transitionProgress = useRef<number>(0);
  const previousIsListening = useRef<boolean>(false);

  const voxelsRef = useRef<
    Array<{
      x: number;
      y: number;
      z: number;
      originalX: number;
      originalY: number;
      originalZ: number;
      color: { r: number; g: number; b: number };
      baseColor: { r: number; g: number; b: number };
      alpha: number;
      size: number;
      baseSize: number;
    }>
  >([]);

  const waveParticlesRef = useRef<
    Array<{
      x: number;
      y: number;
      z: number;
      targetX: number;
      targetY: number;
      targetZ: number;
      speed: number;
      life: number;
      maxLife: number;
      size: number;
      color: { r: number; g: number; b: number };
      alpha: number;
      absorbed: boolean;
    }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const size = Math.min(window.innerWidth * 0.4, 300);
      canvas.width = size;
      canvas.height = size;
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Initialize voxels in sphere formation
    const initVoxels = () => {
      const voxels = [];
      const radius = 80;
      const voxelCount = 800;

      for (let i = 0; i < voxelCount; i++) {
        // Generate points on sphere surface using spherical coordinates
        const phi = Math.acos(1 - 2 * Math.random()); // Uniform distribution
        const theta = 2 * Math.PI * Math.random();

        // Convert to cartesian coordinates
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        const baseSize = 2 + Math.random() * 2;
        voxels.push({
          x,
          y,
          z,
          originalX: x,
          originalY: y,
          originalZ: z,
          color: { r: 99, g: 102, b: 241 }, // Primary color
          baseColor: { r: 99, g: 102, b: 241 }, // Store original color
          alpha: 0.8,
          size: baseSize,
          baseSize: baseSize,
        });
      }

      voxelsRef.current = voxels;
    };

    const initWaveParticles = () => {
      const particles = [];
      const particleCount = 150;
      const spawnRadius = 200;

      for (let i = 0; i < particleCount; i++) {
        // Generate particles in a larger sphere around the main sphere
        const phi = Math.acos(1 - 2 * Math.random());
        const theta = 2 * Math.PI * Math.random();

        const x = spawnRadius * Math.sin(phi) * Math.cos(theta);
        const y = spawnRadius * Math.sin(phi) * Math.sin(theta);
        const z = spawnRadius * Math.cos(phi);

        // Target is a point on the main sphere surface
        const targetPhi = Math.acos(1 - 2 * Math.random());
        const targetTheta = 2 * Math.PI * Math.random();
        const targetRadius = 80;

        const targetX =
          targetRadius * Math.sin(targetPhi) * Math.cos(targetTheta);
        const targetY =
          targetRadius * Math.sin(targetPhi) * Math.sin(targetTheta);
        const targetZ = targetRadius * Math.cos(targetPhi);

        particles.push({
          x,
          y,
          z,
          targetX,
          targetY,
          targetZ,
          speed: 0.2 + Math.random() * 0.6,
          life: 0,
          maxLife: 100 + Math.random() * 100,
          size: 1 + Math.random() * 2,
          color: { r: 34, g: 197, b: 94 },
          alpha: 0.6 + Math.random() * 0.4,
          absorbed: false,
        });
      }

      waveParticlesRef.current = particles;
    };

    initVoxels();
    initWaveParticles();

    // Animation loop
    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const timeMultiplier = isResponding ? 3 : 1;
      time += 0.005 * timeMultiplier;

      // Smooth transition progress
      if (isListening !== previousIsListening.current) {
        previousIsListening.current = isListening;
      }

      const targetProgress = isListening ? 1 : 0;
      transitionProgress.current +=
        (targetProgress - transitionProgress.current) * 0.02;

      if (isListening) {
        waveParticlesRef.current.forEach((particle, index) => {
          if (!particle.absorbed) {
            // Move particle towards target
            const dx = particle.targetX - particle.x;
            const dy = particle.targetY - particle.y;
            const dz = particle.targetZ - particle.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance > 8) {
              // Move towards target
              particle.x += (dx / distance) * particle.speed;
              particle.y += (dy / distance) * particle.speed;
              particle.z += (dz / distance) * particle.speed;

              // Add some organic flow movement
              particle.x += Math.sin(time * 2 + index * 0.1) * 0.5;
              particle.y += Math.cos(time * 1.8 + index * 0.12) * 0.5;
              particle.z += Math.sin(time * 2.2 + index * 0.08) * 0.3;
            } else {
              // Particle reached the sphere surface - stay on the edge
              particle.absorbed = true;
              particle.life = 0;

              // Keep particle on sphere surface
              const currentRadius = Math.sqrt(
                particle.x * particle.x +
                  particle.y * particle.y +
                  particle.z * particle.z
              );
              const targetRadius = 82; // Slightly larger than main sphere to sit on edge
              particle.x = (particle.x / currentRadius) * targetRadius;
              particle.y = (particle.y / currentRadius) * targetRadius;
              particle.z = (particle.z / currentRadius) * targetRadius;
            }
          } else {
            // Particle stays on surface, creating accumulation effect
            particle.life++;

            // Keep particle firmly on sphere surface
            const currentRadius = Math.sqrt(
              particle.x * particle.x +
                particle.y * particle.y +
                particle.z * particle.z
            );
            const targetRadius = 82;
            particle.x = (particle.x / currentRadius) * targetRadius;
            particle.y = (particle.y / currentRadius) * targetRadius;
            particle.z = (particle.z / currentRadius) * targetRadius;

            // Add gentle movement along surface to simulate organic settling
            const surfaceMovement = Math.sin(time * 1.5 + index * 0.3) * 0.3;
            const phi =
              Math.atan2(particle.y, particle.x) + surfaceMovement * 0.01;
            const theta =
              Math.acos(particle.z / targetRadius) + surfaceMovement * 0.01;

            particle.x = targetRadius * Math.sin(theta) * Math.cos(phi);
            particle.y = targetRadius * Math.sin(theta) * Math.sin(phi);
            particle.z = targetRadius * Math.cos(theta);

            // Fade out very slowly to create accumulation effect
            particle.alpha = Math.max(0.1, 1 - particle.life / 200);
          }

          // Reset particle if it's lived too long (but keep absorbed particles longer)
          if (particle.life > particle.maxLife * (particle.absorbed ? 3 : 1)) {
            // Respawn particle at edge
            const phi = Math.acos(1 - 2 * Math.random());
            const theta = 2 * Math.PI * Math.random();
            const spawnRadius = 200;

            particle.x = spawnRadius * Math.sin(phi) * Math.cos(theta);
            particle.y = spawnRadius * Math.sin(phi) * Math.sin(theta);
            particle.z = spawnRadius * Math.cos(phi);

            // New target on sphere
            const targetPhi = Math.acos(1 - 2 * Math.random());
            const targetTheta = 2 * Math.PI * Math.random();
            const targetRadius = 80;

            particle.targetX =
              targetRadius * Math.sin(targetPhi) * Math.cos(targetTheta);
            particle.targetY =
              targetRadius * Math.sin(targetPhi) * Math.sin(targetTheta);
            particle.targetZ = targetRadius * Math.cos(targetPhi);

            particle.life = 0;
            particle.absorbed = false;
            particle.alpha = 0.6 + Math.random() * 0.4;
            particle.speed = 0.2 + Math.random() * 0.6;
          }

          // Render particle
          const perspective = 200;
          const scale = perspective / (perspective + particle.z);
          const screenX = centerX + particle.x * scale;
          const screenY = centerY + particle.y * scale;

          if (
            particle.z > -200 &&
            screenX >= 0 &&
            screenX <= canvas.width &&
            screenY >= 0 &&
            screenY <= canvas.height
          ) {
            const size = particle.size * scale;
            const alpha =
              particle.alpha * Math.max(0, (200 + particle.z) / 400);

            // Color changes as particle approaches sphere
            const distanceToTarget = Math.sqrt(
              (particle.targetX - particle.x) ** 2 +
                (particle.targetY - particle.y) ** 2 +
                (particle.targetZ - particle.z) ** 2
            );
            const proximityFactor = Math.max(0, 1 - distanceToTarget / 200);

            const r = particle.color.r + 60 * proximityFactor;
            const g = particle.color.g + 100 * proximityFactor;
            const b = particle.color.b + 20 * proximityFactor;

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.fillRect(screenX - size / 2, screenY - size / 2, size, size);

            // Add glow effect for particles close to absorption
            if (proximityFactor > 0.7) {
              ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`;
              ctx.shadowBlur = 8;
              ctx.fillRect(screenX - size / 2, screenY - size / 2, size, size);
              ctx.shadowBlur = 0;
            }
          }
        });
      }

      // Render main voxel sphere
      voxelsRef.current.forEach((voxel, index) => {
        const rotationSpeed = isResponding ? 0.3 : 0.1;
        const rotY = time * rotationSpeed;
        const rotX = time * (rotationSpeed * 0.7);

        // Apply rotations
        let x = voxel.originalX;
        let y = voxel.originalY;
        let z = voxel.originalZ;

        const breathingScale = 1 + Math.sin(time * 2) * 0.05;
        x *= breathingScale;
        y *= breathingScale;
        z *= breathingScale;

        // Rotate around Y axis
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const tempX = x * cosY - z * sinY;
        z = x * sinY + z * cosY;
        x = tempX;

        // Rotate around X axis
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const tempY = y * cosX - z * sinX;
        z = y * sinX + z * cosX;
        y = tempY;

        // Voice reaction effects with smooth transitions
        const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
        const normalizedDistance = distanceFromCenter / 80;
        const waveIntensity = audioLevel * 30 * transitionProgress.current;

        // Create ripple effect from center outward (only when transitioning)
        const ripple =
          Math.sin(time * 8 - normalizedDistance * 5) *
          waveIntensity *
          transitionProgress.current;
        const organicMovement =
          Math.sin(time * 3 + index * 0.1) *
          waveIntensity *
          0.5 *
          transitionProgress.current;

        x += (x / distanceFromCenter) * ripple * 0.3;
        y += (y / distanceFromCenter) * ripple * 0.3;
        z += (z / distanceFromCenter) * ripple * 0.3;

        // Add organic swaying (smoothly transition)
        x += Math.sin(time * 2 + index * 0.05) * organicMovement;
        y += Math.cos(time * 1.8 + index * 0.07) * organicMovement;
        z += Math.sin(time * 2.2 + index * 0.06) * organicMovement;

        // Smooth color transition
        const absorptionIntensity =
          Math.sin(time * 4 + index * 0.1) * 0.3 + 0.7;
        const listeningColor = {
          r:
            20 +
            Math.sin(time * 4 + index * 0.1) * 30 +
            absorptionIntensity * 40,
          g:
            180 +
            Math.sin(time * 3 + index * 0.1) * 50 +
            absorptionIntensity * 20,
          b:
            60 +
            Math.sin(time * 2.5 + index * 0.1) * 40 +
            absorptionIntensity * 60,
        };

        if (isListening) {
          // Interpolate between base color and listening color
          voxel.color = {
            r:
              voxel.baseColor.r +
              (listeningColor.r - voxel.baseColor.r) *
                transitionProgress.current,
            g:
              voxel.baseColor.g +
              (listeningColor.g - voxel.baseColor.g) *
                transitionProgress.current,
            b:
              voxel.baseColor.b +
              (listeningColor.b - voxel.baseColor.b) *
                transitionProgress.current,
          };

          // Smooth size transition
          const targetSize = voxel.baseSize * (1 + absorptionIntensity * 0.2);
          voxel.size =
            voxel.baseSize +
            (targetSize - voxel.baseSize) * transitionProgress.current;
        } else if (isResponding) {
          const intensePulse =
            Math.sin(time * 15) * 0.15 + Math.sin(time * 8) * 0.1;
          const dramaticHeartbeat = (1 + intensePulse) * 8;
          const energeticFlow = Math.sin(time * 6 + index * 0.2) * 6;
          const chaosMovement = Math.cos(time * 10 + index * 0.25) * 4;

          // More subtle movements
          x += Math.sin(time * 3 + index * 0.15) * dramaticHeartbeat * 0.2;
          y += Math.cos(time * 2.5 + index * 0.18) * dramaticHeartbeat * 0.2;
          z += Math.sin(time * 2.8 + index * 0.12) * energeticFlow * 0.3;

          // Reduced chaotic energy bursts
          x += Math.sin(time * 8 + index * 0.3) * chaosMovement * 0.15;
          y += Math.cos(time * 7 + index * 0.28) * chaosMovement * 0.15;
          z += Math.sin(time * 9 + index * 0.32) * chaosMovement * 0.1;

          voxel.color = {
            r: 180 + Math.sin(time * 5 + index * 0.15) * 40,
            g: 40 + Math.sin(time * 4 + index * 0.12) * 30,
            b: 220 + Math.sin(time * 6 + index * 0.18) * 25,
          };

          voxel.alpha = 0.85 + Math.sin(time * 4 + index * 0.1) * 0.05;
        } else {
          const idleBreathing = Math.sin(time * 1.5 + index * 0.05) * 2;
          const gentleSway = Math.cos(time * 0.8 + index * 0.03) * 1.5;
          const subtleShift = Math.sin(time * 0.6 + index * 0.04) * 1;

          x += idleBreathing * 0.3;
          y += gentleSway * 0.4;
          z += subtleShift * 0.2;

          const idleColor = {
            r: 80 + Math.sin(time * 0.5 + index * 0.1) * 15,
            g: 90 + Math.sin(time * 0.7 + index * 0.1) * 20,
            b: 220 + Math.sin(time * 0.4 + index * 0.1) * 25,
          };

          // Smooth transition back to idle color
          voxel.color = {
            r: voxel.color.r + (idleColor.r - voxel.color.r) * 0.02,
            g: voxel.color.g + (idleColor.g - voxel.color.g) * 0.02,
            b: voxel.color.b + (idleColor.b - voxel.color.b) * 0.02,
          };

          // Reset alpha and smooth size transition back
          voxel.alpha = 0.8;
          voxel.size = voxel.size + (voxel.baseSize - voxel.size) * 0.02;
        }

        // Project 3D to 2D
        const perspective = 200;
        const scale = perspective / (perspective + z);
        const screenX = centerX + x * scale;
        const screenY = centerY + y * scale;

        // Only draw if in front and within canvas
        if (
          z > -200 &&
          screenX >= 0 &&
          screenX <= canvas.width &&
          screenY >= 0 &&
          screenY <= canvas.height
        ) {
          const size = voxel.size * scale;
          const alpha = voxel.alpha * Math.max(0, (200 + z) / 400);

          ctx.fillStyle = `rgba(${voxel.color.r}, ${voxel.color.g}, ${voxel.color.b}, ${alpha})`;
          ctx.fillRect(screenX - size / 2, screenY - size / 2, size, size);
        }
      });

      if (isResponding) {
        const barCount = 5;
        const barWidth = 3;
        const maxBarHeight = 20;
        const spacing = 6;

        // Calculate starting position to center the icon
        const iconStartX =
          centerX - (barCount * barWidth + (barCount - 1) * spacing) / 2;

        for (let i = 0; i < barCount; i++) {
          const barX = iconStartX + i * (barWidth + spacing);
          const barHeight =
            maxBarHeight * (0.3 + 0.7 * Math.abs(Math.sin(time * 8 + i * 0.8)));
          const barY = centerY - barHeight / 2;

          // Use responding colors for the bars
          const intensity = Math.sin(time * 6 + i * 0.5) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(${180 * intensity}, ${40 * intensity}, ${220 * intensity}, 0.9)`;
          ctx.fillRect(barX, barY, barWidth, barHeight);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, isResponding, audioLevel]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="rounded-full"
        style={{
          filter: isListening
            ? "drop-shadow(0 0 20px rgba(34, 197, 94, 0.5))"
            : isResponding
              ? "drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))"
              : "drop-shadow(0 0 15px rgba(99, 102, 241, 0.3))",
        }}
      />
    </div>
  );
}
