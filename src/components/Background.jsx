import { useMemo } from 'react';

export default function Background({ variant = 'magic', children }) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 30 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      })),
    []
  );

  const grad = {
    magic: 'from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e]',
    forest: 'from-[#052e16] via-[#14532d] to-[#052e16]',
    dungeon: 'from-[#1c1917] via-[#292524] to-[#0c0a09]',
    shop: 'from-[#7c2d12] via-[#431407] to-[#7c2d12]',
  }[variant] ?? 'from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e]';

  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${grad} overflow-hidden`}>
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="sparkle"
          style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.delay}s` }}
        />
      ))}
      <div className="scanline absolute inset-0 pointer-events-none" />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
