import { verifyCoachToken } from '../src/lib/apiAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  const isCoach = await verifyCoachToken(token);
  if (!isCoach) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  const { name, email, pin } = req.body;
  if (!name || !email || !pin) {
    return res.status(400).json({ error: 'Champs manquants' });
  }
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: 'Bienvenue sur ton espace Philémon Musculation',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
            <h2 style="color:#FF6400;">Bienvenue ${name} 👋</h2>
            <p>Ton espace client Philémon Musculation est prêt ! Tu peux y suivre tes séances réservées et ta progression.</p>
            <p style="margin-bottom:6px;"><strong>Identifiant</strong></p>
            <div style="background:#F2F4F7; border:1px solid #E5E7EB; border-radius:8px; padding:12px 14px; margin-bottom:18px; font-family: monospace; font-size:16px; word-break:break-all;">
              ${email}
            </div>
            <p style="margin-bottom:6px;"><strong>Code d'accès</strong></p>
            <div style="background:#F2F4F7; border:1px solid #E5E7EB; border-radius:8px; padding:12px 14px; margin-bottom:18px; font-family: monospace; font-size:20px; letter-spacing:4px; text-align:center;">
              ${pin}
            </div>
            <p style="margin-top:24px;"><a href="https://suivi.philemon-musculation.com" style="background:#FF6400;color:white;padding:10px 18px;border-radius:8px;text-decoration:none;">Accéder à mon espace</a></p>
            <p style="margin-top:24px; margin-bottom:8px;">Une petite vidéo pour bien démarrer :</p>
            <a href="${process.env.WELCOME_VIDEO_URL_MUSCU || '#'}" style="display:block; text-decoration:none; text-align:center;">
              <img src="https://suivi.philemon-musculation.com/philemon-video-thumbnail.png?v=3" alt="Voir la vidéo de bienvenue" width="280" height="326" style="display:inline-block; width:280px; height:326px; max-width:100%; border-radius:8px; border:0;" />
            </a>
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
