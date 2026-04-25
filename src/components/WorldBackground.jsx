import { useMemo } from 'react';
import PixelSprite from '../sprites/PixelSprite.jsx';
import {
  nuagePetit, nuageGrand, sapinSprite, montagneSprite, collineSprite,
  cactusSprite, cristalSprite, colonneSprite, roseauSprite, champignonSprite,
  fleurRose, fleurBleue, tourMageSprite, chateauSprite, portailSprite,
  soleilSprite, luneSprite, stalagmiteSprite, toitSprite, duneSprite, troncMortSprite,
} from '../sprites/decor.js';
import { tuileArbreSprite } from '../sprites/library.js';
import { getAsset } from '../sprites/assetRegistry.js';
import SmartSprite from '../sprites/SmartSprite.jsx';

// Composant background thématique par monde.
// Rend un ciel (gradient CSS) + éléments pixel art positionnés en absolu + sol.

export default function WorldBackground({ monde, children, dim = false }) {
  const scene = SCENES[monde] ?? SCENES[1];
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: scene.sky }}>
      {scene.celestial && (
        <div className="absolute" style={scene.celestialPos}>
          <PixelSprite sprite={scene.celestial} scale={scene.celestialScale ?? 3} />
        </div>
      )}

      {/* Layer 1 : ciel décors (nuages, étoiles) */}
      {scene.sky2?.map((item, i) => (
        <div key={'s' + i} className="absolute pointer-events-none" style={item.style}>
          {item.sprite ? (
            <PixelSprite sprite={item.sprite} scale={item.scale ?? 2} />
          ) : item.css ? (
            <div style={item.css} />
          ) : null}
        </div>
      ))}

      {/* Layer 2 : décor de fond (montagnes, toits, etc.) */}
      {scene.back?.map((item, i) => (
        <div key={'b' + i} className="absolute pointer-events-none" style={item.style}>
          <PixelSprite sprite={item.sprite} scale={item.scale ?? 3} />
        </div>
      ))}

      {/* Sol (horizon) */}
      {scene.floor && (
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{ bottom: 0, height: scene.floorHeight ?? '30%', background: scene.floor }}
        />
      )}

      {/* Layer 3 : premier plan (plantes, cristaux, etc.) */}
      {scene.front?.map((item, i) => (
        <div key={'f' + i} className="absolute pointer-events-none" style={item.style}>
          <PixelSprite sprite={item.sprite} scale={item.scale ?? 3} />
        </div>
      ))}

      {/* Overlay d'ambiance : brouillard / rayons lumineux */}
      {scene.fog && (
        <div
          className="absolute inset-0 pointer-events-none opacity-60 animate-pulse-soft"
          style={{
            backgroundImage: `url(${getAsset('fx.fog')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mixBlendMode: 'screen',
            imageRendering: 'pixelated',
          }}
        />
      )}
      {scene.rays && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `url(${getAsset('fx.raylight')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            mixBlendMode: 'screen',
            imageRendering: 'pixelated',
          }}
        />
      )}

      {/* Voile sombre optionnel pour laisser lisibilité à l'UI */}
      {dim && <div className="absolute inset-0 bg-black/30 pointer-events-none" />}

      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

const sparkleCSS = (x, y, color = '#fef3c7', size = 3, delay = 0) => ({
  position: 'absolute',
  left: `${x}%`,
  top: `${y}%`,
  width: size,
  height: size,
  background: color,
  animation: `sparkle 2s ease-in-out ${delay}s infinite`,
});

const stars = (n = 30, seed = 1) => {
  // Positions pseudo-aléatoires déterministes (seed-based)
  const out = [];
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < n; i++) {
    const x = Math.floor(rnd() * 100);
    const y = Math.floor(rnd() * 70);
    const size = 1 + Math.floor(rnd() * 3);
    const delay = rnd() * 2;
    const color = rnd() > 0.8 ? '#fbbf24' : '#fef3c7';
    out.push({ css: sparkleCSS(x, y, color, size, delay), style: {} });
  }
  return out;
};

const SCENES = {
  // ═══════ MONDE 1 — FORÊT DES DÉBUTANTS ═══════
  1: {
    sky: 'linear-gradient(180deg, #fecaca 0%, #fde68a 40%, #bef264 70%, #166534 100%)',
    floor: 'linear-gradient(180deg, #15803d 0%, #166534 60%, #14532d 100%)',
    floorHeight: '25%',
    rays: true,
    celestial: soleilSprite,
    celestialPos: { right: '8%', top: '8%' },
    celestialScale: 3,
    sky2: [
      { sprite: nuagePetit, scale: 2, style: { left: '15%', top: '15%' } },
      { sprite: nuageGrand, scale: 2, style: { right: '30%', top: '20%' } },
      { sprite: nuagePetit, scale: 2, style: { left: '60%', top: '10%' } },
    ],
    back: [
      { sprite: tuileArbreSprite, scale: 3, style: { left: '2%', bottom: '22%' } },
      { sprite: tuileArbreSprite, scale: 3, style: { left: '15%', bottom: '25%' } },
      { sprite: tuileArbreSprite, scale: 3, style: { left: '60%', bottom: '22%' } },
      { sprite: tuileArbreSprite, scale: 3, style: { right: '2%', bottom: '25%' } },
    ],
    front: [
      { sprite: fleurRose, scale: 2, style: { left: '8%', bottom: '5%' } },
      { sprite: fleurBleue, scale: 2, style: { left: '30%', bottom: '8%' } },
      { sprite: fleurRose, scale: 2, style: { left: '55%', bottom: '3%' } },
      { sprite: champignonSprite, scale: 2, style: { left: '72%', bottom: '6%' } },
      { sprite: fleurBleue, scale: 2, style: { right: '15%', bottom: '7%' } },
    ],
  },

  // ═══════ MONDE 2 — CLAIRIÈRE DES NOMBRES ═══════
  2: {
    sky: 'linear-gradient(180deg, #60a5fa 0%, #bef264 70%, #84cc16 100%)',
    floor: 'linear-gradient(180deg, #84cc16 0%, #65a30d 50%, #4d7c0f 100%)',
    floorHeight: '25%',
    celestial: soleilSprite,
    celestialPos: { right: '10%', top: '5%' },
    celestialScale: 3,
    sky2: [
      { sprite: nuageGrand, scale: 2, style: { left: '5%', top: '10%' } },
      { sprite: nuagePetit, scale: 2, style: { left: '45%', top: '15%' } },
      { sprite: nuageGrand, scale: 2, style: { right: '5%', top: '25%' } },
      { sprite: nuagePetit, scale: 2, style: { left: '70%', top: '8%' } },
    ],
    back: [
      { sprite: collineSprite, scale: 3, style: { left: '-5%', bottom: '20%' } },
      { sprite: collineSprite, scale: 3, style: { right: '-5%', bottom: '22%' } },
    ],
    front: [
      { sprite: fleurRose, scale: 2, style: { left: '10%', bottom: '6%' } },
      { sprite: fleurBleue, scale: 2, style: { left: '25%', bottom: '4%' } },
      { sprite: fleurRose, scale: 2, style: { left: '45%', bottom: '7%' } },
      { sprite: fleurBleue, scale: 2, style: { left: '65%', bottom: '5%' } },
      { sprite: fleurRose, scale: 2, style: { left: '85%', bottom: '8%' } },
    ],
  },

  // ═══════ MONDE 3 — MARAIS DES MOTS ═══════
  3: {
    sky: 'linear-gradient(180deg, #475569 0%, #334155 40%, #166534 100%)',
    floor: 'linear-gradient(180deg, #14532d 0%, #052e16 60%, #064e3b 100%)',
    floorHeight: '30%',
    fog: true,
    sky2: [
      { sprite: nuageGrand, scale: 2, style: { left: '10%', top: '5%', opacity: 0.5 } },
      { sprite: nuagePetit, scale: 2, style: { right: '15%', top: '12%', opacity: 0.5 } },
    ],
    back: [
      { sprite: troncMortSprite, scale: 3, style: { left: '5%', bottom: '18%' } },
      { sprite: troncMortSprite, scale: 3, style: { right: '8%', bottom: '22%' } },
    ],
    front: [
      { sprite: roseauSprite, scale: 2, style: { left: '2%', bottom: '5%' } },
      { sprite: roseauSprite, scale: 2, style: { left: '15%', bottom: '7%' } },
      { sprite: roseauSprite, scale: 2, style: { left: '28%', bottom: '4%' } },
      { sprite: champignonSprite, scale: 2, style: { left: '45%', bottom: '6%' } },
      { sprite: roseauSprite, scale: 2, style: { left: '60%', bottom: '8%' } },
      { sprite: roseauSprite, scale: 2, style: { left: '72%', bottom: '5%' } },
      { sprite: roseauSprite, scale: 2, style: { right: '5%', bottom: '6%' } },
    ],
  },

  // ═══════ MONDE 4 — CAVERNE DES OPÉRATIONS ═══════
  4: {
    sky: 'linear-gradient(180deg, #0d0417 0%, #1a0b2e 40%, #2d1b4e 80%, #1f2937 100%)',
    floor: 'linear-gradient(180deg, #374151 0%, #1f2937 60%, #0d0417 100%)',
    floorHeight: '30%',
    fog: true,
    sky2: [
      ...stars(25, 7),
    ],
    back: [
      { sprite: stalagmiteSprite, scale: 3, style: { left: '5%', top: '0%' } },
      { sprite: stalagmiteSprite, scale: 2, style: { left: '25%', top: '2%' } },
      { sprite: stalagmiteSprite, scale: 3, style: { right: '20%', top: '0%' } },
      { sprite: stalagmiteSprite, scale: 2, style: { right: '5%', top: '4%' } },
    ],
    front: [
      { sprite: cristalSprite, scale: 2, style: { left: '8%', bottom: '5%' } },
      { sprite: cristalSprite, scale: 3, style: { left: '28%', bottom: '8%' } },
      { sprite: cristalSprite, scale: 2, style: { right: '30%', bottom: '6%' } },
      { sprite: cristalSprite, scale: 2, style: { right: '8%', bottom: '9%' } },
    ],
  },

  // ═══════ MONDE 5 — TOUR DE CONJUGAISON ═══════
  5: {
    sky: 'linear-gradient(180deg, #0d0417 0%, #1e1b4b 40%, #3730a3 80%, #4c1d95 100%)',
    floor: 'linear-gradient(180deg, #4c1d95 0%, #2d1b4e 60%, #1a0b2e 100%)',
    floorHeight: '25%',
    celestial: luneSprite,
    celestialPos: { right: '12%', top: '10%' },
    celestialScale: 3,
    sky2: [
      ...stars(40, 13),
    ],
    back: [
      { sprite: tourMageSprite, scale: 3, style: { left: '50%', bottom: '20%', transform: 'translateX(-50%)' } },
    ],
    front: [],
  },

  // ═══════ MONDE 6 — DÉSERT DES FRACTIONS ═══════
  6: {
    sky: 'linear-gradient(180deg, #fde68a 0%, #fbbf24 40%, #f59e0b 80%, #d97706 100%)',
    floor: 'linear-gradient(180deg, #f59e0b 0%, #d97706 60%, #92400e 100%)',
    floorHeight: '30%',
    celestial: soleilSprite,
    celestialPos: { left: '50%', top: '15%', transform: 'translateX(-50%)' },
    celestialScale: 4,
    sky2: [],
    back: [
      { sprite: duneSprite, scale: 4, style: { left: '-10%', bottom: '22%' } },
      { sprite: duneSprite, scale: 3, style: { left: '35%', bottom: '25%' } },
      { sprite: duneSprite, scale: 4, style: { right: '-5%', bottom: '22%' } },
    ],
    front: [
      { sprite: cactusSprite, scale: 3, style: { left: '10%', bottom: '5%' } },
      { sprite: cactusSprite, scale: 2, style: { left: '35%', bottom: '7%' } },
      { sprite: cactusSprite, scale: 3, style: { right: '15%', bottom: '6%' } },
    ],
  },

  // ═══════ MONDE 7 — TEMPLE DE LA GRAMMAIRE ═══════
  7: {
    sky: 'linear-gradient(180deg, #93c5fd 0%, #bfdbfe 40%, #fbcfe8 80%, #f9a8d4 100%)',
    floor: 'linear-gradient(180deg, #fed7aa 0%, #fbbf24 50%, #d97706 100%)',
    floorHeight: '22%',
    rays: true,
    celestial: soleilSprite,
    celestialPos: { right: '15%', top: '8%' },
    celestialScale: 3,
    sky2: [
      { sprite: nuagePetit, scale: 2, style: { left: '10%', top: '20%' } },
      { sprite: nuageGrand, scale: 2, style: { right: '30%', top: '15%' } },
    ],
    back: [
      { sprite: colonneSprite, scale: 2, style: { left: '8%', bottom: '22%' } },
      { sprite: colonneSprite, scale: 3, style: { left: '30%', bottom: '22%' } },
      { sprite: colonneSprite, scale: 3, style: { right: '30%', bottom: '22%' } },
      { sprite: colonneSprite, scale: 2, style: { right: '8%', bottom: '22%' } },
    ],
    front: [],
  },

  // ═══════ MONDE 8 — MONTAGNE DE GÉOMÉTRIE ═══════
  8: {
    sky: 'linear-gradient(180deg, #93c5fd 0%, #bfdbfe 40%, #e5e7eb 100%)',
    floor: 'linear-gradient(180deg, #e5e7eb 0%, #cbd5e1 60%, #94a3b8 100%)',
    floorHeight: '20%',
    sky2: [
      { sprite: nuageGrand, scale: 3, style: { left: '5%', top: '10%' } },
      { sprite: nuagePetit, scale: 2, style: { right: '15%', top: '8%' } },
      { sprite: nuagePetit, scale: 2, style: { left: '55%', top: '18%' } },
    ],
    back: [
      { sprite: montagneSprite, scale: 3, style: { left: '-5%', bottom: '15%' } },
      { sprite: montagneSprite, scale: 4, style: { left: '25%', bottom: '18%' } },
      { sprite: montagneSprite, scale: 3, style: { right: '-5%', bottom: '15%' } },
    ],
    front: [
      { sprite: sapinSprite, scale: 2, style: { left: '8%', bottom: '5%' } },
      { sprite: sapinSprite, scale: 3, style: { left: '22%', bottom: '3%' } },
      { sprite: sapinSprite, scale: 2, style: { right: '25%', bottom: '6%' } },
      { sprite: sapinSprite, scale: 3, style: { right: '5%', bottom: '3%' } },
    ],
  },

  // ═══════ MONDE 9 — CITÉ DE L'ORTHOGRAPHE ═══════
  9: {
    sky: 'linear-gradient(180deg, #fb923c 0%, #f97316 40%, #ea580c 80%, #9a3412 100%)',
    floor: 'linear-gradient(180deg, #78350f 0%, #431407 60%, #1c1917 100%)',
    floorHeight: '20%',
    celestial: soleilSprite,
    celestialPos: { left: '15%', top: '10%' },
    celestialScale: 3,
    sky2: [
      { sprite: nuagePetit, scale: 2, style: { right: '20%', top: '10%', opacity: 0.7 } },
    ],
    back: [
      { sprite: toitSprite, scale: 3, style: { left: '3%', bottom: '18%' } },
      { sprite: toitSprite, scale: 4, style: { left: '25%', bottom: '20%' } },
      { sprite: toitSprite, scale: 3, style: { left: '55%', bottom: '18%' } },
      { sprite: toitSprite, scale: 4, style: { right: '3%', bottom: '20%' } },
    ],
    front: [],
  },

  // ═══════ MONDE 10 — CHÂTEAU FINAL ═══════
  10: {
    sky: 'linear-gradient(180deg, #0d0417 0%, #1f2937 40%, #450a0a 80%, #7f1d1d 100%)',
    floor: 'linear-gradient(180deg, #1c1917 0%, #0d0417 60%, #000000 100%)',
    floorHeight: '22%',
    sky2: [
      { sprite: luneSprite, scale: 2, style: { right: '10%', top: '8%', opacity: 0.6 } },
      ...stars(20, 23),
    ],
    back: [
      { sprite: chateauSprite, scale: 3, style: { left: '50%', bottom: '18%', transform: 'translateX(-50%)' } },
    ],
    front: [
      { sprite: sapinSprite, scale: 2, style: { left: '5%', bottom: '4%' } },
      { sprite: sapinSprite, scale: 2, style: { right: '5%', bottom: '4%' } },
    ],
  },

  // ═══════ MONDE 11 — PORTAIL STELLAIRE ═══════
  11: {
    sky: 'radial-gradient(circle at 50% 40%, #6b21a8 0%, #1e1b4b 40%, #0d0417 80%)',
    floor: 'linear-gradient(180deg, #312e81 0%, #1e1b4b 60%, #0d0417 100%)',
    floorHeight: '20%',
    sky2: [
      ...stars(60, 47),
    ],
    back: [
      { sprite: portailSprite, scale: 4, style: { left: '50%', top: '25%', transform: 'translateX(-50%)' } },
    ],
    front: [
      { sprite: cristalSprite, scale: 2, style: { left: '10%', bottom: '5%' } },
      { sprite: cristalSprite, scale: 2, style: { right: '10%', bottom: '5%' } },
    ],
  },
};
