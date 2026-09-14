import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TABLE = 'kv_store';
const PROSPECTS_KEY = 'prospects-v1';

// Chaîne secrète partagée avec Zapier (configurée dans le Zap), pour éviter
// que n'importe qui puisse appeler cette route et ajouter de faux prospects.
const ZAPIER_SECRET = process.env.ZAPIER_WEBHOOK_SECRET;

function uid(prefix) {
  return prefix + Math.random().toString(36).slice(2, 9);
}

async function getRawValue(key) {
  const { data } = await supabaseAdmin.from(TABLE).select('value').eq('key', key).maybeSingle();
  return data ? data.value : null;
}

async function setRawValue(key, value) {
  const { error } = await supabaseAdmin.from(TABLE).upsert({ key, value });
  if (error) throw new Error(error.message);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { secret, name, contact, notes } = req.body || {};

  if (!ZAPIER_SECRET || secret !== ZAPIER_SECRET) {
    return res.status(401).json({ error: 'Secret invalide' });
  }

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Le nom du prospect est obligatoire' });
  }

  try {
    const raw = await getRawValue(PROSPECTS_KEY);
    const prospects = raw ? JSON.parse(raw) : [];

    prospects.push({
      id: uid('prospect'),
      stage: 0,
      name: name.trim(),
      contact: (contact || '').trim(),
      source: 'Pub Meta',
      notes: (notes || '').trim(),
    });

    await setRawValue(PROSPECTS_KEY, JSON.stringify(prospects));

    return res.status(200).json({ success: true, totalProspects: prospects.length });
  } catch (err) {
    console.error('Erreur webhook Zapier leads', err);
    return res.status(500).json({ error: err.message });
  }
}
