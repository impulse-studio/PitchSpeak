// AlignUI ProgressBar v0.0.0

import * as React from "react";

import { tv, type VariantProps } from "@/lib/utils/tv";

export const progressBarVariants = tv({
  slots: {
    root: "h-1.5 w-full rounded-full bg-bg-soft-200",
    progress: "h-full rounded-full transition-all duration-300 ease-out",
  },
  variants: {
    color: {
      blue: {
        progress: "bg-information-base",
      },
      red: {
        progress: "bg-error-base",
      },
      orange: {
        progress: "bg-warning-base",
      },
      green: {
        progress: "bg-success-base",
      },
    },
  },
  defaultVariants: {
    color: "blue",
  },
});

type ProgressBarRootProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof progressBarVariants> & {
    value?: number;
    max?: number;
  };

const ProgressBarRoot = React.forwardRef<HTMLDivElement, ProgressBarRootProps>(
  ({ className, color, value = 0, max = 100, ...rest }, forwardedRef) => {
    const { root, progress } = progressBarVariants({ color });
    const safeValue = Math.min(max, Math.max(value, 0));

    return (
      <div className={root({ class: className })} ref={forwardedRef} {...rest}>
        <div
          aria-valuemax={max}
          aria-valuenow={value}
          className={progress()}
          role="progressbar"
          style={{
            width: `${(safeValue / max) * 100}%`,
          }}
        />
      </div>
    );
  }
);
ProgressBarRoot.displayName = "ProgressBarRoot";

export { ProgressBarRoot as Root };
