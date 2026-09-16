import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Providers } from "@/components/providers";
import { siteConfig } from "@/lib/data";
import { getSiteSettings } from "@/lib/settings";

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
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: settings.siteTitle || `${siteConfig.name} — ${siteConfig.role}`,
      template: `%s — ${siteConfig.name}`,
    },
    description: settings.metaDescription || siteConfig.tagline,
    keywords: settings.seoKeywords.length
      ? settings.seoKeywords
      : [
          "Ramduth Rajesh",
          "Full Stack Developer",
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
      title: settings.siteTitle || `${siteConfig.name} — ${siteConfig.role}`,
      description: settings.metaDescription || siteConfig.tagline,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle || `${siteConfig.name} — ${siteConfig.role}`,
      description: settings.metaDescription || siteConfig.tagline,
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
