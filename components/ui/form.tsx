import { Slot } from "@radix-ui/react-slot";
import { RiErrorWarningFill } from "@remixicon/react";
import type * as React from "react";

import { tv, type VariantProps } from "@/lib/utils/tv";

const formMessageVariants = tv({
  slots: {
    root: [
      // base
      "flex gap-1 text-paragraph-xs",
      "transition duration-200 ease-out",
    ],
    icon: [
      // base
      "size-4 shrink-0",
      "transition duration-200 ease-out",
    ],
  },
  variants: {
    variant: {
      error: {
        root: "text-error-base",
        icon: "text-error-base",
      },
      success: {
        root: "text-success-base",
        icon: "text-success-base",
      },
      warning: {
        root: "text-warning-base",
        icon: "text-warning-base",
      },
      info: {
        root: "text-information-base",
        icon: "text-information-base",
      },
    },
  },
  defaultVariants: {
    variant: "error",
  },
});

interface FormMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formMessageVariants> {
  Icon?: React.ElementType;
  asChild?: boolean;
}

export function FormMessage({
  children,
  className,
  variant,
  Icon = RiErrorWarningFill,
  asChild,
  ...props
}: FormMessageProps) {
  const Component = asChild ? Slot : "div";
  const { root, icon: iconClass } = formMessageVariants({ variant });

  if (!children) {
    return null;
  }

  return (
    <Component className={root({ class: className })} {...props}>
      {Icon && <Icon className={iconClass()} />}
      {children}
    </Component>
  );
}

const formGlobalMessageVariants = tv({
  slots: {
    root: [
      // base
      "flex w-full items-start gap-1.5 rounded-lg p-1.5 text-label-sm",
      "ring-1 ring-inset",
      "transition duration-200 ease-out",
    ],
    icon: [
      // base
      "mt-px size-[18px] shrink-0",
      "transition duration-200 ease-out",
    ],
  },
  variants: {
    variant: {
      success: {
        root: [
          "bg-success-lighter text-success-base",
          "ring-success-base/10",
          "shadow-regular-xs",
        ],
        icon: "text-success-base",
      },
      error: {
        root: [
          "bg-error-lighter text-error-base",
          "ring-error-base/10",
          "shadow-regular-xs",
        ],
        icon: "text-error-base",
      },
      warning: {
        root: [
          "bg-warning-lighter text-warning-base",
          "ring-warning-base/10",
          "shadow-regular-xs",
        ],
        icon: "text-warning-base",
      },
      info: {
        root: [
          "bg-information-lighter text-information-base",
          "ring-information-base/10",
          "shadow-regular-xs",
        ],
        icon: "text-information-base",
      },
    },
  },
  defaultVariants: {
    variant: "success",
  },
});

interface FormGlobalMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formGlobalMessageVariants> {
  Icon?: React.ElementType;
  asChild?: boolean;
}

export function FormGlobalMessage({
  children,
  className,
  variant,
  Icon = RiErrorWarningFill,
  asChild,
  ...props
}: FormGlobalMessageProps) {
  const Component = asChild ? Slot : "div";
  const { root, icon } = formGlobalMessageVariants({ variant });

  if (!children) {
    return null;
  }

  return (
    <Component className={root({ class: className })} {...props}>
      {Icon && <Icon className={icon()} />}
      {children}
    </Component>
  );
}
