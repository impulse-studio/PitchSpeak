import { env } from "@/env";

export function getBaseUrl() {
  if (env.VERCEL_ENV === "preview") {
    return `https://${env.VERCEL_BRANCH_URL}`;
  }
  if (env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}
