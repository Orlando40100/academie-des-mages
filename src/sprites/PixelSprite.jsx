import { memo, useMemo } from 'react';

// Rendu pixel art pur : un sprite est une matrice 2D d'indices de palette.
// Utilise des divs absolument positionnées pour rester net à n'importe quelle échelle.
// CSS-only : pas de canvas, pas de dépendance externe.

function PixelSpriteImpl({ sprite, frame = 0, scale = 4, className = '', style = {} }) {
  const { frames, palette } = sprite;
  const matrix = frames[frame % frames.length];

  const { rows, cols, flatPixels } = useMemo(() => {
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;
    const flat = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = matrix[y][x];
        if (idx === 0) continue;
        const color = palette[idx];
        if (!color || color === 'transparent') continue;
        flat.push({ x, y, color });
      }
    }
    return { rows, cols, flatPixels: flat };
  }, [matrix, palette]);

  return (
    <div
      className={`pixel-sprite relative inline-block ${className}`}
      style={{
        width: cols * scale,
        height: rows * scale,
        imageRendering: 'pixelated',
        ...style,
      }}
    >
      {flatPixels.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x * scale,
            top: p.y * scale,
            width: scale,
            height: scale,
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

export const PixelSprite = memo(PixelSpriteImpl);
export default PixelSprite;
