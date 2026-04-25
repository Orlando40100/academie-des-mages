import { VERSION } from '../balance/config.js';

const KEY = 'academie_des_mages_save';

export const defaultSave = () => ({
  version: VERSION,
  created: Date.now(),
  lastSave: Date.now(),
  totalPlayTime: 0,
  tutorialCompleted: false,
  player: {
    prenom: '',
    avatarId: 'mage-fille',
    xp: 0,
    niveau: 1,
    piecesOr: 0,
  },
  progression: {
    currentScreen: 'home',
    mondeCourant: 1,
    niveauCourant: 1,
    etoilesParNiveau: {},
    mondesDeverrouilles: [1],
    bossFinalVaincu: false,
    niveauBonusDeverrouille: false,
  },
  currentSession: {
    etudeEnCours: null,
    combatEnCours: null,
  },
  inventaire: {
    potions: {},
    sortsAchetes: [],
    equipementPossede: [],
    equipementEquipe: {},
    tenuesAchetees: [],
    tenueEquipee: null,
  },
  compagnons: {
    debloques: ['miaou'],
    actif: 'miaou',
    affinites: { miaou: 0 },
    evolutions: {},
  },
  historiqueQuestions: {
    idsRecents: [],
    statistiques: { total: 0, correctes: 0 },
    questionsMaitrisees: [],
    questionsARetravailler: [],
  },
  grimoire: { fichesDebloquees: [] },
  bestiaire: { cartesCollectees: [] },
  badges: { debloques: [], dates: {} },
  rescueCompagnon: { derniereVisite: Date.now(), piecesAccumulees: 0 },
  buffsActifs: {
    chanceX2: false,
    bonusQuestionsEtude: 0,
  },
  dialoguesVus: [],
  defiQuotidien: {
    derniereDate: null,    // YYYY-MM-DD du défi en cours
    challengeId: null,
    progres: 0,
    objectif: 1,
    reussi: false,
    serie: 0,
    reclame: false,
  },
  arene: {
    meilleurPalier: 0,
    combatsJoues: 0,
    enCours: false,
    palierActuel: 0,
  },
  tourDeMage: {
    objetsPlaces: [],     // ids d'objets placés en décor
    papierPeint: 'base',  // 'base' | 'foret' | 'cosmos' | 'lave' | 'royal'
  },
  parametres: {
    son: true,
    musique: true,
    vibration: true,
    vibrationManette: 'normale',
    pleinEcran: false,
    codeParent: null,
    difficulteAdaptative: true,
    modeAffichage: 'auto',
    animationsReduites: false,
  },
});

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data;
  } catch (e) {
    console.warn('Sauvegarde corrompue', e);
    return null;
  }
}

export function writeSave(save) {
  try {
    save.lastSave = Date.now();
    localStorage.setItem(KEY, JSON.stringify(save));
    return true;
  } catch (e) {
    console.error('Échec de sauvegarde', e);
    return false;
  }
}

export function resetSave() {
  try {
    localStorage.removeItem(KEY);
    return true;
  } catch (e) {
    return false;
  }
}

export function hasSave() {
  try {
    return localStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
}
