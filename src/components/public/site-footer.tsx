import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { Globe, Mail } from "lucide-react";

import {
  GitHubIcon,
  LinkedInIcon,
  XSocialIcon,
} from "@/components/public/brand-icons";
import { siteConfig as fallbackSiteConfig, type SiteConfig } from "@/lib/data";
import type { SocialLinkItem } from "@/types/portfolio";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const PLATFORM_ICONS: Record<string, IconComponent> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  x: XSocialIcon,
  twitter: XSocialIcon,
  email: Mail,
  mail: Mail,
};

export function SiteFooter({
  config = fallbackSiteConfig,
  socialLinks = [],
}: {
  config?: SiteConfig;
  socialLinks?: SocialLinkItem[];
}) {
  const year = new Date().getFullYear();

  // Keep the mail icon even when the admin hasn't added an Email social link.
  const links = socialLinks.some((l) => l.url.startsWith("mailto:"))
    ? socialLinks
    : [
        ...socialLinks,
        ...(config.email
          ? [
              {
                platform: "Email",
                url: `mailto:${config.email}`,
                order: socialLinks.length + 1,
                active: true,
              },
            ]
          : []),
      ];

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <Link
              href="/"
              className="font-semibold tracking-tight hover:text-primary transition-colors"
            >
              {config.name}
            </Link>
            <p className="text-sm text-muted-foreground">{config.role}</p>
          </div>

          <ul className="flex items-center gap-2" aria-label="Social links">
            {links.map((link) => {
              const Icon = PLATFORM_ICONS[link.platform.toLowerCase()] ?? Globe;
              const isMail = link.url.startsWith("mailto:");
              return (
                <li key={`${link.platform}-${link.url}`}>
                  <a
                    href={link.url}
                    target={isMail ? undefined : "_blank"}
                    rel={isMail ? undefined : "noopener noreferrer"}
                    aria-label={
                      isMail ? "Send an email" : `${link.platform} profile`
                    }
                    className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          {config.footerText ||
            `© ${year} ${config.name}. All rights reserved.`}
        </p>
      </div>
    </footer>
  );
}
