import { isDbConfigured, withDb } from "@/lib/mongodb";
import { ProfileModel } from "@/models";
import { ProfileForm } from "@/components/admin/profile-form";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const dbOk = isDbConfigured();
  const doc = await withDb(() => ProfileModel.findOne().lean());

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your public identity — shown across the portfolio."
      />
      <DbBanner configured={dbOk} />
      <ProfileForm
        initial={
          doc
            ? {
                id: doc._id.toString(),
                name: doc.name,
                role: doc.role,
                tagline: doc.tagline,
                bio: doc.bio.join("\n\n"),
                location: doc.location,
                email: doc.email,
                available: doc.available,
                availabilityLabel: doc.availabilityLabel,
                imageUrl: doc.imageUrl,
                imagePublicId: null,
                stats: doc.stats.map((s) => ({ value: s.value, label: s.label })),
              }
            : null
        }
      />
    </>
  );
}
