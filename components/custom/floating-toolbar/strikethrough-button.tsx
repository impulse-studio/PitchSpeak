"use client";

import { RiStrikethrough } from "@remixicon/react";
import type { Editor } from "@tiptap/react";
import { forwardRef } from "react";

import { ToolbarButton } from "./toolbar-button";

type StrikethroughButtonProps = {
  editor: Editor | null;
};

const StrikethroughButton = forwardRef<
  HTMLButtonElement,
  StrikethroughButtonProps
>(({ editor }, ref) => {
  return (
    <ToolbarButton
      icon={RiStrikethrough}
      isActive={editor?.isActive("strike") ?? false}
      onClick={() => {
        editor?.chain().focus().toggleStrike().run();
      }}
      ref={ref}
      tooltip="Strikethrough"
    />
  );
});

StrikethroughButton.displayName = "StrikethroughButton";

export { StrikethroughButton };
