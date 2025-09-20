"use client";

import type React from "react";
import { forwardRef } from "react";

import * as Button from "@/components/ui/button";
import * as Tooltip from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ToolbarButtonProps = {
  icon: React.ElementType;
  tooltip: string;
  isActive: boolean;
  onClick: () => void;
};

const preventDefault = (fn: () => void) => (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  return fn();
};

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ icon: Icon, tooltip, isActive, onClick }, ref) => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button.Root
            className={cn(
              "size-9",
              isActive ? "bg-bg-weak-50" : "bg-transparent"
            )}
            mode="ghost"
            onMouseDown={preventDefault(onClick)}
            ref={ref}
            size="xsmall"
            type="button"
            variant="neutral"
          >
            <Button.Icon as={Icon} className="size-5" />
          </Button.Root>
        </Tooltip.Trigger>
        <Tooltip.Content align="center" side="top">
          {tooltip}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
);

ToolbarButton.displayName = "ToolbarButton";

export { ToolbarButton };
