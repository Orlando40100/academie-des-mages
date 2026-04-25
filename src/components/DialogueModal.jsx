import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '../audio/soundEngine.js';

// Modal qui affiche un dialogue (suite de répliques) en plein écran.
// Props : dialogue { titre, repliques: [{ qui, emoji, texte }] }, onClose: () => void
export default function DialogueModal({ dialogue, onClose }) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState('');

  if (!dialogue) return null;
  const r = dialogue.repliques[idx];
  const last = idx === dialogue.repliques.length - 1;

  // Effet machine à écrire
  useEffect(() => {
    setRevealed('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setRevealed(r.texte.slice(0, i));
      if (i >= r.texte.length) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [idx, r.texte]);

  const next = () => {
    sounds.select();
    if (revealed.length < r.texte.length) {
      setRevealed(r.texte); // skip animation
      return;
    }
    if (last) {
      sounds.confirm();
      onClose();
    } else {
      setIdx(idx + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="pixel-card-victory w-full max-w-2xl"
        onClick={next}
      >
        {/* Titre du dialogue */}
        <div className="font-pixel text-xs text-magic-gold uppercase tracking-widest mb-2 text-center">
          ✦ {dialogue.titre} ✦
        </div>

        {/* Réplique */}
        <div className="flex items-start gap-3 my-4">
          <div
            className="text-5xl shrink-0 animate-float"
            style={{ filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,0.5))' }}
          >
            {r.emoji}
          </div>
          <div className="flex-1">
            <div className="font-pixel text-xs text-magic-gold mb-2">{r.qui}</div>
            <div
              className="font-cinzel-r text-lg md:text-xl text-magic-cream leading-relaxed min-h-[80px]"
              style={{ textShadow: '1px 1px 0 #000' }}
            >
              {revealed}
              {revealed.length < r.texte.length && <span className="opacity-50 animate-blink">▎</span>}
            </div>
          </div>
        </div>

        {/* Pagination + indication */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-1">
            {dialogue.repliques.map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 border-2 border-black"
                style={{
                  background: i < idx ? '#22c55e' : i === idx ? '#fbbf24' : '#2d1b4e',
                }}
              />
            ))}
          </div>
          <button className="pixel-btn pixel-btn-gold" onClick={next}>
            {revealed.length < r.texte.length
              ? '⏩ Tout afficher'
              : last
              ? '✓ Continuer (Ⓐ)'
              : '▶ Suite (Ⓐ)'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
