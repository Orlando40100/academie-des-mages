import { useGame } from '../store/gameStore.jsx';
import { sounds } from '../audio/soundEngine.js';
import { writeSave } from '../save/save.js';

export default function PauseMenu({ open, onClose, navigate }) {
  const { state, dispatch } = useGame();
  if (!open) return null;
  const p = state.parametres;
  const toggle = (k) => dispatch({ type: 'SET_PARAM', key: k, value: !p[k] });
  const setParam = (k, v) => dispatch({ type: 'SET_PARAM', key: k, value: v });

  return (
    <div className="fixed inset-0 bg-black/85 z-40 flex items-center justify-center p-4">
      <div className="pixel-card max-w-md w-full max-h-full overflow-y-auto">
        <div className="font-pixel text-sm text-magic-gold mb-3">⏸️ Pause</div>
        <div className="space-y-2">
          <button className="pixel-btn pixel-btn-gold w-full" onClick={onClose}>▶ Reprendre</button>
          <button className="pixel-btn w-full" onClick={() => { onClose(); navigate('tutorial'); }}>🎓 Revoir le tutoriel</button>
          <button className="pixel-btn w-full" onClick={() => { onClose(); navigate('grimoire'); }}>📖 Grimoire</button>
          <button className="pixel-btn w-full" onClick={() => { onClose(); navigate('menagerie'); }}>🐾 Ménagerie</button>
          <button className="pixel-btn w-full" onClick={() => { onClose(); navigate('tour'); }}>🏠 Ma tour</button>
          <div className="border-t-2 border-magic-accent my-3" />
          <div className="font-pixel text-xs text-magic-gold">⚙️ Paramètres</div>
          <Row label="🔊 Son" on={p.son} onClick={() => toggle('son')} />
          <Row label="🎵 Musique" on={p.musique} onClick={() => toggle('musique')} />
          <Row label="📳 Vibration mobile" on={p.vibration} onClick={() => toggle('vibration')} />
          <Row label="📈 Difficulté adaptative" on={p.difficulteAdaptative} onClick={() => toggle('difficulteAdaptative')} />
          <Row label="🐌 Animations réduites" on={p.animationsReduites} onClick={() => toggle('animationsReduites')} />
          <div className="flex gap-1 items-center">
            <span className="font-retro text-base">🎮 Manette</span>
            <select
              value={p.vibrationManette}
              onChange={(e) => setParam('vibrationManette', e.target.value)}
              className="flex-1 font-retro bg-magic-bg border-2 border-magic-accent text-magic-cream px-2 py-1"
            >
              <option value="off">Off</option>
              <option value="faible">Faible</option>
              <option value="normale">Normale</option>
              <option value="forte">Forte</option>
            </select>
          </div>
          <button
            className="pixel-btn w-full"
            onClick={() => {
              if (document.fullscreenElement) document.exitFullscreen();
              else document.documentElement.requestFullscreen?.();
            }}
          >
            ⛶ Plein écran
          </button>
          <div className="border-t-2 border-magic-accent my-3" />
          <button className="pixel-btn pixel-btn-red w-full" onClick={() => {
            sounds.save();
            writeSave(state);
            onClose();
            navigate('home');
          }}>
            🏠 Retour menu (sauvegarde)
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, on, onClick }) {
  return (
    <button onClick={onClick} className="flex justify-between items-center w-full px-3 py-2 bg-magic-bg border border-magic-accent hover:bg-magic-accent/20 font-retro text-base">
      <span>{label}</span>
      <span className="font-pixel text-xs">{on ? 'ON' : 'OFF'}</span>
    </button>
  );
}
