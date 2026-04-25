import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { defaultSave, loadSave, writeSave, resetSave } from '../save/save.js';
import { setAudioSettings } from '../audio/soundEngine.js';
import { setHapticsSettings } from '../input/haptics.js';

const GameCtx = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'REPLACE': return action.payload;
    case 'MERGE': return deepMerge(state, action.payload);
    case 'SET_SCREEN':
      return { ...state, progression: { ...state.progression, currentScreen: action.screen } };
    case 'SET_PRENOM':
      return { ...state, player: { ...state.player, prenom: action.prenom } };
    case 'SET_AVATAR':
      return { ...state, player: { ...state.player, avatarId: action.avatar } };
    case 'ADD_PIECES':
      return { ...state, player: { ...state.player, piecesOr: Math.max(0, state.player.piecesOr + action.amount) } };
    case 'ADD_XP': {
      const xp = state.player.xp + action.amount;
      const niveau = 1 + Math.floor(xp / 100);
      return { ...state, player: { ...state.player, xp, niveau } };
    }
    case 'COMPLETE_TUTORIAL':
      return { ...state, tutorialCompleted: true };
    case 'SET_ETOILES': {
      const key = `${action.monde}-${action.niveau}`;
      const prev = state.progression.etoilesParNiveau[key] ?? 0;
      const etoiles = Math.max(prev, action.etoiles);
      return {
        ...state,
        progression: {
          ...state.progression,
          etoilesParNiveau: { ...state.progression.etoilesParNiveau, [key]: etoiles },
        },
      };
    }
    case 'UNLOCK_MONDE': {
      if (state.progression.mondesDeverrouilles.includes(action.monde)) return state;
      return {
        ...state,
        progression: {
          ...state.progression,
          mondesDeverrouilles: [...state.progression.mondesDeverrouilles, action.monde],
        },
      };
    }
    case 'SET_NIVEAU_COURANT':
      return {
        ...state,
        progression: { ...state.progression, mondeCourant: action.monde, niveauCourant: action.niveau },
      };
    case 'UNLOCK_COMPAGNON': {
      if (state.compagnons.debloques.includes(action.id)) return state;
      return {
        ...state,
        compagnons: {
          ...state.compagnons,
          debloques: [...state.compagnons.debloques, action.id],
          affinites: { ...state.compagnons.affinites, [action.id]: 0 },
        },
      };
    }
    case 'SET_COMPAGNON_ACTIF':
      return { ...state, compagnons: { ...state.compagnons, actif: action.id } };
    case 'INC_AFFINITE': {
      const cur = state.compagnons.affinites[action.id] ?? 0;
      return {
        ...state,
        compagnons: {
          ...state.compagnons,
          affinites: { ...state.compagnons.affinites, [action.id]: Math.min(10, cur + 1) },
        },
      };
    }
    case 'ADD_SORT': {
      if (state.inventaire.sortsAchetes.includes(action.id)) return state;
      return {
        ...state,
        inventaire: { ...state.inventaire, sortsAchetes: [...state.inventaire.sortsAchetes, action.id] },
      };
    }
    case 'ADD_POTION': {
      const cur = state.inventaire.potions[action.id] ?? 0;
      return {
        ...state,
        inventaire: { ...state.inventaire, potions: { ...state.inventaire.potions, [action.id]: cur + (action.qty ?? 1) } },
      };
    }
    case 'USE_POTION': {
      const cur = state.inventaire.potions[action.id] ?? 0;
      if (cur <= 0) return state;
      const next = { ...state.inventaire.potions };
      if (cur - 1 <= 0) delete next[action.id]; else next[action.id] = cur - 1;
      return { ...state, inventaire: { ...state.inventaire, potions: next } };
    }
    case 'ADD_EQUIPEMENT': {
      if (state.inventaire.equipementPossede.includes(action.id)) return state;
      return {
        ...state,
        inventaire: { ...state.inventaire, equipementPossede: [...state.inventaire.equipementPossede, action.id] },
      };
    }
    case 'EQUIP_ITEM': {
      return {
        ...state,
        inventaire: {
          ...state.inventaire,
          equipementEquipe: { ...state.inventaire.equipementEquipe, [action.slot]: action.id },
        },
      };
    }
    case 'ADD_TENUE': {
      if (state.inventaire.tenuesAchetees.includes(action.id)) return state;
      return {
        ...state,
        inventaire: { ...state.inventaire, tenuesAchetees: [...state.inventaire.tenuesAchetees, action.id] },
      };
    }
    case 'SET_PARAM':
      return { ...state, parametres: { ...state.parametres, [action.key]: action.value } };
    case 'ADD_BADGE':
      if (state.badges.debloques.includes(action.id)) return state;
      return {
        ...state,
        badges: {
          debloques: [...state.badges.debloques, action.id],
          dates: { ...state.badges.dates, [action.id]: Date.now() },
        },
      };
    case 'ADD_GRIMOIRE_FICHE':
      if (state.grimoire.fichesDebloquees.includes(action.id)) return state;
      return {
        ...state,
        grimoire: { fichesDebloquees: [...state.grimoire.fichesDebloquees, action.id] },
      };
    case 'ADD_BESTIAIRE_CARTE':
      if (state.bestiaire.cartesCollectees.includes(action.id)) return state;
      return {
        ...state,
        bestiaire: { cartesCollectees: [...state.bestiaire.cartesCollectees, action.id] },
      };
    case 'ADD_DIALOGUE_VU':
      if (state.dialoguesVus?.includes(action.id)) return state;
      return { ...state, dialoguesVus: [...(state.dialoguesVus || []), action.id] };
    case 'SET_DEFI_QUOTIDIEN':
      return { ...state, defiQuotidien: { ...state.defiQuotidien, ...action.payload } };
    case 'INC_DEFI_PROGRES': {
      const cur = state.defiQuotidien || {};
      const next = (cur.progres || 0) + (action.amount || 1);
      const reussi = next >= (cur.objectif || 1);
      return { ...state, defiQuotidien: { ...cur, progres: next, reussi: reussi || cur.reussi } };
    }
    case 'SET_ARENE':
      return { ...state, arene: { ...state.arene, ...action.payload } };
    case 'SET_TOUR_PAPIER':
      return { ...state, tourDeMage: { ...state.tourDeMage, papierPeint: action.papier } };
    case 'TOGGLE_TOUR_OBJET': {
      const places = state.tourDeMage.objetsPlaces || [];
      const next = places.includes(action.id)
        ? places.filter((x) => x !== action.id)
        : [...places, action.id];
      return { ...state, tourDeMage: { ...state.tourDeMage, objetsPlaces: next } };
    }
    case 'SET_BUFF': {
      const cur = state.buffsActifs ?? { chanceX2: false, bonusQuestionsEtude: 0 };
      return { ...state, buffsActifs: { ...cur, [action.key]: action.value } };
    }
    case 'CONSUME_BUFF': {
      const cur = state.buffsActifs ?? { chanceX2: false, bonusQuestionsEtude: 0 };
      const reset = action.key === 'bonusQuestionsEtude' ? 0 : false;
      return { ...state, buffsActifs: { ...cur, [action.key]: reset } };
    }
    case 'RECORD_QUESTION': {
      const idsRecents = [action.id, ...state.historiqueQuestions.idsRecents].slice(0, 20);
      const total = state.historiqueQuestions.statistiques.total + 1;
      const correctes = state.historiqueQuestions.statistiques.correctes + (action.correct ? 1 : 0);
      return {
        ...state,
        historiqueQuestions: {
          ...state.historiqueQuestions,
          idsRecents,
          statistiques: { total, correctes },
        },
      };
    }
    default: return state;
  }
}

