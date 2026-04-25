import { useGame } from '../store/gameStore.jsx';
import { getCompagnonById } from '../companions/companions.js';
import AnimatedCounter from './AnimatedCounter.jsx';

export default function HUD({ onPause }) {
  const { state } = useGame();
  const comp = getCompagnonById(state.compagnons.actif);
  return (
    <div className="fixed top-0 inset-x-0 safe-top z-20 flex items-center justify-between px-3 py-2 pixel-hud-bar">
      <div className="flex items-center gap-2">
        <span className="font-cinzel-r text-magic-gold font-bold text-base">{state.player.prenom || 'Mage'}</span>
        <span className="font-retro text-magic-cream/70 text-base">Niv.{state.player.niveau}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-retro text-magic-gold text-base flex items-center gap-1">
          🪙 <AnimatedCounter value={state.player.piecesOr} className="font-retro" />
        </span>
        {comp && <span title={comp.nom} className="text-lg">{comp.emoji}</span>}
        <button
          onClick={onPause}
          className="font-pixel text-xs px-2 py-1 bg-magic-bg/90 border-2 border-magic-accent text-magic-cream"
          aria-label="Pause"
        >
          ☰
        </button>
      </div>
    </div>
  );
}
