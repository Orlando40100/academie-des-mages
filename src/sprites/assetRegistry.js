// Registre central des sprites PNG (pack Ninja Adventure, CC0).
// Chaque entrée : { src, frameWidth, frameHeight, idleAnim, walkAnim, attackAnim }
//
// idleAnim / walkAnim : tableau [[col, row], ...] — chaque paire = une frame.
// Si l'entrée n'a pas de frameWidth, l'image est affichée en entier.
//
// Layout typique des SpriteSheet perso (64×112) :
//   Ligne 0 : idle (vers bas) — col 0..3 = frames d'animation (mais souvent 1 seule)
//   Ligne 1 : idle (vers haut)
//   Ligne 2 : idle (vers gauche)
//   Ligne 3 : idle (vers droite)
//   Ligne 4..7 : attaque, item, etc.
// En pratique on prend Idle.png séparé qui est 64×16 = 4 frames côte à côte (= 4 directions).

export const assetPath = (p) => `./assets/${p}`;

// Convention : la frame [0,0] dans une feuille Idle.png correspond à la vue de face.
// Pour les personnages : frame bas (down) = face vers le spectateur, frame haut (up) = dos.

export const ASSETS = {
  // ─── Personnages principaux ───
  mage: {
    src: assetPath('characters/mage.png'),
    frameWidth: 16,
    frameHeight: 16,
    idleCol: 0,    // idle, face caméra
    backCol: 1,    // idle, de dos (pour combat si on veut le dos)
  },
  mageIdle: {
    src: assetPath('characters/mage-idle.png'),
    // PNG 64×16 = 4 frames de 16×16 (les corps se touchent sur la ligne médiane)
    frameWidth: 16,
    frameHeight: 16,
    front: { col: 0, row: 0 },
    back:  { col: 1, row: 0 },
    left:  { col: 2, row: 0 },
    right: { col: 3, row: 0 },
  },
  mageWalk: {
    src: assetPath('characters/mage-walk.png'),
    // PNG 64×64 = 4 directions × 4 frames d'animation (16×16 chacune)
    frameWidth: 16,
    frameHeight: 16,
    front: [[0, 0], [1, 0], [2, 0], [3, 0]],
    back:  [[0, 1], [1, 1], [2, 1], [3, 1]],
    left:  [[0, 2], [1, 2], [2, 2], [3, 2]],
    right: [[0, 3], [1, 3], [2, 3], [3, 3]],
  },
  mageAttack: {
    src: assetPath('characters/mage-attack.png'),
    frameWidth: 16,
    frameHeight: 16,
    front: { col: 0, row: 0 },
    back:  { col: 1, row: 0 },
    left:  { col: 2, row: 0 },
    right: { col: 3, row: 0 },
  },
  mageSpecial1: {
    src: assetPath('characters/mage-special1.png'),
    frameWidth: 16,
    frameHeight: 16,
    front: { col: 0, row: 0 },
  },
  mageSpecial2: {
    src: assetPath('characters/mage-special2.png'),
    frameWidth: 16,
    frameHeight: 16,
    front: { col: 0, row: 0 },
  },
  mageJump: {
    src: assetPath('characters/mage-jump.png'),
    frameWidth: 16,
    frameHeight: 16,
    front: { col: 0, row: 0 },
    back:  { col: 1, row: 0 },
    left:  { col: 2, row: 0 },
    right: { col: 3, row: 0 },
  },
  mageDead: {
    src: assetPath('characters/mage-dead.png'),
    frameWidth: 16,
    frameHeight: 16,
  },

  aldric: {
    src: assetPath('characters/aldric.png'),
    frameWidth: 16,
    frameHeight: 16,
  },
  aldricIdle: {
    src: assetPath('characters/aldric-idle.png'),
    frameWidth: 16,
    frameHeight: 16,
    front: { col: 0, row: 0 },
  },

  marchand: {
    src: assetPath('characters/marchand.png'),
    frameWidth: 16,
    frameHeight: 16,
  },
  marchandIdle: {
    src: assetPath('characters/marchand-idle.png'),
    frameWidth: 16,
    frameHeight: 16,
    front: { col: 0, row: 0 },
  },

  // ─── Compagnons (sprites 64×64 = grille 4×4 de 16×16) ───
  // Confirmé : chaque cellule 16×16 contient UN sprite complet.
  miaou: {
    src: assetPath('companions/miaou.png'),
    frameWidth: 22,
    frameHeight: 17,
    front: [[0, 0], [1, 0]],
  },
  hulotte: {
    src: assetPath('companions/hulotte.png'),
    frameWidth: 16,
    frameHeight: 16,
    front: { col: 0, row: 0 },
    walk: [[0, 0], [1, 0], [2, 0], [3, 0]],
  },
  braise: {
    src: assetPath('companions/braise.png'),
    frameWidth: 16,
    frameHeight: 16,
    front: { col: 0, row: 0 },
    walk: [[0, 0], [1, 0], [2, 0], [3, 0]],
  },
  lili: {
    src: assetPath('companions/lili.png'),
    frameWidth: 16,
    frameHeight: 16,
    front: { col: 0, row: 0 },
    fly: [[0, 0], [1, 0], [2, 0], [3, 0]],
  },
  astra: {
    src: assetPath('companions/astra.png'),
    frameWidth: 16,
    frameHeight: 16,
    front: { col: 0, row: 0 },
    walk: [[0, 0], [1, 0], [2, 0], [3, 0]],
  },

  // ─── Ennemis par monde (sprite 64×64 = 4 cols × 2 rows de 16×32) ───
  // Frames de 16×32 (tête + corps). 4 frames d'animation idle sur row 0.
  enemies: {
    1:  { src: assetPath('enemies/m1-slime.png'),    frameWidth: 16, frameHeight: 16, front: [[0,0],[1,0],[2,0],[3,0]] },
    2:  { src: assetPath('enemies/m2-slime2.png'),   frameWidth: 16, frameHeight: 16, front: [[0,0],[1,0],[2,0],[3,0]] },
    3:  { src: assetPath('enemies/m3-mushroom.png'), frameWidth: 16, frameHeight: 16, front: [[0,0],[1,0],[2,0],[3,0]] },
    4:  { src: assetPath('enemies/m4-spider.png'),   frameWidth: 16, frameHeight: 16, front: [[0,0],[1,0],[2,0],[3,0]] },
    5:  { src: assetPath('enemies/m5-eye.png'),      frameWidth: 16, frameHeight: 16, front: [[0,0],[1,0],[2,0],[3,0]] },
    6:  { src: assetPath('enemies/m6-snake.png'),    frameWidth: 16, frameHeight: 16, front: [[0,0],[1,0],[2,0],[3,0]] },
    7:  { src: assetPath('enemies/m7-lizard.png'),   frameWidth: 16, frameHeight: 16, front: [[0,0],[1,0],[2,0],[3,0]] },
    8:  { src: assetPath('enemies/m8-bear.png'),     frameWidth: 16, frameHeight: 16, front: [[0,0],[1,0],[2,0],[3,0]] },
    9:  { src: assetPath('enemies/m9-cyclope.png'),  frameWidth: 16, frameHeight: 16, front: [[0,0],[1,0],[2,0],[3,0]] },
    10: { src: assetPath('enemies/m10-dragon.png'),  frameWidth: 16, frameHeight: 16, front: [[0,0],[1,0],[2,0],[3,0]] },
    11: { src: assetPath('enemies/m11-skull.png'),   frameWidth: 16, frameHeight: 16, front: [[0,0],[1,0],[2,0],[3,0]] },
    // M12 + M13 réutilisent des sprites existants (pas d'asset dédié) — fallback sur slime
    12: { src: assetPath('enemies/m3-mushroom.png'), frameWidth: 16, frameHeight: 16, front: [[0,0],[1,0],[2,0],[3,0]] },
    13: { src: assetPath('enemies/m11-skull.png'),   frameWidth: 16, frameHeight: 16, front: [[0,0],[1,0],[2,0],[3,0]] },
  },

  // ─── Boss (dimensions variées par fichier) ───
  bosses: {
    // 310×52 → 5 frames de 62×52
    3:  { src: assetPath('bosses/m3-hulotte-boss.png'), frameWidth: 62, frameHeight: 52, anim: [[0,0],[1,0],[2,0],[3,0],[4,0]] },
    // 250×50 → 5 frames de 50×50
    5:  { src: assetPath('bosses/m5-braise-boss.png'),  frameWidth: 50, frameHeight: 50, anim: [[0,0],[1,0],[2,0],[3,0],[4,0]] },
    // 250×50 → 5 frames de 50×50
    7:  { src: assetPath('bosses/m7-lili-boss.png'),    frameWidth: 50, frameHeight: 50, anim: [[0,0],[1,0],[2,0],[3,0],[4,0]] },
    // 360×60 → 6 frames de 60×60
    9:  { src: assetPath('bosses/m9-astra-boss.png'),   frameWidth: 60, frameHeight: 60, anim: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]] },
    // 44×46 → 1 grosse frame
    10: { src: assetPath('bosses/m10-final-boss.png'),  frameWidth: 44, frameHeight: 46, anim: [[0,0]] },
  },

  // ─── Effets / projectiles (16×16 par frame, 4 frames rotation) ───
  effects: {
    fireball:   { src: assetPath('effects/fireball.png'),   frameWidth: 16, frameHeight: 16, anim: [[0,0],[1,0],[2,0],[3,0]] },
    energyball: { src: assetPath('effects/energyball.png'), frameWidth: 16, frameHeight: 16, anim: [[0,0],[1,0],[2,0],[3,0]] },
    icespike:   { src: assetPath('effects/icespike.png'),   frameWidth: 16, frameHeight: 16, anim: [[0,0],[1,0],[2,0],[3,0]] },
    plantspike: { src: assetPath('effects/plantspike.png'), frameWidth: 16, frameHeight: 16, anim: [[0,0],[1,0],[2,0],[3,0]] },
    shuriken:   { src: assetPath('effects/shuriken.png'),   frameWidth: 16, frameHeight: 16, anim: [[0,0],[1,0],[2,0],[3,0]] },
    thunder:    { src: assetPath('effects/thunder.png'),    frameWidth: 32, frameHeight: 28 },
    flam:       { src: assetPath('effects/flam.png'),       frameWidth: 16, frameHeight: 16, anim: [[0,0],[1,0],[2,0],[3,0]] },
  },

  // ─── Items ───
  items: {
    coin:         { src: assetPath('items/coin.png') },
    chest:        { src: assetPath('items/chest.png') },
    bigChest:     { src: assetPath('items/big-chest.png') },
    potionSmall:  { src: assetPath('items/potion-small.png') },
    potionBig:    { src: assetPath('items/potion-big.png') },
    heart:        { src: assetPath('items/heart.png') },
    scrollFire:   { src: assetPath('items/scroll-fire.png') },
    scrollThunder:{ src: assetPath('items/scroll-thunder.png') },
    scrollIce:    { src: assetPath('items/scroll-ice.png') },
    scroll:       { src: assetPath('items/scroll.png') },
  },

  // ─── Facesets (portraits 32×32 pour dialogues) ───
  faces: {
    mage:     { src: assetPath('faces/mage.png') },
    aldric:   { src: assetPath('faces/aldric.png') },
    marchand: { src: assetPath('faces/marchand.png') },
    miaou:    { src: assetPath('faces/miaou.png') },
    hulotte:  { src: assetPath('faces/hulotte.png') },
    braise:   { src: assetPath('faces/braise.png') },
    lili:     { src: assetPath('faces/lili.png') },
    astra:    { src: assetPath('faces/astra.png') },
  },

  // ─── UI — boîtes de dialogue, panneaux, boutons ───
  ui: {
    dialog: {
      box:         assetPath('ui/dialog/box.png'),           // 300×58
      boxFace:     assetPath('ui/dialog/box-with-face.png'),
      faceFrame:   assetPath('ui/dialog/face-frame.png'),
    },
    theme: {
      panel:       assetPath('ui/theme/panel.png'),     // 16×16 9-patch
      panel2:      assetPath('ui/theme/panel2.png'),
      btn:         assetPath('ui/theme/btn.png'),       // 16×8
      btnHover:    assetPath('ui/theme/btn-hover.png'),
      btnPressed:  assetPath('ui/theme/btn-pressed.png'),
      cell:        assetPath('ui/theme/cell.png'),
    },
    hp: {
      // heart.png = 80×16 = 5 frames 16×16, du plein (frame 0) au vide (frame 4)
      heart:       { src: assetPath('ui/hp/heart.png'), frameWidth: 16, frameHeight: 16 },
      heartPlain:  { src: assetPath('ui/hp/heart2.png'), frameWidth: 16, frameHeight: 16 },
      iconHeart:   assetPath('ui/hp/icon-heart.png'),
      barProgress: assetPath('ui/hp/bar-progress.png'),
      barUnder:    assetPath('ui/hp/bar-under.png'),
    },
    spells: {
      feu:         assetPath('ui/spells/feu.png'),
      foudre:      assetPath('ui/spells/foudre.png'),
      soin:        assetPath('ui/spells/soin.png'),
      bouclier:    assetPath('ui/spells/bouclier.png'),
      vent:        assetPath('ui/spells/vent.png'),
      meteore:     assetPath('ui/spells/meteore.png'),
      miroir:      assetPath('ui/spells/miroir.png'),
      alchemy:     assetPath('ui/spells/alchemy.png'),
      feuOff:      assetPath('ui/spells/feu-off.png'),
      foudreOff:   assetPath('ui/spells/foudre-off.png'),
      soinOff:     assetPath('ui/spells/soin-off.png'),
      bouclierOff: assetPath('ui/spells/bouclier-off.png'),
      ventOff:     assetPath('ui/spells/vent-off.png'),
    },
    gamepad: {
      a:     assetPath('ui/gamepad/a.png'),
      b:     assetPath('ui/gamepad/b.png'),
      x:     assetPath('ui/gamepad/x.png'),
      y:     assetPath('ui/gamepad/y.png'),
      lb:    assetPath('ui/gamepad/lb.png'),
      rb:    assetPath('ui/gamepad/rb.png'),
      up:    assetPath('ui/gamepad/up.png'),
      down:  assetPath('ui/gamepad/down.png'),
      left:  assetPath('ui/gamepad/left.png'),
      right: assetPath('ui/gamepad/right.png'),
    },
    emotes: {
      exclaim:  assetPath('ui/emotes/exclaim.png'),
      question: assetPath('ui/emotes/question.png'),
      heart:    assetPath('ui/emotes/heart.png'),
      happy:    assetPath('ui/emotes/happy.png'),
      sad:      assetPath('ui/emotes/sad.png'),
      sleep:    assetPath('ui/emotes/sleep.png'),
    },
  },

  // ─── Décors animés (feuilles 16×16 avec plusieurs frames) ───
  animated: {
    flower:    { src: assetPath('animated/flower.png'),    frameWidth: 5,  frameHeight: 8,  anim: [[0,0],[1,0],[2,0],[3,0]] },
    plant:     { src: assetPath('animated/plant.png'),     frameWidth: 16, frameHeight: 16, anim: [[0,0],[1,0],[2,0],[3,0]] },
    flagRed:   { src: assetPath('animated/flag-red.png'),   frameWidth: 16, frameHeight: 16, anim: [[0,0],[1,0],[2,0],[3,0]] },
    flagBlue:  { src: assetPath('animated/flag-blue.png'),  frameWidth: 16, frameHeight: 16, anim: [[0,0],[1,0],[2,0],[3,0]] },
    flagYellow:{ src: assetPath('animated/flag-yellow.png'),frameWidth: 16, frameHeight: 16, anim: [[0,0],[1,0],[2,0],[3,0]] },
    water:     { src: assetPath('animated/water.png'),     frameWidth: 16, frameHeight: 16, anim: [[0,0],[1,0],[2,0],[3,0]] },
    waterPurple: { src: assetPath('animated/water-purple.png'), frameWidth: 16, frameHeight: 16, anim: [[0,0],[1,0],[2,0],[3,0]] },
    waterfall: { src: assetPath('animated/waterfall.png'), frameWidth: 16, frameHeight: 16, anim: [[0,0],[1,0],[2,0],[3,0],[4,0]] },
  },

  // ─── Effets d'ambiance ───
  fx: {
    fog:      assetPath('fx/fog.png'),      // 320×180 — overlay plein écran
    raylight: assetPath('fx/raylight.png'), // 216×102 — rayons lumineux
  },

  // ─── Tilesets (pour backgrounds thématiques) ───
  tiles: {
    nature:  assetPath('tiles/nature.png'),
    field:   assetPath('tiles/field.png'),
    desert:  assetPath('tiles/desert.png'),
    dungeon: assetPath('tiles/dungeon.png'),
    water:   assetPath('tiles/water.png'),
    village: assetPath('tiles/village.png'),
    towers:  assetPath('tiles/towers.png'),
    relief:  assetPath('tiles/relief.png'),
    element: assetPath('tiles/element.png'),
  },
};

// Accesseurs pratiques
export const getAsset = (path) => {
  const parts = path.split('.');
  let cur = ASSETS;
  for (const p of parts) {
    if (cur == null) return null;
    cur = cur[p];
  }
  return cur ?? null;
};

export const hasAsset = (path) => getAsset(path) != null;
