import { render } from "@react-email/components";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins/email-otp";
import { PROJECT } from "@/constants/project";
import VerifyEmailTemplate from "@/emails/verify-email";
import { env } from "@/env";
import { resend } from "@/lib/utils/email/resend";

export function getBaseUrl() {
  if (env.VERCEL_ENV === "preview") {
    return `https://${env.VERCEL_BRANCH_URL}`;
  }
  if (env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

function getProtocol() {
  return env.NODE_ENV === "development" ? "http" : "https";
}

export const auth = betterAuth({
  baseURL: getBaseUrl(),
  trustedOrigins: [getBaseUrl()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
  },
  telemetry: {
    enabled: false,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp }, request) {
        const host = request?.headers.get("host") ?? "localhost:3000";
        const protocol = getProtocol();
        const verificationUrl = `${protocol}://${host}/verification?otp=${otp}&email=${email}`;

        const html = await render(
          VerifyEmailTemplate({
            otp,
            host,
            verificationUrl,
          })
        );

        await resend.emails.send({
          from: env.RESEND_FROM_EMAIL,
          to: email,
          subject: `Your verification code for ${PROJECT.NAME}`,
          html,
        });
      },
    }),
    nextCookies(),
  ],
});
