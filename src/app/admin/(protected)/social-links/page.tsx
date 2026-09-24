"use client";

import { useEffect, useState } from "react";
import type { SocialLinkRow } from "@/components/admin/social-link-fields";
import { SocialLinksManager } from "@/components/admin/social-links-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { settingsApi } from "@/lib/api-client";

export default function AdminSocialLinksPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const result = await settingsApi.getSocialLinks();
        if (result.ok) {
          setSocialLinks(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch social links:', error);
        setDbConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Social Links"
          description="GitHub, LinkedIn, email, and other professional profiles."
        />
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Social Links"
        description="GitHub, LinkedIn, email, and other professional profiles."
      />
      <DbBanner configured={dbConfigured} />
      <SocialLinksManager
        initial={socialLinks}
        dbConfigured={dbConfigured}
      />
    </>
  );
}
