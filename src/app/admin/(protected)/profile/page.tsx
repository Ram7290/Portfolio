"use client";

import { ProfileForm } from "@/components/admin/profile-form";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { PageLoading } from "@/components/admin/page-loading";
import { useApiResource } from "@/hooks/use-api-resource";
import { profileApi } from "@/lib/api-client";
import type { Profile } from "@/types/portfolio";

type ProfileRow = Profile & { id: string; imagePublicId?: string | null };

export default function AdminProfilePage() {
  const { data: profile, loading, dbConfigured } = useApiResource<ProfileRow | null>(
    profileApi.get,
    null,
  );

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your public identity — shown across the portfolio."
      />
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <DbBanner configured={dbConfigured} />
          <ProfileForm
            initial={
              profile
                ? {
                    id: profile.id,
                    name: profile.name,
                    role: profile.role,
                    tagline: profile.tagline,
                    bio: Array.isArray(profile.bio) ? profile.bio.join("\n\n") : profile.bio,
                    location: profile.location,
                    email: profile.email,
                    available: profile.available,
                    availabilityLabel: profile.availabilityLabel,
                    imageUrl: profile.imageUrl,
                    imagePublicId: profile.imagePublicId ?? null,
                    stats: profile.stats ?? [],
                  }
                : null
            }
          />
        </>
      )}
    </>
  );
}
