import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TABLE = 'kv_store';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours (comme aujourd'hui, mémorisé sur l'appareil)

async function getValue(key) {
  const { data } = await supabaseAdmin.from(TABLE).select('value').eq('key', key).maybeSingle();
  return data ? data.value : null;
}

async function setValue(key, value) {
  await supabaseAdmin.from(TABLE).upsert({ key, value });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, pin } = req.body;
  if (!email || !pin) return res.status(400).json({ error: 'Champs manquants' });

  const clientsRaw = await getValue('clients-v1');
  const clients = clientsRaw ? JSON.parse(clientsRaw) : [];

  const match = clients.find(
    (c) => (c.email || '').trim().toLowerCase() === email.trim().toLowerCase()
  );

  if (!match) return res.status(401).json({ status: 'not_found' });
  if (String(match.pin) !== String(pin)) return res.status(401).json({ status: 'wrong_pin' });

  const token = randomBytes(24).toString('hex');
  await setValue(
    `client-session-v1-${token}`,
    JSON.stringify({ clientId: match.id, expiresAt: Date.now() + SESSION_DURATION_MS })
  );

  // On ne renvoie que les informations de CE client, jamais la liste complète ni les PIN
  const { pin: _omit, ...clientSansPin } = match;

  res.status(200).json({ status: 'ok', token, client: clientSansPin });
}
