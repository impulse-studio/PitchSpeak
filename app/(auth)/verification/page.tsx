import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";

import { PAGES } from "@/constants/pages";

import { VerificationForm } from "./_components/verification-form";
import { searchParamsCache } from "./search-params";

export const metadata: Metadata = {
  title: "Verify your email",
};

type VerificationPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function PageVerification({
  searchParams,
}: VerificationPageProps) {
  const { email } = await searchParamsCache.parse(searchParams);

  if (!email) {
    return redirect(PAGES.SIGN_UP);
  }

  return (
    <div className="w-full max-w-[472px] px-4">
      <VerificationForm />
    </div>
  );
}
