"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { RiCalendarLine } from "@remixicon/react";
import { format } from "date-fns";
import { useId, useState } from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { FormField } from "@/components/form/form-field";
import { Calendar } from "@/components/ui/datepicker";
import * as Input from "@/components/ui/input";

interface FormDateInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: "medium" | "small" | "xsmall";
  dateFormat?: string;
}

export function FormDateInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  required,
  description,
  placeholder = "Select date...",
  disabled,
  size,
  dateFormat = "PPP", // Default to long date format
  ...controllerProps
}: FormDateInputProps<TFieldValues, TName>) {
  const [open, setOpen] = useState(false);
  const uniqueId = useId();

  return (
    <Controller
      control={control}
      name={name}
      {...controllerProps}
      render={({ field, fieldState }) => (
        <FormField
          description={description}
          error={fieldState.error}
          label={label}
          name={uniqueId}
          required={required}
        >
          <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
              <button
                className="w-full text-left"
                disabled={disabled}
                type="button"
              >
                <Input.Root hasError={!!fieldState.error} size={size}>
                  <Input.Wrapper>
                    <Input.Icon as={RiCalendarLine} />
                    <Input.Input
                      disabled={disabled}
                      id={uniqueId}
                      placeholder={placeholder}
                      readOnly
                      value={field.value ? format(field.value, dateFormat) : ""}
                    />
                  </Input.Wrapper>
                </Input.Root>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-0 shadow-regular-md"
            >
              <Calendar
                initialFocus
                mode="single"
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false);
                }}
                selected={field.value}
              />
            </PopoverContent>
          </Popover>
        </FormField>
      )}
    />
  );
}
