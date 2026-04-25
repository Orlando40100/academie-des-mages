// Barre de PV visuelle en cœurs pixel (style Zelda).
// heart.png = 80×16 = 5 frames 16×16 (plein → vide)

import { assetPath } from '../sprites/assetRegistry.js';

const heartSrc = assetPath('ui/hp/heart.png');
const FRAME_W = 16;
const FRAME_H = 16;
const FRAMES = 5; // plein, 3/4, 1/2, 1/4, vide

export default function HeartBar({ pv, max, scale = 2, className = '', perHeart = 1 }) {
  const totalHearts = Math.ceil(max / perHeart);
  const display = [];
  let remaining = pv;
  for (let i = 0; i < totalHearts; i++) {
    const value = Math.max(0, Math.min(perHeart, remaining));
    const frame = value >= perHeart * 0.875 ? 0
                : value >= perHeart * 0.625 ? 1
                : value >= perHeart * 0.375 ? 2
                : value >= perHeart * 0.125 ? 3
                : 4;
    display.push(frame);
    remaining -= perHeart;
  }

  // Mode condensé au-delà de 10 cœurs : un seul cœur + chiffre
  if (totalHearts > 10) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <HeartSprite frame={display[0]} scale={scale} />
        <span
          className="font-pixel text-sm"
          style={{
            color: '#fef3c7',
            textShadow: '1px 1px 0 #000',
          }}
        >
          × {pv}/{max}
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-[3px] flex-wrap ${className}`}>
      {display.map((f, i) => (
        <HeartSprite key={i} frame={f} scale={scale} />
      ))}
    </div>
  );
}

function HeartSprite({ frame, scale }) {
  const w = FRAME_W * scale;
  const h = FRAME_H * scale;
  return (
    <div
      style={{
        width: w,
        height: h,
        display: 'inline-block',
        flexShrink: 0,
        backgroundImage: `url(${heartSrc})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `-${frame * w}px 0`,
        backgroundSize: `${FRAMES * w}px ${h}px`,
        imageRendering: 'pixelated',
      }}
    />
  );
}
