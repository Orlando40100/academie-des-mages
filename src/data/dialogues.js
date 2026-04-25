// Scénario narratif : dialogues qui se déclenchent à des moments-clés.
// Chaque dialogue est une suite de répliques (locuteur, texte, [emoji]).

export const DIALOGUES = {
  // ─── Intro à la première partie ───
  intro: {
    id: 'intro',
    titre: 'Le commencement',
    repliques: [
      { qui: 'Maître Aldric', emoji: '🧙‍♂️', texte: 'Bienvenue au Royaume de Grammaticaë et Numéria, jeune apprenti.' },
      { qui: 'Maître Aldric', emoji: '🧙‍♂️', texte: 'Le Seigneur de l\'Ignorance menace nos terres. Les mots et les nombres s\'évanouissent partout autour de nous...' },
      { qui: 'Miaou', emoji: '🐱', texte: 'Miaou ! Heureusement que tu es là ! Avec mes griffes et tes connaissances, on va sauver le royaume !' },
      { qui: 'Maître Aldric', emoji: '🧙‍♂️', texte: 'Étudie bien, combats avec sagesse. Chaque bonne réponse t\'accordera une charge magique pour vaincre les monstres.' },
      { qui: 'Maître Aldric', emoji: '🧙‍♂️', texte: 'Je te confie ta première baguette. Va explorer la Forêt des Débutants !' },
    ],
  },

  // ─── Après chaque boss vaincu ───
  boss3: {
    id: 'boss3',
    titre: 'La Grande Hulotte',
    repliques: [
      { qui: 'Grande Hulotte', emoji: '🦉', texte: 'Hou hou... tu as percé mes yeux. Bien joué, jeune mage.' },
      { qui: 'Grande Hulotte', emoji: '🦉', texte: 'Je rejoins ta quête. Avec ma sagesse, tu poseras une question de plus à chaque étude.' },
      { qui: 'Mage', emoji: '🧙', texte: 'Merci Hulotte ! Ensemble nous serons plus forts.' },
    ],
  },

  boss5: {
    id: 'boss5',
    titre: 'Braise le Dragonnet',
    repliques: [
      { qui: 'Braise', emoji: '🐲', texte: 'Grrr... mes flammes s\'éteignent...' },
      { qui: 'Mage', emoji: '🧙', texte: 'Je ne veux pas te détruire, Braise. Rejoins-moi !' },
      { qui: 'Braise', emoji: '🐲', texte: 'Tu as un cœur pur. J\'apporte mon souffle ardent à ta cause.' },
    ],
  },

  boss7: {
    id: 'boss7',
    titre: 'Lili la Fée',
    repliques: [
      { qui: 'Lili', emoji: '🧚', texte: '✨ Tu maîtrises les mots ! Je m\'incline devant ton talent.' },
      { qui: 'Lili', emoji: '🧚', texte: 'Mes pouvoirs de soin sont à toi. Garde toujours espoir !' },
    ],
  },

  boss9: {
    id: 'boss9',
    titre: 'Astra la Licorne',
    repliques: [
      { qui: 'Astra', emoji: '🦄', texte: 'Galop... un être pur et savant. Tu es digne de monter sur mon dos.' },
      { qui: 'Astra', emoji: '🦄', texte: 'Mes sorts arc-en-ciel renforceront tes attaques. Vers le château !' },
    ],
  },

  boss10: {
    id: 'boss10',
    titre: 'Le Seigneur de l\'Ignorance',
    repliques: [
      { qui: 'Seigneur', emoji: '👹', texte: 'Tu... tu n\'aurais jamais dû arriver jusqu\'ici, jeune mortel !' },
      { qui: 'Mage', emoji: '🧙', texte: 'Le savoir est plus fort que la peur. Le royaume sera libre !' },
      { qui: 'Seigneur', emoji: '👹', texte: 'AAAARGH... non... pas encore... je reviendrai...' },
      { qui: 'Maître Aldric', emoji: '🧙‍♂️', texte: 'Tu as sauvé Grammaticaë et Numéria ! Le royaume entier te célèbre.' },
      { qui: 'Maître Aldric', emoji: '🧙‍♂️', texte: 'Mais ton aventure ne fait que commencer. Le portail stellaire s\'ouvre devant toi...' },
    ],
  },

  boss11: {
    id: 'boss11',
    titre: 'Le Gardien Stellaire',
    repliques: [
      { qui: 'Gardien', emoji: '⭐', texte: 'Lumière... savoir... tu maîtrises les rudiments de la 6ème.' },
      { qui: 'Gardien', emoji: '⭐', texte: 'Une nouvelle dimension s\'ouvre. La Forêt Mystique t\'attend.' },
    ],
  },

  boss12: {
    id: 'boss12',
    titre: 'L\'Ent Ancestral',
    repliques: [
      { qui: 'Ent', emoji: '🌳', texte: 'Mes racines plongent dans le savoir ancien. Tu m\'as touché en plein cœur.' },
      { qui: 'Sylphe', emoji: '🍃', texte: 'Père ! Le mage est notre allié ! Je l\'accompagne désormais.' },
    ],
  },

  boss13: {
    id: 'boss13',
    titre: 'La Liche Éternelle',
    repliques: [
      { qui: 'Liche', emoji: '💀', texte: 'IMPOSSIBLE... tu maîtrises tout le savoir du royaume...' },
      { qui: 'Liche', emoji: '💀', texte: 'Je m\'efface... pour toujours... ' },
      { qui: 'Phoenix', emoji: '🔥', texte: 'Je renais de tes cendres, jeune mage ! Tu es la vraie Reine du Savoir !' },
      { qui: 'Maître Aldric', emoji: '🧙‍♂️', texte: 'Le donjon est purgé. Tu as accompli l\'épreuve ultime. Bravo, mon élève.' },
    ],
  },
};

export function getDialogue(id) {
  return DIALOGUES[id] ?? null;
}

// Mapping monde → ID dialogue à déclencher après le boss
export const DIALOGUE_AFTER_BOSS = {
  3: 'boss3',
  5: 'boss5',
  7: 'boss7',
  9: 'boss9',
  10: 'boss10',
  11: 'boss11',
  12: 'boss12',
  13: 'boss13',
};
