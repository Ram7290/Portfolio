import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/data";
import { serverApi } from "@/lib/api-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await serverApi.projects();
  const now = new Date();

  return [
    { url: siteConfig.url, lastModified: now, priority: 1 },
    { url: `${siteConfig.url}/about`, lastModified: now, priority: 0.8 },
    { url: `${siteConfig.url}/projects`, lastModified: now, priority: 0.9 },
    ...projects.map((p) => ({
      url: `${siteConfig.url}/projects/${p.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
    { url: `${siteConfig.url}/contact`, lastModified: now, priority: 0.6 },
    { url: `${siteConfig.url}/resume`, lastModified: now, priority: 0.5 },
  ];
}
