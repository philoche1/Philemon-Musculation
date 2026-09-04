export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  const { clientName, date } = req.body;
  if (!clientName || !date) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  const dateFR = new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: 'philemon.stordeur@gmail.com',
        subject: `${clientName} a rempli sa séance`,
        html: `<p>${clientName} a rempli sa séance du ${dateFR}.</p>`,
      }),
    });
  } catch (e) {
    console.error('Erreur envoi email', e);
    return res.status(500).json({ error: "L'email n'a pas pu être envoyé" });
  }

  res.status(200).json({ success: true });
}
