# Déploiement — L'Académie des Mages

Le build statique généré par `npm run build` produit un dossier `dist/` prêt à déployer sur n'importe quel hébergement statique. Aucun backend requis.

## Prérequis commun

```bash
npm install
npm run build
```

Résultat : `dist/` contient `index.html`, les assets, le manifest PWA et le Service Worker.

---

## Option A — Netlify Drop (le plus simple, 1 minute)

1. Va sur https://app.netlify.com/drop
2. Glisse-dépose le dossier `dist/` dans la zone indiquée
3. Netlify te donne une URL du style `https://xyz.netlify.app`
4. Partage cette URL → n'importe quel parent/enfant peut cliquer, installer la PWA et jouer

## Option B — GitHub Pages

1. Crée un dépôt GitHub public (ex : `academie-des-mages`)
2. Pousse tout le projet
3. Dans le workflow `.github/workflows/deploy.yml` (à créer) :

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }
  deploy:
    needs: build
    permissions: { pages: write, id-token: write }
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

4. Active Pages dans Settings → Pages → Source : "GitHub Actions"
5. URL finale : `https://<user>.github.io/academie-des-mages/`

> **Note** : pour GitHub Pages, le jeu utilise des chemins relatifs (`base: './'` dans `vite.config.js`), donc ça fonctionne sous un sous-chemin sans config supplémentaire.

## Option C — Cloudflare Pages

1. https://dash.cloudflare.com → Pages → Create project
2. Connecte ton repo GitHub
3. Build command : `npm run build`
4. Output directory : `dist`
5. URL : `https://academie-des-mages.pages.dev` (ou domaine custom)

## Option D — Vercel

```bash
npm i -g vercel
vercel
```

Suivre les instructions. Vercel détecte Vite automatiquement. URL finale : `https://<projet>.vercel.app`.

---

## Partage

Une fois déployé :

1. Envoie l'URL à qui tu veux (WhatsApp, SMS, email)
2. Sur téléphone : ouvre le lien dans Chrome/Safari
3. Un bouton "📲 Installer l'app" apparaît en bas de l'accueil → l'app s'installe sur l'écran d'accueil
4. Le jeu fonctionne ensuite hors-ligne, comme une app native
5. Chaque appareil a sa propre sauvegarde (isolée par navigateur/origine)

## iOS — cas spécifique

Sur iOS Safari, il n'y a pas de `beforeinstallprompt`. L'utilisateur doit :
- Appuyer sur l'icône Partager (carré + flèche)
- Choisir "Sur l'écran d'accueil"
- L'app s'installe et se lance en plein écran

## Test local du build

```bash
npm run build
npm run preview
```

Ouvre http://localhost:4173 pour vérifier le build avant déploiement.

## Dépannage

- **PWA ne s'installe pas** : vérifie que le site est servi en HTTPS (obligatoire sauf localhost). Netlify, Vercel, Cloudflare et GitHub Pages fournissent HTTPS automatiquement.
- **Sauvegarde effacée** : localStorage est local au navigateur. Changer de navigateur ou vider les données efface la sauvegarde. Pour la migrer, implémenter un export/import JSON (roadmap).
- **Manette non détectée** : le navigateur doit la reconnaître. Chrome/Edge/Firefox supportent l'API Gamepad. Tester depuis `chrome://gamepad`.
