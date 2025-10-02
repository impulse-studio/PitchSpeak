export const SCROLL_THRESHOLD = 800;
export const AUDIO_VOLUME = 0.3;
export const TIME_UPDATE_INTERVAL = 30000;

export const ANIMATION_DURATIONS = {
  sphere: {
    active: 0.8,
    initial: 2,
  },
  filter: 0.8,
  position: 1.2,
} as const;

export const DROP_SHADOWS = {
  generating: "drop-shadow(0 0 20px rgba(120, 110, 200, 0.5))",
  listening:
    "drop-shadow(0 0 30px rgba(34, 197, 94, 0.6)) drop-shadow(0 0 60px rgba(34, 197, 94, 0.3))",
  responding:
    "drop-shadow(0 0 30px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 60px rgba(168, 85, 247, 0.3))",
  conversation: "drop-shadow(0 0 20px rgba(120, 110, 200, 0.5))",
  idle: "drop-shadow(0 0 15px rgba(99, 102, 241, 0.3))",
} as const;
