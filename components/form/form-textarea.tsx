"use client";

import { useId } from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { FormField } from "@/components/form/form-field";
import * as Textarea from "@/components/ui/textarea";

interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  simple?: boolean;
  maxLength?: number;
  rows?: number;
}

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  required,
  description,
  placeholder,
  disabled,
  simple,
  maxLength,
  rows = 3,
  ...controllerProps
}: FormTextareaProps<TFieldValues, TName>) {
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
          {simple ? (
            <Textarea.Root
              aria-describedby={
                fieldState.error ? `${uniqueId}-error` : undefined
              }
              aria-invalid={!!fieldState.error}
              disabled={disabled}
              hasError={!!fieldState.error}
              id={uniqueId}
              maxLength={maxLength}
              placeholder={placeholder}
              required={required}
              rows={rows}
              simple
              {...field}
            />
          ) : (
            <Textarea.Root
              aria-describedby={
                fieldState.error ? `${uniqueId}-error` : undefined
              }
              aria-invalid={!!fieldState.error}
              disabled={disabled}
              hasError={!!fieldState.error}
              id={uniqueId}
              maxLength={maxLength}
              placeholder={placeholder}
              required={required}
              rows={rows}
              {...field}
            >
              {maxLength && (
                <Textarea.CharCounter
                  current={field.value?.length || 0}
                  max={maxLength}
                />
              )}
            </Textarea.Root>
          )}
        </FormField>
      )}
    />
  );
}
