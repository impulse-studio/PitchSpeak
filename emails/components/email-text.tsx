import { Heading, Link, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { PROJECT } from "@/constants/project";
import { cn } from "@/lib/utils";

interface EmailTextProps {
  children: ReactNode;
  className?: string;
}

export function EmailHeading({ children, className }: EmailTextProps) {
  return (
    <Heading
      className={cn("mt-0 mb-4 font-medium text-white text-xl", className)}
    >
      {children}
    </Heading>
  );
}

export function EmailText({ children, className }: EmailTextProps) {
  return (
    <Text className={cn("my-3 text-sm text-white leading-6", className)}>
      {children}
    </Text>
  );
}

interface EmailFooterProps {
  className?: string;
  twitterLink?: string;
  linkedinLink?: string;
  docsLink?: string;
  privacyLink?: string;
  termsLink?: string;
  children?: ReactNode;
}

export function EmailFooter({
  className,
  twitterLink,
  linkedinLink,
  docsLink,
  privacyLink,
  termsLink,
}: EmailFooterProps) {
  return (
    <Section className="mt-6">
      <div className="mb-4 text-center">
        {twitterLink && (
          <>
            <Link className="mx-2 text-gray-400 text-xs" href={twitterLink}>
              {"Twitter"}
            </Link>
            <Text className="mx-1 inline-block text-gray-400 text-xs">
              {"•"}
            </Text>
          </>
        )}

        {linkedinLink && (
          <>
            <Link className="mx-2 text-gray-400 text-xs" href={linkedinLink}>
              {"LinkedIn"}
            </Link>
            <Text className="mx-1 inline-block text-gray-400 text-xs">
              {"•"}
            </Text>
          </>
        )}

        {docsLink && (
          <>
            <Link className="mx-2 text-gray-400 text-xs" href={docsLink}>
              {"Docs"}
            </Link>
            {(privacyLink || termsLink) && (
              <Text className="mx-1 inline-block text-gray-400 text-xs">
                {"•"}
              </Text>
            )}
          </>
        )}

        {privacyLink && (
          <>
            <Link className="mx-2 text-gray-400 text-xs" href={privacyLink}>
              {"Privacy"}
            </Link>
            {termsLink && (
              <Text className="mx-1 inline-block text-gray-400 text-xs">
                {"•"}
              </Text>
            )}
          </>
        )}

        {termsLink && (
          <Link className="mx-2 text-gray-400 text-xs" href={termsLink}>
            {"Terms"}
          </Link>
        )}
      </div>

      <Text className={cn("text-center text-gray-400 text-xs", className)}>
        {`© ${new Date().getFullYear()} ${PROJECT.COMPANY}`}
      </Text>
    </Section>
  );
}
