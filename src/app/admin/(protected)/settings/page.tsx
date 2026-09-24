"use client";

import { SettingsForm } from "@/components/admin/settings-form";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { PageLoading } from "@/components/admin/page-loading";
import { useApiResource } from "@/hooks/use-api-resource";
import { settingsApi, type SiteSettingsInput } from "@/lib/api-client";

export default function AdminSettingsPage() {
  const { data, loading, dbConfigured } = useApiResource<Partial<SiteSettingsInput> | null>(
    settingsApi.site.get,
    null,
  );

  return (
    <>
      <PageHeader
        title="Settings"
        description="Site title, SEO metadata, hero content, and footer text."
      />
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <DbBanner configured={dbConfigured} />
          <SettingsForm
            initial={{
              siteTitle: data?.siteTitle ?? "",
              metaDescription: data?.metaDescription ?? "",
              heroHeading: data?.heroHeading ?? "",
              heroSubheading: data?.heroSubheading ?? "",
              footerText: data?.footerText ?? "",
              seoKeywords: (data?.seoKeywords ?? []).join(", "),
            }}
          />
        </>
      )}
    </>
  );
}
