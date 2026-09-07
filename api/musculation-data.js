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

async function resolveSession(token) {
  if (!token) return null;

  const coachRaw = await getRawValue(`coach-session-v1-${token}`);
  if (coachRaw) {
    const session = JSON.parse(coachRaw);
    if (session.expiresAt > Date.now()) return { role: 'coach' };
  }

  const clientRaw = await getRawValue(`client-session-v1-${token}`);
  if (clientRaw) {
    const session = JSON.parse(clientRaw);
    if (session.expiresAt > Date.now()) return { role: 'client', clientId: session.clientId };
  }

  return null;
}

function perClientKeys(clientId) {
  return [
    `sessions-v1-${clientId}`,
    `profile-v1-${clientId}`,
    `calendly-bookings-v1-${clientId}`,
    `ct-table-v1-${clientId}`,
    `ct-table-draft-v1-${clientId}`,
    `photo-journal-v1-${clientId}`,
    `hydration-v1-${clientId}`,
  ];
}

// Empêche toute manipulation directe des clés de session/compte via ce proxy générique
function isReservedKey(key) {
  return (
    key.startsWith('coach-session-v1-') ||
    key.startsWith('client-session-v1-') ||
    key === 'coach-account-v1'
  );
}

function isAllowed(session, action, key) {
  if (isReservedKey(key)) return false;

  if (session.role === 'coach') {
    return true; // le coach a accès à tout le reste
  }

  // role === 'client'
  if (perClientKeys(session.clientId).includes(key)) {
    return true; // lecture et écriture sur ses propres données
  }
  if (key === 'library-v1' && action === 'get') {
    return true; // lecture seule du catalogue
  }
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const session = await resolveSession(token);

  if (!session) {
    return res.status(401).json({ error: 'Session invalide ou expirée' });
  }

  const { action, key, value, prefix } = req.body;

  if (action === 'get') {
    if (!isAllowed(session, 'get', key)) return res.status(403).json({ error: 'Accès refusé' });
    const raw = await getRawValue(key);
    if (raw === null) return res.status(200).json({ result: null });
    return res.status(200).json({ result: { key, value: raw, shared: true } });
  }

  if (action === 'set') {
    if (!isAllowed(session, 'set', key)) return res.status(403).json({ error: 'Accès refusé' });
    const { error } = await supabaseAdmin.from(TABLE).upsert({ key, value });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ result: { key, value, shared: true } });
  }

  if (action === 'delete') {
    if (!isAllowed(session, 'delete', key)) return res.status(403).json({ error: 'Accès refusé' });
    const { error } = await supabaseAdmin.from(TABLE).delete().eq('key', key);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ result: { key, deleted: true, shared: true } });
  }

  if (action === 'list') {
    if (session.role !== 'coach') return res.status(403).json({ error: 'Accès refusé' });
    const { data, error } = await supabaseAdmin.from(TABLE).select('key').like('key', `${prefix || ''}%`);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ result: { keys: data.map((d) => d.key), prefix: prefix || '', shared: true } });
  }

  return res.status(400).json({ error: 'Action inconnue' });
}
