import { verifyCoachToken } from '../src/lib/apiAuth.js';

const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const REPAS = ['matin', 'midi', 'gouter', 'soir'];

function extractJson(text) {
  // Le modèle peut entourer le JSON de balises markdown ```json ... ``` :
  // on retire tout ce qui n'est pas entre la première { et la dernière }.
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Pas de JSON trouvé');
  return JSON.parse(text.slice(start, end + 1));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const isCoach = await verifyCoachToken(token);
  if (!isCoach) return res.status(401).json({ error: 'Non autorisé' });

  const { planName, planDescription, mealRules, exclusions } = req.body;
  if (!mealRules) return res.status(400).json({ error: 'Champs manquants' });

  const rulesText = REPAS.map((r) => `- ${r} : ${(mealRules[r] || []).join(', ') || 'libre'}`).join('\n');

  const prompt = `Tu es un(e) diététicien(ne) qui construit un plan alimentaire hebdomadaire pour un client de coaching en musculation.

Règles de composition pour chaque repas (catégories devant apparaître dans l'assiette, parmi "legumes", "proteines", "glucides") :
${rulesText}

Plan de référence : ${planName || ''} — ${planDescription || ''}

Aliments à exclure absolument (allergies, intolérances, aversions du client) : ${exclusions && exclusions.trim() ? exclusions.trim() : 'aucun'}

Construis un plan pour 7 jours (lundi à dimanche), avec un repas pour matin, midi, goûter et soir, en respectant scrupuleusement les catégories imposées pour chaque repas et en excluant les aliments listés ci-dessus. Propose des recettes simples et réalistes de cuisine française du quotidien, varie les recettes sur la semaine (tu peux réutiliser une recette pour plusieurs créneaux si c'est cohérent, mais évite les répétitions excessives). Pour chaque recette, donne une liste d'ingrédients simple (sans quantités précises) et les catégories d'assiette qu'elle couvre réellement (parmi "legumes", "proteines", "glucides" uniquement).

Réponds UNIQUEMENT avec un JSON valide, sans aucun texte autour, sans balises markdown, au format exact suivant :
{
  "recettes": [
    { "nom": "string", "ingredients": ["string", "..."], "categories": ["legumes"|"proteines"|"glucides", "..."] }
  ],
  "grille": {
    "lundi": { "matin": <index dans recettes>, "midi": <index>, "gouter": <index>, "soir": <index> },
    "mardi": { ... },
    "mercredi": { ... },
    "jeudi": { ... },
    "vendredi": { ... },
    "samedi": { ... },
    "dimanche": { ... }
  }
}
Les index sont des nombres entiers correspondant à la position (à partir de 0) de la recette dans le tableau "recettes".`;

  try {
    const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error('Erreur API IA', aiRes.status, errText);
      return res.status(502).json({ error: "Le service IA n'a pas répondu correctement" });
    }
    const aiJson = await aiRes.json();
    const text = (aiJson.content || []).map((b) => b.text || '').join('');
    const parsed = extractJson(text);

    if (!Array.isArray(parsed.recettes) || !parsed.grille) {
      return res.status(502).json({ error: 'Réponse IA mal formée' });
    }
    // Validation légère de la grille pour éviter de propager des index invalides.
    JOURS.forEach((jour) => {
      if (!parsed.grille[jour]) parsed.grille[jour] = {};
      REPAS.forEach((repas) => {
        const idx = parsed.grille[jour][repas];
        if (typeof idx !== 'number' || idx < 0 || idx >= parsed.recettes.length) {
          parsed.grille[jour][repas] = null;
        }
      });
    });

    res.status(200).json(parsed);
  } catch (e) {
    console.error('Erreur génération plan IA', e);
    res.status(500).json({ error: "La génération du plan a échoué" });
  }
}
