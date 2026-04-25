// Hub des mini-jeux + 2 mini-jeux jouables : Memory et Calcul Flash.

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from '../components/Background.jsx';
import HUD from '../components/HUD.jsx';
import { useGame } from '../store/gameStore.jsx';
import { sounds } from '../audio/soundEngine.js';

export default function MiniJeuxScreen({ navigate, onPause }) {
  const [game, setGame] = useState(null); // null | 'memory' | 'calcul'
  return (
    <Background variant="magic">
      <HUD onPause={onPause} />
      <div className="absolute inset-0 pt-14 pb-4 px-3 flex flex-col items-center">
        <div className="flex items-center gap-2 w-full max-w-3xl mb-3">
          <h2 className="pixel-title text-xl flex-1">🎮 Mini-jeux</h2>
          <button className="pixel-btn pixel-btn-ghost" onClick={() => navigate('worldmap')}>← Carte</button>
        </div>

        {!game && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
            <button className="pixel-card-victory text-center" onClick={() => { sounds.confirm(); setGame('memory'); }}>
              <div className="text-6xl mb-2">🧠</div>
              <div className="font-cinzel text-xl text-magic-gold mb-1" style={{ fontWeight: 900 }}>MEMORY</div>
              <div className="font-retro text-magic-cream/80">Trouve les paires de cartes magiques. +5 🪙 par victoire.</div>
            </button>
            <button className="pixel-card-victory text-center" onClick={() => { sounds.confirm(); setGame('calcul'); }}>
              <div className="text-6xl mb-2">⏱️</div>
              <div className="font-cinzel text-xl text-magic-gold mb-1" style={{ fontWeight: 900 }}>CALCUL FLASH</div>
              <div className="font-retro text-magic-cream/80">Réponds vite à un max d'opérations en 30s. +1 🪙 / bonne réponse.</div>
            </button>
          </div>
        )}

        {game === 'memory' && <MemoryGame onQuit={() => setGame(null)} />}
        {game === 'calcul' && <CalculFlash onQuit={() => setGame(null)} />}
      </div>
    </Background>
  );
}

