"use client";

import { RiBold } from "@remixicon/react";
import type { Editor } from "@tiptap/react";
import { forwardRef } from "react";

import { ToolbarButton } from "./toolbar-button";

type BoldButtonProps = {
  editor: Editor | null;
};

const BoldButton = forwardRef<HTMLButtonElement, BoldButtonProps>(
  ({ editor }, ref) => {
    return (
      <ToolbarButton
        icon={RiBold}
        isActive={editor?.isActive("bold") ?? false}
        onClick={() => {
          editor?.chain().focus().toggleBold().run();
        }}
        ref={ref}
        tooltip="Bold"
      />
    );
  }
);

BoldButton.displayName = "BoldButton";

export { BoldButton };
