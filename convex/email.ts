import "./polyfills";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { render } from "@react-email/components";
import VerifyEmailTemplate from "./emails/verifyEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPVerification = action({
  args: {
    to: v.string(),
    code: v.string(),
  },
  handler: async (ctx, { to, code }) => {
    const verificationUrl = `${process.env.NODE_ENV === "development" ? "http" : "https"}://localhost:3000/verification?otp=${code}&email=${to}`;
    const html = await render(
      VerifyEmailTemplate({
        otp: code,
        host: process.env.NODE_ENV === "development" ? "localhost:3000" : "pitchspeak.com",
        verificationUrl,
        name: undefined,
      })
    );

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject: "Your verification code for PitchSpeak",
      html,
    });
  },
});