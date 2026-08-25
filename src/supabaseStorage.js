import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Remplace le window.storage utilisé partout dans l'appli.
// shared = false  -> stocké localement sur cet appareil (localStorage)
// shared = true   -> stocké dans Supabase, partagé entre tous les appareils
window.storage = {
  async get(key, shared = false) {
    try {
      if (!shared) {
        const value = window.localStorage.getItem(key);
        return value !== null ? { key, value, shared } : null;
      }
      if (!supabase) return null;
      const { data, error } = await supabase
        .from("kv_store")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (error || !data) return null;
      return { key, value: data.value, shared };
    } catch (e) {
      return null;
    }
  },

  async set(key, value, shared = false) {
    try {
      if (!shared) {
        window.localStorage.setItem(key, value);
        return { key, value, shared };
      }
      if (!supabase) return null;
      const { error } = await supabase
        .from("kv_store")
        .upsert({ key, value, updated_at: new Date().toISOString() });
      if (error) return null;
      return { key, value, shared };
    } catch (e) {
      return null;
    }
  },

  async delete(key, shared = false) {
    try {
      if (!shared) {
        window.localStorage.removeItem(key);
        return { key, deleted: true, shared };
      }
      if (!supabase) return null;
      const { error } = await supabase.from("kv_store").delete().eq("key", key);
      if (error) return null;
      return { key, deleted: true, shared };
    } catch (e) {
      return null;
    }
  },

  async list(prefix = "", shared = false) {
    try {
      if (!shared) {
        const keys = Object.keys(window.localStorage).filter((k) =>
          prefix ? k.startsWith(prefix) : true
        );
        return { keys, prefix, shared };
      }
      if (!supabase) return null;
      let query = supabase.from("kv_store").select("key");
      if (prefix) query = query.like("key", `${prefix}%`);
      const { data, error } = await query;
      if (error) return null;
      return { keys: (data || []).map((d) => d.key), prefix, shared };
    } catch (e) {
      return null;
    }
  },
};
