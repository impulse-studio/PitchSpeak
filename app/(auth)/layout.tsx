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
        {children}
      </div>
    </div>
  );
}
