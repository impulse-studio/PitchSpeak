"use client";

import { RiUnderline } from "@remixicon/react";
import type { Editor } from "@tiptap/react";
import { forwardRef } from "react";

import { ToolbarButton } from "./toolbar-button";

type UnderlineButtonProps = {
  editor: Editor | null;
};

const UnderlineButton = forwardRef<HTMLButtonElement, UnderlineButtonProps>(
  ({ editor }, ref) => {
    return (
      <ToolbarButton
        icon={RiUnderline}
        isActive={editor?.isActive("underline") ?? false}
        onClick={() => {
          editor?.chain().focus().toggleUnderline().run();
        }}
        ref={ref}
        tooltip="Underline"
      />
    );
  }
);

UnderlineButton.displayName = "UnderlineButton";

export { UnderlineButton };
