import { redirect } from "next/navigation";

import { PAGES } from "@/constants/pages";
import { getServerSession } from "@/lib/auth/utils";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (session) {
    redirect(PAGES.DASHBOARD);
  }

  return (
    <div className="items-cente flex min-h-screen flex-col ">
      <div className="relative isolate flex w-full flex-1 flex-col items-center justify-center">
        <img
          alt=""
          className="-z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 w-full max-w-[1140px] object-contain"
          height="318"
          src="/images/auth-pattern.svg"
          width="824"
        />
        {children}
      </div>
    </div>
  );
}
