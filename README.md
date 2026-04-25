# L'Académie des Mages ✨

Jeu vidéo éducatif en pixel art 16-bit, jouable 100% en local dans un navigateur. Cible : enfant CM1 (9-10 ans). Consolide le programme CM1 (~70%), introduit le CM2 (~25%) et débouche sur un niveau bonus 6ème 1er trimestre.

- **PWA installable** (mobile, tablette, desktop)
- **Manette Xbox + clavier + tactile**
- **Fonctionne offline** après le 1er chargement
- **Sauvegarde automatique** (localStorage, isolée par appareil)

## 🎮 Démarrage

```bash
npm install
npm run dev
```

Ouvre http://localhost:5173 dans ton navigateur.

## 🏗️ Build production

```bash
npm run build
```

Le résultat se trouve dans `dist/` — déployable en hébergement statique.

Voir [DEPLOY.md](./DEPLOY.md) pour les instructions de déploiement (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## 📁 Structure

```
src/
├── main.jsx, App.jsx          — Entrée + routeur d'écrans
├── index.css                  — Tailwind + styles pixel
├── balance/config.js          — ÉQUILIBRAGE CENTRAL (tous les chiffres)
├── save/save.js               — Sauvegarde localStorage
├── audio/soundEngine.js       — SFX 8-bit Web Audio
├── input/
│   ├── gamepad.js             — Manette Xbox (API Gamepad)
│   ├── inputManager.js        — Gestionnaire unifié (clavier+manette+tactile)
│   └── haptics.js             — Vibrations mobile + manette
├── sprites/
│   ├── PixelSprite.jsx        — Composant de rendu
│   ├── palettes.js            — Palette 32 couleurs
│   └── library.js             — Bibliothèque de sprites (matrices)
├── questions/                 — Banques CM1, CM2, 6ème + générateurs
├── shop/catalogue.js          — Articles boutique
├── companions/companions.js   — 5 compagnons
├── tutorial/tutorial.js       — 6 chapitres
├── data/mondes.js             — Définition des 11 mondes
├── store/gameStore.jsx        — État global (Context + reducer)
├── components/                — UI réutilisable
└── screens/                   — Écrans du jeu
```

## ➕ Ajouter du contenu

- **Question** : édite `src/questions/banque-*.js` et ajoute un objet au tableau. Le champ `monde` sélectionne dans quel monde elle apparaît.
- **Sprite** : ajoute une matrice dans `src/sprites/library.js` avec les indices de palette.
- **Article boutique** : `src/shop/catalogue.js`, 4 catégories.
- **Compagnon** : `src/companions/companions.js` + sprite dans `library.js`.

## 🕹️ Contrôles

| Bouton | Clavier | Manette Xbox | Tactile |
|--------|---------|--------------|---------|
| Valider | Espace/Entrée | A | Ⓐ vert |
| Retour | Échap | B | Ⓑ rouge |
| Sorts | F | X | Ⓧ bleu |
| Compagnon | C | Y | Ⓨ jaune |
| Onglets ← → | Q / E | LB / RB | — |
| Pause | P | Start | Bouton ☰ |

## 🔐 Mode parent

Depuis l'accueil → Mode Parent → PIN 4 chiffres (choisi à la première visite).
Accès aux statistiques : temps, taux de réussite, progression, économie.

## 💾 Reset

Depuis l'accueil → ⚙️ Options → Réinitialiser le jeu (double confirmation).

## 🧪 Qualité & tests

- Type checking : néant (JSX pur). Build Vite valide la syntaxe.
- Sauvegarde : stockée sous `academie_des_mages_save` dans localStorage. Robuste : try/catch autour des lectures/écritures.
- PWA : `manifest.json` généré par `vite-plugin-pwa`, Service Worker avec `autoUpdate`.

## 📱 Déploiement mobile

Après build + déploiement, ouvre l'URL sur un téléphone :
- **Android (Chrome)** : le bouton "📲 Installer l'app" apparaît automatiquement.
- **iOS (Safari)** : Partager → Sur l'écran d'accueil.
- Une fois installée, l'app tourne comme une app native, offline.

Chaque appareil a sa propre sauvegarde (isolée par navigateur/origine).

## 🎨 Crédits sprites

Le jeu utilise le pack **Ninja Adventure Asset Pack** par [Pixel-Boy](https://pixel-boy.itch.io/) & AAA, distribué sous licence **CC0 1.0 Universal** (domaine public). Aucune obligation de crédit mais on les remercie chaleureusement.

- Pack : https://pixel-boy.itch.io/ninja-adventure-asset-pack
- Support Patreon : https://www.patreon.com/pixelarchipel

## 📜 Licence

Code du jeu : usage personnel et éducatif. Assets graphiques : CC0 (voir crédits).
