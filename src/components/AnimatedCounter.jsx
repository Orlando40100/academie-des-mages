import { useEffect, useRef, useState } from 'react';

// Compteur numérique qui s'incrémente/décrémente avec animation (roulement).
// Usage : <AnimatedCounter value={piecesOr} />

export default function AnimatedCounter({ value, duration = 700, className = '' }) {
  const [display, setDisplay] = useState(value);
  const lastValue = useRef(value);

  useEffect(() => {
    if (lastValue.current === value) return;
    const start = lastValue.current;
    const end = value;
    const diff = end - start;
    const steps = Math.min(30, Math.max(5, Math.abs(diff)));
    const stepTime = duration / steps;
    let current = start;
    let step = 0;
    const id = setInterval(() => {
      step++;
      if (step >= steps) {
        setDisplay(end);
        clearInterval(id);
        lastValue.current = end;
        return;
      }
      current += diff / steps;
      setDisplay(Math.round(current));
    }, stepTime);
    return () => clearInterval(id);
  }, [value, duration]);

  const changed = display !== value;
  return (
    <span
      className={`${className} transition-transform inline-block ${changed ? 'scale-125 text-magic-gold' : ''}`}
      style={{ transformOrigin: 'center' }}
    >
      {display}
    </span>
  );
}
