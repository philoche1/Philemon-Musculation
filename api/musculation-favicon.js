import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  const host = req.headers.host || '';
  const estAdmin = host.startsWith('admin.');
  const nomFichier = estAdmin ? 'favicon-admin.png' : 'favicon.png';

  const cheminFichier = join(process.cwd(), 'public', nomFichier);
  const image = readFileSync(cheminFichier);

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes, pour ne pas rester bloqué trop longtemps si on change l'icône plus tard
  res.status(200).send(image);
}
