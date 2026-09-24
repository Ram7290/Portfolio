import { withDb } from "@/lib/mongodb";
import { ProfileModel, SocialLinkModel, SiteSettingsModel } from "@/models";
import { success } from "@/lib/api-utils";
import { siteConfig as fallbackSiteConfig } from "@/lib/data";
import { placeholderSocialLinks } from "@/lib/placeholder-data";

/** GET /api/public/site-config - Get site configuration (profile + social + settings) */
export async function GET() {
  const [profile, links, settings] = await Promise.all([
    withDb(() => ProfileModel.findOne().sort({ updatedAt: -1 }).lean()),
    withDb(() => SocialLinkModel.find({ active: true }).sort({ order: 1 }).lean()),
    withDb(() => SiteSettingsModel.findOne().lean()),
  ]);

  const urlFor = (platform: string) =>
    links?.find((l) => l.platform.toLowerCase() === platform)?.url;

  const name = profile?.name || fallbackSiteConfig.name;
  
  function initialsOf(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    const last = parts.length > 1 ? parts[parts.length - 1] : "";
    return (parts[0][0] + (last[0] ?? "")).toUpperCase();
  }

  const config = {
    ...fallbackSiteConfig,
    name,
    initials: initialsOf(name) || fallbackSiteConfig.initials,
    role: profile?.role || fallbackSiteConfig.role,
    tagline: profile?.tagline || fallbackSiteConfig.tagline,
    email: profile?.email || fallbackSiteConfig.email,
    location: profile?.location || fallbackSiteConfig.location,
    availability: profile
      ? { open: profile.available, label: profile.availabilityLabel }
      : fallbackSiteConfig.availability,
    resumeUrl:
      settings?.resumeEnabled && settings.resumeUrl
        ? settings.resumeUrl
        : fallbackSiteConfig.resumeUrl,
    footerText: settings?.footerText || fallbackSiteConfig.footerText,
    social: {
      github: urlFor("github") || fallbackSiteConfig.social.github,
      linkedin: urlFor("linkedin") || fallbackSiteConfig.social.linkedin,
    },
    socialLinks: links || placeholderSocialLinks.filter((s) => s.active),
  };

  return success(config);
}
