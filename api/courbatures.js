// Questionnaire "courbatures" envoyé par email 2 jours après une séance réservée
// sur Calendly. Un seul fichier (limite du nombre de fonctions Vercel) :
//   GET  /api/courbatures?action=cron            -> envoi quotidien (appelé par Vercel Cron)
//   GET  /api/courbatures?action=info&t=TOKEN    -> infos affichées sur la page du questionnaire
//   POST /api/courbatures  { t, intensite, zones, commentaire, continuer }  -> enregistre la réponse
//   GET  /api/courbatures?action=stop&t=TOKEN    -> "Ne plus recevoir" (lien dans l'email)
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { createHmac, createHash, timingSafeEqual } from 'crypto';

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

const SITE = 'https://suivi.philemon-musculation.com';
const CLIENTS_KEY = 'clients-v1';
const bookingsKey = (clientId) => `calendly-bookings-v1-${clientId}`;
const courbaturesKey = (clientId) => `courbatures-v1-${clientId}`;

const JOURS_APRES_SEANCE = 2; // l'email part le 2e jour après la séance
const JOURS_RATTRAPAGE_MAX = 4; // si le cron a raté un jour, on rattrape jusqu'à J+4
const VALIDITE_LIEN_MS = 30 * 24 * 60 * 60 * 1000;

const ZONES = [
  'Quadriceps', 'Ischio-jambiers', 'Fessiers', 'Mollets', 'Dos', 'Pectoraux',
  'Épaules', 'Biceps', 'Triceps', 'Abdos', 'Autre',
];

// --- kv_store (même format que les autres fonctions : valeur = JSON en texte) ---
async function kvGet(key) {
  const { data, error } = await supabaseAdmin.from('kv_store').select('value').eq('key', key).maybeSingle();
  if (error || !data) return null;
  try { return JSON.parse(data.value); } catch (e) { return null; }
}
async function kvSet(key, value) {
  const { error } = await supabaseAdmin.from('kv_store').upsert({ key, value: JSON.stringify(value) });
  if (error) throw error;
}

// --- Jeton signé (aucune connexion nécessaire pour répondre) ---
function sign(clientId, entryId) {
  return createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY)
    .update(`courbatures:${clientId}:${entryId}`).digest('hex').slice(0, 32);
}
function makeToken(clientId, entryId) {
  return `${clientId}.${entryId}.${sign(clientId, entryId)}`;
}
function readToken(t) {
  const parts = String(t || '').split('.');
  if (parts.length !== 3) return null;
  const [clientId, entryId, sig] = parts;
  const expected = sign(clientId, entryId);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return { clientId, entryId };
}

const parisDate = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(d); // YYYY-MM-DD
const daysBetween = (isoA, isoB) => Math.round((new Date(isoB) - new Date(isoA)) / 86400000);
const entryIdFor = (uri) => createHash('sha1').update(String(uri)).digest('hex').slice(0, 12);
const escapeHtml = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export default async function handler(req, res) {
  const action = req.query.action || (req.method === 'POST' ? 'submit' : '');
  try {
    if (action === 'cron') return await envoiQuotidien(req, res);
    if (action === 'info') return await infos(req, res);
    if (action === 'submit' && req.method === 'POST') return await enregistrer(req, res);
    if (action === 'stop') return await arreter(req, res);
  } catch (e) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
  return res.status(400).json({ error: 'Action inconnue' });
}

// ───────────────────────── Envoi quotidien ─────────────────────────
async function envoiQuotidien(req, res) {
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null;
  if (!expected || req.headers.authorization !== expected) return res.status(401).json({ error: 'Non autorisé' });

  const today = parisDate(new Date());
  const clients = (await kvGet(CLIENTS_KEY)) || [];
  let envoyes = 0;

  for (const client of clients) {
    if (!client.email || client.courbaturesQuestionnaire === false) continue;
    const bookings = (await kvGet(bookingsKey(client.id))) || [];
    const reponses = (await kvGet(courbaturesKey(client.id))) || [];
    let modifie = false;

    for (const b of bookings) {
      if (b.status === 'annulee' || !b.start_time || !b.uri) continue;
      const id = entryIdFor(b.uri);
      if (reponses.some((r) => r.id === id)) continue; // déjà envoyé
      const diff = daysBetween(parisDate(new Date(b.start_time)), today);
      if (diff < JOURS_APRES_SEANCE || diff > JOURS_RATTRAPAGE_MAX) continue;

      try {
        await envoyerEmail(client, id, b.start_time);
        reponses.push({ id, bookingUri: b.uri, sessionDate: b.start_time, sentAt: new Date().toISOString(), answeredAt: null });
        modifie = true;
        envoyes++;
      } catch (e) { /* on réessaiera demain (tant que J+4 n'est pas dépassé) */ }
    }
    if (modifie) await kvSet(courbaturesKey(client.id), reponses);
  }
  return res.status(200).json({ ok: true, envoyes });
}

