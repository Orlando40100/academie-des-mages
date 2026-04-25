// Configuration centrale d'équilibrage — tous les chiffres ajustables.

export const VERSION = '0.1.0';

// PV mage : challenging mais jouable. Préparation (potions, équipement) compte.
export const MAGE = {
  pvBase: 8,
  pvParMonde: [8, 10, 11, 12, 14, 16, 18, 20, 22, 26, 26, 28, 32],
};

// Ennemis qui scalent en menace ; les premiers mondes restent permissifs.
export const ENNEMIS = {
  pvParMonde: [3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 18, 20, 24],
  dmgParMonde: [1, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 5, 5],
};

// Boss : vrai défi, à préparer (achats boutique + bon compagnon).
export const BOSS = {
  pvParMonde: [5, 8, 10, 12, 14, 16, 18, 22, 25, 32, 26, 30, 50],
  dmgParMonde: [1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 4, 5, 6],
};

export const GAINS = {
  victoire: 10,
  deuxEtoiles: 15,
  troisEtoiles: 25,
  boss: 50,
  bossFinal: 150,
  coffreMin: 5,
  coffreMax: 20,
  defiQuotidienBonus: 20,
  arenePalier: 5,
};

export const SORTS = {
  attaque: { base: 1, nom: '⚔️ Attaque', cout: 0, type: 'physique' },
  feu: { base: 2, nom: '🔥 Boule de feu', cout: 1, type: 'feu', charge: 'feu' },
  foudre: { base: 3, nom: '⚡ Foudre', cout: 1, type: 'foudre', charge: 'foudre' },
  soin: { base: 2, nom: '💚 Soin', cout: 1, type: 'soin', charge: 'soin' },
  bouclier: { base: 1, nom: '🛡️ Bouclier', cout: 1, type: 'defense', charge: 'bouclier' },
  vent: { base: 1, nom: '🌪️ Vent', cout: 1, type: 'vent', charge: 'vent', effet: 'saute-tour' },
  glace: { base: 2, nom: '🧊 Glace', cout: 1, type: 'glace', charge: 'feu', effet: 'gel' },
  meteore: { base: 5, nom: '🌟 Météore', cout: 2, type: 'feu', charge: 'feu', ignoreBouclier: true },
  miroir: { base: 0, nom: '💫 Miroir', cout: 1, type: 'reflet', charge: 'bouclier' },
  papillons: { base: 0, nom: '🦋 Papillons', cout: 1, type: 'esquive', charge: 'vent' },
  arcEnCiel: { base: 7, nom: '⭐ Arc-en-ciel', cout: 3, type: 'mixte', charge: 'mixte' },
  tornade:    { base: 3, nom: '🌀 Tornade',         cout: 2, type: 'vent',    charge: 'vent' },
  soin_zone:  { base: 6, nom: '🌿 Soin de zone',    cout: 2, type: 'soin',    charge: 'soin' },
  bouclier_max:{ base: 3, nom: '🛡️ Bouclier renforcé', cout: 2, type: 'defense', charge: 'bouclier' },
  // Sorts ajoutés avec l'extension boutique (effets simplifiés)
  meditation:    { base: 0, nom: '🧘 Méditation',      cout: 1, type: 'utility', charge: 'vent' },
  foudre_double: { base: 7, nom: '⚡⚡ Foudre double', cout: 2, type: 'foudre', charge: 'foudre' },
  soin_total:    { base: 99,nom: '✨ Soin total',      cout: 4, type: 'soin',   charge: 'soin' },
  bouclier_magique:{base: 2, nom: '🌀 Bouclier magique', cout: 2, type: 'defense', charge: 'bouclier' },
  brume:        { base: 1, nom: '🌫️ Brume',           cout: 1, type: 'vent',   charge: 'vent' },
  lumiere_sainte:{ base: 5, nom: '☀️ Lumière sainte', cout: 2, type: 'soin',   charge: 'soin', ignoreBouclier: true },
  terre_tremblante:{base:4, nom: '🌋 Terre tremblante', cout: 2, type: 'defense', charge: 'bouclier' },
  givre_eternel: { base: 3, nom: '❄️ Givre éternel',   cout: 2, type: 'feu',    charge: 'feu' },
  boule_psy:     { base: 5, nom: '🧠 Boule psy',       cout: 1, type: 'foudre', charge: 'foudre' },
  tempete:       { base: 2, nom: '⛈️ Tempête',         cout: 3, type: 'vent',   charge: 'vent' },
  priere:        { base: 5, nom: '🙏 Prière',          cout: 2, type: 'soin',   charge: 'soin' },
  enchaines:     { base: 0, nom: '⛓️ Enchaînes',       cout: 2, type: 'defense', charge: 'bouclier' },
  doppelganger:  { base: 0, nom: '👥 Doppelgänger',    cout: 3, type: 'foudre', charge: 'foudre' },
  armure_ange:   { base: 0, nom: '👼 Armure d\'ange',  cout: 3, type: 'defense', charge: 'bouclier' },
};

export const QUESTIONS_PAR_PHASE = 5;

// Matière → charge "primaire" (utilisée comme fallback si le thème est inconnu).
// Ces 5 valeurs représentent l'identité de chaque matière.
export const MAPPING_MATIERE_SORT = {
  'maths-calcul': 'feu',
  'maths-geometrie': 'foudre',
  'francais-grammaire': 'bouclier',
  'francais-conjugaison': 'soin',
  'francais-orthographe': 'vent',
  'francais-vocabulaire': 'foudre',
};

