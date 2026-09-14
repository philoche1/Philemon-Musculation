import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TABLE = 'kv_store';
const PROSPECTS_KEY = 'prospects-v1';

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const APP_SECRET = process.env.META_APP_SECRET; // optionnel mais recommandé

function uid(prefix) {
  return prefix + Math.random().toString(36).slice(2, 9);
}

// Vérifie que la requête vient bien de Meta (si META_APP_SECRET est configuré)
function isValidSignature(req, rawBody) {
  if (!APP_SECRET) return true; // vérification désactivée si le secret n'est pas défini
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return false;
  const expected =
    'sha256=' + crypto.createHmac('sha256', APP_SECRET).update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

async function getRawValue(key) {
  const { data } = await supabaseAdmin.from(TABLE).select('value').eq('key', key).maybeSingle();
  return data ? data.value : null;
}

async function appendProspect(prospect) {
  // Lecture-modification-écriture : suffisant pour le volume de leads d'une seule Page.
  const raw = await getRawValue(PROSPECTS_KEY);
  const list = raw ? JSON.parse(raw) : [];
  list.push(prospect);
  const { error } = await supabaseAdmin
    .from(TABLE)
    .upsert({ key: PROSPECTS_KEY, value: JSON.stringify(list) });
  if (error) throw new Error(error.message);
}

// Vercel ne parse pas automatiquement le body en JSON quand on a besoin du
// texte brut pour vérifier la signature — on le lit nous-mêmes.
export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  // 1. Vérification du webhook par Meta (appel GET, une seule fois à la configuration)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Verification failed');
  }

  // 2. Réception d'un nouveau lead
  if (req.method === 'POST') {
    const rawBody = await readRawBody(req);

    if (!isValidSignature(req, rawBody)) {
      return res.status(401).send('Invalid signature');
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return res.status(400).send('Invalid JSON');
    }

    try {
      const changes = (body.entry || []).flatMap((e) => e.changes || []);

      for (const change of changes) {
        if (change.field !== 'leadgen') continue;
        const leadgenId = change.value.leadgen_id;

        const resp = await fetch(
          `https://graph.facebook.com/v19.0/${leadgenId}?access_token=${PAGE_ACCESS_TOKEN}`
        );
        const leadData = await resp.json();
        if (leadData.error) {
          console.error('Erreur Graph API', leadData.error);
          continue;
        }

        const fields = {};
        (leadData.field_data || []).forEach((f) => {
          fields[f.name] = f.values?.[0] || '';
        });

        // Adapte ces clés aux noms exacts des questions de ton formulaire Meta
        // (visibles dans le récapitulatif du formulaire côté Ads Manager).
        const nom = fields.full_name || [fields.first_name, fields.last_name].filter(Boolean).join(' ') || 'Lead Meta';
        const contact = fields.phone_number || fields.email || '';
        const autresChamps = Object.entries(fields)
          .filter(([k]) => !['full_name', 'first_name', 'last_name', 'phone_number', 'email'].includes(k))
          .map(([k, v]) => `${k}: ${v}`)
          .join(' · ');

        await appendProspect({
          id: uid('prospect'),
          stage: 0,
          name: nom,
          contact,
          source: 'Pub Meta',
          notes: autresChamps,
        });
      }

      return res.status(200).send('EVENT_RECEIVED');
    } catch (err) {
      console.error('Erreur webhook Meta leads', err);
      return res.status(500).send('Error');
    }
  }

  return res.status(405).send('Method not allowed');
}
