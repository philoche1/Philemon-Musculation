import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

const TABLE = 'kv_store';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours (comme aujourd'hui, mémorisé sur l'appareil)
const CLIENTS_KEY = 'clients-v1';

async function getValue(key) {
  const { data } = await supabaseAdmin.from(TABLE).select('value').eq('key', key).maybeSingle();
  return data ? data.value : null;
}

async function setValue(key, value) {
  await supabaseAdmin.from(TABLE).upsert({ key, value });
}

function genererNouveauPin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// Retrouve le client actuellement connecté à partir du jeton envoyé dans le header Authorization
async function getClientFromToken(req) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  const sessionRaw = await getValue(`client-session-v1-${token}`);
  if (!sessionRaw) return null;
  const session = JSON.parse(sessionRaw);
  if (session.expiresAt < Date.now()) return null;

  const clientsRaw = await getValue(CLIENTS_KEY);
  const clients = clientsRaw ? JSON.parse(clientsRaw) : [];
  const client = clients.find((c) => c.id === session.clientId);
  return client ? { client, clients } : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { action } = req.body;

  // --- Changer son code d'accès une fois connecté ---
  if (action === 'change_pin') {
    const { oldPin, newPin } = req.body;
    if (!oldPin || !newPin) return res.status(400).json({ error: 'Champs manquants' });
    if (!/^\d{4}$/.test(String(newPin))) {
      return res.status(400).json({ status: 'invalid_new_pin' });
    }

    const found = await getClientFromToken(req);
    if (!found) return res.status(401).json({ status: 'unauthorized' });
    const { client, clients } = found;

    if (String(client.pin) !== String(oldPin)) {
      return res.status(401).json({ status: 'wrong_pin' });
    }

    const newClients = clients.map((c) => (c.id === client.id ? { ...c, pin: String(newPin) } : c));
    await setValue(CLIENTS_KEY, JSON.stringify(newClients));

    return res.status(200).json({ status: 'ok' });
  }

  // --- Code oublié : génère un nouveau code et l'envoie par email ---
  if (action === 'forgot_pin') {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Champ manquant' });

    const clientsRaw = await getValue(CLIENTS_KEY);
    const clients = clientsRaw ? JSON.parse(clientsRaw) : [];
    const client = clients.find(
      (c) => (c.email || '').trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (!client) return res.status(200).json({ status: 'ok' }); // réponse identique, on ne révèle pas si l'email existe

    const nouveauPin = genererNouveauPin();
    const newClients = clients.map((c) => (c.id === client.id ? { ...c, pin: nouveauPin } : c));
    await setValue(CLIENTS_KEY, JSON.stringify(newClients));

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: client.email,
        subject: 'Ton nouveau code d’accès — Philémon Musculation',
        html: `
          <p>Salut ${client.name || ''},</p>
          <p>Voici ton nouveau code d'accès à 4 chiffres pour te connecter à ton suivi :</p>
          <p style="font-size:24px;font-weight:bold;">${nouveauPin}</p>
          <p>Tu peux le modifier à tout moment depuis ton espace, en bas de la page Profil.</p>
          <p>Merci,<br/>Philémon</p>
        `,
      });
    } catch (e) {
      // On ne bloque jamais la demande côté client même si l'email échoue
    }

    return res.status(200).json({ status: 'ok' });
  }

  // --- Connexion normale (comportement inchangé) ---
  const { email, pin } = req.body;
  if (!email || !pin) return res.status(400).json({ error: 'Champs manquants' });

  const clientsRaw = await getValue(CLIENTS_KEY);
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
