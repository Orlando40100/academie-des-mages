// Configuration des boss par monde + mécaniques spéciales.
// Le boss d'un monde X est au dernier niveau du monde X (si le monde a une récompense).

import { BOSS } from './config.js';

export const BOSSES = {
  3: {
    id: 'hulotte-boss',
    nom: 'Grande Hulotte',
    emoji: '🦉',
    pv: BOSS.pvParMonde[2],
    dmg: BOSS.dmgParMonde[2],
    assetKey: 'bosses.3',
    fallback: null,
    // Mécanique : "Œil perçant" — tous les 3 tours, confond le mage
    // (réduit 1 charge aléatoire au lieu de faire des dégâts)
    mecanique: 'oeil-percant',
    dialogueIntro: 'La Grande Hulotte vous observe de ses yeux perçants...',
    dialogueDefait: 'La Hulotte s\'incline — elle te rejoint !',
  },
  5: {
    id: 'braise-boss',
    nom: 'Braise le Dragonnet',
    emoji: '🐲',
    pv: BOSS.pvParMonde[4],
    dmg: BOSS.dmgParMonde[4],
    assetKey: 'bosses.5',
    fallback: null,
    // Mécanique : "Souffle de feu" — 1 tour sur 2, attaque de feu = +1 dégât
    mecanique: 'souffle-feu',
    dialogueIntro: 'Braise crache des flammes ! Attention !',
    dialogueDefait: 'Braise s\'apaise... Tu as gagné sa confiance !',
  },
  7: {
    id: 'lili-boss',
    nom: 'Lili la Fée',
    emoji: '🧚',
    pv: BOSS.pvParMonde[6],
    dmg: BOSS.dmgParMonde[6],
    assetKey: 'bosses.7',
    fallback: null,
    // Mécanique : "Poussière de vie" — se soigne de 2 PV tous les 3 tours
    mecanique: 'auto-heal',
    dialogueIntro: 'Lili papillonne, puissante et farceuse.',
    dialogueDefait: 'Lili rit et te tend la main — alliées !',
  },
  9: {
    id: 'astra-boss',
    nom: 'Astra la Licorne',
    emoji: '🦄',
    pv: BOSS.pvParMonde[8],
    dmg: BOSS.dmgParMonde[8],
    assetKey: 'bosses.9',
    fallback: null,
    // Mécanique : "Aura arc-en-ciel" — 1 tour sur 3, invulnérable aux sorts (pas à l'attaque)
    mecanique: 'aura-arc-en-ciel',
    dialogueIntro: 'Astra brille d\'une lumière mystique.',
    dialogueDefait: 'Astra incline la corne. Elle t\'accompagnera !',
  },
  10: {
    id: 'final-boss',
    nom: 'Seigneur de l\'Ignorance',
    emoji: '👹',
    pv: BOSS.pvParMonde[9],      // 30 PV en 2 phases
    dmg: BOSS.dmgParMonde[9],
    assetKey: 'bosses.10',
    fallback: null,
    // Mécanique : "Deux phases" — à moins de 50% PV, devient enragé (+1 dmg à chaque attaque)
    mecanique: 'deux-phases',
    dialogueIntro: 'Le Seigneur ricane. Le royaume tremble...',
    dialogueDefait: 'La lumière revient dans le royaume. Tu es la reine des mages !',
  },
  11: {
    id: 'stellar-guardian',
    nom: 'Gardien Stellaire',
    emoji: '⭐',
    pv: BOSS.pvParMonde[10],
    dmg: BOSS.dmgParMonde[10],
    assetKey: null,
    fallback: null,
    mecanique: 'confusion-cosmique',
    dialogueIntro: 'Une entité stellaire se matérialise...',
    dialogueDefait: 'Le portail s\'apaise. Tu maîtrises les 6èmes !',
  },
  12: {
    id: 'ent-ancestral',
    nom: 'Ent Ancestral',
    emoji: '🌳',
    pv: BOSS.pvParMonde[11],
    dmg: BOSS.dmgParMonde[11],
    assetKey: null,
    fallback: null,
    // Mécanique : "Régénération forestière" — récupère 3 PV tous les 4 tours
    mecanique: 'auto-heal',
    dialogueIntro: 'Les racines anciennes s\'éveillent...',
    dialogueDefait: 'L\'Ent te bénit. Sylphe, son enfant, te suit.',
  },
  13: {
    id: 'lich-eternel',
    nom: 'Liche Éternelle',
    emoji: '💀',
    pv: BOSS.pvParMonde[12],
    dmg: BOSS.dmgParMonde[12],
    assetKey: null,
    fallback: null,
    // Mécanique : "Deux phases" + résurrection unique
    mecanique: 'deux-phases',
    dialogueIntro: 'La Liche rit dans les ténèbres éternelles. "Tu n\'as aucune chance, mortel."',
    dialogueDefait: 'La Liche s\'effondre... Phoenix renaît de ses cendres pour toi !',
  },
};

// Détermine si le niveau courant est un boss
export function isBossLevel(monde, niveau, totalNiveaux) {
  if (!BOSSES[monde]) return false;
  return niveau >= totalNiveaux;
}

export function getBoss(monde) {
  return BOSSES[monde] ?? null;
}
