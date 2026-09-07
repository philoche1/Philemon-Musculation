import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TABLE = 'kv_store';

async function getRawValue(key) {
  const { data } = await supabaseAdmin.from(TABLE).select('value').eq('key', key).maybeSingle();
  return data ? data.value : null;
}

export async function verifyCoachToken(token) {
  if (!token) return false;
  const raw = await getRawValue(`coach-session-v1-${token}`);
  if (!raw) return false;
  const session = JSON.parse(raw);
  return session.expiresAt > Date.now();
}

export async function verifyClientToken(token) {
  if (!token) return null;
  const raw = await getRawValue(`client-session-v1-${token}`);
  if (!raw) return null;
  const session = JSON.parse(raw);
  if (session.expiresAt <= Date.now()) return null;
  return session.clientId;
}
