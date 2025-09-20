"use client";

import {
  RiDeleteBinLine,
  RiImageLine,
  RiUploadCloud2Line,
} from "@remixicon/react";
import { upload } from "@vercel/blob/client";
import { useCallback, useId, useState } from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { toast } from "sonner";
import { ulid } from "ulid";

import { StaggeredFadeLoader } from "@/components/staggered-fade-loader";
import * as Button from "@/components/ui/button";
import * as FileUpload from "@/components/ui/file-upload";
import { FormMessage } from "@/components/ui/form";
import * as Label from "@/components/ui/label";
import * as Tooltip from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";

import { InfoCircleFilled } from "../ui/icons";

const FILENAME_EXTENSION_REGEX = /\.([^.]+)$/;

const getAspectRatioClass = (aspectRatio: string) => {
  switch (aspectRatio) {
    case "square":
      return "aspect-square";
    case "wide":
      return "aspect-[16/9]";
    case "tall":
      return "aspect-[4/5]";
    case "auto":
      return "max-h-96 min-h-64";
    default:
      return "aspect-[16/9]";
  }
};

const formatAcceptedTypes = (acceptedTypes: string[]) => {
  return acceptedTypes
    .map((type) => type.split("/")[1].toUpperCase())
    .join(", ");
};

const validateFile = (file: File, acceptedTypes: string[], maxSize: number) => {
  if (file.size > maxSize) {
    return { isValid: false, error: "fileSize" };
  }

  const isValidType = acceptedTypes.some((acceptedType) => {
    if (acceptedType.includes("*")) {
      const [type, subtype] = acceptedType.split("/");
      const [fileType, fileSubtype] = file.type.split("/");
      return type === fileType && (subtype === "*" || subtype === fileSubtype);
    }
    return acceptedType === file.type;
  });

  if (!isValidType) {
    return { isValid: false, error: "fileType" };
  }

  return { isValid: true };
};

interface FormImageUploadProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
  uploadPath: string;
  uploadPrefix?: string;
  acceptedTypes?: string[];
  maxSize?: number;
  previewAspectRatio?: "square" | "wide" | "tall" | "auto";
  onUploadSuccess?: (url: string) => Promise<void> | void;
  onRemoveSuccess?: (url: string) => Promise<void> | void;
  onUploadStart?: () => void;
  onRemoveStart?: () => void;
}

const ImagePreview = ({
  value,
  previewAspectRatio,
  isUploading,
  isRemoving,
  onRemove,
}: {
  value: string;
  previewAspectRatio: string;
  isUploading: boolean;
  isRemoving: boolean;
  onRemove: (e: React.MouseEvent) => void;
}) => {
  return (
    <div className="relative" key={value}>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-stroke-soft-200",
          getAspectRatioClass(previewAspectRatio)
        )}
      >
        <img
          alt="Uploaded content preview"
          className="h-full w-full object-cover"
          src={value}
        />
      </div>
      <Button.Root
        className="absolute top-2 right-2 bg-bg-white-0/90 backdrop-blur-sm"
        disabled={isUploading || isRemoving}
        mode="stroke"
        onClick={onRemove}
        size="xsmall"
        type="button"
        variant="neutral"
      >
        {isRemoving ? (
          <StaggeredFadeLoader variant="muted" />
        ) : (
          <Button.Icon as={RiDeleteBinLine} />
        )}
        {isRemoving ? "Removing" : "Remove"}
      </Button.Root>
    </div>
  );
};

const UploadArea = ({
  dragActive,
  isUploading,
  fieldState,
  onDragLeave,
  onDragOver,
  onDrop,
  name: id,
  acceptedTypes,
  onFileSelect,
  placeholder,
  maxSize,
}: {
  dragActive: boolean;
  isUploading: boolean;
  fieldState: { error?: { message?: string } };
  onDragLeave: (e: React.DragEvent<HTMLElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLElement>) => void;
  onDrop: (e: React.DragEvent<HTMLElement>) => void;
  name: string;
  acceptedTypes: string[];
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  maxSize: number;
}) => {
  return (
    <button
      className="w-full"
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      type="button"
    >
      <FileUpload.Root
        className={cn(
          "cursor-pointer transition-colors",
          dragActive && "border-primary-base bg-primary-base/5",
          isUploading && "pointer-events-none opacity-75",
          fieldState.error && "border-error-base"
        )}
        isDragActive={dragActive}
      >
        <input
          accept={acceptedTypes.join(",")}
          className="sr-only"
          disabled={isUploading}
          id={id}
          onChange={onFileSelect}
          type="file"
        />

        {isUploading ? (
          <div className="flex size-6 items-center justify-center">
            <StaggeredFadeLoader variant="muted" />
          </div>
        ) : (
          <FileUpload.Icon
            as={RiUploadCloud2Line}
            className={cn(
              "transition-colors",
              dragActive && "text-primary-base"
            )}
          />
        )}

        <div className="space-y-1.5">
          <div className="text-label-sm text-text-strong-950">
            {isUploading ? "Uploading..." : placeholder}
          </div>
          <div className="text-paragraph-xs text-text-sub-600">
            {formatAcceptedTypes(acceptedTypes)} up to{" "}
            {Math.round(maxSize / 1024 / 1024)}MB
          </div>
        </div>

        {!isUploading && (
          <FileUpload.Button>
            <FileUpload.Icon as={RiImageLine} />
            Browse images
          </FileUpload.Button>
        )}
      </FileUpload.Root>
    </button>
  );
};

