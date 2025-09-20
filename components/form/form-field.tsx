"use client";

import type { ReactNode } from "react";

import type { FieldError, FieldPath, FieldValues } from "react-hook-form";

import { FormMessage } from "@/components/ui/form";
import { InfoCircleFilled } from "@/components/ui/icons";
import * as Label from "@/components/ui/label";
import * as Tooltip from "@/components/ui/tooltip";

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  label?: string;
  required?: boolean;
  description?: string;
  tooltip?: string;
  children: ReactNode;
  error?: FieldError;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  required,
  description,
  tooltip,
  children,
  error,
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <div className="flex items-center gap-1.5">
          <Label.Root htmlFor={name}>
            {label} {required && <Label.Asterisk />}
            {description && <Label.Sub>{description}</Label.Sub>}
          </Label.Root>
          {tooltip && (
            <Tooltip.Root>
              <Tooltip.Trigger
                aria-label={`More information about ${label}`}
                type="button"
              >
                <InfoCircleFilled className="size-5 text-text-disabled-300" />
              </Tooltip.Trigger>
              <Tooltip.Content side="top" size="xsmall">
                {tooltip}
              </Tooltip.Content>
            </Tooltip.Root>
          )}
        </div>
      )}
      {children}
      {error && <FormMessage>{error?.message?.toString()}</FormMessage>}
    </div>
  );
}
