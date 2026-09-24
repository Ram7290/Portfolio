"use client";

import { useEffect, useState } from "react";
import { SettingsForm } from "@/components/admin/settings-form";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { settingsApi } from "@/lib/api-client";

interface SettingsData {
  siteTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  footerText: string;
  seoKeywords: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    siteTitle: "",
    metaDescription: "",
    heroHeading: "",
    heroSubheading: "",
    footerText: "",
    seoKeywords: "",
  });
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const result = await settingsApi.getSiteSettings();
        if (result.ok) {
          const data = result.data;
          setSettings({
            siteTitle: data.siteTitle ?? "",
            metaDescription: data.metaDescription ?? "",
            heroHeading: data.heroHeading ?? "",
            heroSubheading: data.heroSubheading ?? "",
            footerText: data.footerText ?? "",
            seoKeywords: (data.seoKeywords ?? []).join(", "),
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        setDbConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Settings"
          description="Site title, SEO metadata, hero content, and footer text."
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
        title="Settings"
        description="Site title, SEO metadata, hero content, and footer text."
      />
      <DbBanner configured={dbConfigured} />
      <SettingsForm initial={settings} />
    </>
  );
}
