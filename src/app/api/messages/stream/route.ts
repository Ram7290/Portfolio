import { connectToDatabase } from "@/lib/mongodb";
import { ContactMessageModel } from "@/models";
import { requireAdmin, toRow, unauthorized } from "@/lib/api-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Comment line sent periodically so proxies don't drop an idle connection. */
const HEARTBEAT_MS = 25_000;
/** Used only if MongoDB change streams are unavailable (non-replica-set server). */
const FALLBACK_POLL_MS = 5_000;

/**
 * GET /api/messages/stream — Server-Sent Events feed of new contact
 * messages (admin only).
 *
 * Pushes an `event: new-message` the moment a message is inserted, via a
 * MongoDB change stream (Atlas supports these). Because the database is the
 * source of the event, it works no matter which server instance handled
 * the contact form submission.
 */
export async function GET(request: Request) {
  if (!(await requireAdmin())) return unauthorized();

  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const timers: ReturnType<typeof setInterval>[] = [];
      let changeStream: { close(): Promise<unknown> } | null = null;

      const close = () => {
        if (closed) return;
        closed = true;
        timers.forEach(clearInterval);
        void changeStream?.close().catch(() => {});
        request.signal.removeEventListener("abort", close);
        try {
          controller.close();
        } catch {
          /* already closed by the client */
        }
      };
      cleanup = close;
      request.signal.addEventListener("abort", close);

      const send = (chunk: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          close();
        }
      };
      const sendMessage = (doc: object) =>
        send(`event: new-message\ndata: ${JSON.stringify(toRow(doc))}\n\n`);

      // Browser reconnects after 5s if the connection drops.
      send("retry: 5000\n: connected\n\n");
      timers.push(setInterval(() => send(": ping\n\n"), HEARTBEAT_MS));

      const db = await connectToDatabase();
      if (closed) return;
      if (!db) {
        // DB unreachable: end the stream; the browser retries automatically.
        close();
        return;
      }

      let polling = false;
      const startPolling = () => {
        if (polling || closed) return;
        polling = true;
        let since = new Date();
        timers.push(
          setInterval(async () => {
            try {
              const docs = await ContactMessageModel.find({ createdAt: { $gt: since } })
                .sort({ createdAt: 1 })
                .lean();
              for (const doc of docs) {
                sendMessage(doc);
                since = doc.createdAt ?? since;
              }
            } catch {
              /* transient DB error — try again next tick */
            }
          }, FALLBACK_POLL_MS),
        );
      };

      try {
        const watcher = ContactMessageModel.watch([
          { $match: { operationType: "insert" } },
        ]);
        changeStream = watcher;
        watcher.on("change", (change) => {
          if (change.operationType === "insert") sendMessage(change.fullDocument);
        });
        watcher.on("error", () => {
          void watcher.close().catch(() => {});
          changeStream = null;
          startPolling();
        });
      } catch {
        startPolling();
      }
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Stop nginx-style proxies from buffering the stream.
      "X-Accel-Buffering": "no",
    },
  });
}
