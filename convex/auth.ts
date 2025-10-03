import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins/email-otp";
import { api, components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";

export function getBaseUrl() {
  if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERCEL_BRANCH_URL}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
    ctx: GenericCtx<DataModel>,
        { optionsOnly } = { optionsOnly: false },
    ) => {
      return betterAuth({
        logger: {
            disabled: optionsOnly,
        },
        baseURL: getBaseUrl(),
        trustedOrigins: [getBaseUrl()],
        database: authComponent.adapter(ctx),
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
        socialProviders: {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            mapProfileToUser: (profile) => {
              return {
                name: profile.name,
                email: profile.email,
                image: profile.avatar_url,
                emailVerified: true,
              };
            },
          },
        },
        plugins: [
            convex(),
            emailOTP({
              overrideDefaultEmailVerification: true,
              async sendVerificationOTP({ email, otp }) {
                await requireActionCtx(ctx).runAction(api.email.sendOTPVerification, {
                  to: email,
                  code: otp,
                });
              },
            }),
        ],
    });
};

export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        try {
            return await authComponent.getAuthUser(ctx);
        } catch (error) {
            // Return null if user is not authenticated instead of throwing
            return null;
        }
    },
});