export function FormImageUpload<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  required,
  description,
  placeholder = "Choose an image or drag & drop it here",
  uploadPath,
  uploadPrefix,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  maxSize = 5 * 1024 * 1024, // 5MB
  previewAspectRatio = "wide",
  onUploadSuccess,
  onRemoveSuccess,
  onUploadStart,
  onRemoveStart,
  ...controllerProps
}: FormImageUploadProps<TFieldValues, TName>) {
  const uniqueId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = useCallback(
    async (file: File, onChange: (value: string) => void) => {
      const validation = validateFile(file, acceptedTypes, maxSize);

      if (!validation.isValid) {
        if (validation.error === "fileSize") {
          toast.error(
            `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
          );
        } else {
          toast.error("Invalid file type");
        }
        return;
      }

      setIsUploading(true);
      onUploadStart?.();

      try {
        const extension =
          file.name.match(FILENAME_EXTENSION_REGEX)?.[1] || "jpg";
        const filename = `${uploadPrefix || "uploads"}/${ulid()}.${extension}`;

        const { url } = await upload(filename, file, {
          access: "public",
          handleUploadUrl: uploadPath,
        });

        onChange(url);
        await onUploadSuccess?.(url);

        if (!onUploadSuccess) {
          toast.success("Image uploaded successfully");
        }
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Upload failed");
        onChange("");
      } finally {
        setIsUploading(false);
      }
    },
    [
      maxSize,
      acceptedTypes,
      uploadPath,
      onUploadSuccess,
      onUploadStart,
      uploadPrefix,
    ]
  );

  const handleFileSelect = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      onChange: (value: string) => void
    ) => {
      const file = event.target.files?.[0];
      if (file) {
        handleUpload(file, onChange);
      }
    },
    [handleUpload]
  );

  const handleDrop = useCallback(
    (
      event: React.DragEvent<HTMLElement>,
      onChange: (value: string) => void
    ) => {
      event.preventDefault();
      setDragActive(false);

      const file = event.dataTransfer.files?.[0];
      if (file) {
        handleUpload(file, onChange);
      }
    },
    [handleUpload]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragActive(false);
  }, []);

  const handleRemove = useCallback(
    async (
      currentUrl: string,
      onChange: (value: string) => void,
      event: React.MouseEvent
    ) => {
      event.preventDefault();
      event.stopPropagation();

      if (!currentUrl) {
        onChange("");
        return;
      }

      setIsRemoving(true);
      onRemoveStart?.();

      try {
        await onRemoveSuccess?.(currentUrl);
        onChange("");

        if (!onRemoveSuccess) {
          toast.success("Image removed successfully");
        }
      } catch (_error) {
        toast.error("Failed to remove image");
      } finally {
        setIsRemoving(false);
      }
    },
    [onRemoveSuccess, onRemoveStart]
  );

  return (
    <Controller
      control={control}
      name={name}
      {...controllerProps}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          {label && (
            <Label.Root htmlFor={uniqueId}>
              {label} {required && <Label.Asterisk />}
              {description && (
                <Tooltip.Root>
                  <Tooltip.Trigger
                    aria-label={`More information about ${label}`}
                    type="button"
                  >
                    <InfoCircleFilled className="size-5 text-text-disabled-300" />
                  </Tooltip.Trigger>
                  <Tooltip.Content side="top" size="xsmall">
                    {description}
                  </Tooltip.Content>
                </Tooltip.Root>
              )}
            </Label.Root>
          )}

          <div className="space-y-4">
            {field.value && (
              <ImagePreview
                isRemoving={isRemoving}
                isUploading={isUploading}
                onRemove={(e) => handleRemove(field.value, field.onChange, e)}
                previewAspectRatio={previewAspectRatio}
                value={field.value}
              />
            )}

            {!field.value && (
              <UploadArea
                acceptedTypes={acceptedTypes}
                dragActive={dragActive}
                fieldState={fieldState}
                isUploading={isUploading}
                maxSize={maxSize}
                name={uniqueId}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, field.onChange)}
                onFileSelect={(e) => handleFileSelect(e, field.onChange)}
                placeholder={placeholder}
              />
            )}
          </div>

          <FormMessage>{fieldState.error?.message?.toString()}</FormMessage>
        </div>
      )}
    />
  );
}
