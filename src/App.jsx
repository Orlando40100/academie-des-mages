import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './store/gameStore.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import NewGameFlow from './screens/NewGameFlow.jsx';
import TutorialScreen from './screens/TutorialScreen.jsx';
import WorldMapScreen from './screens/WorldMapScreen.jsx';
import StudyScreen from './screens/StudyScreen.jsx';
import CombatScreen from './screens/CombatScreen.jsx';
import RewardScreen from './screens/RewardScreen.jsx';
import GameOverScreen from './screens/GameOverScreen.jsx';
import ShopScreen from './screens/ShopScreen.jsx';
import MenagerieScreen from './screens/MenagerieScreen.jsx';
import PauseMenu from './screens/PauseMenu.jsx';
import SaveIndicator from './components/SaveIndicator.jsx';
import FullscreenButton from './components/FullscreenButton.jsx';
import { GrimoireScreen, BestiaireScreen, BadgesScreen, ModeParentScreen } from './screens/Stubs.jsx';
import AreneScreen from './screens/AreneScreen.jsx';
import TourDeMageScreen from './screens/TourDeMageScreen.jsx';
import DefiScreen from './screens/DefiScreen.jsx';
import MiniJeuxScreen from './screens/MiniJeuxScreen.jsx';
import { startInputSystem, onAction } from './input/inputManager.js';
import { syncMusic, stopMusic } from './audio/musicController.js';

function Router() {
  const { state, dispatch } = useGame();
  const [payload, setPayload] = useState(null);
  const [pauseOpen, setPauseOpen] = useState(false);

  useEffect(() => {
    // Système d'input clavier/manette pour desktop. Sur mobile, chaque écran
    // gère ses propres boutons natifs (pas de gamepad virtuel à l'écran).
    startInputSystem();
  }, []);

  // Raccourci pause via action START
  useEffect(() => {
    const off = onAction(({ action }) => {
      if (action === 'START') setPauseOpen((v) => !v);
    });
    return off;
  }, []);

  // Musique adaptée au contexte
  useEffect(() => {
    syncMusic({
      screen: state.progression.currentScreen,
      monde: state.progression.mondeCourant,
      musicEnabled: state.parametres.musique,
    });
  }, [state.progression.currentScreen, state.progression.mondeCourant, state.parametres.musique]);

  useEffect(() => () => stopMusic(), []);

  // Auto wake-lock pendant le jeu
  useEffect(() => {
    let wakeLock = null;
    const request = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch {}
    };
    request();
    const onVis = () => {
      if (document.visibilityState === 'visible' && !wakeLock) request();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      if (wakeLock) wakeLock.release?.();
    };
  }, []);

  // Auto plein écran sur mobile : déclenché au premier geste utilisateur
  // (les navigateurs interdisent requestFullscreen() sans user gesture).
  // → On hook un listener one-shot qui se désinscrit après le premier tap.
  // Sur iOS Safari, requestFullscreen() n'est pas supporté pour les éléments
  // non-vidéo : le seul vrai plein écran possible est l'install en PWA
  // (manifest display:'fullscreen' s'occupe de ça).
  useEffect(() => {
    const isStandalone =
      window.matchMedia?.('(display-mode: fullscreen)').matches ||
      window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    if (isStandalone) return; // déjà en mode plein écran (PWA installée)

    const goFullscreen = () => {
      const el = document.documentElement;
      const req =
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.msRequestFullscreen;
      if (req) {
        try { req.call(el, { navigationUI: 'hide' }); } catch { try { req.call(el); } catch {} }
      }
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener('pointerdown', goFullscreen);
      window.removeEventListener('keydown', goFullscreen);
    };
    window.addEventListener('pointerdown', goFullscreen, { once: true });
    window.addEventListener('keydown', goFullscreen, { once: true });
    return cleanup;
  }, []);

  const navigate = (screen, pl = null) => {
    setPayload(pl);
    dispatch({ type: 'SET_SCREEN', screen });
  };

  const screen = state.progression.currentScreen || 'home';
  const onPause = () => setPauseOpen(true);

  // Pas de gamepad virtuel : sur mobile, on utilise les boutons natifs de chaque écran
  // (la duplication créait des conflits, et la worldmap a déjà sa propre nav).

  let content;
  switch (screen) {
    case 'home':       content = <HomeScreen navigate={navigate} />; break;
    case 'newgame':    content = <NewGameFlow onDone={(next) => navigate(next)} />; break;
    case 'tutorial':   content = <TutorialScreen onDone={(next) => navigate(next)} />; break;
    case 'worldmap':   content = <WorldMapScreen navigate={navigate} onPause={onPause} />; break;
    case 'study':      content = <StudyScreen navigate={navigate} onPause={onPause} />; break;
    case 'combat':     content = <CombatScreen navigate={navigate} onPause={onPause} payload={payload} />; break;
    case 'reward':     content = <RewardScreen navigate={navigate} payload={payload} />; break;
    case 'gameover':   content = <GameOverScreen navigate={navigate} />; break;
    case 'shop':       content = <ShopScreen navigate={navigate} onPause={onPause} />; break;
    case 'menagerie':  content = <MenagerieScreen navigate={navigate} onPause={onPause} />; break;
    case 'grimoire':   content = <GrimoireScreen navigate={navigate} onPause={onPause} />; break;
    case 'bestiaire':  content = <BestiaireScreen navigate={navigate} onPause={onPause} />; break;
    case 'badges':     content = <BadgesScreen navigate={navigate} onPause={onPause} />; break;
    case 'arene':      content = <AreneScreen navigate={navigate} onPause={onPause} />; break;
    case 'tour':       content = <TourDeMageScreen navigate={navigate} onPause={onPause} />; break;
    case 'defi':       content = <DefiScreen navigate={navigate} onPause={onPause} />; break;
    case 'minijeux':   content = <MiniJeuxScreen navigate={navigate} onPause={onPause} />; break;
    case 'modeParent': content = <ModeParentScreen navigate={navigate} />; break;
    default:           content = <HomeScreen navigate={navigate} />;
  }

  // Si prénom pas saisi et pas sur newgame/home : forcer newgame après clic "Nouvelle partie"
  // La home gère déjà les cas.
  const needsNewGame = screen !== 'home' && screen !== 'modeParent' && !state.player.prenom;

  // BUG FIX : on utilise une clé STABLE pour le NewGameFlow.
  // Avant, la key passait de 'newgame-forced' à 'newgame' au moment où
  // dispatch(SET_PRENOM) mettait à jour le state, ce qui forçait
  // <AnimatePresence> à démonter/remonter le composant et perdait son state
  // interne (étape, prénom saisi). Résultat : le user devait ressaisir le
  // prénom une 2e fois pour finalement arriver sur la worldmap.
  // → On considère que tant qu'on est dans le flux nouvelle partie
  //   (screen='newgame' OU prénom pas encore saisi), la clé reste 'newgame'.
  const inNewGameFlow = needsNewGame || screen === 'newgame';
  const animKey = inNewGameFlow ? 'newgame' : screen;

  return (
    <div className="w-screen h-[100dvh] overflow-hidden relative bg-magic-bg">
      <AnimatePresence mode="wait">
        <motion.div
          key={animKey}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {inNewGameFlow ? <NewGameFlow onDone={(next) => navigate(next)} /> : content}
        </motion.div>
      </AnimatePresence>
      <SaveIndicator />
      <FullscreenButton />
      <PauseMenu open={pauseOpen} onClose={() => setPauseOpen(false)} navigate={(s) => { setPauseOpen(false); navigate(s); }} />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Router />
    </GameProvider>
  );
}
