// Générateurs procéduraux de questions.

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

let genCounter = 0;
const genId = (prefix) => `${prefix}_${Date.now()}_${genCounter++}`;

export function genMultiplication(maxFactor = 10) {
  const a = rand(2, maxFactor);
  const b = rand(2, maxFactor);
  const produit = a * b;
  const fausses = new Set();
  while (fausses.size < 3) {
    const delta = rand(-10, 10);
    if (delta !== 0 && produit + delta > 0) fausses.add(String(produit + delta));
  }
  const choix = [...fausses, String(produit)].sort(() => Math.random() - 0.5);
  return {
    id: genId('gen_mul'), monde: 2, matiere: 'maths-calcul', theme: 'multiplication', difficulte: 'CM1',
    enonce: `Combien font ${a} × ${b} ?`, type: 'qcm', choix, reponse: String(produit),
    explication: `${a} × ${b} = ${produit}.`,
  };
}

export function genAddition(maxTerme = 999) {
  const a = rand(10, maxTerme);
  const b = rand(10, maxTerme);
  const somme = a + b;
  return {
    id: genId('gen_add'), monde: 4, matiere: 'maths-calcul', theme: 'addition', difficulte: 'CM1',
    enonce: `${a} + ${b} = ?`, type: 'saisie', reponse: String(somme),
    explication: `${a} + ${b} = ${somme}.`,
  };
}

export function genSoustraction(max = 999) {
  const a = rand(100, max);
  const b = rand(10, a);
  return {
    id: genId('gen_sub'), monde: 4, matiere: 'maths-calcul', theme: 'soustraction', difficulte: 'CM1',
    enonce: `${a} − ${b} = ?`, type: 'saisie', reponse: String(a - b),
    explication: `${a} − ${b} = ${a - b}.`,
  };
}

export function genDivision() {
  const diviseur = rand(2, 9);
  const quotient = rand(2, 12);
  const dividende = diviseur * quotient;
  return {
    id: genId('gen_div'), monde: 4, matiere: 'maths-calcul', theme: 'division', difficulte: 'CM1',
    enonce: `${dividende} ÷ ${diviseur} = ?`, type: 'saisie', reponse: String(quotient),
    explication: `${dividende} ÷ ${diviseur} = ${quotient}, car ${diviseur} × ${quotient} = ${dividende}.`,
  };
}

const GENERATORS = {
  multiplication: genMultiplication,
  addition: genAddition,
  soustraction: genSoustraction,
  division: genDivision,
};

export function genFromTheme(theme) {
  const f = GENERATORS[theme];
  return f ? f() : null;
}
