"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { Toaster as Sonner } from "sonner";

import { cn } from "@/lib/utils/";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = React.forwardRef<HTMLDivElement, ToasterProps>(
  ({ className, ...props }, ref) => {
    const { theme = "system" } = useTheme();

    return (
      <Sonner
        className={cn("toaster group", className)}
        expand
        ref={ref}
        richColors
        theme={theme as ToasterProps["theme"]}
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-bg-white-0 group-[.toaster]:text-text-strong-950 group-[.toaster]:border-stroke-soft-200 group-[.toaster]:shadow-regular-md group-[.toaster]:rounded-10",
            description: "group-[.toast]:text-text-soft-400",
            actionButton:
              "group-[.toast]:bg-primary-base group-[.toast]:text-text-white-0 group-[.toast]:rounded-md hover:group-[.toast]:bg-primary-dark focus:group-[.toast]:outline-none focus:group-[.toast]:ring-2 focus:group-[.toast]:ring-primary-alpha-10",
            cancelButton:
              "group-[.toast]:bg-bg-soft-200 group-[.toast]:text-text-strong-950 group-[.toast]:rounded-md hover:group-[.toast]:bg-bg-sub-300 focus:group-[.toast]:outline-none focus:group-[.toast]:ring-2 focus:group-[.toast]:ring-primary-alpha-10",
            closeButton:
              "group-[.toast]:text-text-soft-400 hover:group-[.toast]:text-text-strong-950 focus:group-[.toast]:outline-none focus:group-[.toast]:ring-2 focus:group-[.toast]:ring-primary-alpha-10",
            success:
              "group-[.toast]:bg-success-lighter group-[.toast]:text-success-dark group-[.toast]:border-success-light",
            error:
              "group-[.toast]:bg-error-lighter group-[.toast]:text-error-dark group-[.toast]:border-error-light",
            warning:
              "group-[.toast]:bg-warning-lighter group-[.toast]:text-warning-dark group-[.toast]:border-warning-light",
            info: "group-[.toast]:bg-information-lighter group-[.toast]:text-information-dark group-[.toast]:border-information-light",
            loading:
              "group-[.toast]:bg-bg-soft-200 group-[.toast]:text-text-strong-950",
          },
        }}
        {...props}
      />
    );
  }
);

Toaster.displayName = "Toaster";

export { Toaster };
