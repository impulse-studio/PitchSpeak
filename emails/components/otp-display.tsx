import { Section, Text } from "@react-email/components";

interface OtpDisplayProps {
  otp: string;
}

export function OtpDisplay({ otp }: OtpDisplayProps) {
  return (
    <Section className="mx-auto w-full rounded-md bg-[#323336] text-center">
      <Text className="font-mono text-lg text-white leading-5 tracking-[10px] md:text-xl">
        {otp}
      </Text>
    </Section>
  );
}