// Mapping fin THEME → CHARGE : assure de la variété même pour des questions
// de la même matière. Chaque thème est associé à une charge spécifique selon
// son "essence" (ex : addition = feu, soustraction = soin, division = bouclier).
export const MAPPING_THEME_SORT = {
  // ─── MATHS · CALCUL ───
  'addition':       'feu',      // additionner = combiner = feu
  'soustraction':   'soin',     // retirer = soulager
  'multiplication': 'foudre',   // multiplier = explosion électrique
  'division':       'bouclier', // diviser = répartir = défense
  'mental':         'feu',      // calcul rapide = vif comme le feu
  'fraction':       'vent',     // fragmenter = vent
  'fractions':      'vent',
  'priorite':       'foudre',   // ordre = précision = foudre
  'priorites':      'foudre',
  'puissance':      'feu',      // puissance = explosion
  'pourcentage':    'soin',     // proportions = équilibre
  'pourcentages':   'soin',
  'nombre-decimal': 'foudre',
  'decimaux':       'foudre',
  'conversion':     'vent',     // changement = mouvement
  'proportionnalite':'soin',
  'probleme':       'bouclier', // raisonnement = méthode

  // ─── MATHS · GÉOMÉTRIE ───
  'angle':       'foudre',
  'angles':      'foudre',
  'aire':        'bouclier',    // surface = remplissage
  'perimetre':   'vent',        // contour = mouvement
  'geometrie':   'foudre',
  'forme':       'feu',
  'symetrie':    'soin',        // équilibre
  'droites':     'foudre',
  'segments':    'foudre',
  'mediatrice':  'soin',
  'nombres':     'feu',

  // ─── FRANÇAIS · VOCABULAIRE ───
  'synonyme':      'soin',      // similarité = douceur
  'antonyme':      'foudre',    // opposition = choc
  'famille-mots':  'feu',       // racine commune = lien
  'expression':    'vent',      // figure de style = légèreté
  'sens-figure':   'vent',
  'sens':          'soin',
  'dictionnaire':  'bouclier',  // référence = solidité
  'prefixe':       'feu',
  'suffixe':       'foudre',

  // ─── FRANÇAIS · CONJUGAISON ───
  'present':         'feu',     // immédiat = action vive
  'imparfait':       'soin',    // continuité = paisible
  'futur':           'foudre',  // projection = puissance
  'passe-compose':   'feu',
  'passe-simple':    'soin',
  'plus-que-parfait':'bouclier',
  'subjonctif':      'bouclier',// hypothèse = précaution
  'verbe':           'feu',

  // ─── FRANÇAIS · GRAMMAIRE ───
  'sujet':         'bouclier',
  'sujet-verbe':   'bouclier',
  'nom':           'feu',
  'adjectif':      'foudre',    // descriptif = précision
  'nature':        'bouclier',
  'cod':           'feu',       // direct = frappe
  'coi':           'foudre',    // indirect = précision
  'cod-coi':       'foudre',
  'cc':            'soin',      // circonstance = contexte
  'phrases':       'soin',
  'types-phrases': 'vent',

  // ─── FRANÇAIS · ORTHOGRAPHE ───
  'pluriel':    'vent',
  'homophone':  'bouclier',     // distinguer = vigilance
  'accord':     'soin',         // harmonie = douceur
  'accord-pp':  'soin',
  'alphabet':   'feu',
};

// Garantit une variété de charges même quand toutes les questions
// d'un combat ont la même matière. Si le thème est connu, on utilise
// son mapping spécifique ; sinon, on rotate entre les charges affines à la matière.
export function getChargeForCorrect(matiere, indexInFight, theme) {
  // 1. Mapping fin par thème (préféré, pour la variété)
  if (theme && MAPPING_THEME_SORT[theme]) {
    return MAPPING_THEME_SORT[theme];
  }
  // 2. Fallback : matière primaire alternée avec une charge complémentaire
  const primary = MAPPING_MATIERE_SORT[matiere] || 'feu';
  const isOffensive = primary === 'feu' || primary === 'foudre';
  if (isOffensive) {
    // Pour les matières offensives, alterne avec sa charge complémentaire
    const complement = primary === 'feu' ? 'foudre' : 'feu';
    return indexInFight % 2 === 0 ? primary : complement;
  }
  // Pour les matières défensives, alterne avec une charge offensive
  if (indexInFight % 2 === 0) return primary;
  return indexInFight === 1 ? 'feu' : 'foudre';
}

export const DIFFICULTE_ADAPTATIVE = {
  seuilDefaites: 3,
  reductionPvEnnemi: 0.2,
  reductionDmgEnnemi: 0.2,
  bonusPvMage: 1,
};

export const TYPES_AFFINITES = {
  feu: { faible: 'plante', fort: 'eau' },
  eau: { faible: 'feu', fort: 'plante' },
  plante: { faible: 'eau', fort: 'feu' },
  ombre: { faible: 'ombre', fort: 'ombre' },
  mixte: { faible: null, fort: null },
};

export const BONUS_TYPE = 1;
export const MALUS_TYPE = 1;
export const CRIT_CHANCE = 0.05;

export const AFFINITE_MAX = 10;
