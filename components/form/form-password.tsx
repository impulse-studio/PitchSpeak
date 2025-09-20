"use client";

import { RiEyeLine, RiEyeOffLine, RiLockLine } from "@remixicon/react";
import { useId, useState } from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { FormField } from "@/components/form/form-field";
import * as Input from "@/components/ui/input";

interface FormPasswordProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: "medium" | "small" | "xsmall";
}

export function FormPassword<
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
  ...controllerProps
}: FormPasswordProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = useState(false);
  const uniqueId = useId();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          <Input.Root hasError={!!fieldState.error} size={size}>
            <Input.Wrapper>
              <Input.Icon as={RiLockLine} />
              <Input.Input
                disabled={disabled}
                id={uniqueId}
                placeholder={placeholder}
                type={showPassword ? "text" : "password"}
                {...field}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="cursor-pointer"
                onClick={togglePasswordVisibility}
                type="button"
              >
                {showPassword ? (
                  <RiEyeOffLine className="h-5 w-5 text-text-sub-600" />
                ) : (
                  <RiEyeLine className="h-5 w-5 text-text-sub-600" />
                )}
              </button>
            </Input.Wrapper>
          </Input.Root>
        </FormField>
      )}
    />
  );
}
