import { PROJECT } from "@/constants/project";

import { Logomark } from "./common/logomark";
import { Card } from "./components/card";
import { EmailButton } from "./components/email-button";
import { EmailLayout } from "./components/email-layout";
import { EmailFooter, EmailHeading, EmailText } from "./components/email-text";

interface ResetPasswordTemplateProps {
  name: string;
  url: string;
  host: string;
}

export default function ResetPasswordTemplate({
  name,
  url,
  host,
}: ResetPasswordTemplateProps) {
  return (
    <EmailLayout previewText={`Reset your password for ${host}`}>
      <div className="mb-6 flex w-full items-center justify-center">
        <Logomark className="h-8 text-white" />
      </div>

      <Card>
        <EmailHeading>{name ? `Hi ${name},` : "Hi there,"}</EmailHeading>

        <EmailText>
          {
            "We received a request to reset your password. Click the button below to choose a new password:"
          }
        </EmailText>

        <EmailButton href={url}>{"Reset password"}</EmailButton>

        <EmailText>
          {
            "If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged."
          }
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

ResetPasswordTemplate.PreviewProps = {
  name: "Leonard",
  url: "https://example.com/reset-password?token=xyz",
  host: PROJECT.DOMAIN,
} as ResetPasswordTemplateProps;
