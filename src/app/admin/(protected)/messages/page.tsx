"use client";

import { MessagesManager, type MessageRow } from "@/components/admin/messages-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { PageLoading } from "@/components/admin/page-loading";
import { useApiResource } from "@/hooks/use-api-resource";
import { messagesApi } from "@/lib/api-client";

export default function AdminMessagesPage() {
  const { data, loading, dbConfigured, reload } = useApiResource<MessageRow[]>(
    messagesApi.list,
    [],
  );

  return (
    <>
      <PageHeader
        title="Messages"
        description="Inbox for contact form submissions."
      />
      {loading ? (
        <PageLoading />
      ) : (
        <>
          <DbBanner configured={dbConfigured} />
          <MessagesManager initial={data} dbConfigured={dbConfigured} onChanged={reload} />
        </>
      )}
    </>
  );
}
