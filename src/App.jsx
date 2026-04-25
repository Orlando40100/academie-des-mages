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
import VirtualGamepad from './components/VirtualGamepad.jsx';
import { GrimoireScreen, BestiaireScreen, BadgesScreen, ModeParentScreen } from './screens/Stubs.jsx';
import AreneScreen from './screens/AreneScreen.jsx';
import TourDeMageScreen from './screens/TourDeMageScreen.jsx';
import DefiScreen from './screens/DefiScreen.jsx';
import MiniJeuxScreen from './screens/MiniJeuxScreen.jsx';
import { startInputSystem, getInputMode, onInputModeChange, onAction } from './input/inputManager.js';
import { syncMusic, stopMusic } from './audio/musicController.js';

function Router() {
  const { state, dispatch } = useGame();
  const [payload, setPayload] = useState(null);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [mode, setMode] = useState(getInputMode());

  useEffect(() => {
    startInputSystem();
    const off = onInputModeChange(setMode);
    return off;
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

  const navigate = (screen, pl = null) => {
    setPayload(pl);
    dispatch({ type: 'SET_SCREEN', screen });
  };

  const screen = state.progression.currentScreen || 'home';
  const onPause = () => setPauseOpen(true);

  // Affiche les boutons tactiles en mode touch OU quand pas de manette ET écran tactile
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;
  const showVirtualGamepad = mode === 'touch' && isTouchDevice && screen !== 'home' && screen !== 'modeParent';

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

  return (
    <div className="w-screen h-[100dvh] overflow-hidden relative bg-magic-bg">
      <AnimatePresence mode="wait">
        <motion.div
          key={needsNewGame ? 'newgame-forced' : screen}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {needsNewGame ? <NewGameFlow onDone={(next) => navigate(next)} /> : content}
        </motion.div>
      </AnimatePresence>
      <SaveIndicator />
      <PauseMenu open={pauseOpen} onClose={() => setPauseOpen(false)} navigate={(s) => { setPauseOpen(false); navigate(s); }} />
      {showVirtualGamepad && <VirtualGamepad />}
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
