"use client";

import { useId } from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { FormField } from "@/components/form/form-field";
import * as Select from "@/components/ui/select";

type SelectOption = {
  value: string;
  label: string;
  icon?: React.ElementType;
};

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: "medium" | "small" | "xsmall";
  variant?: "default" | "compact" | "compactForInput" | "inline";
  options: SelectOption[];
}

export function FormSelect<
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
  size,
  variant,
  options,
  ...controllerProps
}: FormSelectProps<TFieldValues, TName>) {
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
          <Select.Root
            disabled={disabled || field.disabled}
            hasError={!!fieldState.error}
            name={field.name}
            onValueChange={(value) => {
              field.onChange(value);
              field.onBlur();
            }}
            size={size}
            value={field.value}
            variant={variant}
          >
            <Select.Trigger>
              <Select.Value placeholder={placeholder} />
            </Select.Trigger>
            <Select.Content>
              {options.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.icon && <Select.ItemIcon as={option.icon} />}
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </FormField>
      )}
    />
  );
}
