// Calcule les bonus apportés par l'équipement équipé.
// Retourne un objet avec les bonus à appliquer en combat.

const EFFETS = {
  // ─── Armes ───
  baguette_erable:   { attaqueBase: 1 },
  baguette_chene:    { attaqueBase: 2 },
  baguette_etoile:   { dmgFeu: 1, dmgFoudre: 1 },
  sceptre_etoile:    { dmgFeu: 2, dmgFoudre: 2 },
  sabre_ethere:      { attaqueBase: 1, dmgFoudre: 1 },
  baton_orage:       { dmgFoudre: 1 },

  // ─── Accessoires offensifs / dégâts ───
  cristal_feu:       { dmgFeu: 1 },
  amulette_soin:     { soinBonus: 1 },
  tunique_runique:   { soinBonus: 1 },
  gants_runiques:    { attaqueBase: 1 },

  // ─── Accessoires défensifs ───
  bouclier_runique:  { boucliersDoubles: true },
  cape_dragon:       { reductionDmg: 1 },
  bottes_acier:      { reductionDmg: 1 },
  armure_cristal:    { pvMaxBonus: 3 },
  cape_velours:      { pvMaxBonus: 2 },
  robe_mage:         { pvMaxBonus: 2 },
  amulette_courage:  { dmgSortsBonus: 0 }, // bonus conditionnel <50% PV (géré dans CombatScreen)

  // ─── Esquive ───
  bottes_vent:       { esquive: 0.10 },
  masque_loup_eq:    { esquive: 0.05 },
  cape_invisible:    { esquive: 0.05 }, // +5% + 1 esquive auto (géré combat)

  // ─── Économie / pièces ───
  pendentif_chance:  { piecesBonus: 0.05 },
  medaillon_sang:    { piecesBonus: 0.20 },
  ceinture_or:       { pieceParBonneReponse: 1 },

  // ─── Bonus utilité ───
  orbe_magique:      { chargeGratuiteToutes: 1 },
  casque_savant:     { questionsBonus: 2 },
  lunettes_savant:   { questionsBonus: 1 },
  plume_phenix:      { renaissance: true },
  anneau_protection: { boucliersGratuit: 1 },
};

export function getBonusEquipement(equipementEquipe) {
  const bonus = {
    attaqueBase: 0,
    dmgFeu: 0,
    dmgFoudre: 0,
    soinBonus: 0,
    boucliersDoubles: false,
    esquive: 0,
    pvMaxBonus: 0,
    piecesBonus: 0,
    reductionDmg: 0,
    chargeGratuiteToutes: 0,
    questionsBonus: 0,
    pieceParBonneReponse: 0,
    renaissance: false,
    boucliersGratuit: 0,
    dmgSortsBonus: 0,
  };
  if (!equipementEquipe) return bonus;
  for (const slot of Object.keys(equipementEquipe)) {
    const id = equipementEquipe[slot];
    const e = EFFETS[id];
    if (!e) continue;
    if (e.attaqueBase) bonus.attaqueBase += e.attaqueBase;
    if (e.dmgFeu) bonus.dmgFeu += e.dmgFeu;
    if (e.dmgFoudre) bonus.dmgFoudre += e.dmgFoudre;
    if (e.soinBonus) bonus.soinBonus += e.soinBonus;
    if (e.boucliersDoubles) bonus.boucliersDoubles = true;
    if (e.esquive) bonus.esquive += e.esquive;
    if (e.pvMaxBonus) bonus.pvMaxBonus += e.pvMaxBonus;
    if (e.piecesBonus) bonus.piecesBonus += e.piecesBonus;
    if (e.reductionDmg) bonus.reductionDmg += e.reductionDmg;
    if (e.chargeGratuiteToutes) bonus.chargeGratuiteToutes += e.chargeGratuiteToutes;
    if (e.questionsBonus) bonus.questionsBonus += e.questionsBonus;
    if (e.pieceParBonneReponse) bonus.pieceParBonneReponse += e.pieceParBonneReponse;
    if (e.renaissance) bonus.renaissance = true;
    if (e.boucliersGratuit) bonus.boucliersGratuit += e.boucliersGratuit;
    if (e.dmgSortsBonus) bonus.dmgSortsBonus += e.dmgSortsBonus;
  }
  return bonus;
}
