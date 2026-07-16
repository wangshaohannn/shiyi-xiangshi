import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const apiDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(apiDir, "..");
const dataDir = path.join(rootDir, "data");
const dbPath = path.join(dataDir, "db.json");
const runtimeDbPath = process.env.VERCEL ? path.join("/tmp", "shiyi-db.json") : dbPath;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const supabaseTable = process.env.SUPABASE_STATE_TABLE || "site_state";
const stateId = process.env.SHIYI_STATE_ID || "default";

let fileWriteQueue = Promise.resolve();

function clone(value) {
  return structuredClone(value);
}

function hasSupabase() {
  return Boolean(supabaseUrl && supabaseKey);
}

async function readFileDb() {
  await ensureRuntimeFileDb();
  const raw = await fs.readFile(runtimeDbPath, "utf8");
  return JSON.parse(raw);
}

async function writeFileDb(db) {
  await fs.mkdir(path.dirname(runtimeDbPath), { recursive: true });
  const next = `${JSON.stringify(db, null, 2)}\n`;
  const tmpPath = `${runtimeDbPath}.tmp`;
  await fs.writeFile(tmpPath, next);
  await fs.rename(tmpPath, runtimeDbPath);
}

async function ensureRuntimeFileDb() {
  if (runtimeDbPath === dbPath) return;
  try {
    await fs.access(runtimeDbPath);
  } catch {
    const seed = await fs.readFile(dbPath, "utf8");
    await fs.writeFile(runtimeDbPath, seed);
  }
}

async function supabaseRequest(method, query = "", payload) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${supabaseTable}${query}`, {
    method,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || data?.error || "Supabase 数据读写失败";
    throw new Error(message);
  }

  return data;
}

async function writeSupabaseDb(db) {
  await supabaseRequest("POST", "?on_conflict=id", {
    id: stateId,
    data: db,
    updated_at: new Date().toISOString(),
  });
}

async function readSupabaseDb() {
  const rows = await supabaseRequest("GET", `?id=eq.${encodeURIComponent(stateId)}&select=data&limit=1`);
  if (rows?.[0]?.data) return rows[0].data;

  const seed = await readFileDb();
  await writeSupabaseDb(seed);
  return seed;
}

export function getStorageMode() {
  return hasSupabase() ? "supabase" : "file";
}

export async function readDb() {
  const db = hasSupabase() ? await readSupabaseDb() : await readFileDb();
  return clone(db);
}

export async function updateDb(mutator) {
  if (hasSupabase()) {
    const db = await readSupabaseDb();
    const result = await mutator(db);
    await writeSupabaseDb(db);
    return result;
  }

  const task = fileWriteQueue.then(async () => {
    const db = await readFileDb();
    const result = await mutator(db);
    await writeFileDb(db);
    return result;
  });

  fileWriteQueue = task.catch(() => {});
  return task;
}
