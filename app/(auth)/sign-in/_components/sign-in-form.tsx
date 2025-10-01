"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as LabelPrimitive from "@radix-ui/react-label";
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiMailLine,
  RiUserFill,
  RiGithubFill,
} from "@remixicon/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PasswordInput } from "@/app/(auth)/_components/password-input";
import { StaggeredFadeLoader } from "@/components/common/staggered-fade-loader";
import * as Checkbox from "@/components/ui/checkbox";
import * as Divider from "@/components/ui/divider";
import * as FancyButton from "@/components/ui/fancy-button";
import { FormGlobalMessage, FormMessage } from "@/components/ui/form";
import * as Input from "@/components/ui/input";
import * as Label from "@/components/ui/label";
import * as LinkButton from "@/components/ui/link-button";
import * as SocialButton from "@/components/ui/social-button";
import { AUTH_ERRORS } from "@/constants/auth-errors";
import { PAGES } from "@/constants/pages";
import { PROJECT } from "@/constants/project";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils/cn";

import sendVerificationOtp from "../../_lib/send-verification-otp";
import { messageParsers } from "../search-params";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

export function SignInForm() {
  const router = useRouter();
  const [{ message, error: errorQuery, callbackUrl }] =
    useQueryStates(messageParsers);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(errorQuery);

  const { register, handleSubmit, formState, setValue } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    setError(null);
    setIsLoading(true);

    authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: PAGES.LANDING_PAGE,
        rememberMe: values.rememberMe,
      },
      {
        onError: (ctx) => {
          if (ctx.error.code === AUTH_ERRORS.EMAIL_NOT_VERIFIED) {
            sendVerificationOtp(values.email)
              .then((redirectUrl) => {
                router.push(redirectUrl);
              })
              .catch((error) => {
                setError(error as string);
              })
              .finally(() => {
                setIsLoading(false);
              });
          } else if (ctx.error.code === AUTH_ERRORS.INVALID_EMAIL_OR_PASSWORD) {
            setIsLoading(false);
            setError("Invalid email or password.");
          } else {
            setIsLoading(false);
            setError(ctx.error.message);
          }
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[472px] px-4"
    >
      <section className="relative flex w-full flex-col gap-6 rounded-20 bg-gradient-to-br from-black/[0.60] via-slate-900/[0.70] to-slate-800/[0.80] backdrop-blur-2xl p-5 shadow-[0_32px_64px_rgba(0,0,0,0.6),0_8px_16px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.15] ring-inset md:p-8 before:absolute before:inset-0 before:rounded-20 before:bg-gradient-to-br before:from-white/[0.08] before:via-white/[0.04] before:to-transparent before:pointer-events-none overflow-hidden after:absolute after:inset-0 after:rounded-20 after:bg-gradient-to-t after:from-black/[0.20] after:to-transparent after:pointer-events-none">
        <form
          className="relative z-10 flex w-full flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl lg:size-24",
                "before:absolute before:inset-0 before:rounded-full",
                "before:bg-gradient-to-b before:from-primary-base/20 before:to-primary-dark/5 before:opacity-100"
              )}
            >
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-white/[0.15] to-white/[0.05] shadow-[0_8px_16px_rgba(0,0,0,0.3)] ring-1 ring-white/[0.15] ring-inset lg:size-16 backdrop-blur-sm">
                <RiUserFill className="size-6 text-text-sub-600 lg:size-8" />
              </div>
            </div>

            <div className="space-y-1 text-center">
              <div className="text-title-h6 lg:text-title-h5 text-white font-semibold">
                Sign in to your account
              </div>
              <div className="text-paragraph-sm text-white/70 lg:text-paragraph-md">
                Enter your email and password to access your account.
              </div>
            </div>
          </div>

          <SocialButton.Root
            brand="github"
            className="w-full"
            mode="stroke"
            onClick={() =>
              authClient.signIn.social({
                provider: "github",
                callbackURL: callbackUrl || PAGES.LANDING_PAGE,
              })
            }
          >
            <SocialButton.Icon as={RiGithubFill} />
            Continue with GitHub
          </SocialButton.Root>

          <Divider.Root variant="line-text">OR</Divider.Root>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Label.Root htmlFor="email">
                Email <Label.Asterisk />
              </Label.Root>
              <Input.Root hasError={!!formState.errors.email}>
                <Input.Wrapper>
                  <Input.Icon as={RiMailLine} />
                  <Input.Input
                    {...register("email")}
                    autoComplete="email webauthn"
                    id="email"
                    placeholder={`hello@${PROJECT.DOMAIN}`}
                    required
                    type="email"
                  />
                </Input.Wrapper>
              </Input.Root>
              <FormMessage>{formState.errors.email?.message}</FormMessage>
            </div>

            <div className="flex flex-col gap-1">
              <Label.Root htmlFor="password">
                Password <Label.Asterisk />
              </Label.Root>
              <PasswordInput
                {...register("password")}
                autoComplete="current-password webauthn"
                hasError={!!formState.errors.password}
                id="password"
                required
              />
              <FormMessage>{formState.errors.password?.message}</FormMessage>
            </div>
          </div>

          <div>
            <FormGlobalMessage Icon={RiErrorWarningFill} variant="error">
              {error}
            </FormGlobalMessage>

            {message && !error && (
              <FormGlobalMessage Icon={RiCheckboxCircleFill} variant="success">
                {message}
              </FormGlobalMessage>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-2">
              <Checkbox.Root
                id="agree"
                onCheckedChange={(value) => {
                  setValue("rememberMe", !!value);
                }}
                {...register("rememberMe")}
              />
              <LabelPrimitive.Root
                className="block cursor-pointer text-paragraph-sm"
                htmlFor="agree"
              >
                Remember me
              </LabelPrimitive.Root>
            </div>
            <LinkButton.Root asChild size="medium" underline variant="gray">
              <Link href={PAGES.FORGOT_PASSWORD}>Forgot password?</Link>
            </LinkButton.Root>
          </div>

          <div>
            <FancyButton.Root
              disabled={isLoading}
              size="medium"
              variant="primary"
              className="w-full"
            >
              {isLoading && <StaggeredFadeLoader variant="muted" />}
              {isLoading ? "Signing in..." : "Sign in"}
            </FancyButton.Root>
          </div>
        </form>

        <div className="relative z-10 flex flex-col items-center gap-2 pt-4 border-t border-white/[0.1]">
          <p className="text-paragraph-sm text-white/70 text-center">
            Don't have an account?
          </p>
          <LinkButton.Root asChild size="medium" underline variant="primary">
            <Link href={PAGES.SIGN_UP}>Sign up</Link>
          </LinkButton.Root>
        </div>
      </section>
    </motion.div>
  );
}
