import "server-only";

import {
  NOTIFY_TIMEOUT_MS,
  describeFailure,
  env,
  escapeHtml,
  inboxUrl,
  truncate,
  type NewMessageNotice,
} from "./shared";

/**
 * Telegram Bot API (free): https://core.telegram.org/bots/api#sendmessage
 * Needs TELEGRAM_BOT_TOKEN (from @BotFather) and TELEGRAM_CHAT_ID (yours).
 */

/** Telegram's hard limit is 4096 characters per message. */
const MAX_BODY_CHARS = 3_000;

export function isTelegramConfigured(): boolean {
  return Boolean(env("TELEGRAM_BOT_TOKEN") && env("TELEGRAM_CHAT_ID"));
}

export async function sendTelegram(notice: NewMessageNotice): Promise<void> {
  const token = env("TELEGRAM_BOT_TOKEN");
  const chatId = env("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return;

  const link = inboxUrl();
  const text = [
    "📩 <b>New portfolio message</b>",
    "",
    `<b>From:</b> ${escapeHtml(notice.name)}`,
    `<b>Email:</b> ${escapeHtml(notice.email)}`,
    `<b>Subject:</b> ${escapeHtml(notice.subject)}`,
    "",
    escapeHtml(truncate(notice.message, MAX_BODY_CHARS)),
    ...(link ? ["", `<a href="${escapeHtml(link)}">Open inbox</a>`] : []),
  ].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(await describeFailure(res));
}
