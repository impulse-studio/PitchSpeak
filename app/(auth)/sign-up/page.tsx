import type { Metadata } from "next";
import type { SearchParams } from "nuqs";

import { SignUpForm } from "./_components/sign-up-form";
import { signUpSearchParams } from "./search-params";

export const metadata: Metadata = {
  title: "Register",
};

interface PageRegisterProps {
  searchParams: Promise<SearchParams>;
}

export default async function PageRegister({
  searchParams,
}: PageRegisterProps) {
  await signUpSearchParams.parse(searchParams);

  return <SignUpForm />;
}
