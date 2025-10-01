"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RiDoorLockFill, RiMailCheckFill, RiMailLine } from "@remixicon/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { StaggeredFadeLoader } from "@/components/common/staggered-fade-loader";
import * as Divider from "@/components/ui/divider";
import * as FancyButton from "@/components/ui/fancy-button";
import { FormGlobalMessage, FormMessage } from "@/components/ui/form";
import * as Input from "@/components/ui/input";
import * as Label from "@/components/ui/label";
import * as LinkButton from "@/components/ui/link-button";
import { PROJECT } from "@/constants/project";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils/cn";
import { forgotPasswordSchema } from "@/validators/auth";

export function ForgotPasswordForm({ error }: { error: string | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    const { error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      form.setError("email", {
        message: error.message,
      });
    } else {
      setSuccess(true);
    }

    setIsLoading(false);
  }

  return (
    <form
      className="flex w-full flex-col gap-6 rounded-20 bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-stroke-soft-200 ring-inset md:p-8"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-2">
        {/* icon */}
        <div
          className={cn(
            "relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl lg:size-24",
            // bg
            "before:absolute before:inset-0 before:rounded-full",
            "before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10"
          )}
        >
          <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-stroke-soft-200 ring-inset lg:size-16">
            <RiDoorLockFill className="size-6 text-text-sub-600 lg:size-8" />
          </div>
        </div>

        <div className="space-y-1 text-center">
          <div className="text-title-h6 lg:text-title-h5">
            Forgot your password?
          </div>
          <div className="text-paragraph-sm text-text-sub-600 lg:text-paragraph-md">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </div>
        </div>
      </div>

      <Divider.Root />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label.Root htmlFor="email">
            Email <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiMailLine} />
              <Input.Input
                id="email"
                placeholder={`hello@${PROJECT.DOMAIN}`}
                required
                type="email"
                {...form.register("email")}
              />
            </Input.Wrapper>
          </Input.Root>

          {form.formState.errors.email && (
            <FormMessage variant="error">
              {form.formState.errors.email.message}
            </FormMessage>
          )}
        </div>
      </div>

      {success && (
        <FormGlobalMessage Icon={RiMailCheckFill} variant="success">
          Check your email for a password reset link.
        </FormGlobalMessage>
      )}

      {error && !success && (
        <FormGlobalMessage variant="error">{error}</FormGlobalMessage>
      )}

      <FancyButton.Root disabled={isLoading} size="medium" variant="primary">
        {isLoading ? (
          <>
            <StaggeredFadeLoader variant="muted" />
            Sending email...
          </>
        ) : (
          "Reset password"
        )}
      </FancyButton.Root>

      <div className="flex flex-col items-center gap-1 text-center text-paragraph-sm text-text-sub-600">
        Don&apos;t have access anymore?
        <LinkButton.Root asChild size="medium" underline variant="black">
          <Link href={`mailto:${PROJECT.HELP_EMAIL}`}>Contact us</Link>
        </LinkButton.Root>
      </div>
    </form>
  );
}
