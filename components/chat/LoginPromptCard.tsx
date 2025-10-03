"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import * as Button from "@/components/ui/button";
import * as Popover from "@/components/ui/popover";

interface LoginPromptCardProps {
  onLoginClick: () => void;
  triggerElement: React.ReactNode;
}

export function LoginPromptCard({
  onLoginClick,
  triggerElement,
}: LoginPromptCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <Popover.Trigger asChild>{triggerElement}</Popover.Trigger>
      <Popover.Content
        side="top"
        align="center"
        sideOffset={16}
        showArrow={true}
        className="w-[260px] p-4 bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <div className="space-y-3">
          {/* Message simple et direct */}
          <div className="space-y-1">
            <h3 className="text-label-sm text-white/90 font-medium">
              Sign in to continue
            </h3>
            <p className="text-paragraph-xs text-white/50">
              Start a conversation with AI
            </p>
          </div>

          {/* Bouton épuré */}
          <Button.Root
            onClick={onLoginClick}
            variant="neutral"
            mode="stroke"
            size="small"
            className="w-full group bg-white/5 hover:bg-white/10 border-white/10"
          >
            <span className="text-white/90">Sign in</span>
            <Button.Icon
              as={ArrowRight}
              className="group-hover:translate-x-0.5 transition-transform duration-200 text-white/70"
            />
          </Button.Root>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
