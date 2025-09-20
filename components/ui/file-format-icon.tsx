// AlignUI FileFormatIcon v0.0.0

import type * as React from "react";

import { tv, type VariantProps } from "@/lib/utils/tv";

export const fileFormatIconVariants = tv({
  slots: {
    root: "relative shrink-0",
    formatBox: [
      "absolute flex items-center rounded px-1 py-[3px]",
      "font-semibold text-static-white tracking-[0.02em]",
      "shadow-[0_19px_8px_rgba(115,31,8,0.01),0_11px_6px_rgba(115,31,8,0.04),0_5px_5px_rgba(115,31,8,0.07),0_1px_3px_rgba(115,31,8,0.08),0_0_0_1px_rgb(229,63,16),inset_0_-0.5px_0.5px_rgba(255,255,255,0.36)]",
    ],
  },
  variants: {
    size: {
      large: {
        root: "w-10",
        formatBox: "-left-2 bottom-[13px] h-5 text-[13px]/[14px]",
      },
      medium: {
        root: "w-9",
        formatBox: "-left-1.5 bottom-[11px] h-4 text-[11px]/[12px]",
      },
      small: {
        root: "w-8",
        formatBox:
          "-left-1 bottom-[11px] h-3.5 rounded-[3px] text-[10px]/[11px]",
      },
    },
    color: {
      red: {
        formatBox: "bg-error-base",
      },
      orange: {
        formatBox: "bg-warning-base",
      },
      yellow: {
        formatBox: "bg-away-base",
      },
      green: {
        formatBox: "bg-success-base",
      },
      sky: {
        formatBox: "bg-verified-base",
      },
      blue: {
        formatBox: "bg-information-base",
      },
      purple: {
        formatBox: "bg-feature-base",
      },
      pink: {
        formatBox: "bg-highlighted-base",
      },
      gray: {
        formatBox: "bg-faded-base",
      },
    },
  },
  defaultVariants: {
    color: "gray",
    size: "medium",
  },
});

function FileFormatIcon({
  format,
  className,
  color,
  size,
  ...rest
}: VariantProps<typeof fileFormatIconVariants> &
  React.SVGProps<SVGSVGElement>) {
  const { root, formatBox } = fileFormatIconVariants({ color, size });

  return (
    <div className={root({ class: className })}>
      <svg
        fill="none"
        height="100%"
        viewBox="0 0 36 48"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <title>File format icon</title>
        <path
          className="fill-bg-soft-200"
          d="M27.8 48H8.2c-2.99 0-4.484 0-5.609-.618a5 5 0 0 1-1.973-1.973C0 44.284 0 42.789 0 39.8V8.2c0-2.99 0-4.484.618-5.609A5 5 0 0 1 2.591.618C3.716 0 5.211 0 8.2 0h12.032c1.314 0 1.971 0 2.587.16a5 5 0 0 1 1.31.546c.546.325 1.008.793 1.932 1.727l7.569 7.65c.91.921 1.366 1.382 1.683 1.923.237.404.416.84.532 1.294.155.608.155 1.255.155 2.55V39.8c0 2.99 0 4.484-.618 5.609a5 5 0 0 1-1.973 1.973C32.284 48 30.789 48 27.8 48Z"
        />
      </svg>
      <div className={formatBox()}>{format}</div>
    </div>
  );
}

export { FileFormatIcon as Root };
