// Banque BONUS — questions pour les mondes 11, 12, 13 + complément des mondes existants.
// Mix de difficulté CM1 → 6ème renforcé.

export const bonus = [
  // ═══════════════════════════════════════════════════════════════
  // MONDE 1 — FORÊT DES DÉBUTANTS (mixte tutoriel)
  // ═══════════════════════════════════════════════════════════════
  { id: 'b_m1_001', monde: 1, matiere: 'maths-calcul', theme: 'addition', difficulte: 'CM1',
    enonce: '2 + 3 = ?', type: 'qcm', choix: ['4', '5', '6', '7'], reponse: '5',
    explication: '2 + 3 fait 5. On peut compter sur ses doigts.' },
  { id: 'b_m1_002', monde: 1, matiere: 'maths-calcul', theme: 'soustraction', difficulte: 'CM1',
    enonce: '10 - 4 = ?', type: 'qcm', choix: ['4', '5', '6', '7'], reponse: '6',
    explication: 'Tu retires 4 de 10. Il reste 6.' },
  { id: 'b_m1_003', monde: 1, matiere: 'francais-vocabulaire', theme: 'synonyme', difficulte: 'CM1',
    enonce: 'Quel est le synonyme de « rapide » ?', type: 'qcm', choix: ['lent', 'vif', 'doux', 'gros'], reponse: 'vif',
    explication: '« Rapide » et « vif » veulent dire la même chose : qui va vite.' },
  { id: 'b_m1_004', monde: 1, matiere: 'francais-vocabulaire', theme: 'antonyme', difficulte: 'CM1',
    enonce: 'Quel est le contraire de « jour » ?', type: 'qcm', choix: ['matin', 'soir', 'nuit', 'midi'], reponse: 'nuit',
    explication: 'Le contraire de jour, c\'est nuit.' },
  { id: 'b_m1_005', monde: 1, matiere: 'maths-calcul', theme: 'multiplication', difficulte: 'CM1',
    enonce: '3 × 2 = ?', type: 'qcm', choix: ['5', '6', '7', '8'], reponse: '6',
    explication: '3 fois 2, c\'est comme 2 + 2 + 2 = 6.' },
  { id: 'b_m1_006', monde: 1, matiere: 'francais-grammaire', theme: 'nature', difficulte: 'CM1',
    enonce: '« Le chat dort. » Quel est le verbe ?', type: 'qcm', choix: ['Le', 'chat', 'dort', 'rien'], reponse: 'dort',
    explication: 'Le verbe est l\'action : « dort ».' },

  // ═══════════════════════════════════════════════════════════════
  // MONDE 2 — CLAIRIÈRE DES NOMBRES (calcul)
  // ═══════════════════════════════════════════════════════════════
  { id: 'b_m2_001', monde: 2, matiere: 'maths-calcul', theme: 'multiplication', difficulte: 'CM1',
    enonce: '7 × 8 = ?', type: 'qcm', choix: ['54', '56', '58', '64'], reponse: '56',
    explication: 'Table de 7 : 7×8 = 56.' },
  { id: 'b_m2_002', monde: 2, matiere: 'maths-calcul', theme: 'multiplication', difficulte: 'CM1',
    enonce: '6 × 9 = ?', type: 'qcm', choix: ['48', '54', '56', '63'], reponse: '54',
    explication: 'Table de 6 : 6×9 = 54.' },
  { id: 'b_m2_003', monde: 2, matiere: 'maths-calcul', theme: 'division', difficulte: 'CM1',
    enonce: '36 ÷ 4 = ?', type: 'qcm', choix: ['7', '8', '9', '10'], reponse: '9',
    explication: '36 partagé en 4 = 9 (4×9 = 36).' },
  { id: 'b_m2_004', monde: 2, matiere: 'maths-calcul', theme: 'addition', difficulte: 'CM1',
    enonce: '125 + 78 = ?', type: 'qcm', choix: ['193', '203', '213', '223'], reponse: '203',
    explication: '125 + 78 = 203 (poser l\'opération).' },
  { id: 'b_m2_005', monde: 2, matiere: 'maths-calcul', theme: 'soustraction', difficulte: 'CM1',
    enonce: '500 - 234 = ?', type: 'qcm', choix: ['256', '266', '276', '286'], reponse: '266',
    explication: '500 - 234 = 266.' },

  // ═══════════════════════════════════════════════════════════════
  // MONDE 3 — MARAIS DES MOTS (vocabulaire)
  // ═══════════════════════════════════════════════════════════════
  { id: 'b_m3_001', monde: 3, matiere: 'francais-vocabulaire', theme: 'synonyme', difficulte: 'CM1',
    enonce: 'Quel est le synonyme de « peur » ?', type: 'qcm', choix: ['joie', 'crainte', 'colère', 'amour'], reponse: 'crainte',
    explication: 'Avoir peur = avoir une crainte. Synonymes proches.' },
  { id: 'b_m3_002', monde: 3, matiere: 'francais-vocabulaire', theme: 'antonyme', difficulte: 'CM1',
    enonce: 'Quel est le contraire de « froid » ?', type: 'qcm', choix: ['tiède', 'chaud', 'frais', 'gelé'], reponse: 'chaud',
    explication: 'Le contraire de froid, c\'est chaud.' },
  { id: 'b_m3_003', monde: 3, matiere: 'francais-vocabulaire', theme: 'famille-mots', difficulte: 'CM1',
    enonce: 'Quel mot vient de « école » ?', type: 'qcm', choix: ['écolier', 'éclair', 'écran', 'écureuil'], reponse: 'écolier',
    explication: 'Un écolier est un enfant qui va à l\'école. Même famille.' },

  // ═══════════════════════════════════════════════════════════════
  // MONDE 5 — TOUR DE CONJUGAISON
  // ═══════════════════════════════════════════════════════════════
  { id: 'b_m5_001', monde: 5, matiere: 'francais-conjugaison', theme: 'present', difficulte: 'CM1',
    enonce: 'Conjugue « manger » : Vous ____.', type: 'qcm', choix: ['mangez', 'mangent', 'mange', 'mangons'], reponse: 'mangez',
    explication: 'Présent, 2e personne du pluriel : « vous mangez ». 1er groupe en -ez.' },
  { id: 'b_m5_002', monde: 5, matiere: 'francais-conjugaison', theme: 'imparfait', difficulte: 'CM1',
    enonce: 'Conjugue « avoir » à l\'imparfait : Tu ____.', type: 'qcm', choix: ['avais', 'avait', 'avez', 'auras'], reponse: 'avais',
    explication: 'Imparfait de avoir : j\'avais, tu avais, il avait, nous avions.' },
  { id: 'b_m5_003', monde: 5, matiere: 'francais-conjugaison', theme: 'passe-compose', difficulte: 'CM1',
    enonce: 'Au passé composé : Hier, j\'____ (jouer).', type: 'qcm', choix: ['ai joué', 'a joué', 'as joué', 'ont joué'], reponse: 'ai joué',
    explication: 'Passé composé = avoir + participe passé. « J\'ai joué ».' },

  // ═══════════════════════════════════════════════════════════════
  // MONDE 7 — TEMPLE DE LA GRAMMAIRE
  // ═══════════════════════════════════════════════════════════════
  { id: 'b_m7_001', monde: 7, matiere: 'francais-grammaire', theme: 'sujet-verbe', difficulte: 'CM1',
    enonce: '« Les enfants jouent dans le jardin. » Quel est le sujet ?', type: 'qcm',
    choix: ['Les enfants', 'jouent', 'dans', 'le jardin'], reponse: 'Les enfants',
    explication: 'Le sujet répond à « qui ? ». Qui joue ? Les enfants.' },
  { id: 'b_m7_002', monde: 7, matiere: 'francais-grammaire', theme: 'nom', difficulte: 'CM1',
    enonce: '« Une belle maison rouge. » Quel est le nom ?', type: 'qcm',
    choix: ['Une', 'belle', 'maison', 'rouge'], reponse: 'maison',
    explication: 'Le nom désigne une chose, ici « maison ».' },
  { id: 'b_m7_003', monde: 7, matiere: 'francais-grammaire', theme: 'adjectif', difficulte: 'CM1',
    enonce: '« Le petit chien noir aboie. » Quel est l\'adjectif ?', type: 'qcm',
    choix: ['Le', 'petit', 'chien', 'aboie'], reponse: 'petit',
    explication: 'L\'adjectif décrit le nom. « Petit » qualifie chien (et « noir » aussi).' },

  // ═══════════════════════════════════════════════════════════════
  // MONDE 9 — CITÉ DE L'ORTHOGRAPHE
  // ═══════════════════════════════════════════════════════════════
  { id: 'b_m9_001', monde: 9, matiere: 'francais-orthographe', theme: 'pluriel', difficulte: 'CM1',
    enonce: 'Pluriel de « cheval » ?', type: 'qcm', choix: ['chevals', 'chevaux', 'chevales', 'chevauls'], reponse: 'chevaux',
    explication: 'Mots en -al → -aux au pluriel : un cheval / des chevaux.' },
  { id: 'b_m9_002', monde: 9, matiere: 'francais-orthographe', theme: 'homophone', difficulte: 'CM1',
    enonce: 'Complète : « Je vais ____ la plage. »', type: 'qcm', choix: ['a', 'à', 'as', 'ah'], reponse: 'à',
    explication: '« À » préposition (lieu). « A » = verbe avoir.' },
  { id: 'b_m9_003', monde: 9, matiere: 'francais-orthographe', theme: 'pluriel', difficulte: 'CM1',
    enonce: 'Pluriel de « bijou » ?', type: 'qcm', choix: ['bijous', 'bijoux', 'bijoues', 'bijoz'], reponse: 'bijoux',
    explication: 'Bijou, caillou, chou, genou, hibou, joujou, pou → tous en -oux.' },

  // ═══════════════════════════════════════════════════════════════
  // MONDE 10 — CHÂTEAU FINAL (mixte boss)
  // ═══════════════════════════════════════════════════════════════
  { id: 'b_m10_001', monde: 10, matiere: 'maths-calcul', theme: 'multiplication', difficulte: 'CM2',
    enonce: '12 × 12 = ?', type: 'qcm', choix: ['124', '132', '144', '154'], reponse: '144',
    explication: '12² = 144 (table à connaître).' },
  { id: 'b_m10_002', monde: 10, matiere: 'francais-grammaire', theme: 'nature', difficulte: 'CM2',
    enonce: 'Dans « rapidement », quelle est la nature ?', type: 'qcm',
    choix: ['adjectif', 'adverbe', 'nom', 'verbe'], reponse: 'adverbe',
    explication: 'Les mots en -ment sont souvent des adverbes (modifient un verbe).' },
  { id: 'b_m10_003', monde: 10, matiere: 'maths-calcul', theme: 'fraction', difficulte: 'CM2',
    enonce: '1/2 + 1/4 = ?', type: 'qcm', choix: ['2/6', '2/4', '3/4', '1/8'], reponse: '3/4',
    explication: '1/2 = 2/4. Donc 2/4 + 1/4 = 3/4.' },
  { id: 'b_m10_004', monde: 10, matiere: 'francais-conjugaison', theme: 'passe-simple', difficulte: 'CM2',
    enonce: 'Au passé simple : Il ____ (être).', type: 'qcm', choix: ['fut', 'était', 'fût', 'serait'], reponse: 'fut',
    explication: 'Passé simple de être : je fus, tu fus, il fut.' },

  // ═══════════════════════════════════════════════════════════════
  // MONDE 11 — PORTAIL STELLAIRE (6ème)
  // ═══════════════════════════════════════════════════════════════
  { id: 'b_m11_001', monde: 11, matiere: 'maths-calcul', theme: 'puissance', difficulte: '6e',
    enonce: '2³ = ?', type: 'qcm', choix: ['6', '8', '9', '12'], reponse: '8',
    explication: '2³ = 2×2×2 = 8.' },
  { id: 'b_m11_002', monde: 11, matiere: 'maths-geometrie', theme: 'angle', difficulte: '6e',
    enonce: 'Combien fait un angle droit ?', type: 'qcm', choix: ['45°', '60°', '90°', '180°'], reponse: '90°',
    explication: 'Un angle droit mesure exactement 90°.' },
  { id: 'b_m11_003', monde: 11, matiere: 'francais-grammaire', theme: 'cod', difficulte: '6e',
    enonce: '« Marie mange une pomme. » Quel est le COD ?', type: 'qcm',
    choix: ['Marie', 'mange', 'une pomme', 'aucun'], reponse: 'une pomme',
    explication: 'COD répond à « mange QUOI ? » → « une pomme ».' },
  { id: 'b_m11_004', monde: 11, matiere: 'maths-calcul', theme: 'priorite', difficulte: '6e',
    enonce: 'Calcule : 3 + 4 × 2', type: 'qcm', choix: ['11', '14', '10', '12'], reponse: '11',
    explication: 'Multiplication d\'abord : 4×2 = 8. Puis 3 + 8 = 11.' },

  // ═══════════════════════════════════════════════════════════════
  // MONDE 12 — FORÊT MYSTIQUE (énigmes mixtes)
  // ═══════════════════════════════════════════════════════════════
  { id: 'b_m12_001', monde: 12, matiere: 'maths-calcul', theme: 'pourcentage', difficulte: '6e',
    enonce: '20% de 50 = ?', type: 'qcm', choix: ['5', '10', '15', '20'], reponse: '10',
    explication: '20% = 20/100 = 1/5. 50/5 = 10.' },
  { id: 'b_m12_002', monde: 12, matiere: 'francais-vocabulaire', theme: 'expression', difficulte: 'CM2',
    enonce: 'Que signifie « avoir le cafard » ?', type: 'qcm',
    choix: ['être malade', 'être triste', 'être surpris', 'être fâché'], reponse: 'être triste',
    explication: '« Avoir le cafard » est une expression imagée pour la tristesse.' },
  { id: 'b_m12_003', monde: 12, matiere: 'maths-geometrie', theme: 'perimetre', difficulte: 'CM2',
    enonce: 'Périmètre d\'un carré de 6 cm de côté ?', type: 'qcm',
    choix: ['12 cm', '18 cm', '24 cm', '36 cm'], reponse: '24 cm',
    explication: 'Périmètre carré = 4 × côté = 4 × 6 = 24 cm.' },
  { id: 'b_m12_004', monde: 12, matiere: 'francais-grammaire', theme: 'temps', difficulte: 'CM2',
    enonce: 'À quel temps est : « Demain, je partirai. » ?', type: 'qcm',
    choix: ['présent', 'imparfait', 'futur', 'passé'], reponse: 'futur',
    explication: 'Terminaison -ai/-as/-a → futur simple.' },
  { id: 'b_m12_005', monde: 12, matiere: 'maths-calcul', theme: 'fraction', difficulte: 'CM2',
    enonce: 'Simplifie : 6/8', type: 'qcm', choix: ['2/4', '3/4', '4/6', '6/8'], reponse: '3/4',
    explication: '6/8 ÷ 2/2 = 3/4. On divise haut et bas par 2.' },
  { id: 'b_m12_006', monde: 12, matiere: 'francais-orthographe', theme: 'accord', difficulte: 'CM2',
    enonce: 'Complète : « Les fleurs ____ belles. »', type: 'qcm',
    choix: ['son', 'sont', 'sons', 'sond'], reponse: 'sont',
    explication: '« Sont » = verbe être pluriel. « Son » = déterminant.' },
  { id: 'b_m12_007', monde: 12, matiere: 'maths-calcul', theme: 'mental', difficulte: 'CM2',
    enonce: 'Quel est le double de 17 ?', type: 'qcm', choix: ['27', '32', '34', '37'], reponse: '34',
    explication: 'Double de 17 = 17 × 2 = 34.' },
  { id: 'b_m12_008', monde: 12, matiere: 'francais-vocabulaire', theme: 'famille-mots', difficulte: 'CM2',
    enonce: 'Quel mot ne fait PAS partie de la famille « terre » ?', type: 'qcm',
    choix: ['terrain', 'terrestre', 'tertiaire', 'enterrer'], reponse: 'tertiaire',
    explication: '« Tertiaire » vient de « tertius » (latin = troisième), pas de « terre ».' },

  // ═══════════════════════════════════════════════════════════════
  // MONDE 13 — DONJON ÉTERNEL (défi ultime)
  // ═══════════════════════════════════════════════════════════════
  { id: 'b_m13_001', monde: 13, matiere: 'maths-calcul', theme: 'priorite', difficulte: '6e',
    enonce: '(8 + 4) × 3 - 6 = ?', type: 'qcm', choix: ['24', '30', '36', '42'], reponse: '30',
    explication: 'Parenthèses d\'abord : (12) × 3 = 36. Puis 36 - 6 = 30.' },
  { id: 'b_m13_002', monde: 13, matiere: 'maths-geometrie', theme: 'aire', difficulte: '6e',
    enonce: 'Aire d\'un rectangle 8 cm × 5 cm ?', type: 'qcm',
    choix: ['13 cm²', '26 cm²', '40 cm²', '45 cm²'], reponse: '40 cm²',
    explication: 'Aire rectangle = longueur × largeur = 8 × 5 = 40 cm².' },
  { id: 'b_m13_003', monde: 13, matiere: 'francais-grammaire', theme: 'nature', difficulte: '6e',
    enonce: 'Dans « Je marche lentement », quel est l\'adverbe ?', type: 'qcm',
    choix: ['Je', 'marche', 'lentement', 'aucun'], reponse: 'lentement',
    explication: 'L\'adverbe modifie le verbe. « Lentement » dit comment je marche.' },
  { id: 'b_m13_004', monde: 13, matiere: 'maths-calcul', theme: 'division', difficulte: '6e',
    enonce: '144 ÷ 12 = ?', type: 'qcm', choix: ['11', '12', '13', '14'], reponse: '12',
    explication: '12 × 12 = 144 donc 144 ÷ 12 = 12.' },
  { id: 'b_m13_005', monde: 13, matiere: 'francais-conjugaison', theme: 'subjonctif', difficulte: '6e',
    enonce: '« Il faut que tu ____ (être) sage. »', type: 'qcm',
    choix: ['es', 'sois', 'soit', 'serai'], reponse: 'sois',
    explication: 'Après « il faut que » → subjonctif : que je sois, que tu sois, qu\'il soit.' },
  { id: 'b_m13_006', monde: 13, matiere: 'maths-calcul', theme: 'puissance', difficulte: '6e',
    enonce: '5² + 3² = ?', type: 'qcm', choix: ['16', '25', '34', '64'], reponse: '34',
    explication: '5² = 25, 3² = 9. 25 + 9 = 34.' },
  { id: 'b_m13_007', monde: 13, matiere: 'francais-vocabulaire', theme: 'sens-figure', difficulte: '6e',
    enonce: 'Sens de « Briser la glace » dans une conversation ?', type: 'qcm',
    choix: ['frapper', 'commencer à parler', 'faire froid', 'laver'], reponse: 'commencer à parler',
    explication: 'Expression idiomatique : briser le silence, mettre à l\'aise.' },
  { id: 'b_m13_008', monde: 13, matiere: 'maths-geometrie', theme: 'angle', difficulte: '6e',
    enonce: 'Somme des angles d\'un triangle ?', type: 'qcm',
    choix: ['90°', '180°', '270°', '360°'], reponse: '180°',
    explication: 'Tout triangle a ses 3 angles qui font 180° au total.' },
  { id: 'b_m13_009', monde: 13, matiere: 'francais-grammaire', theme: 'coi', difficulte: '6e',
    enonce: '« Il parle à son ami. » À son ami est :', type: 'qcm',
    choix: ['COD', 'COI', 'sujet', 'verbe'], reponse: 'COI',
    explication: 'COI = complément d\'objet INDIRECT (avec préposition à/de). « Parler à qui ? ».' },
  { id: 'b_m13_010', monde: 13, matiere: 'maths-calcul', theme: 'nombre-decimal', difficulte: '6e',
    enonce: '0,5 + 0,25 = ?', type: 'qcm', choix: ['0,55', '0,75', '0,80', '1,00'], reponse: '0,75',
    explication: '0,5 = 0,50. 0,50 + 0,25 = 0,75.' },
];
