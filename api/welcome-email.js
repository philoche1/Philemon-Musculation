export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (token !== process.env.ADMIN_PASSWORD) {
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

            <div style="background:#F2F4F7; border-radius:8px; padding:16px; margin-top:20px;">
              <p style="margin:0 0 8px 0; font-weight:600;">📱 Astuce : garde ton suivi à portée de main</p>
              <p style="font-size:13px; color:#374151; margin:0 0 10px 0;">Une fois connecté(e), tu peux ajouter ton espace directement sur ton écran d'accueil, comme une vraie application :</p>
              <p style="font-size:13px; color:#374151; margin:0 0 6px 0;"><strong>Sur iPhone (Safari) :</strong> appuie sur l'icône de partage <span style="font-family: monospace;">⬆️</span> en bas de l'écran, puis "Sur l'écran d'accueil".</p>
              <p style="font-size:13px; color:#374151; margin:0;"><strong>Sur Android (Chrome) :</strong> appuie sur les 3 points en haut à droite, puis "Installer l'application" ou "Ajouter à l'écran d'accueil".</p>
            </div>

            <p style="margin-top:20px;">Une petite vidéo pour bien démarrer : <a href="${process.env.WELCOME_VIDEO_URL_MUSCU || '#'}">voir la vidéo</a></p>
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
