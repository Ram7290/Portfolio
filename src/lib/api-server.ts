import "server-only";

import { headers } from "next/headers";

import type { SiteConfig } from "@/lib/data";
import type { SiteSettings } from "@/lib/settings";
import type {
  Education,
  Experience,
  Profile,
  Project,
  Service,
  Skill,
  SocialLinkItem,
} from "@/types/portfolio";

/**
 * REST client for Server Components (layouts, pages, metadata, sitemap).
 *
 * The browser-side axios client in `api-client.ts` uses a relative `/api`
 * base URL, which has no meaning on the server — so server code calls the
 * same public endpoints through an absolute URL. Set API_BASE_URL to pin it
 * (e.g. an internal address); otherwise it's derived from the incoming
 * request, which also makes every caller render dynamically, per request.
 */

interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

async function baseUrl(): Promise<string> {
  const configured = process.env.API_BASE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) throw new Error("Cannot resolve API host: set API_BASE_URL.");
  const proto = h.get("x-forwarded-proto")?.split(",")[0]?.trim() || "http";
  return `${proto}://${host}`;
}

/** GET a public endpoint; returns null on 404, throws on any other failure. */
async function get<T>(path: string): Promise<T | null> {
  const res = await fetch(`${await baseUrl()}/api/public${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (res.status === 404) return null;

  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!res.ok || !body?.ok) {
    throw new Error(
      `GET /api/public${path} failed (${res.status}): ${body?.error ?? res.statusText}`,
    );
  }
  return body.data ?? null;
}

async function getList<T>(path: string): Promise<T[]> {
  return (await get<T[]>(path)) ?? [];
}

async function getRequired<T>(path: string): Promise<T> {
  const data = await get<T>(path);
  if (data === null) throw new Error(`GET /api/public${path} returned no data.`);
  return data;
}

export const serverApi = {
  profile: () => getRequired<Profile>("/profile"),
  skills: () => getList<Skill>("/skills"),
  experience: () => getList<Experience>("/experience"),
  projects: () => getList<Project>("/projects"),
  projectBySlug: (slug: string) =>
    get<Project>(`/projects/${encodeURIComponent(slug)}`),
  services: () => getList<Service>("/services"),
  education: () => getList<Education>("/education"),
  socialLinks: () => getList<SocialLinkItem>("/social-links"),
  siteConfig: () => getRequired<SiteConfig>("/site-config"),
  siteSettings: () => getRequired<SiteSettings>("/site-settings"),
};
