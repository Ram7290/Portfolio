/**
 * Shared types for portfolio content. These mirror the MongoDB models
 * (Phase 3) so local placeholder data and database data share one shape.
 */

export interface StatItem {
  value: string;
  label: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  bio: string[];
  imageUrl: string | null;
  location: string;
  email: string;
  available: boolean;
  availabilityLabel: string;
  stats: StatItem[];
}

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Databases"
  | "Tools";

export interface Skill {
  name: string;
  category: SkillCategory;
  icon?: string | null;
  proficiency?: string | null;
  order: number;
  active: boolean;
}

export interface Experience {
  company: string;
  role: string;
  location?: string | null;
  startDate: string; // YYYY-MM
  endDate?: string | null; // YYYY-MM | null when current
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements?: string[];
  order: number;
}

export type ProjectCategory =
  | "Full Stack"
  | "Frontend"
  | "Backend"
  | "Other";

export interface Project {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  problem?: string | null;
  solution?: string | null;
  features: string[];
  challenges?: string | null;
  results?: string | null;
  technologies: string[];
  category: ProjectCategory;
  thumbnailUrl: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured: boolean;
  order: number;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  startYear: number;
  endYear?: number | null;
  description?: string | null;
  order: number;
}

export interface SocialLinkItem {
  platform: string;
  url: string;
  order: number;
  active: boolean;
}
