import { verifyCoachToken } from '../src/lib/apiAuth.js';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TABLE = 'kv_store';
const PROSPECTS_KEY = 'prospects-v1';
const IMPORTED_LEADS_KEY = 'meta-leads-imported-v1';

// ID de la Page "PhilCoach" (Philémon Musculation)
const PAGE_ID = process.env.META_PAGE_ID || '941246529073025';
const PAGE_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;

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
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).end();

  // Autorisé soit par un coach connecté (bouton dans l'app), soit par le
  // cron Vercel qui envoie automatiquement Authorization: Bearer <CRON_SECRET>.
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const isCronCall = !!process.env.CRON_SECRET && token === process.env.CRON_SECRET;
  const isCoach = isCronCall || (await verifyCoachToken(token));
  if (!isCoach) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  if (!PAGE_TOKEN) {
    return res.status(500).json({ error: "META_PAGE_ACCESS_TOKEN n'est pas configuré" });
  }

  try {
    const formsResp = await fetch(
      `https://graph.facebook.com/v19.0/${PAGE_ID}/leadgen_forms?access_token=${PAGE_TOKEN}&fields=id,name`
    );
    const formsData = await formsResp.json();
    if (formsData.error) {
      return res.status(500).json({ error: 'Erreur formulaires Meta : ' + formsData.error.message });
    }

    const importedRaw = await getRawValue(IMPORTED_LEADS_KEY);
    const importedIds = new Set(importedRaw ? JSON.parse(importedRaw) : []);

    const prospectsRaw = await getRawValue(PROSPECTS_KEY);
    const prospects = prospectsRaw ? JSON.parse(prospectsRaw) : [];

    let added = 0;
    const erreursFormulaires = [];

    for (const form of formsData.data || []) {
      let url = `https://graph.facebook.com/v19.0/${form.id}/leads?access_token=${PAGE_TOKEN}&fields=id,field_data,created_time&limit=100`;

      while (url) {
        const leadsResp = await fetch(url);
        const leadsData = await leadsResp.json();
        if (leadsData.error) {
          erreursFormulaires.push(`${form.name}: ${leadsData.error.message}`);
          break;
        }

        for (const lead of leadsData.data || []) {
          if (importedIds.has(lead.id)) continue;

          const fields = {};
          (lead.field_data || []).forEach((f) => {
            fields[f.name] = f.values?.[0] || '';
          });

          // Adapte ces clés aux noms exacts des questions de ton/tes formulaire(s).
          const nom =
            fields.full_name ||
            [fields.first_name, fields.last_name].filter(Boolean).join(' ') ||
            'Lead Meta';
          const contact = fields.phone_number || fields.email || '';
          const autresChamps = Object.entries(fields)
            .filter(([k]) => !['full_name', 'first_name', 'last_name', 'phone_number', 'email'].includes(k))
            .map(([k, v]) => `${k}: ${v}`)
            .join(' · ');

          prospects.push({
            id: uid('prospect'),
            stage: 0,
            name: nom,
            contact,
            source: 'Pub Meta',
            notes: autresChamps,
          });
          importedIds.add(lead.id);
          added++;
        }

        url = leadsData.paging && leadsData.paging.next ? leadsData.paging.next : null;
      }
    }

    if (added > 0) {
      await setRawValue(PROSPECTS_KEY, JSON.stringify(prospects));
      await setRawValue(IMPORTED_LEADS_KEY, JSON.stringify([...importedIds]));
    }

    return res.status(200).json({
      success: true,
      added,
      totalProspects: prospects.length,
      formulairesAnalyses: (formsData.data || []).length,
      erreursFormulaires,
    });
  } catch (err) {
    console.error('Erreur synchronisation leads Meta', err);
    return res.status(500).json({ error: err.message });
  }
}
