import "server-only";

import {
  NOTIFY_TIMEOUT_MS,
  describeFailure,
  env,
  escapeHtml,
  inboxUrl,
  type NewMessageNotice,
} from "./shared";

/**
 * Email via Resend's REST API (free tier: 3,000 emails/month):
 * https://resend.com/docs/api-reference/emails/send-email
 *
 * Needs RESEND_API_KEY and NOTIFY_EMAIL_TO. Without a verified domain Resend
 * only allows the sender onboarding@resend.dev and only delivers to the
 * address you signed up with — which is exactly what an owner alert needs.
 * Reply-To is the visitor, so "Reply" in your mail app answers them directly.
 */

const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

export function isEmailConfigured(): boolean {
  return Boolean(env("RESEND_API_KEY") && env("NOTIFY_EMAIL_TO"));
}

export async function sendEmail(notice: NewMessageNotice): Promise<void> {
  const apiKey = env("RESEND_API_KEY");
  const to = env("NOTIFY_EMAIL_TO");
  if (!apiKey || !to) return;

  const link = inboxUrl();
  const text = [
    `New message from your portfolio contact form.`,
    "",
    `From:    ${notice.name}`,
    `Email:   ${notice.email}`,
    `Subject: ${notice.subject}`,
    "",
    notice.message,
    "",
    "— Reply to this email to answer the sender directly.",
    ...(link ? [`Inbox: ${link}`] : []),
  ].join("\n");

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#6b7280">${label}</td><td style="padding:4px 0">${value}</td></tr>`;
  const html = `
<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;color:#111827;max-width:560px">
  <p style="margin:0 0 12px;font-weight:600">📩 New portfolio message</p>
  <table style="border-collapse:collapse;margin-bottom:16px">
    ${row("From", escapeHtml(notice.name))}
    ${row("Email", `<a href="mailto:${escapeHtml(notice.email)}">${escapeHtml(notice.email)}</a>`)}
    ${row("Subject", escapeHtml(notice.subject))}
  </table>
  <div style="white-space:pre-wrap;line-height:1.5;padding:12px 14px;background:#f3f4f6;border-radius:8px">${escapeHtml(notice.message)}</div>
  <p style="margin:16px 0 0;color:#6b7280;font-size:13px">Reply to this email to answer ${escapeHtml(notice.name)} directly.${
    link ? ` · <a href="${escapeHtml(link)}">Open inbox</a>` : ""
  }</p>
</div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env("NOTIFY_EMAIL_FROM") ?? DEFAULT_FROM,
      to: [to],
      reply_to: notice.email,
      subject: `Portfolio: ${notice.subject} — from ${notice.name}`,
      text,
      html,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(await describeFailure(res));
}
