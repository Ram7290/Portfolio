/**
 * Central site configuration.
 *
 * The live values come from MongoDB via `getSiteConfig()` in `@/lib/content`
 * (Profile + SocialLink + SiteSettings). What follows is the fallback used
 * field by field whenever the database is unconfigured, unreachable, or the
 * field is still empty — so the site always renders.
 */

export interface SiteConfig {
  name: string;
  initials: string;
  role: string;
  tagline: string;
  url: string;
  email: string;
  location: string;
  availability: { open: boolean; label: string };
  resumeUrl: string;
  social: { github: string; linkedin: string };
  footerText: string;
}

export const siteConfig: SiteConfig = {
  name: "Ramduth Rajesh",
  initials: "RR",
  role: "Full Stack Developer",
  tagline:
    "Building modern, scalable and user-focused web applications with clean architecture and powerful technologies.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "ramduthrajesh1@gmail.com",
  location: "Available Worldwide (Remote)",
  availability: {
    open: true,
    label: "Open to Opportunities",
  },
  resumeUrl: "",
  social: {
    github: "https://github.com/ramduth-rajesh",
    linkedin: "https://www.linkedin.com/in/ramduth-rajesh",
  },
  footerText: "",
};

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/contact" },
];
