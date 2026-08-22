# Philémon Musculation — version site web

Ceci est la version "site web autonome" de ton application, prête à être
hébergée en ligne puis intégrée sur ta page systeme.io.

L'application elle-même (`src/App.jsx`) est exactement celle que tu utilises
dans Claude — rien n'a été changé côté fonctionnalités. Ce qui a changé,
c'est juste la façon dont les données sont sauvegardées : au lieu du
stockage propre à Claude, elle utilise maintenant une vraie base de données
en ligne (Supabase, gratuite) pour que ton coach et tes clients partagent
bien les mêmes données depuis n'importe quel appareil, sur n'importe quel
site.

---

## Étape 1 — Créer la base de données (Supabase, gratuit, ~5 min)

1. Va sur https://supabase.com et crée un compte gratuit.
2. Crée un nouveau projet (choisis un nom et un mot de passe, la région la
   plus proche de toi).
3. Une fois le projet créé, va dans l'onglet **SQL Editor** (menu de
   gauche) et colle ce code, puis clique sur **Run** :

   ```sql
   create table kv_store (
     key text primary key,
     value text not null,
     updated_at timestamptz default now()
   );

   alter table kv_store enable row level security;

   create policy "public read" on kv_store
     for select using (true);

   create policy "public write" on kv_store
     for insert with check (true);

   create policy "public update" on kv_store
     for update using (true);

   create policy "public delete" on kv_store
     for delete using (true);
   ```

   ⚠️ Ces règles rendent la table lisible/modifiable par toute personne qui
   connaît l'adresse du site (comme le fait `window.storage` partagé dans
   Claude). C'est suffisant pour un usage coach/client simple. Si tu veux
   sécuriser davantage plus tard (vrais comptes utilisateurs), on pourra
   ajouter une authentification Supabase.

4. Va dans **Project Settings → API**. Note les deux valeurs suivantes :
   - **Project URL** (ressemble à `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public key** (une longue chaîne de caractères)

---

## Étape 2 — Configurer le projet

1. Ouvre le fichier `.env.example`, copie-le en `.env` :
   ```
   cp .env.example .env
   ```
2. Remplis `.env` avec les deux valeurs récupérées à l'étape 1 :
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=ta-clé-anon-ici
   ```

---

## Étape 3 — Tester en local (optionnel mais recommandé)

Si tu as Node.js installé sur ton ordinateur :

```
npm install
npm run dev
```

Puis ouvre l'adresse affichée (en général `http://localhost:5173`) dans ton
navigateur pour vérifier que tout fonctionne avant de mettre en ligne.

---

## Étape 4 — Mettre le site en ligne (Vercel, gratuit)

La façon la plus simple, sans ligne de commande :

1. Va sur https://vercel.com et crée un compte gratuit (tu peux te
   connecter avec GitHub, Google, etc.).
2. Clique sur **Add New → Project**.
3. Choisis **"Deploy without Git"** si tu n'as pas de compte GitHub, ou
   pousse ce dossier sur un dépôt GitHub puis importe-le depuis Vercel
   (recommandé si tu veux pouvoir remettre à jour facilement plus tard).
4. Dans les paramètres du projet Vercel, va dans **Settings →
   Environment Variables** et ajoute les deux mêmes variables que dans ton
   `.env` :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clique sur **Deploy**. Après une minute ou deux, Vercel te donne une
   adresse du type `https://philemon-musculation.vercel.app`.

C'est cette adresse que tu vas utiliser à l'étape suivante.

---

## Étape 5 — Intégrer sur ta page systeme.io

1. Dans l'éditeur de page systeme.io, ajoute un bloc **"Code HTML"** (ou
   "Élément personnalisé" selon la version) à l'endroit où tu veux que
   l'application apparaisse.
2. Colle ce code, en remplaçant l'URL par la tienne :

   ```html
   <iframe
     src="https://philemon-musculation.vercel.app"
     style="width: 100%; height: 900px; border: none; border-radius: 12px;"
     title="Philémon Musculation"
   ></iframe>
   ```

3. Publie la page. L'application s'affiche directement dans ton site,
   avec les mêmes fonctionnalités que dans Claude.

---

## Mettre à jour l'application plus tard

Si tu me redemandes des modifications sur l'app dans Claude, je te
redonnerai un fichier `App.jsx` à jour. Il suffira de remplacer
`src/App.jsx` par la nouvelle version dans ce projet, puis de redéployer
sur Vercel (automatique si tu es passé par GitHub, ou en relançant le
déploiement sinon).
