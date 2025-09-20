"use client";

import { useId } from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { RichTextEditor } from "@/components/custom/rich-text-editor";
import { FormField } from "@/components/form/form-field";

interface FormRichTextEditorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
}

export function FormRichTextEditor<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  required,
  description,
  placeholder,
  ...controllerProps
}: FormRichTextEditorProps<TFieldValues, TName>) {
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
          <RichTextEditor
            content={field.value || ""}
            id={uniqueId}
            onChange={field.onChange}
            placeholder={placeholder}
          />
        </FormField>
      )}
    />
  );
}
