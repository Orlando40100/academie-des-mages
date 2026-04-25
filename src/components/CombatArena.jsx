import { useMemo } from 'react';
import PixelSprite from '../sprites/PixelSprite.jsx';
import { MONDE_TEXTURE, TEXTURES } from './GroundTexture.js';
import {
  tuileArbreSprite,
} from '../sprites/library.js';
import {
  fleurRose, fleurBleue, roseauSprite, cristalSprite,
  cactusSprite, colonneSprite, champignonSprite, sapinSprite,
  stalagmiteSprite, troncMortSprite, duneSprite,
} from '../sprites/decor.js';

// Arène de combat vue top-down : sol plein écran + décor éparpillé tout autour.
// Remplace WorldBackground en mode "vue aérienne" pour que l'ennemi ne flotte pas.

const DECOR_BY_MONDE = {
  1: [tuileArbreSprite, fleurRose, fleurBleue, champignonSprite],
  2: [fleurRose, fleurBleue, tuileArbreSprite],
  3: [roseauSprite, champignonSprite, troncMortSprite, roseauSprite],
  4: [cristalSprite, stalagmiteSprite, cristalSprite],
  5: [colonneSprite, cristalSprite],
  6: [cactusSprite, duneSprite, cactusSprite],
  7: [colonneSprite, fleurRose],
  8: [sapinSprite, sapinSprite],
  9: [],
  10: [sapinSprite],
  11: [cristalSprite],
};

function generateDecor(monde, seed = 7) {
  const sprites = DECOR_BY_MONDE[monde] ?? [];
  if (sprites.length === 0) return [];
  let s = seed + monde * 31;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const decor = [];
  // Zone interdite au milieu (où sont les combattants)
  const isForbidden = (x, y) => {
    // Centre vertical : éviter 35% à 75% en vertical, 30% à 70% en horizontal
    return x > 25 && x < 75 && y > 15 && y < 85;
  };
  for (let i = 0; i < 22; i++) {
    const x = rnd() * 100;
    const y = rnd() * 100;
    if (isForbidden(x, y)) continue;
    const sprite = sprites[Math.floor(rnd() * sprites.length)];
    const scale = rnd() > 0.4 ? 2 : rnd() > 0.3 ? 3 : 1;
    decor.push({ x, y, sprite, scale, seed: rnd() });
  }
  return decor;
}

export default function CombatArena({ monde, children }) {
  const texture = MONDE_TEXTURE[monde] ?? TEXTURES.grass;
  const decor = useMemo(() => generateDecor(monde), [monde]);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundImage: texture,
        backgroundSize: '64px 64px',
        backgroundRepeat: 'repeat',
        imageRendering: 'pixelated',
      }}
    >
      {/* Vignette douce pour délimiter l'arène */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      {/* Décor éparpillé en bordure */}
      {decor.map((d, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            transform: 'translate(-50%, -50%)',
            filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.4))',
            zIndex: 1,
          }}
        >
          <PixelSprite sprite={d.sprite} scale={d.scale} />
        </div>
      ))}

      {/* Ombres dynamiques au sol pour donner profondeur */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)',
        }}
      />

      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
