"use client";

import { RiLogoutBoxLine } from "@remixicon/react";

import * as Button from "@/components/ui/button";
import { signOut } from "@/server/actions/sign-out";

export function LogoutButton() {
  return (
    <Button.Root onClick={() => signOut()} type="submit">
      <Button.Icon as={RiLogoutBoxLine} />
      Logout
    </Button.Root>
  );
}
