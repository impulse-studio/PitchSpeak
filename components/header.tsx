"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import { PROJECT } from "@/constants/project";

import { Logo } from "./logo";

const ThemeSwitchWrapper = () => {
  const DynamicThemeSwitch = dynamic(() => import("./theme-switch"), {
    ssr: false,
  });
  return <DynamicThemeSwitch />;
};

export default function Header() {
  return (
    <div className="border-stroke-soft-200 border-b">
      <header className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link
          className="flex items-center gap-2 font-mono text-label-md text-text-strong-950"
          href="/"
        >
          <Logo className="size-7" />
          {PROJECT.NAME}
        </Link>
        <ThemeSwitchWrapper />
      </header>
    </div>
  );
}
