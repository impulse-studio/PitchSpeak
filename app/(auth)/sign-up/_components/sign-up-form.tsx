"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  RiErrorWarningFill,
  RiGithubFill,
  RiInformationFill,
  RiMailLine,
  RiUserAddFill,
  RiUserLine,
} from "@remixicon/react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { PasswordInput } from "@/app/(auth)/_components/password-input";
import { StaggeredFadeLoader } from "@/components/common/staggered-fade-loader";
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
import { signUpSchema } from "@/validators/auth";
import { signUpParsers } from "../search-params";

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [{ signUpEmail, callbackUrl }] = useQueryStates(signUpParsers);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: signUpEmail,
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    setError(null);
    setIsLoading(true);

    authClient.signUp.email(
      {
        name: values.fullName,
        email: values.email,
        password: values.password,
      },
      {
        onError: (ctx) => {
          switch (ctx.error.code) {
            case AUTH_ERRORS.USER_ALREADY_EXISTS:
              setError("A user with this email already exists.");
              break;
            default:
              setError(
                ctx.error.message || "An error occurred during sign up."
              );
          }
          setIsLoading(false);
        },
        onSuccess: () => {
          router.push(`${PAGES.VERIFICATION}?email=${values.email}`);
        },
      }
    );
  }
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
                <RiUserAddFill className="size-6 text-text-sub-600 lg:size-8" />
              </div>
            </div>

            <div className="space-y-1 text-center">
              <div className="text-title-h6 lg:text-title-h5 text-white font-semibold">
                Create your account
              </div>
              <div className="text-paragraph-sm text-white/70 lg:text-paragraph-md">
                Enter your details to sign up.
              </div>
            </div>
          </div>

          <SocialButton.Root
            brand="github"
            className="w-full"
            mode="stroke"
            type="button"
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
              <Label.Root htmlFor="fullname">
                Full name <Label.Asterisk />
              </Label.Root>
              <Input.Root hasError={!!formState.errors.fullName}>
                <Input.Wrapper>
                  <Input.Icon as={RiUserLine} />
                  <Input.Input
                    id="fullname"
                    placeholder="James Brown"
                    required
                    type="text"
                    {...register("fullName")}
                  />
                </Input.Wrapper>
              </Input.Root>
              <FormMessage>{formState.errors.fullName?.message}</FormMessage>
            </div>

            <div className="flex flex-col gap-1">
              <Label.Root htmlFor="email">
                Email <Label.Asterisk />
              </Label.Root>
              <Input.Root hasError={!!formState.errors.email}>
                <Input.Wrapper>
                  <Input.Icon as={RiMailLine} />
                  <Input.Input
                    disabled={!!signUpEmail}
                    id="email"
                    placeholder={`hello@${PROJECT.DOMAIN}`}
                    required
                    type="email"
                    {...register("email")}
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
                hasError={!!formState.errors.password}
                id="password"
                required
                {...register("password")}
              />
              {formState.errors.password ? (
                <FormMessage>{formState.errors.password.message}</FormMessage>
              ) : (
                <div className="flex gap-1 text-paragraph-xs text-white/60">
                  <RiInformationFill className="size-4 shrink-0 text-white/40" />
                  Password must be at least 8 characters long and contain a
                  number.
                </div>
              )}
            </div>
          </div>

          <div>
            <FormGlobalMessage Icon={RiErrorWarningFill} variant="error">
              {error}
            </FormGlobalMessage>
          </div>

          <div>
            <FancyButton.Root
              disabled={isLoading}
              size="medium"
              variant="primary"
              className="w-full"
            >
              {isLoading && <StaggeredFadeLoader variant="muted" />}
              {isLoading ? "Registering..." : "Register"}
            </FancyButton.Root>
          </div>
        </form>

        <div className="relative z-10 flex flex-col items-center gap-2 pt-4 border-t border-white/[0.1]">
          <p className="text-paragraph-sm text-white/70 text-center">
            By signing up, you agree to our terms of service.
          </p>
          <LinkButton.Root asChild size="medium" underline variant="primary">
            <Link href="/terms-of-service">Terms of Service</Link>
          </LinkButton.Root>
        </div>
      </section>
    </motion.div>
  );
}
