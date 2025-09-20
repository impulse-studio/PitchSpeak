"use client";

import { RiListOrdered } from "@remixicon/react";
import type { Editor } from "@tiptap/react";
import { forwardRef } from "react";

import { ToolbarButton } from "./toolbar-button";

type NumberedListButtonProps = {
  editor: Editor | null;
};

const NumberedListButton = forwardRef<
  HTMLButtonElement,
  NumberedListButtonProps
>(({ editor }, ref) => {
  return (
    <ToolbarButton
      icon={RiListOrdered}
      isActive={editor?.isActive("orderedList") ?? false}
      onClick={() => {
        editor?.chain().focus().toggleOrderedList().run();
      }}
      ref={ref}
      tooltip="Numbered list"
    />
  );
});

NumberedListButton.displayName = "NumberedListButton";

export { NumberedListButton };
