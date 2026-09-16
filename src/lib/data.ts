/**
 * Central site configuration + placeholder content for Phase 1–2.
 * In Phase 3+ this data moves to MongoDB; the shape here mirrors the
 * future Mongoose models so the swap is mechanical.
 */

export const siteConfig = {
  name: "Ramduth Rajesh",
  initials: "RR",
  role: "Full Stack Developer",
  tagline:
    "Building modern, scalable and user-focused web applications with clean architecture and powerful technologies.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "ramduth.rajesh@example.com",
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
} as const;

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
