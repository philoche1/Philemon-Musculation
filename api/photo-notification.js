import { verifyClientToken } from '../src/lib/apiAuth.js';

const REPAS_LABELS = { matin: 'Matin', midi: 'Midi', gouter: 'Goûter', soir: 'Soir' };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const client = await verifyClientToken(token);
  if (!client) return res.status(401).json({ error: 'Non autorisé' });

  const { clientName, date, repas } = req.body;
  const repasLabel = REPAS_LABELS[repas] || repas || '';

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: 'philestmoncoach@gmail.com',
        subject: `📸 ${clientName || 'Un client'} a ajouté une photo alimentation`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
            <h2 style="color:#FF6400;">Nouvelle photo alimentation 📸</h2>
            <p><strong>${clientName || 'Un client'}</strong> vient d'ajouter une photo dans son espace alimentation${repasLabel ? ` (${repasLabel})` : ''}${date ? ` du ${date}` : ''}.</p>
            <p style="margin-top:24px;"><a href="https://suivi.philemon-musculation.com" style="background:#FF6400;color:white;padding:10px 18px;border-radius:8px;text-decoration:none;">Voir dans l'espace coach</a></p>
          </div>
        `,
      }),
    });
  } catch (e) {
    console.error('Erreur envoi email', e);
    return res.status(500).json({ error: "L'email n'a pas pu être envoyé" });
  }
  res.status(200).json({ success: true });
}
