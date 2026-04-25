// Tutoriel en 6 chapitres animé par Maître Aldric.

export const chapitres = [
  {
    id: 'carte',
    titre: 'Chapitre 1 — La Carte du Royaume',
    aldric: [
      'Bienvenue jeune mage ! Je suis Maître Aldric.',
      'Voici la carte du royaume de Grammaticaë et Numéria.',
      'Chaque monde représente une matière à maîtriser.',
      'Les niveaux se débloquent au fur et à mesure de tes victoires.',
    ],
  },
  {
    id: 'etude',
    titre: 'Chapitre 2 — La Salle d\'Étude',
    aldric: [
      'Avant chaque combat, tu étudies dans une salle magique.',
      'Chaque bonne réponse charge un sort que tu utiliseras plus tard.',
      'En cas d\'erreur, je t\'explique pour que tu progresses.',
      'Prête pour une question test ?',
    ],
    questionTest: {
      id: 'tuto_q1', enonce: 'Combien font 3 + 4 ?',
      type: 'qcm', choix: ['5', '6', '7', '8'], reponse: '7',
      explication: '3 + 4 = 7. Tu peux compter sur tes doigts !', matiere: 'maths-calcul',
    },
  },
  {
    id: 'combat',
    titre: 'Chapitre 3 — Le Combat Tour par Tour',
    aldric: [
      'En combat, chacun joue à son tour.',
      'Tu choisis : ⚔️ attaquer, ✨ lancer un sort, 🐾 faire agir ton compagnon ou 🛡️ défendre.',
      'L\'ennemi annonce son prochain coup pour que tu anticipes.',
      'Sois stratège !',
    ],
  },
  {
    id: 'compagnon',
    titre: 'Chapitre 4 — Ton Compagnon',
    aldric: [
      'Miaou le chat t\'accompagne dès le début.',
      'Il peut griffer l\'ennemi une fois par combat.',
      'D\'autres compagnons t\'attendent : Hulotte, Braise, Lili, et la licorne Astra !',
      'Tu les rencontreras en vainquant les boss.',
    ],
  },
  {
    id: 'boutique',
    titre: 'Chapitre 5 — Pièces et Boutique',
    aldric: [
      'Chaque victoire te rapporte des pièces d\'or 🪙.',
      'Dépense-les chez le marchand : potions, sorts, équipement, tenues.',
      'Il y a 4 onglets. Une potion de vie t\'attend gratuitement pour commencer !',
      'Gère bien tes pièces : l\'équipement facilite beaucoup le boss final.',
    ],
  },
  {
    id: 'grimoire',
    titre: 'Chapitre 6 — Le Grimoire et la Sauvegarde',
    aldric: [
      'Ton grimoire se remplit de fiches de règles à chaque nouvelle notion.',
      'Tu peux y réviser sans combat !',
      'Ta progression est sauvegardée automatiquement.',
      'Tu es prête. Que l\'aventure commence !',
    ],
  },
];
