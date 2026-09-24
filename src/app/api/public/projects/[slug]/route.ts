import { NextResponse } from "next/server";

import { getProjectBySlug } from "@/lib/content";
import { success, type ApiResponse } from "@/lib/api-utils";

/** GET /api/public/projects/[slug] — a single project by slug */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return NextResponse.json<ApiResponse>(
      { ok: false, error: "Project not found." },
      { status: 404 },
    );
  }

  return success(project);
}
