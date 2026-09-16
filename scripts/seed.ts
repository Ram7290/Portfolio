import { readFileSync } from "node:fs";

/**
 * Minimal .env loader so the seed script works outside Next.js
 * (tsx does not load .env / .env.local automatically).
 * Real environment variables always take precedence.
 */
function loadEnvFiles(): void {
  for (const file of [".env", ".env.local"]) {
    try {
      const contents = readFileSync(file, "utf8");
      for (const line of contents.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (match && !(match[1] in process.env)) {
          process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
        }
      }
    } catch {
      // file missing — fine
    }
  }
}

async function main(): Promise<void> {
  loadEnvFiles();
  const { seedDatabase } = await import("../src/lib/seed");
  try {
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

void main();
