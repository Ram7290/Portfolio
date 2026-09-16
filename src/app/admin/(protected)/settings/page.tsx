import { isDbConfigured, withDb } from "@/lib/mongodb";
import { SiteSettingsModel } from "@/models";
import { SettingsForm } from "@/components/admin/settings-form";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const dbOk = isDbConfigured();
  const settings = await withDb(() => SiteSettingsModel.findOne().lean());

  return (
    <>
      <PageHeader
        title="Settings"
        description="Site title, SEO metadata, hero content, and footer text."
      />
      <DbBanner configured={dbOk} />
      <SettingsForm
        initial={{
          siteTitle: settings?.siteTitle ?? "",
          metaDescription: settings?.metaDescription ?? "",
          heroHeading: settings?.heroHeading ?? "",
          heroSubheading: settings?.heroSubheading ?? "",
          footerText: settings?.footerText ?? "",
          seoKeywords: (settings?.seoKeywords ?? []).join(", "),
        }}
      />
    </>
  );
}
