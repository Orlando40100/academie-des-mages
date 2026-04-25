import { mathsCM1 } from './banque-maths-cm1.js';
import { francaisCM1 } from './banque-francais-cm1.js';
import { cm2 } from './banque-cm2.js';
import { sixieme } from './banque-6eme.js';
import { bonus } from './banque-bonus.js';
import { genMultiplication, genAddition, genSoustraction, genDivision } from './generators.js';

export const banqueTotale = [...mathsCM1, ...francaisCM1, ...cm2, ...sixieme, ...bonus];

// Tire n questions pour un monde donné.
// Anti-répétition basique : évite les 20 derniers idsRecents.
export function tirerQuestions({ monde, n = 5, idsRecents = [], matierePref = null }) {
  const dispo = banqueTotale.filter((q) => q.monde === monde && !idsRecents.includes(q.id));
  let selection = matierePref ? dispo.filter((q) => q.matiere.startsWith(matierePref)) : dispo;
  if (selection.length < n) selection = dispo; // fallback

  const shuffled = [...selection].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, n);

  // Compléter avec des questions générées si besoin
  while (picked.length < n) {
    const gens = [genMultiplication, genAddition, genSoustraction, genDivision];
    const g = gens[Math.floor(Math.random() * gens.length)];
    const q = g();
    q.monde = monde;
    picked.push(q);
  }
  return picked;
}
