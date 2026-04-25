// Système de badges (trophées) — déblocage automatique selon les conditions.

export const BADGES = [
  // ─── Progression de l'aventure ───
  { id: 'premier_pas', nom: 'Premiers pas', emoji: '👣', desc: 'Termine ton premier niveau.',
    check: (s) => Object.keys(s.progression.etoilesParNiveau).length >= 1 },
  { id: 'apprenti_mage', nom: 'Apprenti mage', emoji: '🧙', desc: 'Atteint le niveau 5 du joueur.',
    check: (s) => s.player.niveau >= 5 },
  { id: 'mage_aguerri', nom: 'Mage aguerri', emoji: '🧙‍♀️', desc: 'Atteint le niveau 10 du joueur.',
    check: (s) => s.player.niveau >= 10 },
  { id: 'archmage', nom: 'Archmage', emoji: '🧝‍♀️', desc: 'Atteint le niveau 20 du joueur.',
    check: (s) => s.player.niveau >= 20 },

  // ─── Boss vaincus ───
  { id: 'boss_hulotte', nom: 'Œil pour œil', emoji: '🦉', desc: 'Bat la Grande Hulotte (M3).',
    check: (s) => Object.keys(s.progression.etoilesParNiveau).some((k) => k.startsWith('3-')) && (s.progression.mondesDeverrouilles.includes(4)) },
  { id: 'boss_braise', nom: 'Dompteur de feu', emoji: '🐲', desc: 'Bat Braise le Dragonnet (M5).',
    check: (s) => s.progression.mondesDeverrouilles.includes(6) },
  { id: 'boss_lili', nom: 'Ami des fées', emoji: '🧚', desc: 'Bat Lili la Fée (M7).',
    check: (s) => s.progression.mondesDeverrouilles.includes(8) },
  { id: 'boss_astra', nom: 'Cavalier stellaire', emoji: '🦄', desc: 'Bat Astra la Licorne (M9).',
    check: (s) => s.progression.mondesDeverrouilles.includes(10) },
  { id: 'boss_final', nom: 'Sauveur du royaume', emoji: '👑', desc: 'Bat le Seigneur de l\'Ignorance (M10).',
    check: (s) => !!s.progression.bossFinalVaincu || s.progression.mondesDeverrouilles.includes(11) },
  { id: 'boss_lich', nom: 'Conquérant du donjon', emoji: '💀', desc: 'Bat la Liche Éternelle (M13).',
    check: (s) => Object.keys(s.progression.etoilesParNiveau).some((k) => k.startsWith('13-')) },

  // ─── Performance ───
  { id: 'parfait_5', nom: 'Sans-faute', emoji: '💯', desc: 'Réponds 5/5 à un combat.',
    check: (s) => Object.values(s.progression.etoilesParNiveau).filter((e) => e === 3).length >= 1 },
  { id: 'serie_or', nom: 'Série dorée', emoji: '🏆', desc: 'Obtiens 3 étoiles sur 10 niveaux.',
    check: (s) => Object.values(s.progression.etoilesParNiveau).filter((e) => e === 3).length >= 10 },
  { id: 'collectionneur', nom: 'Collectionneur', emoji: '🏵️', desc: 'Termine tous les niveaux d\'au moins 5 mondes.',
    check: (s) => {
      const counts = {};
      for (const k of Object.keys(s.progression.etoilesParNiveau)) {
        const monde = k.split('-')[0];
        counts[monde] = (counts[monde] || 0) + 1;
      }
      return Object.keys(counts).filter((m) => counts[m] >= 3).length >= 5;
    } },

  // ─── Économie ───
  { id: 'premier_or', nom: 'Première fortune', emoji: '🪙', desc: 'Accumule 100 pièces d\'or.',
    check: (s) => s.player.piecesOr >= 100 },
  { id: 'banquier', nom: 'Banquier', emoji: '💰', desc: 'Accumule 500 pièces d\'or.',
    check: (s) => s.player.piecesOr >= 500 },
  { id: 'roi_or', nom: 'Roi de l\'or', emoji: '👑', desc: 'Accumule 1000 pièces d\'or.',
    check: (s) => s.player.piecesOr >= 1000 },

  // ─── Compagnons ───
  { id: 'meilleur_ami', nom: 'Meilleur ami', emoji: '❤️', desc: 'Atteint 10 d\'affinité avec un compagnon.',
    check: (s) => Object.values(s.compagnons.affinites).some((v) => v >= 10) },
  { id: 'eleveur', nom: 'Éleveur', emoji: '🐾', desc: 'Débloque 5 compagnons différents.',
    check: (s) => s.compagnons.debloques.length >= 5 },
  { id: 'maitre_compagnons', nom: 'Maître des compagnons', emoji: '🎖️', desc: 'Débloque 10 compagnons.',
    check: (s) => s.compagnons.debloques.length >= 10 },

  // ─── Boutique ───
  { id: 'shopping', nom: 'Première achat', emoji: '🛒', desc: 'Achète ton premier objet à la boutique.',
    check: (s) => (s.inventaire.equipementPossede.length + s.inventaire.sortsAchetes.length + s.inventaire.tenuesAchetees.length) >= 1 },
  { id: 'magasinier', nom: 'Magasinier', emoji: '🏪', desc: 'Achète 10 objets différents à la boutique.',
    check: (s) => (s.inventaire.equipementPossede.length + s.inventaire.sortsAchetes.length + s.inventaire.tenuesAchetees.length) >= 10 },
  { id: 'spell_master', nom: 'Maître des sorts', emoji: '✨', desc: 'Apprends 5 sorts différents.',
    check: (s) => s.inventaire.sortsAchetes.length >= 5 },

  // ─── Questions ───
  { id: 'curieux', nom: 'Curieux', emoji: '🤔', desc: 'Réponds à 50 questions au total.',
    check: (s) => s.historiqueQuestions.statistiques.total >= 50 },
  { id: 'savant', nom: 'Savant', emoji: '📚', desc: 'Réponds à 200 questions au total.',
    check: (s) => s.historiqueQuestions.statistiques.total >= 200 },
  { id: 'sage', nom: 'Sage', emoji: '🧠', desc: 'Réponds correctement à 100 questions.',
    check: (s) => s.historiqueQuestions.statistiques.correctes >= 100 },
];

// Vérifie tous les badges et retourne ceux qui devraient être débloqués mais ne le sont pas encore.
export function getBadgesAUnlock(state) {
  const dejaUnlock = new Set(state.badges?.debloques || []);
  return BADGES.filter((b) => !dejaUnlock.has(b.id) && b.check(state));
}

export function getBadgeById(id) {
  return BADGES.find((b) => b.id === id);
}
