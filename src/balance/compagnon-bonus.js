// Bonus passifs apportés par le compagnon actif.
// Renvoie un objet de bonus utilisables en combat ou pendant l'étude.

const PASSIFS = {
  miaou:     { esquive: 0.05 },
  hulotte:   { bonusQuestionsEtude: 1 },
  braise:    { dmgAutoParTour: 1 },
  lili:      { pvBonus: 1, soinBonus: 1 },
  astra:     { dmgSortsBonus: 1, chargesGratuitesFeu: 1 },
  croquette: { pieceParBonneReponse: 1 },
  pixel:     { esquive: 0.05 },
  saphir:    { dmgFeu: 1 },
  eclipse:   { reductionDmgPair: 1 },
  stella:    { chargesGratuitesFeu: 1 },
  sylphe:    { esquive: 0.08, dmgVent: 1 },     // nouveau M12
  phoenix:   { renaissance: true, dmgFeu: 1 },  // nouveau M13 — renaît avec 5 PV si KO
};

export function getBonusCompagnon(compagnonId) {
  const base = {
    esquive: 0, bonusQuestionsEtude: 0, dmgAutoParTour: 0,
    pvBonus: 0, soinBonus: 0, dmgSortsBonus: 0,
    chargesGratuitesFeu: 0, pieceParBonneReponse: 0,
    dmgFeu: 0, dmgFoudre: 0, reductionDmgPair: 0,
  };
  const p = PASSIFS[compagnonId];
  if (!p) return base;
  return { ...base, ...p };
}
