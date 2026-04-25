# Packs de sprites pixel art — guide d'intégration

Le jeu est prêt à utiliser des sprites PNG externes en plus (ou à la place) des sprites codés. Il suffit de télécharger un pack, d'en placer les PNG dans `public/assets/` et de remplir le registre.

## Packs recommandés (gratuits)

### 1. **Ninja Adventure Asset Pack** ⭐ recommandé
- **Auteur** : Pixel-Boy & AAA
- **URL** : https://pixel-boy.itch.io/ninja-adventure-asset-pack
- **Licence** : gratuit, attribution demandée (CC BY 4.0)
- **Contenu** : 100+ personnages, monstres, compagnons, items, décors, effets, 10 tilesets de biomes. Style mignon et cohérent.
- **Pourquoi** : couvre quasiment tout ce dont on a besoin (mage, gobelin, slime, dragon, chat, chouette, forêt, désert, château, etc.)

### 2. **Mystic Woods**
- **Auteur** : Game Endeavor
- **URL** : https://game-endeavor.itch.io/mystic-woods
- **Licence** : gratuit (version de base), version complète payante (~15€)
- **Contenu** : magnifique forêt mystique, perso, slimes, arbres, maison
- **Pourquoi** : très joli pour Monde 1 et Monde 3 si on veut du haut de gamme

### 3. **Kenney — Tiny Dungeon** (fallback minimaliste)
- **URL** : https://kenney.nl/assets/tiny-dungeon
- **Licence** : CC0 (domaine public)
- **Contenu** : héros, monstres, tiles, objets
- **Pourquoi** : pas besoin de créditer. Style plus simple mais très propre.

### 4. **Tiny Swords** (pour les combats)
- **Auteur** : Pixel Frog
- **URL** : https://pixelfrog-assets.itch.io/tiny-swords
- **Licence** : CC0
- **Contenu** : chevalier, orc, gobelin, bâtiments, nature
- **Pourquoi** : superbes animations pour combat

## Installation (exemple avec Ninja Adventure)

1. Télécharge le pack depuis https://pixel-boy.itch.io/ninja-adventure-asset-pack (clique "Download Now", offre 0€ ou donne ce que tu veux)
2. Décompresse le fichier ZIP
3. Dans le projet, crée le dossier **`public/assets/`** :
   ```
   academie-des-mages/
     public/
       assets/
         characters/
         enemies/
         companions/
         effects/
         decor/
   ```
4. Copie les PNG qui t'intéressent dans les bons sous-dossiers. Par exemple pour Ninja Adventure :
   - `Actor/Characters/WhiteNinja/SpriteSheet.png` → `public/assets/characters/mage.png`
   - `Actor/Characters/GreenNinja/SpriteSheet.png` → `public/assets/characters/aldric.png`
   - `Actor/Monsters/Slime/Slime.png` → `public/assets/enemies/slime.png`
   - `Actor/Monsters/Bat/Bat.png` → `public/assets/enemies/bat.png`
   - `Actor/Animals/Cat/Cat.png` → `public/assets/companions/miaou.png`
   - `Actor/Animals/Owl/Owl.png` → `public/assets/companions/hulotte.png`
   - `Items/Coin/Coin.png` → `public/assets/effects/coin.png`
   - `Tiles/Grass.png` → `public/assets/decor/grass.png`
5. Ouvre **`src/sprites/assetRegistry.js`** et remplace `null` par le chemin correspondant :
   ```js
   export const ASSETS = {
     mage: assetPath('characters/mage.png'),
     aldric: assetPath('characters/aldric.png'),
     enemies: {
       1: assetPath('enemies/slime.png'),
       2: assetPath('enemies/bat.png'),
       // etc.
     },
     companions: {
       miaou: assetPath('companions/miaou.png'),
       hulotte: assetPath('companions/owl.png'),
     },
     effects: {
       coin: assetPath('effects/coin.png'),
     },
   };
   ```
6. Lance `npm run dev` — les nouveaux sprites s'affichent à la place des sprites codés.

## Gestion des feuilles sprite (plusieurs frames)

Ninja Adventure fournit des feuilles avec 4 directions × 4 frames. Pour une image "SpriteSheet.png" de 64×64 (16×16 × 4×4), on indique les dimensions d'UNE frame :

```jsx
<SmartSprite
  assetKey="mage"
  scale={3}
  frameWidth={16}
  frameHeight={16}
  frame={0}   // 0 = première frame, vue de face, idle
/>
```

## Licences : attribution

Pour **Ninja Adventure** et packs similaires (CC BY), ajoute un crédit dans `README.md` :

```
## Crédits
- Sprites : Ninja Adventure Asset Pack par Pixel-Boy & AAA (CC BY 4.0)
  https://pixel-boy.itch.io/ninja-adventure-asset-pack
```

Les packs **Kenney / Pixel Frog (CC0)** ne demandent aucun crédit mais c'est toujours sympa d'en mettre un.

## Que faire maintenant ?

Dis-moi quel pack tu choisis et partage un lien vers le dossier téléchargé (ou copie-colle la liste des fichiers qu'il contient). Je m'occupe ensuite de :
- Créer l'arborescence `public/assets/` avec les bons noms
- Remplir le registre pour chaque sprite
- Adapter les composants (CombatScreen, WorldMapScreen, etc.) pour utiliser `<SmartSprite>` au lieu de `<PixelSprite>` là où on veut le PNG
- Gérer les feuilles sprite multi-directions et les animations
