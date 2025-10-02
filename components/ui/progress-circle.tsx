// AlignUI ProgressCircle v0.0.0

import * as React from "react";

import { cn } from "@/lib/utils/cn";
import { tv, type VariantProps } from "@/lib/utils/tv";

export const progressCircleVariants = tv({
  slots: {
    text: "",
  },
  variants: {
    size: {
      "80": { text: "text-label-sm" },
      "72": { text: "text-label-sm" },
      "64": { text: "text-label-sm" },
      "56": { text: "text-label-xs" },
      "48": { text: "text-label-xs" },
      "32": { text: "text-label-xs" },
      "24": { text: "text-label-xs" },
      "20": { text: "text-label-xs" },
    },
  },
  defaultVariants: {
    size: "80",
  },
});

function getSizes({
  size,
}: Pick<VariantProps<typeof progressCircleVariants>, "size">) {
  switch (size) {
    case "80":
      return {
        strokeWidth: 6.4,
        radius: 40,
      };
    case "72":
      return {
        strokeWidth: 5.75,
        radius: 36,
      };
    case "64":
      return {
        strokeWidth: 5.1,
        radius: 32,
      };
    case "56":
      return {
        strokeWidth: 4.5,
        radius: 28,
      };
    case "48":
      return {
        strokeWidth: 6.7,
        radius: 24,
      };
    case "32":
      return {
        strokeWidth: 3,
        radius: 16,
      };
    case "24":
      return {
        strokeWidth: 2.5,
        radius: 12,
      };
    case "20":
      return {
        strokeWidth: 2,
        radius: 10,
      };
    default:
      return {
        strokeWidth: 6.4,
        radius: 40,
      };
  }
}

type ProgressCircleRootProps = Omit<React.SVGProps<SVGSVGElement>, "value"> &
  VariantProps<typeof progressCircleVariants> & {
    value?: number;
    max?: number;
    children?: React.ReactNode;
  };

const ProgressCircleRoot = React.forwardRef<
  SVGSVGElement,
  ProgressCircleRootProps
>(
  (
    {
      value = 0,
      max = 100,
      size,
      className,
      children,
      ...rest
    }: ProgressCircleRootProps,
    forwardedRef
  ) => {
    const { text } = progressCircleVariants({ size });
    const { strokeWidth, radius } = getSizes({ size });
    const safeValue = Math.min(max, Math.max(value, 0));
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const offset = circumference - (safeValue / max) * circumference;

    return (
      <div className={cn("relative", className)}>
        <svg
          aria-valuemax={max}
          aria-valuemin={0}
          aria-valuenow={value}
          className="-rotate-90"
          height={radius * 2}
          ref={forwardedRef}
          role="progressbar"
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          width={radius * 2}
          {...rest}
        >
          <title>Progress circle</title>
          <circle
            className="stroke-bg-soft-200"
            cx={radius}
            cy={radius}
            fill="none"
            r={normalizedRadius}
            strokeWidth={strokeWidth}
          />
          {safeValue >= 0 && (
            <circle
              className="stroke-primary-base transition-all duration-300 ease-out"
              cx={radius}
              cy={radius}
              fill="none"
              r={normalizedRadius}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
              strokeWidth={strokeWidth}
            />
          )}
        </svg>
        {children && (
          <div
            className={text({
              class:
                "absolute inset-0 flex items-center justify-center text-center",
            })}
          >
            {children}
          </div>
        )}
      </div>
    );
  }
);
ProgressCircleRoot.displayName = "ProgressCircleRoot";

export { ProgressCircleRoot as Root };
