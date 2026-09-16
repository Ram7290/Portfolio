import "server-only";

/**
 * Shared helpers for admin pages: safe doc serialization and auth gate.
 */

export interface WithId {
  _id: { toString(): string };
}

export function withId<T extends WithId>(doc: T): T & { id: string } {
  return { ...doc, id: doc._id.toString() };
}

export function withIds<T extends WithId>(docs: T[]): Array<T & { id: string }> {
  return docs.map(withId);
}

/**
 * Server → client row serialization: strips mongoose internals and
 * normalizes undefined → null so rows match the client prop types.
 */
export function serializeRows<T>(docs: WithId[]): T[] {
  return docs.map((doc) => {
    const copy: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(doc)) {
      copy[key] = value === undefined ? null : value;
    }
    delete copy._id;
    delete copy.__v;
    copy.id = doc._id.toString();
    return copy as T;
  });
}

export async function requireAdmin() {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user) {
    const { redirect } = await import("next/navigation");
    redirect("/admin/login");
  }
  return session;
}
