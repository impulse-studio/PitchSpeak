// AlignUI Divider v0.0.0

import { tv, type VariantProps } from "@/lib/utils/tv";

const DIVIDER_ROOT_NAME = "DividerRoot";

export const dividerVariants = tv({
  base: "relative flex w-full items-center",
  variants: {
    variant: {
      line: "before:-translate-y-1/2 h-0 before:absolute before:top-1/2 before:left-0 before:h-px before:w-full before:bg-stroke-soft-200",
      "line-spacing": [
        // base
        "h-1",
        // before
        "before:-translate-y-1/2 before:absolute before:top-1/2 before:left-0 before:h-px before:w-full before:bg-stroke-soft-200",
      ],
      "line-text": [
        // base
        "gap-2.5",
        "text-subheading-2xs text-text-soft-400",
        // before
        "before:h-px before:w-full before:flex-1 before:bg-stroke-soft-200",
        // after
        "after:h-px after:w-full after:flex-1 after:bg-stroke-soft-200",
      ],
      content: [
        // base
        "gap-2.5",
        // before
        "before:h-px before:w-full before:flex-1 before:bg-stroke-soft-200",
        // after
        "after:h-px after:w-full after:flex-1 after:bg-stroke-soft-200",
      ],
      text: [
        // base
        "px-2 py-1",
        "text-subheading-xs text-text-soft-400",
      ],
      "solid-text": [
        // base
        "bg-bg-weak-50 px-5 py-1.5 uppercase",
        "text-subheading-xs text-text-soft-400",
      ],
      "dotted-line": [
        // base
        "h-1 w-full text-stroke-soft-200",
        // dotted line effect
        "![background-image:linear-gradient(90deg,currentColor_4px,transparent_4px)]",
        "![background-position:50%_50%]",
        "![background-size:8px_1px]",
        "![background-repeat:repeat-x]",
      ],
    },
  },
  defaultVariants: {
    variant: "line",
  },
});

function Divider({
  className,
  variant,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof dividerVariants>) {
  return (
    <div className={dividerVariants({ variant, class: className })} {...rest} />
  );
}
Divider.displayName = DIVIDER_ROOT_NAME;

export { Divider as Root };
