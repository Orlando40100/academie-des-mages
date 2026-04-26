// Mode Arène : gauntlet de combats successifs sans repos.
// Le palier augmente la difficulté à chaque round.

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Background from '../components/Background.jsx';
import HUD from '../components/HUD.jsx';
import MobileScrollPane from '../components/MobileScrollPane.jsx';
import { useGame } from '../store/gameStore.jsx';
import { sounds } from '../audio/soundEngine.js';
import { GAINS } from '../balance/config.js';

const PALIERS = [
  { num: 1,  pvEnnemi: 4,  dmgEnnemi: 1, recompense: 10 },
  { num: 2,  pvEnnemi: 6,  dmgEnnemi: 2, recompense: 15 },
  { num: 3,  pvEnnemi: 9,  dmgEnnemi: 2, recompense: 20 },
  { num: 4,  pvEnnemi: 12, dmgEnnemi: 3, recompense: 30 },
  { num: 5,  pvEnnemi: 16, dmgEnnemi: 3, recompense: 40 },
  { num: 6,  pvEnnemi: 20, dmgEnnemi: 4, recompense: 50 },
  { num: 7,  pvEnnemi: 25, dmgEnnemi: 4, recompense: 70 },
  { num: 8,  pvEnnemi: 30, dmgEnnemi: 5, recompense: 90 },
  { num: 9,  pvEnnemi: 38, dmgEnnemi: 5, recompense: 120 },
  { num: 10, pvEnnemi: 50, dmgEnnemi: 6, recompense: 200 },
];

const ENNEMIS_NOM = ['Slime mineur','Gobelin','Loup-garou','Troll','Ogre','Cyclope','Démon','Wyvern','Basilic','Champion'];

