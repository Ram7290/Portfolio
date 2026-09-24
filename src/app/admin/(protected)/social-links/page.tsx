"use client";

import type { SocialLinkRow } from "@/components/admin/social-link-fields";
import { SocialLinksManager } from "@/components/admin/social-links-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { PageLoading } from "@/components/admin/page-loading";
import { useApiResource } from "@/hooks/use-api-resource";
import { settingsApi } from "@/lib/api-client";

export default function AdminSocialLinksPage() {
  const { data, loading, dbConfigured, reload } = useApiResource<SocialLinkRow[]>(
    settingsApi.socialLinks.list,
    [],
  );

  return (
    <>
      <PageHeader
        title="Social Links"
        description="GitHub, LinkedIn, email, and other professional profiles."
      />
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <DbBanner configured={dbConfigured} />
          <SocialLinksManager initial={data} dbConfigured={dbConfigured} onChanged={reload} />
        </>
      )}
    </>
  );
}
