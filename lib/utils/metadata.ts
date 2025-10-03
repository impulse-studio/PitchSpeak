import { getBaseUrl } from "@/lib/utils/get-base-url";
import type { Metadata } from "next";

interface CreateMetadataOptions {
  title?: string;
  description?: string;
  url?: string;
  og?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

export function createMetadata(options: CreateMetadataOptions = {}): Metadata {
  const baseUrl = getBaseUrl();

  return {
    title: {
      default:
        options.title ??
        "PitchSpeak | AI-Powered Project Estimations in Minutes",
      template: "%s | PitchSpeak",
    },
    description:
      options.description ??
      "Get instant, accurate project estimations through natural conversation. PitchSpeak uses AI to analyze your project requirements and deliver detailed cost, timeline, and complexity estimates.",
    keywords: [
      "project estimation",
      "AI project estimation",
      "cost estimation",
      "project planning",
      "software development estimation",
      "consulting estimation",
      "AI-powered estimation",
      "project cost calculator",
      "timeline estimation",
      "complexity analysis",
      "AI assistant",
      "project scoping",
      "development cost estimation",
      "budget planning",
      "PitchSpeak",
    ],
    authors: [{ name: "PitchSpeak Team" }],
    creator: "PitchSpeak",
    publisher: "PitchSpeak",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `${baseUrl}${options.url ?? ""}`,
      title:
        options.og?.title ?? "PitchSpeak - AI-Powered Project Estimations",
      description:
        options.og?.description ??
        "Get instant, accurate project estimations through natural conversation with AI.",
      images: [
        {
          url: `${baseUrl}${options.og?.image ?? "/og-image.png"}`,
          width: 1200,
          height: 630,
          alt: "PitchSpeak - AI-Powered Project Estimations",
        },
      ],
      siteName: "PitchSpeak",
    },
    twitter: {
      card: "summary_large_image",
      title:
        options.og?.title ?? "PitchSpeak - AI-Powered Project Estimations",
      description:
        options.og?.description ??
        "Get instant, accurate project estimations through natural conversation with AI.",
      images: [`${baseUrl}${options.og?.image ?? "/og-image.png"}`],
    },
    alternates: {
      canonical: `${baseUrl}${options.url ?? ""}`,
    },
    other: {
      "theme-color": "#3b82f6",
      "msapplication-TileColor": "#3b82f6",
    },
  };
}
