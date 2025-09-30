import { createAuth } from "../../convex/auth";
import { getToken as getTokenNextjs } from "@convex-dev/better-auth/nextjs";
import { headers } from "next/headers";
import { betterFetch } from "@better-fetch/fetch";

export const getToken = () => {
  return getTokenNextjs(createAuth);
};

export async function getServerSession() {
  try {
    const headersList = await headers();
    const baseURL = process.env.SITE_URL || "http://localhost:3000";

    const { data: session } = await betterFetch("/api/auth/get-session", {
      baseURL,
      headers: {
        cookie: headersList.get("cookie") ?? "",
      },
    });

    return session;
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
}