import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorldBackground from '../components/WorldBackground.jsx';
import HUD from '../components/HUD.jsx';
import { useGame } from '../store/gameStore.jsx';
import { tirerQuestions } from '../questions/index.js';
import { QUESTIONS_PAR_PHASE, MAPPING_MATIERE_SORT, getChargeForCorrect } from '../balance/config.js';
import { mondes } from '../data/mondes.js';
import { isBossLevel } from '../balance/bosses.js';
import { sounds } from '../audio/soundEngine.js';
import { haptics } from '../input/haptics.js';
import { getCompagnonById } from '../companions/companions.js';
import { getBonusCompagnon } from '../balance/compagnon-bonus.js';

export default function StudyScreen({ navigate, onPause }) {
  const { state, dispatch } = useGame();
  const monde = state.progression.mondeCourant;
  const niveau = state.progression.niveauCourant;
  const mondeData = mondes.find((m) => m.id === monde);
  const totalNiveaux = mondeData?.niveaux ?? 3;
  const isBoss = isBossLevel(monde, niveau, totalNiveaux);
  const actif = getCompagnonById(state.compagnons.actif);
  const bonusCompagnon = getBonusCompagnon(state.compagnons.actif);
  const bonusQuestions = bonusCompagnon.bonusQuestionsEtude;
  // On fige le bonus étude au mount pour éviter qu'il ne disparaisse de l'UI
  // dès que le reducer le remet à 0 ; sinon useMemo recalcule les questions.
  const bonusEtudeRef = useRef(state.buffsActifs?.bonusQuestionsEtude ?? 0);
  const bonusEtude = bonusEtudeRef.current;
  const n = QUESTIONS_PAR_PHASE + bonusQuestions + bonusEtude;

  const questions = useMemo(
    () => tirerQuestions({ monde, n, idsRecents: state.historiqueQuestions.idsRecents }),
    [monde, n]
  );

  // Consommer le buff bonusQuestionsEtude une seule fois (au mount)
  useEffect(() => {
    if (bonusEtude > 0) {
      dispatch({ type: 'CONSUME_BUFF', key: 'bonusQuestionsEtude' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [input, setInput] = useState('');
  const [charges, setCharges] = useState({ feu: 0, foudre: 0, soin: 0, bouclier: 0, vent: 0 });
  const [correct, setCorrect] = useState(0);

  const q = questions[idx];
  const done = idx >= questions.length;

  useEffect(() => {
    if (done) {
      // Lance le combat avec les charges accumulées
      dispatch({ type: 'ADD_XP', amount: correct * 10 });
      navigate('combat', { charges, bonneReponses: correct, total: questions.length });
    }
  }, [done]);

  if (done) return null;

  const submit = (valeur) => {
    const ok = String(valeur).trim().toLowerCase() === String(q.reponse).trim().toLowerCase();
    setAnswer({ value: valeur, ok });
    dispatch({ type: 'RECORD_QUESTION', id: q.id, correct: ok });
    if (ok) {
      setCorrect((c) => c + 1);
      const charge = getChargeForCorrect(q.matiere, idx, q.theme);
      setCharges((prev) => ({ ...prev, [charge]: (prev[charge] || 0) + 1 }));
      // Croquette : +1 pièce par bonne réponse
      const passifCroquette = getBonusCompagnon(state.compagnons.actif).pieceParBonneReponse;
      if (passifCroquette > 0) {
        dispatch({ type: 'ADD_PIECES', amount: passifCroquette });
      }
      sounds.correct();
      haptics.correct();
    } else {
      sounds.wrong();
      haptics.wrong();
    }
  };

  const next = () => {
    sounds.select();
    setAnswer(null);
    setInput('');
    setIdx(idx + 1);
  };

  return (
    <WorldBackground monde={monde} dim>
      <HUD onPause={onPause} />
      <div className="absolute inset-0 pt-14 pb-4 px-4 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-3 font-retro text-sm">
          <span>
            📖 {mondeData?.nom ?? `Monde ${monde}`}
            <span className={`ml-2 px-1.5 py-0.5 border font-pixel text-xs ${isBoss ? 'bg-magic-red/30 border-magic-red text-magic-red animate-pulse' : 'bg-magic-accent/30 border-magic-accent'}`}>
              {isBoss ? '👑 BOSS' : `Niveau ${niveau}/${totalNiveaux}`}
            </span>
          </span>
          <span>
            Question {idx + 1}/{questions.length}
            {bonusEtude > 0 && (
              <span className="ml-2 px-1.5 py-0.5 border font-pixel text-xs bg-magic-green/30 border-magic-green text-magic-green">
                📖 +{bonusEtude}
              </span>
            )}
          </span>
        </div>

        {/* Jauges de charges */}
        <div className="flex gap-2 justify-center mb-3 flex-wrap">
          <Jauge icon="🔥" n={charges.feu} />
          <Jauge icon="⚡" n={charges.foudre} />
          <Jauge icon="💚" n={charges.soin} />
          <Jauge icon="🛡️" n={charges.bouclier} />
          <Jauge icon="🌪️" n={charges.vent} />
        </div>

        {/* Ribbon matière (Direction A) */}
        <div className="flex justify-center mb-3">
          <div className={`ribbon ribbon-banner ${q.matiere?.startsWith('maths') ? 'ribbon-maths' : 'ribbon-fr'}`}>
            {q.matiere?.startsWith('maths') ? '⚔  MATHS  ⚔' : '✒  FRANÇAIS  ✒'}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            className="pixel-card max-w-2xl mx-auto w-full"
          >
            <div className="font-pixel text-xs text-magic-gold mb-2 text-center">
              {matLabel(q.matiere)} · {q.theme}
            </div>
            <div className="font-cinzel-r text-xl md:text-2xl text-magic-cream mb-4 min-h-[60px] leading-relaxed text-center" style={{ textShadow: '1px 1px 0 #000' }}>
              {q.enonce}
            </div>

            {q.type === 'qcm' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.choix.map((c, i) => {
                  const lettre = ['A', 'B', 'C', 'D'][i];
                  let cls = 'study-choice';
                  if (answer) {
                    if (c === q.reponse) cls += ' correct';
                    else if (c === answer.value) cls += ' wrong';
                  }
                  return (
                    <button key={`${i}-${c}`} className={cls} disabled={!!answer} onClick={() => submit(c)}>
                      <span className="study-letter">{lettre}</span>
                      <span>{c}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'saisie' && (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={!!answer}
                  inputMode={/^\d/.test(q.reponse) ? 'numeric' : 'text'}
                  placeholder="Ta réponse"
                  onKeyDown={(e) => e.key === 'Enter' && input && submit(input)}
                  className="flex-1 font-retro text-2xl px-3 py-2 bg-magic-bg2 text-magic-cream border-2 border-magic-accent"
                />
                <button
                  className="pixel-btn pixel-btn-gold"
                  disabled={!input || !!answer}
                  onClick={() => submit(input)}
                >
                  OK
                </button>
              </div>
            )}

            {answer && (
              <div className="mt-4 font-retro text-lg">
                {answer.ok ? (
                  <div className="text-magic-green">
                    ✨ Bravo ! +1 charge {chargeLabel(q.matiere, idx, q.theme)}
                  </div>
                ) : (
                  <div className="text-magic-red">
                    ❌ Bonne réponse : <span className="text-magic-gold">{q.reponse}</span>
                  </div>
                )}
                <div className="text-magic-cream/80 mt-2">{q.explication}</div>
                <button className="pixel-btn pixel-btn-gold mt-3" onClick={next}>
                  Continuer ▶ (Ⓐ)
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </WorldBackground>
  );
}

function Jauge({ icon, n }) {
  return (
    <div className="pixel-hud flex items-center gap-1">
      <span>{icon}</span>
      <span className="font-pixel text-xs">×{n}</span>
    </div>
  );
}

function matLabel(m) {
  if (m.startsWith('maths')) return 'Maths';
  if (m.startsWith('francais')) return 'Français';
  return m;
}

function chargeLabel(matiere, idx, theme) {
  const c = getChargeForCorrect(matiere, idx ?? 0, theme);
  return { feu: '🔥', foudre: '⚡', soin: '💚', bouclier: '🛡️', vent: '🌪️' }[c] ?? '🔥';
}
