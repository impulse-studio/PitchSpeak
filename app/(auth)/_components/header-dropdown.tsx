"use client";

import type { User } from "better-auth";
import { LogOut } from "lucide-react";
import { useCallback } from "react";
import * as Avatar from "@/components/ui/avatar";
import * as DropdownMenu from "@/components/ui/dropdown";
import { authClient } from "@/lib/auth/client";

export function HeaderDropdown({ user }: { user: User }) {
  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const handleSignOut = useCallback(async () => {
    await authClient.signOut();
  }, []);

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Avatar.Root
          className="cursor-pointer bg-white/10 text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
          size="32"
        >
          {user.image ? (
            <Avatar.Image src={user.image} />
          ) : (
            getInitials(user.name)
          )}
        </Avatar.Root>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="end"
        className="w-64 bg-gradient-to-br from-black/[0.6] to-black/[0.4] backdrop-blur-3xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/[0.05] before:to-transparent before:pointer-events-none relative overflow-hidden"
      >
        <DropdownMenu.Label className="relative z-10">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none text-white/90">
              {user.name}
            </p>
            <p className="text-sm text-white/60 leading-none">{user.email}</p>
          </div>
        </DropdownMenu.Label>

        <DropdownMenu.Separator className="bg-white/[0.08] relative z-10" />

        <DropdownMenu.Item
          onSelect={handleSignOut}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 relative z-10"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
