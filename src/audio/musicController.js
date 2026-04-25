// Contrôleur haut niveau : choisit la bonne piste selon l'écran + monde.
import { playTrack, stopMusic, setMusicEnabled, setMusicVolume } from './musicEngine.js';
import { themeAccueil, themeCombat, themeVictoire, tracksByMonde } from './tracks.js';

let lastKey = null;

function trackForContext({ screen, monde }) {
  if (screen === 'home' || screen === 'newgame' || screen === 'tutorial') return { key: 'home', track: themeAccueil };
  if (screen === 'combat') return { key: `combat`, track: themeCombat };
  if (screen === 'reward') return { key: 'victory', track: themeVictoire };
  if (screen === 'gameover') return { key: 'silence', track: null };
  if (screen === 'worldmap') return { key: 'home', track: themeAccueil };
  // study, shop, menagerie, etc. → musique du monde
  const m = tracksByMonde[monde] ?? tracksByMonde[1];
  return { key: `monde-${monde}`, track: m };
}

export function syncMusic({ screen, monde, musicEnabled }) {
  setMusicEnabled(!!musicEnabled);
  if (!musicEnabled) {
    lastKey = null;
    return;
  }
  const { key, track } = trackForContext({ screen, monde });
  if (key === lastKey) return;
  lastKey = key;
  if (track) playTrack(track);
  else stopMusic();
}

export { stopMusic, setMusicVolume };
