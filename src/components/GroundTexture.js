// Génère des textures tileables par biome via SVG inline encodé en data URL.
// Chaque texture fait 32×32 et se répète sans couture.

function svgToDataUrl(svg) {
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

const rect = (x, y, w, h, color) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`;
const px = (x, y, color) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`;

// Helper : génère une texture avec couleur de base + mouchetures pseudo-aléatoires
function genTexture({ base, specks = [], tileSize = 32, decor = '' }) {
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileSize}" height="${tileSize}" shape-rendering="crispEdges">`;
  s += rect(0, 0, tileSize, tileSize, base);
  for (const speck of specks) {
    for (const [x, y] of speck.positions) s += px(x, y, speck.color);
  }
  s += decor;
  s += '</svg>';
  return svgToDataUrl(s);
}

// Positions pseudo-aléatoires mais déterministes
function seedPositions(count, seed, size = 32) {
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push([Math.floor(rnd() * size), Math.floor(rnd() * size)]);
  }
  return positions;
}

// ═══════════════════════════════════════════════════════════════
// Textures par biome
// ═══════════════════════════════════════════════════════════════

export const TEXTURES = {
  // Herbe verte (forêt, clairière)
  grass: genTexture({
    base: '#4ade80',
    specks: [
      { color: '#22c55e', positions: seedPositions(25, 11) },
      { color: '#166534', positions: seedPositions(15, 23) },
      { color: '#86efac', positions: seedPositions(20, 37) },
    ],
  }),
  grassDark: genTexture({
    base: '#166534',
    specks: [
      { color: '#14532d', positions: seedPositions(30, 17) },
      { color: '#22c55e', positions: seedPositions(15, 29) },
      { color: '#052e16', positions: seedPositions(20, 41) },
    ],
  }),

  // Boue / marais
  swamp: genTexture({
    base: '#3f4823',
    specks: [
      { color: '#2a3017', positions: seedPositions(35, 53) },
      { color: '#556b2f', positions: seedPositions(20, 59) },
      { color: '#1a1f0a', positions: seedPositions(15, 71) },
    ],
  }),

  // Roche caverne
  cave: genTexture({
    base: '#44403c',
    specks: [
      { color: '#292524', positions: seedPositions(40, 67) },
      { color: '#57534e', positions: seedPositions(25, 79) },
      { color: '#1c1917', positions: seedPositions(15, 83) },
    ],
  }),

  // Dalles mystiques (tour)
  tower: genTexture({
    base: '#3d2466',
    specks: [
      { color: '#5b21b6', positions: seedPositions(25, 89) },
      { color: '#2d1b4e', positions: seedPositions(30, 97) },
      { color: '#8b5cf6', positions: seedPositions(10, 101) },
    ],
    decor: `<rect x="0" y="0" width="32" height="1" fill="#8b5cf6" opacity="0.4"/>
            <rect x="0" y="0" width="1" height="32" fill="#8b5cf6" opacity="0.4"/>`,
  }),

  // Sable désert
  sand: genTexture({
    base: '#fbbf24',
    specks: [
      { color: '#f59e0b', positions: seedPositions(30, 103) },
      { color: '#fde68a', positions: seedPositions(20, 109) },
      { color: '#d97706', positions: seedPositions(15, 113) },
    ],
  }),

  // Marbre temple
  marble: genTexture({
    base: '#fef3c7',
    specks: [
      { color: '#fde68a', positions: seedPositions(20, 127) },
      { color: '#fbbf24', positions: seedPositions(15, 131) },
      { color: '#e5e7eb', positions: seedPositions(10, 137) },
    ],
    decor: `<rect x="0" y="15" width="32" height="1" fill="#d4a574" opacity="0.3"/>
            <rect x="15" y="0" width="1" height="32" fill="#d4a574" opacity="0.3"/>`,
  }),

  // Pierre montagne
  stone: genTexture({
    base: '#94a3b8',
    specks: [
      { color: '#64748b', positions: seedPositions(35, 139) },
      { color: '#cbd5e1', positions: seedPositions(20, 149) },
      { color: '#475569', positions: seedPositions(15, 151) },
    ],
  }),

  // Pavés cité
  city: genTexture({
    base: '#9a3412',
    specks: [
      { color: '#78350f', positions: seedPositions(25, 157) },
      { color: '#c2410c', positions: seedPositions(25, 163) },
      { color: '#431407', positions: seedPositions(15, 167) },
    ],
    decor: `<rect x="0" y="0" width="16" height="16" fill="none" stroke="#431407" stroke-width="0.5" opacity="0.5"/>
            <rect x="16" y="16" width="16" height="16" fill="none" stroke="#431407" stroke-width="0.5" opacity="0.5"/>`,
  }),

  // Dalles château
  castle: genTexture({
    base: '#1f2937',
    specks: [
      { color: '#0d0417', positions: seedPositions(35, 173) },
      { color: '#374151', positions: seedPositions(20, 179) },
      { color: '#7f1d1d', positions: seedPositions(8, 181) },
    ],
    decor: `<rect x="0" y="0" width="16" height="16" fill="none" stroke="#0d0417" stroke-width="0.5"/>
            <rect x="16" y="16" width="16" height="16" fill="none" stroke="#0d0417" stroke-width="0.5"/>`,
  }),

  // Espace stellaire
  cosmic: genTexture({
    base: '#1e1b4b',
    specks: [
      { color: '#312e81', positions: seedPositions(20, 191) },
      { color: '#818cf8', positions: seedPositions(8, 193) },
      { color: '#fef3c7', positions: seedPositions(4, 197) },
    ],
  }),

  // Eau (pour rivières)
  water: genTexture({
    base: '#2563eb',
    specks: [
      { color: '#1e40af', positions: seedPositions(25, 199) },
      { color: '#60a5fa', positions: seedPositions(20, 211) },
      { color: '#93c5fd', positions: seedPositions(10, 223) },
    ],
  }),

  // Terre / chemin
  dirt: genTexture({
    base: '#92400e',
    specks: [
      { color: '#78350f', positions: seedPositions(30, 227) },
      { color: '#b45309', positions: seedPositions(20, 229) },
      { color: '#451a03', positions: seedPositions(15, 233) },
    ],
  }),
};

// Associe un monde à une texture de sol
export const MONDE_TEXTURE = {
  1: TEXTURES.grass,
  2: TEXTURES.grass,
  3: TEXTURES.swamp,
  4: TEXTURES.cave,
  5: TEXTURES.tower,
  6: TEXTURES.sand,
  7: TEXTURES.marble,
  8: TEXTURES.stone,
  9: TEXTURES.city,
  10: TEXTURES.castle,
  11: TEXTURES.cosmic,
};
