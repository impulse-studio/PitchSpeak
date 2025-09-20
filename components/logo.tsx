import type React from "react";

import { cn } from "@/lib/utils/cn";

function Logo({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      className={cn("h-8 w-auto", className)}
      fill="currentColor"
      height="237"
      viewBox="0 0 389 237"
      width="389"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{"impulse-logo"}</title>
      <path d="M120 78H78L155 1H163C192.5 1 233 34 233 74V236L156 236V114.5C156 93.5 134 78 120 78Z" />
      <path d="M1 155V233H78V78L1 155Z" />
      <path d="M1 1V78H78V1H1Z" />
      <path d="M310 1L233 78H271C293 78 311 96.5 311 117V236H388V76C388 35 350 1 318 1H310Z" />
    </svg>
  );
}

export { Logo };
