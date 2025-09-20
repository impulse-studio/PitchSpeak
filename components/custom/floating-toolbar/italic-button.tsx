"use client";

import { RiItalic } from "@remixicon/react";
import type { Editor } from "@tiptap/react";
import { forwardRef } from "react";

import { ToolbarButton } from "./toolbar-button";

type ItalicButtonProps = {
  editor: Editor | null;
};

const ItalicButton = forwardRef<HTMLButtonElement, ItalicButtonProps>(
  ({ editor }, ref) => {
    return (
      <ToolbarButton
        icon={RiItalic}
        isActive={editor?.isActive("italic") ?? false}
        onClick={() => {
          editor?.chain().focus().toggleItalic().run();
        }}
        ref={ref}
        tooltip="Italic"
      />
    );
  }
);

ItalicButton.displayName = "ItalicButton";

export { ItalicButton };