export default function AreneScreen({ navigate, onPause }) {
  const { state, dispatch } = useGame();
  const ok = state.progression.bossFinalVaincu || state.progression.mondesDeverrouilles.includes(11);

  const [palier, setPalier] = useState(0);
  const [pvMage, setPvMage] = useState(20);
  const [pvEnnemi, setPvEnnemi] = useState(PALIERS[0].pvEnnemi);
  const [tour, setTour] = useState('mage');
  const [log, setLog] = useState(['L\'arène vibre. Es-tu prêt(e) ?']);
  const [gainsTotaux, setGainsTotaux] = useState(0);
  const [enJeu, setEnJeu] = useState(false);
  const [fini, setFini] = useState(null); // null | 'victoire-arene' | 'defaite'

  const cur = PALIERS[palier];

  if (!ok) {
    return (
      <Background variant="magic">
        <HUD onPause={onPause} />
        <div className="absolute inset-0 pt-14 pb-4 px-4 flex flex-col items-center justify-center">
          <div className="pixel-card text-center max-w-md">
            <div className="text-5xl mb-3">🏛️</div>
            <h2 className="font-cinzel text-2xl text-magic-gold mb-3" style={{ fontWeight: 900 }}>L\'ARÈNE</h2>
            <div className="font-retro text-lg text-magic-cream/80 mb-3">
              🔒 Débloquée après avoir vaincu le boss du Château Final (Monde 10).
            </div>
            <button className="pixel-btn pixel-btn-ghost" onClick={() => navigate('worldmap')}>← Retour</button>
          </div>
        </div>
      </Background>
    );
  }

  const ajoutLog = (m) => setLog((l) => [...l.slice(-3), m]);

  const startArene = () => {
    sounds.confirm();
    setEnJeu(true);
    setPalier(0);
    setPvMage(20);
    setPvEnnemi(PALIERS[0].pvEnnemi);
    setTour('mage');
    setGainsTotaux(0);
    setFini(null);
    setLog([`🏛️ Round 1 : ${ENNEMIS_NOM[0]} apparaît !`]);
    dispatch({ type: 'SET_ARENE', payload: { combatsJoues: state.arene.combatsJoues + 1, enCours: true } });
  };

  const attaquer = () => {
    sounds.hit();
    const dmg = 3 + Math.floor(Math.random() * 3); // 3-5
    setPvEnnemi((pv) => Math.max(0, pv - dmg));
    ajoutLog(`Tu attaques pour ${dmg} dégâts !`);
    setTimeout(() => setTour('ennemi'), 600);
  };

  const soigner = () => {
    sounds.heal();
    setPvMage((pv) => Math.min(20, pv + 4));
    ajoutLog('💚 +4 PV');
    setTimeout(() => setTour('ennemi'), 600);
  };

  // Tour ennemi
  useEffect(() => {
    if (tour === 'ennemi' && enJeu && pvEnnemi > 0 && pvMage > 0) {
      const t = setTimeout(() => {
        const dmg = cur.dmgEnnemi + Math.floor(Math.random() * 2); // jitter
        setPvMage((pv) => Math.max(0, pv - dmg));
        ajoutLog(`L'ennemi attaque (-${dmg} PV)`);
        setTour('mage');
      }, 800);
      return () => clearTimeout(t);
    }
  }, [tour, enJeu]);

  // Détecte fin de palier ou défaite
  useEffect(() => {
    if (!enJeu) return;
    if (pvEnnemi <= 0) {
      sounds.victory();
      const gain = cur.recompense;
      setGainsTotaux((g) => g + gain);
      ajoutLog(`✓ Vainqueur palier ${cur.num} ! +${gain} 🪙`);
      // Suivant
      if (palier + 1 >= PALIERS.length) {
        // Fin victorieuse de l'arène
        setTimeout(() => {
          setFini('victoire-arene');
          setEnJeu(false);
          dispatch({ type: 'ADD_PIECES', amount: gainsTotaux + gain + 200 }); // bonus final
          dispatch({ type: 'SET_ARENE', payload: { meilleurPalier: Math.max(state.arene.meilleurPalier, PALIERS.length), enCours: false } });
        }, 1200);
      } else {
        setTimeout(() => {
          setPalier((p) => p + 1);
          setPvEnnemi(PALIERS[palier + 1].pvEnnemi);
          ajoutLog(`🏛️ Round ${palier + 2} : ${ENNEMIS_NOM[palier + 1]} apparaît !`);
        }, 1500);
      }
    } else if (pvMage <= 0) {
      sounds.gameOver();
      ajoutLog('💔 Tu t\'effondres...');
      setTimeout(() => {
        setFini('defaite');
        setEnJeu(false);
        dispatch({ type: 'ADD_PIECES', amount: gainsTotaux });
        dispatch({ type: 'SET_ARENE', payload: { meilleurPalier: Math.max(state.arene.meilleurPalier, palier + 1), enCours: false } });
      }, 1500);
    }
  }, [pvEnnemi, pvMage]);

  return (
    <Background variant="dungeon">
      <HUD onPause={onPause} />

      {/* Header fixé sous le HUD */}
      <div
        style={{
          position: 'absolute', top: 60, left: 12, right: 12, zIndex: 5,
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <h2 className="pixel-title text-xl" style={{ flex: 1 }}>🏛️ Arène des Champions</h2>
        <button className="pixel-btn pixel-btn-ghost" onClick={() => navigate('worldmap')}>← Carte</button>
      </div>

      {/* Zone scrollable bulletproof */}
      <MobileScrollPane topOffset={108}>
        <div className="flex flex-col">
        {!enJeu && !fini && (
          <div className="pixel-card text-center max-w-md mx-auto">
            <div className="font-cinzel text-xl text-magic-gold mb-2" style={{ fontWeight: 900 }}>10 ROUNDS · 1 SEULE BARRE DE VIE</div>
            <div className="font-retro text-magic-cream/80 mb-3">
              Affronte 10 adversaires sans repos. Pas de soin entre les rounds. Les rounds avancés rapportent jusqu'à <span className="text-magic-gold">200 🪙</span> + bonus final.
            </div>
            <div className="font-pixel text-xs text-magic-cream/60 mb-3">
              Meilleur palier : <span className="text-magic-gold">{state.arene.meilleurPalier}/10</span> · Combats joués : {state.arene.combatsJoues}
            </div>
            <button className="pixel-btn pixel-btn-gold w-full" onClick={startArene}>
              ⚔️ COMMENCER L'ARÈNE
            </button>
          </div>
        )}

        {fini && (
          <div className="pixel-card-victory text-center max-w-md mx-auto">
            <div className="text-6xl mb-3">{fini === 'victoire-arene' ? '🏆' : '💔'}</div>
            <h3 className="font-cinzel text-2xl text-magic-gold mb-2" style={{ fontWeight: 900 }}>
              {fini === 'victoire-arene' ? 'CHAMPION DE L\'ARÈNE !' : 'TU AS TENU JUSQU\'AU PALIER ' + (palier + 1)}
            </h3>
            <div className="font-retro text-xl mb-3">
              Total gagné : <span className="text-magic-gold font-bold">{gainsTotaux + (fini === 'victoire-arene' ? 200 : 0)} 🪙</span>
            </div>
            <div className="flex gap-2 justify-center">
              <button className="pixel-btn pixel-btn-gold" onClick={startArene}>🔁 Recommencer</button>
              <button className="pixel-btn pixel-btn-ghost" onClick={() => { setFini(null); navigate('worldmap'); }}>← Carte</button>
            </div>
          </div>
        )}

        {enJeu && (
          <>
            {/* Header palier */}
            <div className="pixel-card mb-3">
              <div className="flex justify-between items-center">
                <div className="font-pixel text-sm text-magic-gold">PALIER {cur.num}/10</div>
                <div className="font-pixel text-xs text-magic-cream">Total : {gainsTotaux} 🪙</div>
              </div>
              <div className="font-cinzel text-lg text-magic-cream mt-1" style={{ fontWeight: 700 }}>
                {ENNEMIS_NOM[palier]}
              </div>
            </div>

            {/* Combat — barres de PV */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="pixel-card">
                <div className="font-pixel text-xs text-magic-gold mb-1">{state.player.prenom || 'Mage'}</div>
                <BarreSimple pv={pvMage} max={20} couleur="#22c55e" />
                <div className="font-retro text-sm mt-1">{pvMage}/20 PV</div>
              </div>
              <div className="pixel-card">
                <div className="font-pixel text-xs text-magic-red mb-1">{ENNEMIS_NOM[palier]}</div>
                <BarreSimple pv={pvEnnemi} max={cur.pvEnnemi} couleur="#ef4444" />
                <div className="font-retro text-sm mt-1">{pvEnnemi}/{cur.pvEnnemi} PV</div>
              </div>
            </div>

            {/* Log */}
            <div className="pixel-card mb-3 max-w-md mx-auto">
              <div className="font-retro text-magic-cream">{log[log.length - 1]}</div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto w-full">
              <button className="pixel-btn pixel-btn-red" onClick={attaquer} disabled={tour !== 'mage'}>
                ⚔️ Attaquer
              </button>
              <button className="pixel-btn pixel-btn-green" onClick={soigner} disabled={tour !== 'mage'}>
                💚 Soigner
              </button>
            </div>
          </>
        )}
        </div>
      </MobileScrollPane>
    </Background>
  );
}

function BarreSimple({ pv, max, couleur }) {
  return (
    <div className="w-full h-3 border-2 border-black bg-magic-bg2/50">
      <motion.div
        className="h-full"
        initial={false}
        animate={{ width: `${(pv / max) * 100}%` }}
        transition={{ duration: 0.4 }}
        style={{ background: couleur }}
      />
    </div>
  );
}
