import { RiTimeLine } from "@remixicon/react";

import { PROJECT } from "@/constants/project";

import { Logomark } from "./common/logomark";
import { Card } from "./components/card";
import { EmailButton } from "./components/emailButton";
import { EmailLayout } from "./components/emailLayout";
import { EmailFooter, EmailHeading, EmailText } from "./components/emailText";

interface ChangeEmailTemplateProps {
  url: string;
  name?: string;
  newEmail: string;
}

export default function ChangeEmailTemplate({
  url,
  name,
  newEmail,
}: ChangeEmailTemplateProps) {
  return (
    <EmailLayout
      previewText={`Please verify your new email address for your ${PROJECT.NAME} account`}
    >
      <div className="mb-6 flex w-full items-center justify-center">
        <Logomark className="h-8 text-white" />
      </div>

      <Card>
        <EmailHeading>{name ? `Hi ${name},` : "Hi there,"}</EmailHeading>

        <EmailText>
          {
            "We received a request to change the email address associated with your "
          }
          {PROJECT.NAME}
          {" account to: "}
          <strong>{newEmail}</strong>
        </EmailText>

        <EmailText>
          {"To complete this change, please click the button below:"}
        </EmailText>

        <EmailButton href={url}>{"Verify New Email Address"}</EmailButton>

        <EmailText className="text-gray-500 text-sm">
          {
            "If the button doesn't work, copy and paste this link into your browser: "
          }
          <span className="break-all text-blue-500">{url}</span>
        </EmailText>

        <div className="mt-6 flex items-center gap-2">
          <RiTimeLine className="h-5 w-5 flex-shrink-0 text-amber-500" />
          <EmailText className="font-semibold">
            {"This link will expire in 1 hour for security reasons."}
          </EmailText>
        </div>

        <EmailText>
          {
            "If you did not request this email change, please disregard this message or contact our support team immediately if you have any concerns about your account security."
          }
        </EmailText>

        <EmailText className="mt-6">
          {"Thanks,"}
          <br />
          {`The ${PROJECT.NAME} Team`}
        </EmailText>
      </Card>

      <EmailFooter />
    </EmailLayout>
  );
}

ChangeEmailTemplate.PreviewProps = {
  url: "https://example.com/verify-email-change?token=xyz",
  name: "Leonard",
  newEmail: "newemail@example.com",
} as ChangeEmailTemplateProps;
