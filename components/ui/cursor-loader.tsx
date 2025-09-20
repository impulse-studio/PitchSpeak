"use client";

import { cn } from "@/lib/utils";

interface CursorLoaderProps {
  className?: string;
}

export function CursorLoader({ className }: CursorLoaderProps) {
  return (
    <span
      className={cn(
        "ml-1 inline-block h-[1.5em] w-[0.75em] animate-[pulse_1s_steps(1)_infinite] rounded-[3px] align-middle",
        "bg-text-sub-600",
        className
      )}
    />
  );
}
