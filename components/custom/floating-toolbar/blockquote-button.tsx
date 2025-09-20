"use client";

import { RiDoubleQuotesL } from "@remixicon/react";
import type { Editor } from "@tiptap/react";
import { forwardRef } from "react";

import { ToolbarButton } from "./toolbar-button";

type BlockquoteButtonProps = {
  editor: Editor | null;
};

const BlockquoteButton = forwardRef<HTMLButtonElement, BlockquoteButtonProps>(
  ({ editor }, ref) => {
    return (
      <ToolbarButton
        icon={RiDoubleQuotesL}
        isActive={editor?.isActive("blockquote") ?? false}
        onClick={() => {
          editor?.chain().focus().toggleBlockquote().run();
        }}
        ref={ref}
        tooltip="Blockquote"
      />
    );
  }
);

BlockquoteButton.displayName = "BlockquoteButton";

export { BlockquoteButton };
