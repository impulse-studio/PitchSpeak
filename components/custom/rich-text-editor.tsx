"use client";

import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { AnimatePresence } from "motion/react";
import { type ComponentPropsWithoutRef, forwardRef, useEffect } from "react";

import FloatingToolbar from "@/components/custom/floating-toolbar";
import { cn } from "@/lib/utils";

interface RichTextEditorProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ content, onChange, id, placeholder, className, ...props }, ref) => {
    const editor = useEditor({
      content: content || "",
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: false,
        }),
        Placeholder.configure({
          emptyEditorClass: "is-editor-empty",
          showOnlyWhenEditable: false,
          placeholder: placeholder || "Write something...",
        }),
        Highlight,
        Underline,
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        }),
        Typography,
      ],
      editorProps: {
        attributes: {
          class:
            "text-paragraph-sm prose-sm prose focus:outline-none min-h-[100px] text-text-strong-950 dark:prose-invert",
          role: "textbox",
          "aria-multiline": "true",
          "aria-label": placeholder || "Rich text editor",
        },
      },
      onUpdate: ({ editor: currentEditor }) => {
        onChange(currentEditor.getHTML());
      },
    });

    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content || "", {
          emitUpdate: false,
        });
      }
    }, [editor, content]);

    return (
      <div
        className={cn(
          "group/textarea relative flex w-full flex-col rounded-xl bg-bg-white-0 pb-2.5 shadow-regular-xs",
          "ring-1 ring-stroke-soft-200 ring-inset transition duration-200 ease-out",
          "hover:[&:not(:focus-within)]:bg-bg-weak-50 hover:[&:not(:focus-within)]:ring-transparent",
          "focus-within:shadow-button-important-focus focus-within:ring-stroke-strong-950",
          "has-[[data-disabled]]:pointer-events-none has-[[data-disabled]]:bg-bg-weak-50 has-[[data-disabled]]:ring-transparent",
          className
        )}
        data-slot="control"
        ref={ref}
        {...props}
      >
        <AnimatePresence>
          {editor?.isFocused && <FloatingToolbar editor={editor} />}
        </AnimatePresence>
        <div
          className={cn(
            "block w-full resize-none text-paragraph-sm text-text-strong-950 outline-none",
            "pointer-events-auto h-full min-h-[82px] bg-transparent pt-2.5 pr-2.5 pl-3",
            "min-h-[100px] overflow-auto"
          )}
        >
          <EditorContent className="editor-content" editor={editor} id={id} />
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export { RichTextEditor };
