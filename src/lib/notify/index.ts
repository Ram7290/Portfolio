import "server-only";

import { isEmailConfigured, sendEmail } from "./email";
import type { NewMessageNotice } from "./shared";
import { isTelegramConfigured, sendTelegram } from "./telegram";
import { isWhatsAppConfigured, sendWhatsApp } from "./whatsapp";

export type { NewMessageNotice };

/**
 * Owner notifications for new contact messages. Each channel is enabled
 * only when its environment variables are set; all enabled channels are
 * sent in parallel, and a failing channel never affects the others.
 */

const CHANNELS = [
  { name: "telegram", configured: isTelegramConfigured, send: sendTelegram },
  { name: "email", configured: isEmailConfigured, send: sendEmail },
  { name: "whatsapp", configured: isWhatsAppConfigured, send: sendWhatsApp },
] as const;

export type ChannelName = (typeof CHANNELS)[number]["name"];

export interface ChannelResult {
  channel: ChannelName;
  status: "sent" | "failed" | "not-configured";
  error?: string;
}

/** Notify every configured channel. Never throws; failures are logged. */
export async function notifyNewMessage(
  notice: NewMessageNotice,
): Promise<ChannelResult[]> {
  return Promise.all(
    CHANNELS.map(async ({ name, configured, send }): Promise<ChannelResult> => {
      if (!configured()) return { channel: name, status: "not-configured" };
      try {
        await send(notice);
        return { channel: name, status: "sent" };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[notify:${name}] failed — ${message}`);
        return { channel: name, status: "failed", error: message };
      }
    }),
  );
}
