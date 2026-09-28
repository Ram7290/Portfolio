import { requireAdmin, success, unauthorized } from "@/lib/api-utils";
import { notifyNewMessage } from "@/lib/notify";
import { isEmailConfigured } from "@/lib/notify/email";
import { isTelegramConfigured } from "@/lib/notify/telegram";
import { isWhatsAppConfigured } from "@/lib/notify/whatsapp";

/** GET /api/notifications — which alert channels are configured (admin only) */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();

  return success({
    telegram: isTelegramConfigured(),
    email: isEmailConfigured(),
    whatsapp: isWhatsAppConfigured(),
  });
}

/** POST /api/notifications — send a sample alert to every configured channel (admin only) */
export async function POST() {
  if (!(await requireAdmin())) return unauthorized();

  const results = await notifyNewMessage({
    name: "Test Sender",
    email: "test.sender@example.com",
    subject: "Test notification",
    message:
      "This is a test alert from your portfolio admin. If you can read this, new contact messages will reach you here.",
  });
  return success(results);
}
