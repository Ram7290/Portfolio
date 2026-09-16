import Link from "next/link";
import { Mail } from "lucide-react";

import {
  GitHubIcon,
  LinkedInIcon,
} from "@/components/public/brand-icons";
import { siteConfig } from "@/lib/data";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <Link
              href="/"
              className="font-semibold tracking-tight hover:text-primary transition-colors"
            >
              {siteConfig.name}
            </Link>
            <p className="text-sm text-muted-foreground">{siteConfig.role}</p>
          </div>

          <ul className="flex items-center gap-2" aria-label="Social links">
            <li>
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <GitHubIcon className="size-4" />
              </a>
            </li>
            <li>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LinkedInIcon className="size-4" />
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Send an email"
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Mail className="size-4" />
              </a>
            </li>
          </ul>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
