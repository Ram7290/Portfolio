import { isDbConfigured, withDb } from "@/lib/mongodb";
import { ContactMessageModel } from "@/models";
import { withIds } from "@/lib/admin-utils";
import { MessagesManager } from "@/components/admin/messages-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const dbOk = isDbConfigured();
  const docs = await withDb(() =>
    ContactMessageModel.find().sort({ createdAt: -1 }).limit(200).lean(),
  );

  return (
    <>
      <PageHeader
        title="Messages"
        description="Inbox for contact form submissions."
      />
      <DbBanner configured={dbOk} />
      <MessagesManager
        initial={
          docs
            ? withIds(docs).map((m) => ({
                id: m.id,
                name: m.name,
                email: m.email,
                subject: m.subject,
                message: m.message,
                read: m.read,
                createdAt: m.createdAt.toISOString(),
              }))
            : []
        }
        dbConfigured={dbOk}
      />
    </>
  );
}
