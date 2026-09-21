import type { ReactNode } from "react";

import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getSiteConfig, getSocialLinks } from "@/lib/content";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const [config, socialLinks] = await Promise.all([
    getSiteConfig(),
    getSocialLinks(),
  ]);

  return (
    <>
      <SiteHeader config={config} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter config={config} socialLinks={socialLinks} />
    </>
  );
}