async function envoyerEmail(client, entryId, startTime) {
  const lien = `${SITE}/courbatures.html?t=${makeToken(client.id, entryId)}`;
  const lienStop = `${SITE}/api/courbatures?action=stop&t=${makeToken(client.id, entryId)}`;
  const dateTxt = new Date(startTime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Paris' });
  const prenom = escapeHtml((client.name || '').split(' ')[0]);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: client.email,
    subject: 'Comment vont tes courbatures ?',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; color:#222;">
        <h2 style="color:#FF6400;">Philémon Musculation</h2>
        <p>Salut ${prenom},</p>
        <p>Ta séance de ${dateTxt} date d'il y a deux jours. Prends 30 secondes pour me dire comment tu as récupéré (zones et intensité des courbatures) : ça m'aide à adapter tes prochaines séances.</p>
        <p style="margin:24px 0;"><a href="${lien}" style="background:#FF6400;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;">Remplir le questionnaire</a></p>
        <p style="font-size:12px;color:#888;">Tu peux choisir de continuer ou non à recevoir ce questionnaire après tes prochaines séances. <a href="${lienStop}" style="color:#888;">Ne plus recevoir ce questionnaire</a></p>
        <p>À bientôt,<br/>Philémon</p>
      </div>`,
  });
}

// ───────────────────────── Page du questionnaire ─────────────────────────
async function trouverEntree(t) {
  const tok = readToken(t);
  if (!tok) return null;
  const reponses = (await kvGet(courbaturesKey(tok.clientId))) || [];
  const entree = reponses.find((r) => r.id === tok.entryId);
  if (!entree) return null;
  if (Date.now() - new Date(entree.sentAt).getTime() > VALIDITE_LIEN_MS) return { expired: true };
  return { ...tok, reponses, entree };
}

async function infos(req, res) {
  const found = await trouverEntree(req.query.t);
  if (!found) return res.status(404).json({ error: 'Lien invalide' });
  if (found.expired) return res.status(410).json({ error: 'Lien expiré' });
  const clients = (await kvGet(CLIENTS_KEY)) || [];
  const client = clients.find((c) => c.id === found.clientId);
  return res.status(200).json({
    prenom: ((client && client.name) || '').split(' ')[0],
    sessionDate: found.entree.sessionDate,
    dejaRepondu: !!found.entree.answeredAt,
    continuer: !client || client.courbaturesQuestionnaire !== false,
    zones: ZONES,
  });
}

async function enregistrer(req, res) {
  const { t, intensite, zones, commentaire, continuer } = req.body || {};
  const found = await trouverEntree(t);
  if (!found) return res.status(404).json({ error: 'Lien invalide' });
  if (found.expired) return res.status(410).json({ error: 'Lien expiré' });
  const n = Number(intensite);
  if (!Number.isFinite(n) || n < 0 || n > 10) return res.status(400).json({ error: 'Intensité invalide' });
  const zonesOk = (Array.isArray(zones) ? zones : []).filter((z) => ZONES.includes(z));

  const maj = found.reponses.map((r) => (r.id === found.entryId
    ? { ...r, answeredAt: new Date().toISOString(), intensite: n, zones: zonesOk, commentaire: String(commentaire || '').slice(0, 500) }
    : r));
  await kvSet(courbaturesKey(found.clientId), maj);
  await definirPreference(found.clientId, continuer !== false);
  return res.status(200).json({ ok: true });
}

async function arreter(req, res) {
  const tok = readToken(req.query.t);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (!tok) return res.status(404).send('<p style="font-family:sans-serif">Lien invalide.</p>');
  await definirPreference(tok.clientId, false);
  return res.status(200).send(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <body style="font-family:sans-serif;background:#0f0d0b;color:#fff;text-align:center;padding:60px 20px;">
    <h2 style="color:#FF6400;">C'est noté</h2><p>Tu ne recevras plus le questionnaire courbatures. Tu peux me prévenir si tu changes d'avis.</p></body>`);
}

async function definirPreference(clientId, continuer) {
  const clients = (await kvGet(CLIENTS_KEY)) || [];
  const maj = clients.map((c) => (c.id === clientId ? { ...c, courbaturesQuestionnaire: continuer } : c));
  await kvSet(CLIENTS_KEY, maj);
}
