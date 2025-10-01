import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import type { ReactNode } from "react";

interface EmailLayoutProps {
  children: ReactNode;
  previewText: string;
}

export function EmailLayout({ children, previewText }: EmailLayoutProps) {
  return (
    <Html>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Head />
        <Body className="bg-neutral-950 font-sans">
          <Container className="mx-auto max-w-[580px] px-3 py-5">
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
