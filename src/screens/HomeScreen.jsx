import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Background from '../components/Background.jsx';
import InstallButton from '../components/InstallButton.jsx';
import { useGame } from '../store/gameStore.jsx';
import { hasSave } from '../save/save.js';
import PixelSprite from '../sprites/PixelSprite.jsx';
import SmartSprite from '../sprites/SmartSprite.jsx';
import { mage, miaou, maitreAldric, astraSprite, hulotteSprite, braiseSprite, liliSprite } from '../sprites/library.js';
import { sounds } from '../audio/soundEngine.js';
import { resetAndReload } from '../store/gameStore.jsx';
import { VERSION } from '../balance/config.js';
import { defaultSave, resetSave } from '../save/save.js';

export default function HomeScreen({ navigate }) {
  const { state, dispatch } = useGame();
  const [showOptions, setShowOptions] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);
  const existingSave = hasSave() && state.player.prenom;

  const musique = state.parametres.musique;
  const son = state.parametres.son;

  useEffect(() => {
    // Jingle d'ouverture
    if (son) setTimeout(() => sounds.confirm(), 200);
  }, []);

  const doStartNew = () => {
    sounds.confirm();
    resetSave();
    const fresh = defaultSave();
    fresh.progression.currentScreen = 'newgame';
    dispatch({ type: 'REPLACE', payload: fresh });
  };

  const startNew = () => {
    if (existingSave && !confirmNew) {
      setConfirmNew(true);
      return;
    }
    doStartNew();
  };

  const continuer = () => {
    sounds.confirm();
    const target = state.progression.currentScreen || 'worldmap';
    navigate(target === 'home' ? 'worldmap' : target);
  };

  return (
    <Background variant="magic">
      <div className="absolute inset-0 flex flex-col items-center justify-between p-6">
        {/* Silhouettes compagnons en fond */}
        <div className="absolute inset-0 flex items-end justify-around opacity-20 pointer-events-none">
          <SmartSprite assetKey="hulotte" fallback={hulotteSprite} scale={2} />
          <SmartSprite assetKey="braise" fallback={braiseSprite} scale={2} />
          <SmartSprite assetKey="lili" fallback={liliSprite} scale={2} />
          <SmartSprite assetKey="astra" fallback={astraSprite} scale={2} />
        </div>

        {/* Titre */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-4 relative z-10"
        >
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-magic-gold text-2xl" style={{ filter: 'drop-shadow(2px 2px 0 #000)' }}>✦</span>
            <h1 className="pixel-title text-xl sm:text-3xl md:text-4xl tracking-wide animate-float">
              L'Académie
            </h1>
            <span className="text-magic-gold text-2xl" style={{ filter: 'drop-shadow(2px 2px 0 #000)' }}>✦</span>
          </div>
          <h2 className="pixel-title text-lg sm:text-2xl md:text-3xl mb-3">des Mages</h2>
          <p className="font-cinzel-r text-base sm:text-lg text-magic-cream/70 italic">
            ~ Le Royaume de Grammaticaë et Numéria ~
          </p>
        </motion.div>

        {/* Sparks d'ambiance */}
        <div className="magic-spark" style={{ left: '10%', top: '15%', animationDelay: '0s' }} />
        <div className="magic-spark" style={{ left: '88%', top: '20%', animationDelay: '0.7s' }} />
        <div className="magic-spark" style={{ left: '6%', top: '70%', animationDelay: '1.4s' }} />
        <div className="magic-spark" style={{ left: '92%', top: '78%', animationDelay: '2.1s' }} />

        {/* Double cercle runique tournant + sprites centraux (Direction A) */}
        <div className="relative flex items-center justify-center" style={{ width: 360, height: 360 }}>
          {/* Cercle externe : grand, rotation lente */}
          <div
            className="magic-rune absolute"
            style={{ width: 360, height: 360, left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
          />
          {/* Cercle interne : plus petit, contre-rotation pour effet */}
          <div
            className="magic-rune absolute"
            style={{
              width: 240, height: 240,
              left: '50%', top: '50%',
              transform: 'translate(-50%,-50%)',
              animationDirection: 'reverse',
              animationDuration: '18s',
              borderColor: '#b45309',
              opacity: 0.7,
            }}
          />
          <div className="flex items-end gap-6 relative z-10">
            <SmartSprite assetKey="aldricIdle" fallback={maitreAldric} scale={4} direction="front" />
            <SmartSprite assetKey="mageIdle" fallback={mage} scale={4} direction="front" />
            <SmartSprite assetKey="miaou" fallback={miaou} scale={3} />
          </div>
        </div>

        {/* Menu */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-3 relative z-10 w-full max-w-md"
        >
          <button className="pixel-btn pixel-btn-gold w-full" onClick={startNew}>
            🗡️ Nouvelle partie
          </button>
          {existingSave ? (
            <button className="pixel-btn w-full" onClick={continuer}>
              ▶️ Continuer · {state.player.prenom} · Monde {state.progression.mondeCourant} · 🪙 {state.player.piecesOr}
            </button>
          ) : (
            <button className="pixel-btn w-full opacity-40 cursor-not-allowed" disabled>
              ▶️ Continuer
            </button>
          )}
          <button className="pixel-btn pixel-btn-pink w-full" onClick={() => { sounds.select(); navigate('menagerie'); }}>
            🐾 Ménagerie
          </button>
          <button className="pixel-btn pixel-btn-ghost w-full" onClick={() => { sounds.select(); navigate('modeParent'); }}>
            🔒 Mode parent
          </button>
        </motion.div>

        {/* Coin bas-droit */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2 z-20">
          <span className="font-retro text-sm text-magic-cream/60">v{VERSION}</span>
          <button
            onClick={() => { dispatch({ type: 'SET_PARAM', key: 'son', value: !son }); sounds.select(); }}
            className="pixel-hud"
            aria-label="Son"
          >
            {son ? '🔊' : '🔇'}
          </button>
          <button onClick={() => setShowOptions(true)} className="pixel-hud" aria-label="Options">⚙️</button>
        </div>

        {/* Bouton install (coin bas-gauche) */}
        <div className="absolute bottom-2 left-2 z-20">
          <InstallButton />
        </div>

        {/* Confirmation nouvelle partie */}
        {confirmNew && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="pixel-card max-w-md">
              <div className="font-pixel text-sm text-magic-gold mb-3">⚠️ Attention</div>
              <div className="font-retro text-xl mb-4">
                Tu as une sauvegarde active. Commencer une nouvelle partie effacera toute ta progression. Continuer ?
              </div>
              <div className="flex gap-2 justify-end">
                <button className="pixel-btn pixel-btn-ghost" onClick={() => setConfirmNew(false)}>Annuler</button>
                <button className="pixel-btn pixel-btn-red" onClick={() => { setConfirmNew(false); doStartNew(); }}>Tout effacer</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal options */}
        {showOptions && (
          <OptionsModal onClose={() => setShowOptions(false)} />
        )}
      </div>
    </Background>
  );
}

function OptionsModal({ onClose }) {
  const { state, dispatch } = useGame();
  const p = state.parametres;
  const toggle = (k) => dispatch({ type: 'SET_PARAM', key: k, value: !p[k] });
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="pixel-card max-w-md w-full">
        <div className="font-pixel text-sm text-magic-gold mb-4">⚙️ Options</div>
        <div className="space-y-2 font-retro text-lg">
          <Row label="🔊 Son" on={p.son} onClick={() => toggle('son')} />
          <Row label="🎵 Musique" on={p.musique} onClick={() => toggle('musique')} />
          <Row label="📳 Vibration mobile" on={p.vibration} onClick={() => toggle('vibration')} />
          <Row label="📈 Difficulté adaptative" on={p.difficulteAdaptative} onClick={() => toggle('difficulteAdaptative')} />
          <Row label="🐌 Animations réduites" on={p.animationsReduites} onClick={() => toggle('animationsReduites')} />
          <div className="border-t-2 border-magic-accent my-3" />
          <button className="pixel-btn pixel-btn-ghost w-full" onClick={() => {
            if (document.fullscreenElement) document.exitFullscreen();
            else document.documentElement.requestFullscreen?.();
          }}>
            ⛶ Plein écran
          </button>
          <button className="pixel-btn pixel-btn-red w-full" onClick={() => {
            if (confirm('Effacer toute la sauvegarde ? Cette action est irréversible.')) {
              if (confirm('Vraiment ? Tu perdras tout.')) resetAndReload();
            }
          }}>
            🗑️ Réinitialiser le jeu
          </button>
        </div>
        <button className="pixel-btn mt-4 w-full" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

function Row({ label, on, onClick }) {
  return (
    <button onClick={onClick} className="flex justify-between items-center w-full px-3 py-2 bg-magic-bg border border-magic-accent hover:bg-magic-accent/20">
      <span>{label}</span>
      <span className="font-pixel text-xs">{on ? 'ON' : 'OFF'}</span>
    </button>
  );
}
