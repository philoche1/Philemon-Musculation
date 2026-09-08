import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

const LIEN_AVIS = 'https://g.page/r/CeunR46rQXyjEAE/review';
const URL_REDIRECTION_AVIS = 'https://suivi.philemon-musculation.com/api/avis';

const CLIENTS_KEY = 'clients-v1';
const bookingsKey = (clientId) => `calendly-bookings-v1-${clientId}`;
const COACH_ACCOUNT_KEY = 'coach-account-v1';
const WEBHOOK_ALERTS_KEY = 'calendly-webhook-alerts-v1';

// --- Petits helpers pour lire/écrire dans la table kv_store, en bypassant
// les policies RLS grâce à la clé service_role (contrairement à storage.js
// qui utilise la clé publique côté navigateur). ---
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
  if (req.method !== 'POST') return res.status(405).end();

  const event = req.body;

  // --- LOGS DE DIAGNOSTIC TEMPORAIRES : à retirer une fois le problème identifié ---
  console.log('DEBUG webhook body reçu :', JSON.stringify(event));
  // --- FIN LOGS DE DIAGNOSTIC ---

  const eventType = event.event; // 'invitee.created' ou 'invitee.canceled'
  const payload = event.payload;
  const email = payload?.email;
  const startTime = payload?.scheduled_event?.start_time;
  const eventUri = payload?.uri;
  const cancelUrl = payload?.cancel_url;
  const rescheduleUrl = payload?.reschedule_url;

  console.log('DEBUG valeurs extraites :', { eventType, email, startTime, eventUri });

  if (!email || !startTime) {
    console.log('DEBUG rejet 400 : email ou startTime manquant');
    return res.status(400).json({ error: 'Données Calendly incomplètes' });
  }

  // Retrouver le client par email dans la liste clients-v1
  const clients = (await kvGet(CLIENTS_KEY)) || [];
  const client = clients.find(
    (c) => (c.email || '').trim().toLowerCase() === email.trim().toLowerCase()
  );

  console.log('DEBUG client trouvé ?', client ? client.id : 'AUCUN', '- email recherché :', email);

  if (!client) {
    // Aucun compte client trouvé pour cet email — on historise et on alerte le coach
    await alerterEmailInconnu(email, eventType, startTime);
    return res.status(200).json({ ignored: true, reason: 'client inconnu' });
  }

  const bookings = (await kvGet(bookingsKey(client.id))) || [];

  console.log('DEBUG eventType est-il invitee.created ?', eventType === 'invitee.created');

  if (eventType === 'invitee.created') {
    bookings.push({
      uri: eventUri,
      start_time: startTime,
      status: 'reservee',
      cancel_url: cancelUrl || null,
      reschedule_url: rescheduleUrl || null,
    });
    await kvSet(bookingsKey(client.id), bookings);
    console.log('DEBUG réservation écrite pour client', client.id);
    await verifierEtEnvoyerRelanceAvis(client, clients);
  }

  if (eventType === 'invitee.canceled') {
    const idx = bookings.findIndex((b) => b.uri === eventUri);
    if (idx !== -1) {
      bookings[idx].status = 'annulee';
      await kvSet(bookingsKey(client.id), bookings);
    }
  }

  res.status(200).json({ success: true });
}

async function verifierEtEnvoyerRelanceAvis(client, clients) {
  if (client.avisClique) return; // déjà cliqué, on ne relance plus jamais

  const bookings = (await kvGet(bookingsKey(client.id))) || [];
  const nbReservations = bookings.filter((b) => b.status !== 'annulee').length;

  const dernierEnvoi = client.dernierMailAvisEnvoyeAReservation || 0;
  const doitEnvoyer =
    dernierEnvoi === 0
      ? nbReservations >= 3
      : nbReservations - dernierEnvoi >= 2;

  if (!doitEnvoyer) return;

  const lienTracke = `${URL_REDIRECTION_AVIS}?client=${client.id}`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: client.email,
    subject: 'Ton avis compte pour moi 🙏',
    html: `
      <p>Salut ${client.name || ''},</p>
      <p>Merci pour ta confiance depuis le début de tes séances !</p>
      <p>Si tu es satisfait(e), un avis Google m'aiderait énormément à me faire connaître à Alès. Ça prend 30 secondes :</p>
      <p><a href="${lienTracke}">Laisser un avis Google</a></p>
      <p>Merci beaucoup,<br/>Philémon</p>
    `,
  });

  const newClients = clients.map((c) =>
    c.id === client.id
      ? { ...c, dernierMailAvisEnvoyeAReservation: nbReservations }
      : c
  );
  await kvSet(CLIENTS_KEY, newClients);
}

async function alerterEmailInconnu(emailInconnu, eventType, startTime) {
  // Historise l'événement pour garder une trace consultable plus tard
  const alerts = (await kvGet(WEBHOOK_ALERTS_KEY)) || [];
  alerts.unshift({
    email: emailInconnu,
    eventType,
    startTime,
    detectedAt: new Date().toISOString(),
  });
  await kvSet(WEBHOOK_ALERTS_KEY, alerts.slice(0, 100)); // garde les 100 derniers

  // Envoie un mail immédiat au coach
  const account = await kvGet(COACH_ACCOUNT_KEY);
  const coachEmail = account?.email;
  if (!coachEmail) return;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: coachEmail,
      subject: '⚠️ Réservation Calendly non reconnue (Musculation)',
      html: `
        <p>Une réservation Calendly est arrivée avec une adresse mail qui ne correspond à aucun client enregistré.</p>
        <p><strong>Email utilisé :</strong> ${emailInconnu}</p>
        <p><strong>Créneau réservé :</strong> ${startTime ? new Date(startTime).toLocaleString('fr-FR') : 'inconnu'}</p>
        <p>Vérifie l'adresse mail enregistrée dans la fiche du client concerné et corrige-la si besoin, sinon sa réservation ne sera pas liée à son suivi.</p>
      `,
    });
  } catch (e) {
    console.log('DEBUG échec envoi email alerte :', e.message);
  }
}
