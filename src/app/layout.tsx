import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "@/components/providers";
import { getSiteSettings } from "@/lib/settings";
import { getProfile, getSiteConfig } from "@/lib/content";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [settings, profile, siteConfig] = await Promise.all([
    getSiteSettings(),
    getProfile(),
    getSiteConfig(),
  ]);
  const title = settings.siteTitle || `${siteConfig.name} — ${siteConfig.role}`;
  const description = settings.metaDescription || siteConfig.tagline;
  const socialImage = profile.imageUrl ?? undefined;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s — ${siteConfig.name}`,
    },
    description,
    keywords: settings.seoKeywords.length
      ? settings.seoKeywords
      : [
          siteConfig.name,
          siteConfig.role,
          "Next.js",
          "TypeScript",
          "React",
          "Node.js",
          "MongoDB",
          "Portfolio",
        ],
    authors: [{ name: siteConfig.name }],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      title,
      description,
      siteName: siteConfig.name,
      images: socialImage ? [socialImage] : undefined,
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0e17" },
    { media: "(prefers-color-scheme: light)", color: "#fbfcfe" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
