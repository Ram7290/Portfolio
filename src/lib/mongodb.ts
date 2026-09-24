import mongoose from "mongoose";

/**
 * Cached MongoDB connection that survives Next.js dev hot reloads.
 * Returns null when MONGODB_URI is not configured (placeholder-data mode).
 *
 * Resilience built in:
 *  - Atlas SRV fallback: some networks/VPNs block the raw DNS queries Node
 *    uses for `mongodb+srv://` lookups (querySrv ECONNREFUSED) while the OS
 *    resolver works fine. On Windows we then resolve the SRV record through
 *    PowerShell and connect to the discovered hosts directly.
 *  - Fail fast + cooldown: when the database is unreachable we stop hammering
 *    it on every request (which produced 30s hangs and log spam) and serve
 *    fallback content until the cooldown expires.
 */

/**
 * Sanitise env values: pasting into a hosting dashboard often carries stray
 * whitespace/newlines, or the surrounding quotes from a .env file. A .env
 * parser strips those quotes, a dashboard field does not — leaving a value
 * that starts with `"` and fails as `MongoParseError: Invalid scheme`.
 */
function cleanEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return trimmed;
  return trimmed.replace(/^(['"])([\s\S]*)\1$/, "$2").trim();
}

const MONGODB_URI = cleanEnv(process.env.MONGODB_URI);
const MONGODB_DB = cleanEnv(process.env.MONGODB_DB);

/** How long the driver waits to find a usable server before giving up. */
const SERVER_SELECTION_TIMEOUT_MS = 3_000; // Reduced from 8_000
/** After a failed connect, skip new attempts for this long. */
const FAILURE_COOLDOWN_MS = 10_000; // Reduced from 20_000

interface MongooseCache {
  conn: typeof mongoose | null;
  connecting: Promise<typeof mongoose> | null;
  srvHosts: string[] | null;
  lastFailureAt: number;
  lastFailureLogged: boolean;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache =
  global._mongooseCache ??
  (global._mongooseCache = {
    conn: null,
    connecting: null,
    srvHosts: null,
    lastFailureAt: 0,
    lastFailureLogged: false,
  });

export function isDbConfigured(): boolean {
  return Boolean(MONGODB_URI);
}

/* ------------------------------------------------------------------ */
/* SRV fallback (Windows)                                              */
/* ------------------------------------------------------------------ */

function isSrvDnsError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? `${error.message} ${String((error as { code?: string }).code)}`
      : "";
  return message.includes("querySrv");
}

/** One-line summary instead of the driver's multi-page topology dump. */
function describeError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const firstLine = error.message.split("\n")[0];
  return `${error.name}: ${firstLine}`;
}

async function resolveSrvHostsWindows(hostname: string): Promise<string[] | null> {
  if (process.platform !== "win32") return null;
  if (cache.srvHosts) return cache.srvHosts;

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
    cache.srvHosts = hosts;
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
    const authority =
      slashIndex === -1 ? withoutScheme : withoutScheme.slice(0, slashIndex);
    const rest = slashIndex === -1 ? "" : withoutScheme.slice(slashIndex); // "/db?params"

    const atIndex = authority.lastIndexOf("@");
    const credentials = atIndex === -1 ? "" : authority.slice(0, atIndex + 1);
    const hostname = atIndex === -1 ? authority : authority.slice(atIndex + 1);

    const hosts = await resolveSrvHostsWindows(hostname);
    if (!hosts || hosts.length === 0) return null;

    // ensure TLS + admin auth source (the defaults the SRV TXT record supplies)
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

export async function connectToDatabase(
  { bypassCooldown = false }: { bypassCooldown?: boolean } = {},
) {
  if (!MONGODB_URI) return null;

  if (cache.conn && cache.conn.connection.readyState === 1) return cache.conn;

  // Recently failed? Don't hammer the database on every request. Callers
  // acting on a deliberate user gesture (signing in) pass `bypassCooldown`
  // so a click always gets a real attempt instead of a cached failure left
  // behind by a background page render.
  if (!bypassCooldown && Date.now() - cache.lastFailureAt < FAILURE_COOLDOWN_MS) {
    return null;
  }

  if (!cache.connecting) {
    cache.connecting = (async () => {
      const options = {
        dbName: MONGODB_DB || "portfolio",
        bufferCommands: false,
        serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
      } as const;

      try {
        cache.conn = await mongoose.connect(MONGODB_URI, options);
      } catch (error) {
        // SRV DNS blocked → retry through OS-resolved hosts
        const fallbackUri = isSrvDnsError(error)
          ? await buildNonSrvUri(MONGODB_URI)
          : null;
        if (!fallbackUri) throw error;
        cache.conn = await mongoose.connect(fallbackUri, options);
      }

      cache.lastFailureAt = 0;
      cache.lastFailureLogged = false;
      return cache.conn;
    })();

    cache.connecting
      .catch(() => {
        /* handled by the caller below */
      })
      .finally(() => {
        cache.connecting = null;
      });
  }

  try {
    return await cache.connecting;
  } catch (error) {
    cache.conn = null;
    cache.lastFailureAt = Date.now();
    // log once per cooldown window instead of on every request
    if (!cache.lastFailureLogged) {
      cache.lastFailureLogged = true;
      console.error(
        `[mongodb] unavailable — ${describeError(error)} ` +
          `(serving fallback content; retrying in ${FAILURE_COOLDOWN_MS / 1000}s)`,
      );
    }
    return null;
  }
}

type Mongoose = Awaited<ReturnType<typeof connectToDatabase>>;

/**
 * Run a database operation; returns null when the DB is not configured or
 * unreachable, so callers can fall back to placeholder data.
 */
export async function withDb<T>(
  fn: (mongoose: NonNullable<Mongoose>) => Promise<T>,
): Promise<T | null> {
  const mongooseInstance = await connectToDatabase();
  if (!mongooseInstance) return null;

  try {
    return await fn(mongooseInstance);
  } catch (error) {
    console.error(`[mongodb] operation failed — ${describeError(error)}`);
    return null;
  }
}
