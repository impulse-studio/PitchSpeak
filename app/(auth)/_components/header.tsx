"use client";

import Link from "next/link";

import * as Button from "@/components/ui/button";
import { PAGES } from "@/constants/pages";
import { authClient } from "@/lib/auth/client";
import { HeaderDropdown } from "./header-dropdown";

export default function Header() {
  const session = authClient.useSession();

  return (
    <div className="fixed top-6 left-6 right-6 z-40 flex justify-center">
      <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-3xl border border-white/[0.08] rounded-full px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:pointer-events-none relative overflow-hidden max-w-4xl w-full">
        <div className="flex items-center gap-8 relative z-10">
          <div className="flex items-center gap-2">
            <img
              src={"/sphere.svg"}
              alt="PitchSpeak logo"
              className="w-10 h-10 brightness-0 invert"
            />
            <span className="text-white/90 font-medium tracking-tight text-sm">
              PitchSpeak
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-white/70 hover:text-white/90 text-sm font-medium tracking-tight transition-colors duration-200"
            >
              Home
            </Link>
            {session.data?.user && (
              <Link
                href="/summary"
                className="text-white/70 hover:text-white/90 text-sm font-medium tracking-tight transition-colors duration-200"
              >
                Summary
              </Link>
            )}
          </div>

          <div className="ml-auto">
            {session.isPending ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            ) : session.data?.user ? (
              <HeaderDropdown user={session.data.user} />
            ) : (
              <div className="flex items-center gap-2">
                <Button.Root
                  asChild
                  className="hidden sm:inline-flex"
                  mode="ghost"
                  size="small"
                  variant="neutral"
                >
                  <Link href={PAGES.SIGN_IN}>Sign in</Link>
                </Button.Root>
                <Button.Root
                  asChild
                  mode="filled"
                  size="small"
                  variant="primary"
                  className="rounded-full"
                >
                  <Link href={PAGES.SIGN_UP}>Create an account</Link>
                </Button.Root>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
