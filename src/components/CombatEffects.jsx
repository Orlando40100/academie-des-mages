import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Couche d'effets visuels pour le combat :
// - Flash blanc au hit
// - Damage numbers flottants
// - Particules de sort
// - Screen shake (via classe CSS appliquée au parent)

let nextId = 1;

export function useCombatEffects() {
  const [popups, setPopups] = useState([]);   // {id, text, x, y, color}
  const [particles, setParticles] = useState([]); // {id, x, y, color, angle}
  const [flash, setFlash] = useState(null);   // 'red' | 'white' | null
  const [shake, setShake] = useState(0);      // 0 | 1 pulses

  const showDamage = (amount, side = 'right', kind = 'damage') => {
    const id = nextId++;
    const color = kind === 'heal' ? '#22c55e' : kind === 'crit' ? '#fbbf24' : '#ef4444';
    const text = kind === 'heal' ? `+${amount}` : `-${amount}`;
    const x = side === 'right' ? 70 : 20;
    const y = 40 + (Math.random() * 10);
    setPopups((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== id)), 900);
  };

  const burstParticles = (side = 'right', color = '#fbbf24', n = 8) => {
    const baseX = side === 'right' ? 72 : 18;
    const baseY = 50;
    const ps = Array.from({ length: n }).map((_, i) => ({
      id: nextId++,
      x: baseX + (Math.random() - 0.5) * 8,
      y: baseY + (Math.random() - 0.5) * 8,
      color,
      angle: (i / n) * Math.PI * 2,
      dist: 40 + Math.random() * 20,
    }));
    setParticles((prev) => [...prev, ...ps]);
    setTimeout(() => setParticles((prev) => prev.filter((p) => !ps.find((q) => q.id === p.id))), 700);
  };

  const flashHit = (color = 'red') => {
    setFlash(color);
    setTimeout(() => setFlash(null), 160);
  };

  const shakeNow = () => {
    setShake((s) => s + 1);
  };

  const [zoom, setZoom] = useState(0);
  const zoomPunch = () => {
    setZoom((z) => z + 1);
    setTimeout(() => setZoom((z) => Math.max(0, z - 1)), 350);
  };

  const [lightning, setLightning] = useState(0);
  const strikeLightning = () => {
    setLightning((l) => l + 1);
    setTimeout(() => setLightning((l) => Math.max(0, l - 1)), 350);
  };

  return {
    popups, particles, flash, shake, zoom, lightning,
    showDamage, burstParticles, flashHit, shakeNow, zoomPunch, strikeLightning,
  };
}

export function CombatEffectsLayer({ effects }) {
  const { popups, particles, flash, lightning } = effects;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {popups.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.6, y: 0 }}
            animate={{ opacity: 1, scale: 1.2, y: -40 }}
            exit={{ opacity: 0, scale: 0.9, y: -60 }}
            transition={{ duration: 0.9 }}
            className="absolute font-pixel text-2xl"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              color: p.color,
              textShadow: '2px 2px 0 #000, 0 0 8px rgba(0,0,0,0.8)',
            }}
          >
            {p.text}
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {particles.map((p) => {
          const endX = Math.cos(p.angle) * p.dist;
          const endY = Math.sin(p.angle) * p.dist;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{ opacity: 0, scale: 0.3, x: endX, y: endY }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute"
              style={{
                left: `${p.x}%`, top: `${p.y}%`,
                width: 6, height: 6,
                background: p.color,
                boxShadow: `0 0 6px ${p.color}`,
              }}
            />
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0"
            style={{
              background: flash === 'red' ? '#ef4444' : flash === 'green' ? '#22c55e' : '#ffffff',
              mixBlendMode: 'screen',
            }}
          />
        )}
      </AnimatePresence>

      {/* Éclair diagonal pour sort foudre */}
      <AnimatePresence>
        {lightning > 0 && (
          <motion.svg
            key={lightning}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0, 1, 0.7, 1, 0], scale: [0.7, 1.2, 1, 1, 1.1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 60 5 L 45 40 L 55 42 L 35 95 L 55 50 L 45 48 Z"
              fill="#fcd34d"
              stroke="#ffffff"
              strokeWidth="0.5"
              style={{ filter: 'drop-shadow(0 0 8px #fbbf24)' }}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
}

export function useShakeClass(shake) {
  const [cls, setCls] = useState('');
  const last = useRef(0);
  useEffect(() => {
    if (shake === last.current) return;
    last.current = shake;
    setCls('animate-shake');
    const t = setTimeout(() => setCls(''), 350);
    return () => clearTimeout(t);
  }, [shake]);
  return cls;
}
