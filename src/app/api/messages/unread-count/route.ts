import { withDb } from "@/lib/mongodb";
import { ContactMessageModel } from "@/models";
import { requireAdmin, success, unauthorized } from "@/lib/api-utils";

/** GET /api/messages/unread-count — number of unread messages (admin only) */
export async function GET() {
  if (!(await requireAdmin())) return unauthorized();

  const count = await withDb(() =>
    ContactMessageModel.countDocuments({ read: false }),
  );
  return success({ count: count ?? 0 });
}
