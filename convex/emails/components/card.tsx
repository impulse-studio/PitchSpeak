import { Section } from "@react-email/components";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <Section className="my-4 w-full rounded-3xl bg-zinc-800 p-10">
      {children}
    </Section>
  );
}
