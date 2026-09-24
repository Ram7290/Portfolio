import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/public/contact-form";
import { SectionHeading } from "@/components/public/motion";
import {
  GitHubIcon,
  LinkedInIcon,
} from "@/components/public/brand-icons";
import { serverApi } from "@/lib/api-server";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const config = await serverApi.siteConfig();
  const email = config.email;
  const github = config.social.github;
  const linkedin = config.social.linkedin;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something together"
        description="Have a project in mind, a role to fill, or just a question? My inbox is open."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <Card className="border-border/60 bg-card/50 backdrop-blur">
            <CardContent className="space-y-5 p-6">
              <div>
                <h2 className="font-semibold">Direct</h2>
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="mt-2 flex items-center gap-2.5 text-sm text-primary hover:underline"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    {email}
                  </a>
                ) : null}
              </div>
              <div>
                <h2 className="font-semibold">Elsewhere</h2>
                <ul className="mt-2 flex gap-2" aria-label="Social links">
                  {github ? (
                    <li>
                      <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub profile"
                        className="flex size-9 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <GitHubIcon className="size-4" />
                      </a>
                    </li>
                  ) : null}
                  {linkedin ? (
                    <li>
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn profile"
                        className="flex size-9 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <LinkedInIcon className="size-4" />
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Prefer async? Messages sent through the form land directly in my
                inbox — typically answered within a couple of days.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/60 bg-card/50 backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            <ContactForm />
          </CardContent>
        </Card>
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Looking for my background instead?{" "}
        <Link href="/about" className="text-primary hover:underline">
          Read the about page
        </Link>
        .
      </p>
    </div>
  );
}
