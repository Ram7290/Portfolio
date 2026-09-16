import mongoose from "mongoose";

/**
 * Cached MongoDB connection that survives Next.js dev hot reloads.
 * Returns null when MONGODB_URI is not configured (placeholder-data mode).
 *
 * Includes an Atlas SRV fallback: some networks/VPNs block the raw DNS
 * queries Node uses for `mongodb+srv://` lookups (querySrv ECONNREFUSED)
 * while the OS resolver works fine. On Windows we then resolve the SRV
 * record through PowerShell and connect to the hosts directly.
 */

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var _mongooseCache: {
    conn: typeof mongoose | null;
    connecting: Promise<typeof mongoose> | null;
  } | undefined;
}

const cache =
  global._mongooseCache ??
  (global._mongooseCache = { conn: null, connecting: null });

export function isDbConfigured(): boolean {
  return Boolean(MONGODB_URI);
}

/* ------------------------------------------------------------------ */
/* SRV fallback (Windows)                                              */
/* ------------------------------------------------------------------ */

const QUERY_SRV_ERROR = "querySrv";

function isSrvDnsError(error: unknown): boolean {
  const message =
    error instanceof Error ? `${error.message} ${String((error as { code?: string }).code)}` : "";
  return message.includes(QUERY_SRV_ERROR);
}

async function resolveSrvHostsWindows(hostname: string): Promise<string[] | null> {
  if (process.platform !== "win32") return null;
  try {
    const { execFile } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const execFileAsync = promisify(execFile);
    const { stdout } = await execFileAsync(
      "powershell",
      [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        `(Resolve-DnsName -Type SRV '_mongodb._tcp.${hostname}' -ErrorAction Stop | ` +
          `Where-Object { $_.NameTarget -and $_.Port } | ` +
          `ForEach-Object { "$($_.NameTarget):$($_.Port)" }) -join ','`,
      ],
      { timeout: 10_000 },
    );
    const hosts = stdout
      .trim()
      .split(",")
      .filter((h) => h && h.includes(":"));
    if (hosts.length === 0) return null;
    return hosts;
  } catch {
    return null;
  }
}

/** mongodb+srv://user:pass@cluster.example.net/db?params → mongodb://… with explicit hosts */
async function buildNonSrvUri(uri: string): Promise<string | null> {
  if (!uri.startsWith("mongodb+srv://")) return null;

  try {
    const withoutScheme = uri.slice("mongodb+srv://".length);
    const slashIndex = withoutScheme.indexOf("/");
    const authority = slashIndex === -1 ? withoutScheme : withoutScheme.slice(0, slashIndex);
    const rest = slashIndex === -1 ? "" : withoutScheme.slice(slashIndex); // "/db?params"

    const atIndex = authority.lastIndexOf("@");
    const credentials = atIndex === -1 ? "" : authority.slice(0, atIndex + 1);
    const hostname = atIndex === -1 ? authority : authority.slice(atIndex + 1);

    const hosts = await resolveSrvHostsWindows(hostname);
    if (!hosts || hosts.length === 0) return null;

    // ensure TLS + admin auth source (Atlas defaults)
    let params = rest.includes("?") ? rest.slice(rest.indexOf("?") + 1) : "";
    const db = rest.includes("?") ? rest.slice(0, rest.indexOf("?")) : rest;
    const has = (key: string) =>
      params.split("&").some((p) => p.toLowerCase().startsWith(`${key}=`));
    if (!has("tls") && !has("ssl")) params += (params ? "&" : "") + "tls=true";
    if (!has("authSource")) params += (params ? "&" : "") + "authSource=admin";

    return `mongodb://${credentials}${hosts.join(",")}/${db}${params ? `?${params}` : ""}`;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Connection                                                          */
/* ------------------------------------------------------------------ */

export async function connectToDatabase() {
  if (!MONGODB_URI) return null;

  if (cache.conn) return cache.conn;

  if (!cache.connecting) {
    cache.connecting = (async () => {
      const options = {
        dbName: process.env.MONGODB_DB ?? "portfolio",
        bufferCommands: false,
      } as const;

      try {
        cache.conn = await mongoose.connect(MONGODB_URI, options);
        return cache.conn;
      } catch (error) {
        if (!isSrvDnsError(error)) throw error;
        const fallbackUri = await buildNonSrvUri(MONGODB_URI);
        if (!fallbackUri) throw error;
        console.warn(
          "[mongodb] SRV DNS lookup failed — connecting via resolved hosts fallback",
        );
        cache.conn = await mongoose.connect(fallbackUri, options);
        return cache.conn;
      } finally {
        cache.connecting = null;
      }
    })();
  }

  return cache.connecting;
}

type Mongoose = Awaited<ReturnType<typeof connectToDatabase>>;

/**
 * Run a database operation; returns null when DB is not configured
 * (so callers can fall back to placeholder data) or on failure.
 */
export async function withDb<T>(
  fn: (mongoose: NonNullable<Mongoose>) => Promise<T>,
): Promise<T | null> {
  let mongooseInstance: Mongoose;
  try {
    mongooseInstance = await connectToDatabase();
  } catch (error) {
    console.error("[mongodb] connection failed:", error);
    return null;
  }
  if (!mongooseInstance) return null;

  try {
    return await fn(mongooseInstance);
  } catch (error) {
    console.error("[mongodb] operation failed:", error);
    return null;
  }
}
