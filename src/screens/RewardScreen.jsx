import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from '../components/Background.jsx';
import { useGame } from '../store/gameStore.jsx';
import { GAINS } from '../balance/config.js';
import { getBonusEquipement } from '../balance/equipement.js';
import { getBadgesAUnlock } from '../balance/badges.js';
import { mondes } from '../data/mondes.js';
import { DIALOGUE_AFTER_BOSS, getDialogue } from '../data/dialogues.js';
import DialogueModal from '../components/DialogueModal.jsx';
import { sounds } from '../audio/soundEngine.js';
import { haptics } from '../input/haptics.js';

export default function RewardScreen({ navigate, payload }) {
  const { state, dispatch } = useGame();
  // Snapshot des infos de combat (évite glitches sur dispatch SET_NIVEAU_COURANT)
  const [snapshot] = useState(() => ({
    monde: state.progression.mondeCourant,
    niveau: state.progression.niveauCourant,
  }));
  const monde = snapshot.monde;
  const niveau = snapshot.niveau;
  const cfg = mondes.find((m) => m.id === monde);
  const totalNiveaux = cfg?.niveaux ?? 3;
  const lastLevel = niveau >= totalNiveaux;
  const bonnes = payload?.bonneReponses ?? 0;
  const total = payload?.total ?? 5;
  const ratio = bonnes / total;
  const etoiles = ratio >= 0.95 ? 3 : ratio >= 0.6 ? 2 : 1;

  const gainBase = etoiles === 3 ? GAINS.troisEtoiles : etoiles === 2 ? GAINS.deuxEtoiles : GAINS.victoire;
  const chanceX2 = !!state.buffsActifs?.chanceX2;
  const piecesBonus = getBonusEquipement(state.inventaire.equipementEquipe).piecesBonus || 0;
  const gainAvecBonus = Math.round(gainBase * (1 + piecesBonus));
  const gain = chanceX2 ? gainAvecBonus * 2 : gainAvecBonus;

  const [starsShown, setStarsShown] = useState(0);
  const [coinsShown, setCoinsShown] = useState(false);
  const [applied, setApplied] = useState(false);
  // Dialogue à montrer après un boss (si pas encore vu)
  const dialogueId = niveau >= totalNiveaux ? DIALOGUE_AFTER_BOSS[monde] : null;
  const dejaVu = state.dialoguesVus?.includes(dialogueId);
  const [showDialogue, setShowDialogue] = useState(!!dialogueId && !dejaVu);

  // Progression appliquée une seule fois
  useEffect(() => {
    if (applied) return;
    setApplied(true);
    dispatch({ type: 'ADD_PIECES', amount: gain });
    if (chanceX2) dispatch({ type: 'CONSUME_BUFF', key: 'chanceX2' });
    dispatch({ type: 'SET_ETOILES', monde, niveau, etoiles });
    dispatch({ type: 'INC_AFFINITE', id: state.compagnons.actif });
    if (cfg && niveau >= cfg.niveaux) {
      if (cfg.recompense) dispatch({ type: 'UNLOCK_COMPAGNON', id: cfg.recompense });
      if (monde < mondes.length) dispatch({ type: 'UNLOCK_MONDE', monde: monde + 1 });
      dispatch({ type: 'SET_NIVEAU_COURANT', monde: Math.min(monde + 1, mondes.length), niveau: 1 });
    } else {
      dispatch({ type: 'SET_NIVEAU_COURANT', monde, niveau: niveau + 1 });
    }
    // ─── Tracking défi quotidien ───
    if (state.defiQuotidien?.challengeId && !state.defiQuotidien.reussi) {
      const c = state.defiQuotidien.challengeId;
      const ratio = bonnes / total;
      // combat-victoire (chaque combat gagné)
      if (c === 'gagner_2_combats' || c === 'tuer_3_ennemis') {
        dispatch({ type: 'INC_DEFI_PROGRES', amount: 1 });
      }
      // parfait
      if (c === 'parfait_1' && ratio === 1) {
        dispatch({ type: 'INC_DEFI_PROGRES', amount: 1 });
      }
      // questions
      if (c === 'questions_20') {
        dispatch({ type: 'INC_DEFI_PROGRES', amount: total });
      }
    }
    // ─── Auto-déblocage badges ───
    // On utilise un setTimeout pour que tous les dispatch précédents
    // se soient propagés avant qu'on relise le state.
    setTimeout(() => {
      const fresh = JSON.parse(localStorage.getItem('academie_des_mages_save') || 'null');
      if (!fresh) return;
      const aUnlock = getBadgesAUnlock(fresh);
      for (const badge of aUnlock) {
        dispatch({ type: 'ADD_BADGE', id: badge.id });
      }
    }, 100);
  }, []);

  // Animation séquentielle : étoiles apparaissent une par une avec son
  useEffect(() => {
    const delays = [600, 1100, 1600];
    const timers = [];
    for (let i = 0; i < etoiles; i++) {
      timers.push(setTimeout(() => {
        setStarsShown(i + 1);
        sounds.correct();
        haptics.correct();
      }, delays[i]));
    }
    timers.push(setTimeout(() => {
      setCoinsShown(true);
      sounds.coin();
    }, 1600 + etoiles * 250));
    return () => timers.forEach(clearTimeout);
  }, [etoiles]);

  return (
    <Background variant="magic">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {/* Halo doré tournant en fond */}
        <div className="magic-rune absolute" style={{ width: 360, height: 360, left: '50%', top: '32%', transform: 'translate(-50%,-50%)', opacity: 0.7, pointerEvents: 'none' }} />
        {/* Sparks */}
        {[[12, 18, 0], [88, 12, 0.5], [10, 50, 1], [90, 48, 1.5], [15, 78, 2], [85, 72, 0.8]].map(([l, t, d], i) => (
          <div key={i} className="magic-spark" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${d}s` }} />
        ))}

        {/* Bannière VICTOIRE */}
        <motion.div
          initial={{ y: -60, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          className="victory-banner mb-6 animate-float"
        >
          ✦ VICTOIRE ✦
        </motion.div>

        {/* Rangée de 3 étoiles séquentielles */}
        <div className="flex gap-4 mb-6">
          {[1, 2, 3].map((i) => {
            const acquired = i <= starsShown;
            const unavailable = i > etoiles;
            return (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={
                  acquired
                    ? { scale: i === 2 ? 1.25 : 1.1, rotate: 0, opacity: 1 }
                    : unavailable
                    ? { scale: 0.7, rotate: 0, opacity: 0.4 }
                    : { scale: 0, rotate: -180, opacity: 0 }
                }
                transition={{ duration: 0.5, type: 'spring', stiffness: 250 }}
                className="relative"
              >
                <div className={`reward-star ${unavailable && !acquired ? 'reward-star-empty' : ''} ${i === 2 ? 'reward-star-big' : ''}`} />
                {acquired && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.8) 0%, transparent 70%)' }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Carte stats + récompenses */}
        <div className="pixel-card-victory w-full max-w-md text-center mb-4">
          {/* Bandeau progression du monde */}
          <div className="bg-magic-bg border-2 border-magic-gold mb-3 px-2 py-2" style={{ boxShadow: 'inset 0 0 8px rgba(251,191,36,0.2)' }}>
            <div className="font-pixel text-xs text-magic-gold mb-1">
              {(cfg?.nom ?? `Monde ${monde}`).toUpperCase()}
            </div>
            {lastLevel ? (
              <div className="font-retro text-base text-magic-green">
                🎉 Monde terminé ! Nouveau monde débloqué !
              </div>
            ) : (
              <>
                <div className="font-retro text-base text-magic-cream">
                  Niveau <span className="text-magic-gold font-bold">{niveau}</span> / {totalNiveaux} terminé
                </div>
                <div className="flex justify-center gap-1 mt-2">
                  {Array.from({ length: totalNiveaux }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 border-2 border-black ${i < niveau ? 'bg-magic-gold' : 'bg-magic-bg2/50'}`}
                      style={i < niveau ? { background: 'linear-gradient(180deg, #fde68a, #d97706)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)' } : {}}
                    />
                  ))}
                </div>
                <div className="font-retro text-xs text-magic-cream/70 mt-1">
                  Encore {totalNiveaux - niveau} niveau{totalNiveaux - niveau > 1 ? 'x' : ''} avant le monde suivant
                </div>
              </>
            )}
          </div>

          <div className="font-retro text-xl mb-1 text-magic-cream">
            Tu as réussi <span className="text-magic-gold font-bold">{bonnes}/{total}</span> questions
          </div>
          <div className="font-retro text-base text-magic-cream/70 mb-3">
            ({Math.round(ratio * 100)}% de réussite)
          </div>

          <AnimatePresence>
            {coinsShown && (
              <motion.div
                initial={{ scale: 0, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex items-center justify-center gap-3 my-3 py-3 px-4 border-2 border-magic-gold"
                style={{
                  background: 'linear-gradient(180deg, rgba(251,191,36,0.18), rgba(180,83,9,0.18))',
                  boxShadow: 'inset 0 0 12px rgba(251,191,36,0.2)',
                }}
              >
                <div className="reward-coin">★</div>
                <span className="font-cinzel text-3xl font-black text-magic-gold" style={{ textShadow: '2px 2px 0 #000' }}>+{gain}</span>
                {chanceX2 && (
                  <span className="font-pixel text-xs text-magic-green ml-1">🍀 ×2 !</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {coinsShown && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-retro text-base text-magic-cream/85"
            >
              Ton compagnon gagne <span className="text-magic-pink font-bold">+1 ❤️ affinité</span>
            </motion.div>
          )}
        </div>

        {/* Boutons de navigation */}
        {coinsShown && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-2 w-full max-w-md"
          >
            <button className="pixel-btn pixel-btn-gold" onClick={() => navigate('study')}>
              {lastLevel ? '▶ Nouveau monde !' : `▶ Niveau ${niveau + 1}/${totalNiveaux}`}
            </button>
            <div className="flex gap-2">
              <button className="pixel-btn pixel-btn-ghost flex-1" onClick={() => navigate('worldmap')}>
                🗺️ Carte
              </button>
              <button className="pixel-btn pixel-btn-pink flex-1" onClick={() => navigate('shop')}>
                🏪 Boutique
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Dialogue narratif après boss */}
      {showDialogue && dialogueId && (
        <DialogueModal
          dialogue={getDialogue(dialogueId)}
          onClose={() => {
            dispatch({ type: 'ADD_DIALOGUE_VU', id: dialogueId });
            setShowDialogue(false);
          }}
        />
      )}
    </Background>
  );
}
