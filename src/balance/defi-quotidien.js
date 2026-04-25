// Défis quotidiens — un par jour, généré de manière déterministe à partir de la date.

export const DEFIS = [
  { id: 'gagner_2_combats', nom: 'Triple victoire', emoji: '⚔️',
    desc: 'Gagne 2 combats aujourd\'hui.', objectif: 2, recompense: 30,
    track: 'combat-victoire' },
  { id: 'parfait_1', nom: 'Sans-faute', emoji: '💯',
    desc: 'Réussis 5/5 questions dans un combat.', objectif: 1, recompense: 50,
    track: 'combat-parfait' },
  { id: 'utiliser_3_sorts', nom: 'Maître des sorts', emoji: '✨',
    desc: 'Lance 3 sorts différents en combat.', objectif: 3, recompense: 25,
    track: 'sort-different' },
  { id: 'tuer_3_ennemis', nom: 'Chasseur de monstres', emoji: '👹',
    desc: 'Vaincre 3 ennemis aujourd\'hui.', objectif: 3, recompense: 35,
    track: 'ennemi-tue' },
  { id: 'aucun_degat', nom: 'Intouchable', emoji: '🛡️',
    desc: 'Gagne un combat sans perdre de PV.', objectif: 1, recompense: 60,
    track: 'combat-sans-degat' },
  { id: 'depenser_50', nom: 'Acheteur compulsif', emoji: '🛒',
    desc: 'Dépense 50 pièces à la boutique.', objectif: 50, recompense: 25,
    track: 'depense-or' },
  { id: 'questions_20', nom: 'Studieux', emoji: '📚',
    desc: 'Réponds à 20 questions aujourd\'hui.', objectif: 20, recompense: 30,
    track: 'question-repondue' },
  { id: 'monde_different', nom: 'Voyageur', emoji: '🗺️',
    desc: 'Joue dans 2 mondes différents.', objectif: 2, recompense: 40,
    track: 'monde-visite' },
];

export function getTodayDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// Choisit un défi déterministe pour une date donnée
export function getDefiForDate(dateStr) {
  // Hash simple : somme des codes ASCII modulo nb défis
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) hash += dateStr.charCodeAt(i);
  const idx = hash % DEFIS.length;
  return DEFIS[idx];
}

// Renvoie le défi du jour + état (le créé/réinitialise si nouveau jour)
export function ensureDefiDuJour(state) {
  const today = getTodayDateStr();
  const cur = state.defiQuotidien || {};
  if (cur.derniereDate === today && cur.challengeId) {
    return { needsUpdate: false, defi: cur };
  }
  const nouveau = getDefiForDate(today);
  return {
    needsUpdate: true,
    defi: {
      derniereDate: today,
      challengeId: nouveau.id,
      progres: 0,
      objectif: nouveau.objectif,
      reussi: false,
      reclame: false,
      serie: cur.derniereDate === yesterdayStr() ? (cur.serie || 0) : 0,
    },
  };
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function getDefiById(id) {
  return DEFIS.find((d) => d.id === id);
}