// ═══════════════════════════════════════════════════════════════
// MEMORY — 4×3 cartes (6 paires)
// ═══════════════════════════════════════════════════════════════
function MemoryGame({ onQuit }) {
  const { dispatch } = useGame();
  const SYMBOLS = ['🔥', '⚡', '💚', '🛡️', '🌪️', '⭐'];
  const [cartes, setCartes] = useState(() => melange());
  const [retournees, setRetournees] = useState([]); // index
  const [paires, setPaires] = useState([]);          // index trouvés
  const [coups, setCoups] = useState(0);
  const [gagne, setGagne] = useState(false);

  function melange() {
    const arr = [...SYMBOLS, ...SYMBOLS].sort(() => Math.random() - 0.5);
    return arr.map((s, i) => ({ id: i, sym: s }));
  }

  const clic = (idx) => {
    if (retournees.includes(idx) || paires.includes(idx) || retournees.length === 2) return;
    sounds.select();
    const newRet = [...retournees, idx];
    setRetournees(newRet);
    if (newRet.length === 2) {
      setCoups((c) => c + 1);
      const [a, b] = newRet;
      if (cartes[a].sym === cartes[b].sym) {
        sounds.correct();
        setTimeout(() => {
          setPaires((p) => [...p, a, b]);
          setRetournees([]);
        }, 600);
      } else {
        sounds.cancel();
        setTimeout(() => setRetournees([]), 900);
      }
    }
  };

  useEffect(() => {
    if (paires.length === cartes.length && !gagne) {
      setGagne(true);
      sounds.victory();
      const recompense = Math.max(5, 30 - coups);
      dispatch({ type: 'ADD_PIECES', amount: recompense });
    }
  }, [paires]);

  const reset = () => {
    setCartes(melange());
    setRetournees([]);
    setPaires([]);
    setCoups(0);
    setGagne(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between font-pixel text-xs text-magic-gold mb-3">
        <span>Coups : {coups}</span>
        <span>Paires : {paires.length / 2} / {SYMBOLS.length}</span>
        <button className="pixel-btn pixel-btn-ghost text-[9px] px-2 py-1" onClick={onQuit}>← Retour</button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cartes.map((c, i) => {
          const visible = retournees.includes(i) || paires.includes(i);
          return (
            <button
              key={i}
              onClick={() => clic(i)}
              className="aspect-square border-4 border-magic-gold flex items-center justify-center text-3xl transition-all"
              style={{
                background: visible
                  ? 'linear-gradient(180deg, #fef3c7, #fbbf24)'
                  : 'linear-gradient(180deg, #4c2a85, #1a0b2e)',
                boxShadow: '3px 3px 0 #000',
                cursor: visible ? 'default' : 'pointer',
              }}
            >
              {visible ? c.sym : '✦'}
            </button>
          );
        })}
      </div>
      {gagne && (
        <div className="pixel-card mt-4 text-center">
          <div className="font-cinzel text-xl text-magic-gold mb-1" style={{ fontWeight: 900 }}>🏆 GAGNÉ !</div>
          <div className="font-retro text-magic-cream">Trouvé en {coups} coups · +{Math.max(5, 30 - coups)} 🪙</div>
          <div className="flex gap-2 justify-center mt-3">
            <button className="pixel-btn pixel-btn-gold" onClick={reset}>🔁 Rejouer</button>
            <button className="pixel-btn pixel-btn-ghost" onClick={onQuit}>← Retour</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CALCUL FLASH — 30s pour répondre à un max d'opérations
// ═══════════════════════════════════════════════════════════════
function CalculFlash({ onQuit }) {
  const { dispatch } = useGame();
  const [tempsRestant, setTempsRestant] = useState(30);
  const [op, setOp] = useState(genOp());
  const [reponse, setReponse] = useState('');
  const [score, setScore] = useState(0);
  const [erreurs, setErreurs] = useState(0);
  const [enJeu, setEnJeu] = useState(false);
  const [fini, setFini] = useState(false);

  function genOp() {
    const ops = [
      () => { const a = 5 + Math.floor(Math.random() * 20); const b = 5 + Math.floor(Math.random() * 20); return { txt: `${a} + ${b}`, val: a + b }; },
      () => { const a = 10 + Math.floor(Math.random() * 30); const b = 1 + Math.floor(Math.random() * a); return { txt: `${a} − ${b}`, val: a - b }; },
      () => { const a = 2 + Math.floor(Math.random() * 9); const b = 2 + Math.floor(Math.random() * 9); return { txt: `${a} × ${b}`, val: a * b }; },
    ];
    return ops[Math.floor(Math.random() * ops.length)]();
  }

  useEffect(() => {
    if (!enJeu || fini) return;
    if (tempsRestant <= 0) {
      setFini(true);
      sounds.victory();
      dispatch({ type: 'ADD_PIECES', amount: score });
      return;
    }
    const t = setTimeout(() => setTempsRestant((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [tempsRestant, enJeu, fini]);

  const submit = (e) => {
    e?.preventDefault?.();
    if (!enJeu || fini) return;
    if (parseInt(reponse, 10) === op.val) {
      sounds.correct();
      setScore((s) => s + 1);
      setOp(genOp());
      setReponse('');
    } else {
      sounds.wrong();
      setErreurs((e) => e + 1);
      setReponse('');
    }
  };

  const start = () => {
    sounds.confirm();
    setEnJeu(true);
    setFini(false);
    setTempsRestant(30);
    setScore(0);
    setErreurs(0);
    setOp(genOp());
    setReponse('');
  };

  if (!enJeu && !fini) {
    return (
      <div className="pixel-card-victory max-w-md text-center">
        <div className="text-6xl mb-2">⏱️</div>
        <h3 className="font-cinzel text-2xl text-magic-gold mb-2" style={{ fontWeight: 900 }}>CALCUL FLASH</h3>
        <div className="font-retro text-magic-cream mb-3">
          30 secondes pour résoudre un maximum d'opérations.<br />
          +1 🪙 par bonne réponse.
        </div>
        <div className="flex gap-2 justify-center">
          <button className="pixel-btn pixel-btn-gold" onClick={start}>▶ DÉMARRER</button>
          <button className="pixel-btn pixel-btn-ghost" onClick={onQuit}>← Retour</button>
        </div>
      </div>
    );
  }

  if (fini) {
    return (
      <div className="pixel-card-victory max-w-md text-center">
        <div className="text-6xl mb-2">🏁</div>
        <h3 className="font-cinzel text-2xl text-magic-gold mb-2" style={{ fontWeight: 900 }}>TEMPS ÉCOULÉ</h3>
        <div className="font-retro text-xl mb-2">
          ✓ {score} bonnes · ❌ {erreurs} erreurs
        </div>
        <div className="font-cinzel text-3xl text-magic-gold mb-3" style={{ fontWeight: 900 }}>+{score} 🪙</div>
        <div className="flex gap-2 justify-center">
          <button className="pixel-btn pixel-btn-gold" onClick={start}>🔁 Rejouer</button>
          <button className="pixel-btn pixel-btn-ghost" onClick={onQuit}>← Retour</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-card max-w-md w-full text-center">
      <div className="flex justify-between font-pixel text-xs text-magic-gold mb-2">
        <span>⏱️ {tempsRestant}s</span>
        <span>Score : {score}</span>
        <span>❌ {erreurs}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={op.txt}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="font-cinzel text-5xl text-magic-gold my-6"
          style={{ fontWeight: 900 }}
        >
          {op.txt} = ?
        </motion.div>
      </AnimatePresence>
      <form onSubmit={submit} className="flex gap-2 justify-center">
        <input
          autoFocus
          inputMode="numeric"
          value={reponse}
          onChange={(e) => setReponse(e.target.value.replace(/[^\-\d]/g, ''))}
          className="font-retro text-2xl px-3 py-2 bg-magic-bg2 text-magic-cream border-2 border-magic-accent w-24 text-center"
          placeholder="?"
        />
        <button type="submit" className="pixel-btn pixel-btn-gold" disabled={!reponse}>OK</button>
      </form>
    </div>
  );
}
