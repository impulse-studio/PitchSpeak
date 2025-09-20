"use client";

import { RiListUnordered } from "@remixicon/react";
import type { Editor } from "@tiptap/react";
import { forwardRef } from "react";

import { ToolbarButton } from "./toolbar-button";

type BulletListButtonProps = {
  editor: Editor | null;
};

const BulletListButton = forwardRef<HTMLButtonElement, BulletListButtonProps>(
  ({ editor }, ref) => {
    return (
      <ToolbarButton
        icon={RiListUnordered}
        isActive={editor?.isActive("bulletList") ?? false}
        onClick={() => {
          editor?.chain().focus().toggleBulletList().run();
        }}
        ref={ref}
        tooltip="Bullet list"
      />
    );
  }
);

BulletListButton.displayName = "BulletListButton";

export { BulletListButton };
