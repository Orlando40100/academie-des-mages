// Écran du défi quotidien — affiche le défi du jour, sa progression, et permet de réclamer la récompense.

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Background from '../components/Background.jsx';
import HUD from '../components/HUD.jsx';
import { useGame } from '../store/gameStore.jsx';
import { sounds } from '../audio/soundEngine.js';
import { ensureDefiDuJour, getDefiById } from '../balance/defi-quotidien.js';

export default function DefiScreen({ navigate, onPause }) {
  const { state, dispatch } = useGame();

  // Initialise / met à jour le défi du jour si besoin
  useEffect(() => {
    const { needsUpdate, defi } = ensureDefiDuJour(state);
    if (needsUpdate) {
      dispatch({ type: 'SET_DEFI_QUOTIDIEN', payload: defi });
    }
  }, []);

  const cur = state.defiQuotidien;
  const challenge = cur?.challengeId ? getDefiById(cur.challengeId) : null;
  const reussi = cur?.reussi;
  const reclame = cur?.reclame;
  const progres = cur?.progres ?? 0;
  const objectif = cur?.objectif ?? 1;

  const reclamer = () => {
    if (!reussi || reclame || !challenge) return;
    sounds.confirm();
    dispatch({ type: 'ADD_PIECES', amount: challenge.recompense });
    dispatch({ type: 'SET_DEFI_QUOTIDIEN', payload: { reclame: true, serie: (cur.serie || 0) + 1 } });
  };

  if (!challenge) {
    return (
      <Background variant="magic">
        <HUD onPause={onPause} />
        <div className="absolute inset-0 pt-14 pb-4 px-3 flex flex-col items-center overflow-y-auto">
          <h2 className="pixel-title text-xl mb-3">📅 Défi du jour</h2>
          <div className="font-retro">Chargement...</div>
        </div>
      </Background>
    );
  }

  const pct = Math.min(100, Math.round((progres / objectif) * 100));

  return (
    <Background variant="magic">
      <HUD onPause={onPause} />
      <div className="absolute inset-0 pt-14 pb-4 px-3 flex flex-col items-center overflow-y-auto">
        <div className="flex items-center gap-2 w-full max-w-2xl mb-3">
          <h2 className="pixel-title text-xl flex-1">📅 Défi du jour</h2>
          <button className="pixel-btn pixel-btn-ghost" onClick={() => navigate('worldmap')}>← Carte</button>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="pixel-card-victory w-full max-w-md"
        >
          {/* Emoji + nom */}
          <div className="text-center mb-3">
            <div className="text-6xl mb-2 animate-float" style={{ filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,0.5))' }}>
              {challenge.emoji}
            </div>
            <div className="font-cinzel text-2xl text-magic-gold" style={{ fontWeight: 900, letterSpacing: '0.05em' }}>
              {challenge.nom.toUpperCase()}
            </div>
          </div>

          {/* Description */}
          <div className="font-cinzel-r text-lg text-magic-cream mb-4 text-center" style={{ textShadow: '1px 1px 0 #000' }}>
            {challenge.desc}
          </div>

          {/* Barre de progression */}
          <div className="bg-magic-bg border-2 border-magic-gold p-2 mb-3">
            <div className="flex justify-between font-pixel text-xs text-magic-gold mb-1">
              <span>Progression</span>
              <span>{progres} / {objectif}</span>
            </div>
            <div className="w-full h-3 border-2 border-black bg-magic-bg2/50">
              <motion.div
                className="h-full"
                initial={{ width: '0%' }}
                animate={{ width: `${pct}%` }}
                style={{ background: reussi ? '#22c55e' : 'linear-gradient(90deg, #fbbf24, #d97706)' }}
              />
            </div>
          </div>

          {/* Récompense + bouton */}
          <div className="flex justify-between items-center">
            <div className="font-pixel text-sm text-magic-gold">
              🪙 +{challenge.recompense}
            </div>
            {!reussi ? (
              <div className="font-pixel text-xs text-magic-cream/60">⏳ En cours...</div>
            ) : reclame ? (
              <div className="font-pixel text-xs text-magic-green">✓ Récompense réclamée</div>
            ) : (
              <button className="pixel-btn pixel-btn-gold" onClick={reclamer}>
                ✨ RÉCLAMER
              </button>
            )}
          </div>

          {/* Série */}
          {(cur.serie || 0) > 0 && (
            <div className="mt-3 pt-3 border-t-2 border-magic-accent text-center">
              <div className="font-pixel text-xs text-magic-pink">
                🔥 Série en cours : {cur.serie} jour{cur.serie > 1 ? 's' : ''} d'affilée
              </div>
            </div>
          )}
        </motion.div>

        {/* Astuce */}
        <div className="font-retro text-sm text-magic-cream/60 mt-4 text-center max-w-md">
          💡 Le défi se renouvelle chaque jour à minuit. Termine plusieurs jours d'affilée pour bâtir une série !
        </div>
      </div>
    </Background>
  );
}
