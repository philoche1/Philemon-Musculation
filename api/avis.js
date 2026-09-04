import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const LIEN_AVIS = 'https://g.page/r/CeunR46rQXyjEAE/review';
const CLIENTS_KEY = 'clients-v1';

async function kvGet(key) {
  const { data, error } = await supabaseAdmin
    .from('kv_store')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error || !data) return null;
  try {
    return JSON.parse(data.value);
  } catch (e) {
    return null;
  }
}

async function kvSet(key, value) {
  const { error } = await supabaseAdmin
    .from('kv_store')
    .upsert({ key, value: JSON.stringify(value) });
  if (error) throw error;
}

export default async function handler(req, res) {
  const clientId = req.query?.client;

  if (clientId) {
    const clients = (await kvGet(CLIENTS_KEY)) || [];
    const newClients = clients.map((c) =>
      c.id === clientId ? { ...c, avisClique: true } : c
    );
    await kvSet(CLIENTS_KEY, newClients);
  }

  res.writeHead(302, { Location: LIEN_AVIS });
  res.end();
}
