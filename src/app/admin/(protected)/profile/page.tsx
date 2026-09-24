"use client";

import { useEffect, useState } from "react";
import { ProfileForm } from "@/components/admin/profile-form";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { profileApi } from "@/lib/api-client";
import type { Profile } from "@/types";

export default function AdminProfilePage() {
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(true); // Assume configured, API will fail if not

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await profileApi.get();
        if (result.ok) {
          setProfileData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setDbConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Profile"
          description="Your public identity — shown across the portfolio."
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
        title="Profile"
        description="Your public identity — shown across the portfolio."
      />
      <DbBanner configured={dbConfigured} />
      <ProfileForm
        initial={
          profileData
            ? {
                id: profileData.id,
                name: profileData.name,
                role: profileData.role,
                tagline: profileData.tagline,
                bio: Array.isArray(profileData.bio) ? profileData.bio.join("\n\n") : profileData.bio,
                location: profileData.location,
                email: profileData.email,
                available: profileData.available,
                availabilityLabel: profileData.availabilityLabel,
                imageUrl: profileData.imageUrl,
                imagePublicId: null,
                stats: profileData.stats || [],
              }
            : null
        }
      />
    </>
  );
}