function deepMerge(a, b) {
  if (Array.isArray(b)) return b;
  if (b && typeof b === 'object') {
    const out = { ...a };
    for (const k of Object.keys(b)) out[k] = deepMerge(a?.[k], b[k]);
    return out;
  }
  return b;
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    const loaded = loadSave();
    return loaded ?? defaultSave();
  });
  const saveTimer = useRef(null);
  const saveIndicator = useRef(null);

  useEffect(() => {
    setAudioSettings({ son: state.parametres.son, musique: state.parametres.musique });
    setHapticsSettings(state.parametres.vibration, state.parametres.vibrationManette);
  }, [state.parametres]);

  useEffect(() => {
    writeSave(state);
    if (saveIndicator.current) saveIndicator.current();
  }, [state]);

  useEffect(() => {
    const interval = setInterval(() => writeSave(state), 30000);
    const onHide = () => writeSave(state);
    window.addEventListener('beforeunload', onHide);
    window.addEventListener('visibilitychange', onHide);
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', onHide);
      window.removeEventListener('visibilitychange', onHide);
    };
  }, [state]);

  return (
    <GameCtx.Provider value={{ state, dispatch, saveIndicatorRef: saveIndicator }}>
      {children}
    </GameCtx.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export function resetAndReload() {
  resetSave();
  window.location.reload();
}
