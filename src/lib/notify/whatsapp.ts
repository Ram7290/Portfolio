import "server-only";

import {
  NOTIFY_TIMEOUT_MS,
  describeFailure,
  env,
  inboxUrl,
  truncate,
  type NewMessageNotice,
} from "./shared";

/**
 * WhatsApp via CallMeBot (free, personal use):
 * https://www.callmebot.com/blog/free-api-whatsapp-messages/
 * Needs CALLMEBOT_PHONE and CALLMEBOT_APIKEY.
 */

/** Keep the request URL a sane length; long messages are shortened. */
const MAX_BODY_CHARS = 1_000;

export function isWhatsAppConfigured(): boolean {
  return Boolean(env("CALLMEBOT_PHONE") && env("CALLMEBOT_APIKEY"));
}

export async function sendWhatsApp(notice: NewMessageNotice): Promise<void> {
  const phone = env("CALLMEBOT_PHONE");
  const apiKey = env("CALLMEBOT_APIKEY");
  if (!phone || !apiKey) return;

  const link = inboxUrl();
  const text = [
    "📩 *New portfolio message*",
    "",
    `*From:* ${notice.name}`,
    `*Email:* ${notice.email}`,
    `*Subject:* ${notice.subject}`,
    "",
    truncate(notice.message, MAX_BODY_CHARS),
    ...(link ? ["", `Inbox: ${link}`] : []),
  ].join("\n");

  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
  });
  // CallMeBot reports some errors (bad key, not activated) with a 200 page.
  const body = await res.clone().text().catch(() => "");
  if (!res.ok || /error/i.test(body.slice(0, 500))) {
    throw new Error(await describeFailure(res));
  }
}
