// Storage module that mimics the window.storage API used inside Claude
// artifacts, so the rest of the app (App.jsx) doesn't need to change.
//
// - shared = true  -> stored in Supabase (visible to everyone who opens the site)
// - shared = false -> stored in this browser's localStorage (personal to this device)

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn(
    "[storage] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. " +
      "Shared data (clients, programs, sessions...) will NOT be saved. " +
      "See README.md to configure Supabase."
  );
}

const TABLE = "kv_store";

function localKeyName(key) {
  return `philemon-local:${key}`;
}

async function get(key, shared = false) {
  if (!shared) {
    const raw = window.localStorage.getItem(localKeyName(key));
    if (raw === null) return null;
    return { key, value: raw, shared };
  }
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error || !data) return null;
  return { key, value: data.value, shared };
}

async function set(key, value, shared = false) {
  if (!shared) {
    window.localStorage.setItem(localKeyName(key), value);
    return { key, value, shared };
  }
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from(TABLE).upsert({ key, value });
  if (error) throw error;
  return { key, value, shared };
}

async function del(key, shared = false) {
  if (!shared) {
    window.localStorage.removeItem(localKeyName(key));
    return { key, deleted: true, shared };
  }
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from(TABLE).delete().eq("key", key);
  if (error) throw error;
  return { key, deleted: true, shared };
}

async function list(prefix = "", shared = false) {
  if (!shared) {
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      const marker = "philemon-local:";
      if (k && k.startsWith(marker + prefix)) keys.push(k.slice(marker.length));
    }
    return { keys, prefix, shared };
  }
  if (!supabase) return { keys: [], prefix, shared };
  const { data, error } = await supabase
    .from(TABLE)
    .select("key")
    .like("key", `${prefix}%`);
  if (error) return { keys: [], prefix, shared };
  return { keys: data.map((d) => d.key), prefix, shared };
}

export const storage = { get, set, delete: del, list };
