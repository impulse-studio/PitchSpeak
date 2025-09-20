// AlignUI FileUpload v0.0.0

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils/cn";
import type { PolymorphicComponentProps } from "@/lib/utils/polymorphic";

interface FileUploadRootProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  asChild?: boolean;
  isDragActive?: boolean;
}

const FileUpload = React.forwardRef<HTMLLabelElement, FileUploadRootProps>(
  ({ className, asChild, isDragActive, ...rest }, forwardedRef) => {
    const Component = asChild ? Slot : "label";

    return (
      <Component
        className={cn(
          "flex w-full cursor-pointer flex-col items-center gap-5 rounded-2xl border border-stroke-sub-300 border-dashed bg-bg-white-0 p-8 text-center",
          "transition duration-200 ease-out",
          // hover
          "hover:bg-bg-weak-50",
          // drag active
          isDragActive && "bg-bg-weak-50",
          className
        )}
        ref={forwardedRef}
        {...rest}
      />
    );
  }
);
FileUpload.displayName = "FileUpload";

const FileUploadButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
  }
>(({ className, asChild, ...rest }, forwardedRef) => {
  const Component = asChild ? Slot : "div";

  return (
    <Component
      className={cn(
        "inline-flex h-8 items-center justify-center gap-2.5 whitespace-nowrap rounded-lg bg-bg-white-0 px-2.5 text-label-sm text-text-sub-600",
        "pointer-events-none ring-1 ring-stroke-soft-200 ring-inset",
        className
      )}
      ref={forwardedRef}
      {...rest}
    />
  );
});
FileUploadButton.displayName = "FileUploadButton";

function FileUploadIcon<T extends React.ElementType>({
  className,
  as,
  ...rest
}: PolymorphicComponentProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={cn("size-6 text-text-sub-600", className)}
      {...rest}
    />
  );
}

export {
  FileUpload as Root,
  FileUploadButton as Button,
  FileUploadIcon as Icon,
};
