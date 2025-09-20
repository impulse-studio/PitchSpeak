"use client";

import { useId } from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { FormField } from "@/components/form/form-field";
import * as Input from "@/components/ui/input";

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: string;
  required?: boolean;
  description?: string;
  tooltip?: string;
  placeholder?: string;
  type?: string;
  icon?: React.ElementType;
  disabled?: boolean;
  size?: "medium" | "small" | "xsmall";
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  required,
  description,
  tooltip,
  placeholder,
  type = "text",
  icon,
  disabled,
  size,
  ...controllerProps
}: FormInputProps<TFieldValues, TName>) {
  const uniqueId = useId();

  return (
    <Controller
      control={control}
      name={name}
      {...controllerProps}
      render={({ field, fieldState }) => {
        const { onChange, ...rest } = field;
        return (
          <FormField
            description={description}
            error={fieldState.error}
            label={label}
            name={uniqueId}
            required={required}
            tooltip={tooltip}
          >
            <Input.Root hasError={!!fieldState.error} size={size}>
              <Input.Wrapper>
                {icon && <Input.Icon as={icon} />}
                <Input.Input
                  disabled={disabled}
                  id={uniqueId}
                  onChange={(e) => {
                    if (type === "number") {
                      const numValue = e.target.valueAsNumber;
                      onChange(Number.isNaN(numValue) ? undefined : numValue);
                    } else {
                      onChange(e.target.value);
                    }
                  }}
                  placeholder={placeholder}
                  type={type}
                  {...rest}
                />
              </Input.Wrapper>
            </Input.Root>
          </FormField>
        );
      }}
    />
  );
}
