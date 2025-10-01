import { PROJECT } from "@/constants/project";

import { Logomark } from "./common/logomark";
import { Card } from "./components/card";
import { EmailButton } from "./components/emailButton";
import { EmailLayout } from "./components/emailLayout";
import { EmailFooter, EmailHeading, EmailText } from "./components/emailText";
import { OtpDisplay } from "./components/otpDisplay";

interface VerifyEmailTemplateProps {
  otp: string;
  host: string;
  verificationUrl: string;
  name?: string;
}

export default function VerifyEmailTemplate({
  otp,
  host,
  verificationUrl,
  name,
}: VerifyEmailTemplateProps) {
  return (
    <EmailLayout previewText={`Your verification code for ${host}`}>
      <div className="mb-6 flex w-full items-center justify-center">
        <Logomark className="h-8 text-white" />
      </div>

      <Card>
        <EmailHeading>{name ? `Hi ${name},` : "Hi there,"}</EmailHeading>

        <EmailText>
          {"Please use the following code to verify your email address:"}
        </EmailText>

        <OtpDisplay otp={otp} />

        <EmailButton href={verificationUrl}>{"Verify Email"}</EmailButton>

        <EmailText>
          {"If you didn't request this code, you can safely ignore this email."}
        </EmailText>

        <EmailText>
          {"Thanks,"}
          <br />
          {`The ${PROJECT.NAME} Team`}
        </EmailText>
      </Card>

      <EmailFooter />
    </EmailLayout>
  );
}

VerifyEmailTemplate.PreviewProps = {
  otp: "123456",
  host: PROJECT.DOMAIN,
  verificationUrl: `https://${PROJECT.DOMAIN}/verification?otp=123456&email=test@test.com`,
  name: "Leonard",
} as VerifyEmailTemplateProps;
