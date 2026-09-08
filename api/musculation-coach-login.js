import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TABLE = 'kv_store';
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 heures

async function getValue(key) {
  const { data } = await supabaseAdmin.from(TABLE).select('value').eq('key', key).maybeSingle();
  return data ? data.value : null;
}

async function setValue(key, value) {
  await supabaseAdmin.from(TABLE).upsert({ key, value });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { action, email, password, token } = req.body;

  const accountRaw = await getValue('coach-account-v1');
  const account = accountRaw ? JSON.parse(accountRaw) : null;

  if (action === 'check') {
    return res.status(200).json({ hasAccount: !!account });
  }

  if (action === 'create') {
    if (account) {
      return res.status(400).json({ error: 'Un compte coach existe déjà' });
    }
    if (!email || !password || password.length < 4) {
      return res.status(400).json({ error: 'Email ou mot de passe invalide' });
    }
    const newAccount = { email: email.trim().toLowerCase(), password };
    await setValue('coach-account-v1', JSON.stringify(newAccount));

    const token = randomBytes(24).toString('hex');
    await setValue(`coach-session-v1-${token}`, JSON.stringify({ expiresAt: Date.now() + SESSION_DURATION_MS }));
    return res.status(200).json({ status: 'ok', token });
  }

  if (action === 'login') {
    if (!account) return res.status(401).json({ status: 'no_account' });
    if (account.email !== (email || '').trim().toLowerCase()) {
      return res.status(401).json({ status: 'wrong_email' });
    }
    if (account.password !== password) {
      return res.status(401).json({ status: 'wrong_password' });
    }
    const token = randomBytes(24).toString('hex');
    await setValue(`coach-session-v1-${token}`, JSON.stringify({ expiresAt: Date.now() + SESSION_DURATION_MS }));
    return res.status(200).json({ status: 'ok', token });
  }
  if (action === 'verify') {
    if (!token) return res.status(401).json({ status: 'invalid' });
    const sessionRaw = await getValue(`coach-session-v1-${token}`);
    if (!sessionRaw) return res.status(401).json({ status: 'invalid' });
    const session = JSON.parse(sessionRaw);
    if (session.expiresAt < Date.now()) {
      return res.status(401).json({ status: 'expired' });
    }
    return res.status(200).json({ status: 'ok' });
  }
  return res.status(400).json({ error: 'Action inconnue' });
}
