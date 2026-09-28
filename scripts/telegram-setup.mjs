// One-time Telegram alert setup: `npm run telegram:setup`
//
// 1. Checks TELEGRAM_BOT_TOKEN in .env with Telegram (getMe)
// 2. Finds your chat id from the messages you've sent the bot (getUpdates)
// 3. Saves it as TELEGRAM_CHAT_ID in .env
// 4. Sends a test alert to your phone
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ENV_PATH = resolve(process.cwd(), ".env");

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

function readEnv() {
  const text = readFileSync(ENV_PATH, "utf8");
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) values[m[1]] = m[2].trim().replace(/^(['"])(.*)\1$/, "$2");
  }
  return { text, values };
}

function saveEnvValue(text, key, value) {
  const re = new RegExp(`^(\\s*${key}\\s*=).*$`, "m");
  const next = re.test(text) ? text.replace(re, `$1${value}`) : `${text.trimEnd()}\n${key}=${value}\n`;
  writeFileSync(ENV_PATH, next);
}

async function telegram(token, method, body) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15_000),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ...data };
}

const { text, values } = readEnv();
const token = values.TELEGRAM_BOT_TOKEN;

if (!token) {
  fail(
    "TELEGRAM_BOT_TOKEN is empty in .env.\n" +
      "  In Telegram, message @BotFather → /newbot, then paste the token it gives you\n" +
      "  after TELEGRAM_BOT_TOKEN= in portfolio/.env and run this again.",
  );
}
if (!/^\d+:[\w-]{30,}$/.test(token)) {
  fail("TELEGRAM_BOT_TOKEN doesn't look like a bot token (expected something like 7123456789:AAH...).");
}

// 1. Validate the token
const me = await telegram(token, "getMe");
if (!me.ok) {
  fail(
    me.status === 401
      ? "Telegram rejected the token (401). Copy it again from @BotFather — the whole thing, including the part before the colon."
      : `Telegram getMe failed: ${me.description ?? `HTTP ${me.status}`}`,
  );
}
const botName = `@${me.result.username}`;
console.log(`✔ Token is valid — bot ${botName}`);

// 2. Find the chat id
let chatId = values.TELEGRAM_CHAT_ID;
if (chatId) {
  console.log(`✔ TELEGRAM_CHAT_ID already set in .env`);
} else {
  const updates = await telegram(token, "getUpdates");
  if (!updates.ok) fail(`Telegram getUpdates failed: ${updates.description ?? `HTTP ${updates.status}`}`);

  const chats = new Map();
  for (const u of updates.result ?? []) {
    const chat = (u.message ?? u.edited_message ?? u.my_chat_member)?.chat;
    if (chat?.type === "private") chats.set(chat.id, chat);
  }
  if (chats.size === 0) {
    fail(
      `No messages found for ${botName}.\n` +
        `  Open https://t.me/${me.result.username} on your phone, press Start (or send "hi"),\n` +
        "  then run this again.",
    );
  }
  // Most recent private chat — the person who just messaged the bot
  const chat = [...chats.values()].at(-1);
  chatId = String(chat.id);
  saveEnvValue(text, "TELEGRAM_CHAT_ID", chatId);
  const who = [chat.first_name, chat.last_name].filter(Boolean).join(" ") || chat.username || "you";
  console.log(`✔ Found your chat (${who}) and saved TELEGRAM_CHAT_ID to .env`);
  if (chats.size > 1) {
    console.log(`  Note: ${chats.size} people have messaged this bot — used the most recent one.`);
  }
}

// 3. Send a test alert
const sent = await telegram(token, "sendMessage", {
  chat_id: chatId,
  parse_mode: "HTML",
  text:
    "✅ <b>Portfolio alerts are working</b>\n\n" +
    "You'll get a message here whenever someone uses your contact form.",
});
if (!sent.ok) {
  fail(
    `Sending the test message failed: ${sent.description ?? `HTTP ${sent.status}`}\n` +
      "  If it says 'chat not found', clear TELEGRAM_CHAT_ID in .env, message the bot again, and rerun.",
  );
}
console.log("✔ Test message sent — check Telegram on your phone.");
console.log("\nNext: restart the dev server (npm run dev) so the site picks up the new .env values.\n");
