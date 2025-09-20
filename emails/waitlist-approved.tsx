import { PROJECT } from "@/constants/project";

import { Logomark } from "./common/logomark";
import { Card } from "./components/card";
import { EmailButton } from "./components/email-button";
import { EmailLayout } from "./components/email-layout";
import { EmailFooter, EmailHeading, EmailText } from "./components/email-text";

interface WaitlistApprovedTemplateProps {
  signUpUrl: string;
  email?: string;
  discordUrl?: string;
}

export default function WaitlistApprovedTemplate({
  signUpUrl,
  email,
  discordUrl,
}: WaitlistApprovedTemplateProps) {
  return (
    <EmailLayout
      previewText={`Your application to ${PROJECT.NAME} has been approved`}
    >
      <div className="mb-6 flex w-full items-center justify-center">
        <Logomark className="h-8 text-white" />
      </div>

      <Card>
        <EmailHeading>You&apos;re in!</EmailHeading>

        <EmailText>
          Thank you for your interest in <strong>{PROJECT.NAME}</strong>! Your
          application has been approved. Click the button below to register an
          account
          {email && (
            <>
              {" "}
              with your email{" "}
              <a className="text-blue-500" href={`mailto:${email}`}>
                {email}
              </a>
            </>
          )}{" "}
          and start your <strong>{PROJECT.NAME}</strong> experience!
        </EmailText>

        <EmailButton href={signUpUrl}>Try {PROJECT.NAME}</EmailButton>

        <EmailText className="text-gray-500 text-sm">
          Your account will be ready immediately after registration.
        </EmailText>

        {discordUrl && (
          <>
            <EmailText className="mt-8 mb-4">
              We also invite you to join our Discord!
            </EmailText>

            <div className="text-center">
              <a
                className="my-4 inline-block rounded-full border border-blue-500 px-6 py-3 font-medium text-blue-500 no-underline"
                href={discordUrl}
              >
                Join Discord
              </a>
            </div>
          </>
        )}
      </Card>
      <EmailFooter />
    </EmailLayout>
  );
}

WaitlistApprovedTemplate.PreviewProps = {
  signUpUrl: "https://example.com/sign-up",
  email: "leonard@example.com",
} as WaitlistApprovedTemplateProps;
