"use client";

import { useEffect, useState } from "react";
import { MessagesManager } from "@/components/admin/messages-manager";
import { DbBanner } from "@/components/admin/db-banner";
import { PageHeader } from "@/components/admin/page-header";
import { messagesApi } from "@/lib/api-client";

interface MessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConfigured, setDbConfigured] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await messagesApi.getAll();
        if (result.ok) {
          setMessages(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setDbConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Messages"
          description="Inbox for contact form submissions."
        />
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Messages"
        description="Inbox for contact form submissions."
      />
      <DbBanner configured={dbConfigured} />
      <MessagesManager
        initial={messages}
        dbConfigured={dbConfigured}
      />
    </>
  );
}
