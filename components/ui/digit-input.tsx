// AlignUI DigitInput v0.0.0

import * as React from "react";

import OtpInput, { type OTPInputProps } from "react-otp-input";

import { cn } from "@/lib/utils/cn";

type OtpOptions = Omit<OTPInputProps, "renderInput">;

type DigitInputProps = {
  className?: string;
  disabled?: boolean;
  hasError?: boolean;
} & OtpOptions;

function DigitInput({
  className,
  disabled,
  hasError,
  ...rest
}: DigitInputProps) {
  return (
    <OtpInput
      containerStyle={cn("flex w-full items-center gap-2.5", className)}
      renderInput={(inputProps) => (
        <DigitInputSlot
          disabled={disabled}
          hasError={hasError}
          {...inputProps}
        />
      )}
      skipDefaultStyles
      {...rest}
    />
  );
}
DigitInput.displayName = "DigitInput";

const DigitInputSlot = React.forwardRef<
  React.ComponentRef<"input">,
  React.ComponentPropsWithoutRef<"input"> & {
    hasError?: boolean;
  }
>(({ className, hasError, ...rest }, forwardedRef) => {
  return (
    <input
      className={cn(
        "h-16 w-full min-w-0 rounded-10 bg-bg-white-0 text-center text-text-strong-950 text-title-h5 shadow-regular-xs outline-none ring-1 ring-stroke-soft-200 ring-inset",
        "transition duration-200 ease-out",
        // hover
        "hover:bg-bg-weak-50 hover:shadow-none hover:ring-transparent",
        // focus
        "focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950",
        // selection
        "selection:bg-none",
        // disabled
        "disabled:bg-bg-weak-50 disabled:text-text-disabled-300 disabled:shadow-none disabled:ring-transparent",
        {
          "ring-error-base hover:ring-error-base focus:shadow-button-error-focus focus:ring-error-base":
            hasError,
        },
        className
      )}
      ref={forwardedRef}
      {...rest}
    />
  );
});
DigitInputSlot.displayName = "DigitInputSlot";

export { DigitInput as Root };
