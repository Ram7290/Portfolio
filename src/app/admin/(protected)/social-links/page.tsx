import { isDbConfigured, withDb } from "@/lib/mongodb";
import { SocialLinkModel } from "@/models";
import { serializeRows } from "@/lib/admin-utils";
import type { SocialLinkRow } from "@/components/admin/social-link-fields";
import { SocialLinksManager } from "@/components/admin/social-links-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminSocialLinksPage() {
  const dbOk = isDbConfigured();
  const docs = await withDb(() => SocialLinkModel.find().sort({ order: 1 }).lean());

  return (
    <>
      <PageHeader
        title="Social Links"
        description="GitHub, LinkedIn, email, and other professional profiles."
      />
      <DbBanner configured={dbOk} />
      <SocialLinksManager
        initial={docs ? serializeRows<SocialLinkRow>(docs) : []}
        dbConfigured={dbOk}
      />
    </>
  );
}
