"use client";

import type { Editor } from "@tiptap/react";
import { motion } from "motion/react";
import { forwardRef, useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { BlockquoteButton } from "./blockquote-button";
import { BoldButton } from "./bold-button";
import { BulletListButton } from "./bullet-list-button";
import { ItalicButton } from "./italic-button";
import { NumberedListButton } from "./numbered-list-button";
import { StrikethroughButton } from "./strikethrough-button";
import { UnderlineButton } from "./underline-button";

type FloatingToolbarProps = {
  editor: Editor | null;
};

const FloatingToolbar = forwardRef<HTMLDivElement, FloatingToolbarProps>(
  ({ editor }, ref) => {
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const totalButtons = buttonRefs.current.filter(Boolean).length;

        switch (e.key) {
          case "ArrowRight":
          case "ArrowDown":
            e.preventDefault();
            setFocusedIndex((prev) => {
              const next = prev < totalButtons - 1 ? prev + 1 : 0;
              buttonRefs.current[next]?.focus();
              return next;
            });
            break;
          case "ArrowLeft":
          case "ArrowUp":
            e.preventDefault();
            setFocusedIndex((prev) => {
              const next = prev > 0 ? prev - 1 : totalButtons - 1;
              buttonRefs.current[next]?.focus();
              return next;
            });
            break;
          case "Enter":
          case " ":
            e.preventDefault();
            if (focusedIndex >= 0 && focusedIndex < totalButtons) {
              buttonRefs.current[focusedIndex]?.click();
            }
            break;
          case "Escape":
            e.preventDefault();
            setFocusedIndex(-1);
            editor?.commands.focus();
            break;
          default:
            break;
        }
      },
      [focusedIndex, editor]
    );

    if (!editor) {
      return null;
    }

    return (
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="-top-16 absolute flex w-full justify-center"
        exit={{ opacity: 0, y: 5 }}
        initial={{ opacity: 0, y: 10 }}
        ref={ref}
        transition={{ duration: 0.15 }}
      >
        <div
          aria-label="Text formatting toolbar"
          className={cn([
            "flex items-center space-x-1 rounded-10 p-1",
            "bg-bg-white-0/90 backdrop-blur-sm",
            "border border-stroke-soft-200",
            "shadow-regular-md",
          ])}
          onKeyDown={handleKeyDown}
          role="toolbar"
        >
          {/* Text formatting group */}
          <BoldButton
            editor={editor}
            ref={(el) => {
              buttonRefs.current[0] = el;
            }}
          />
          <ItalicButton
            editor={editor}
            ref={(el) => {
              buttonRefs.current[1] = el;
            }}
          />
          <UnderlineButton
            editor={editor}
            ref={(el) => {
              buttonRefs.current[2] = el;
            }}
          />
          <StrikethroughButton
            editor={editor}
            ref={(el) => {
              buttonRefs.current[3] = el;
            }}
          />

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-stroke-soft-200" />

          {/* Lists group */}
          <BulletListButton
            editor={editor}
            ref={(el) => {
              buttonRefs.current[4] = el;
            }}
          />
          <NumberedListButton
            editor={editor}
            ref={(el) => {
              buttonRefs.current[5] = el;
            }}
          />

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-stroke-soft-200" />

          {/* Blockquote group */}
          <BlockquoteButton
            editor={editor}
            ref={(el) => {
              buttonRefs.current[6] = el;
            }}
          />
        </div>
      </motion.div>
    );
  }
);

FloatingToolbar.displayName = "FloatingToolbar";

export default FloatingToolbar;
