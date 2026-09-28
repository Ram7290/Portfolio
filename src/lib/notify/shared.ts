import "server-only";

export interface NewMessageNotice {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Network timeout for every notification provider. */
export const NOTIFY_TIMEOUT_MS = 10_000;

export function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

/** Link to the admin inbox, when the public site URL is known. */
export function inboxUrl(): string | null {
  const site = env("NEXT_PUBLIC_SITE_URL")?.replace(/\/+$/, "");
  return site ? `${site}/admin/messages` : null;
}

export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}… (truncated)` : text;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Short, single-line summary of a failed provider response for the logs. */
export async function describeFailure(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  return `HTTP ${res.status}: ${text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200)}`;
}
