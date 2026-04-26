import { memo, useEffect, useState } from 'react';

// Affiche un PNG en pixel-art avec support de feuilles sprite.
//
// ────── Approche background-image (la plus fiable cross-browser) ──────
//
// Pourquoi pas <img> + transform ? Sur mobile (Safari iOS / Chrome Android),
// la combinaison `transform: translate(...) scale(...)` sur une <img> à
// l'intérieur d'un parent en `overflow: hidden` souffre d'arrondis sous-pixel
// quand le DPR est fractionnaire (2, 2.625, 3) — les frames adjacentes du
// spritesheet "fuient" à travers le clipping et apparaissent collées.
//
// Solution : on n'utilise pas <img> du tout. On affiche le spritesheet via
// `background-image` sur un div, et on choisit la frame avec `background-position`
// en coordonnées non scalées (entiers parfaits). Le clipping se fait via
// `overflow: hidden` SANS transform sur l'élément clippé. La mise à l'échelle
// est faite par un transform scale() sur le DIV CLIPPÉ (pas son contenu) —
// l'overflow hidden s'applique avant le scale, donc le clipping est exact.
//
// Structure :
//   outer (frameWidth*scale × frameHeight*scale, overflow:hidden, layout)
//     inner (frameWidth × frameHeight, overflow:hidden, scale(N) au transform,
//            background-image avec background-position propre)
//
// Props :
//  - src : chemin vers le PNG
//  - scale : facteur d'agrandissement (défaut 3)
//  - frameWidth / frameHeight : taille d'UNE frame dans la feuille (si omis, image complète)
//  - col / row : position de la frame dans la grille (défaut 0,0)
//  - animate : array de [col, row] à alterner automatiquement
//  - frameRate : ms entre frames d'animation (défaut 300)
//  - flipX : inverser horizontalement

function ImageSpriteImpl({
  src,
  scale = 3,
  frameWidth,
  frameHeight,
  col = 0,
  row = 0,
  animate = null,
  frameRate = 300,
  flipX = false,
  className = '',
  style = {},
  alt = '',
}) {
  const [animIdx, setAnimIdx] = useState(0);

  useEffect(() => {
    if (!animate || animate.length <= 1) return;
    const id = setInterval(() => setAnimIdx((i) => (i + 1) % animate.length), frameRate);
    return () => clearInterval(id);
  }, [animate, frameRate]);

  const [curCol, curRow] = animate ? animate[animIdx] : [col, row];

  // ─── Cas 1 : image complète (pas de spritesheet) ───
  if (!frameWidth || !frameHeight) {
    return (
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`pixel-img inline-block align-bottom ${className}`}
        style={{
          imageRendering: 'pixelated',
          transform: `scale(${scale})${flipX ? ' scaleX(-1)' : ''}`,
          transformOrigin: 'top left',
          ...style,
        }}
      />
    );
  }

  // ─── Cas 2 : frame extraite d'une feuille sprite (background-image) ───
  return (
    <div
      className={`pixel-sprite-wrap inline-block ${className}`}
      style={{
        width: frameWidth * scale,
        height: frameHeight * scale,
        overflow: 'hidden',
        position: 'relative',
        // flip appliqué au wrapper externe (clippage déjà fait par les enfants)
        transform: flipX ? 'scaleX(-1)' : undefined,
        ...style,
      }}
    >
      <div
        style={{
          width: frameWidth,
          height: frameHeight,
          overflow: 'hidden',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          backgroundImage: `url(${src})`,
          // Offsets en pixels CSS NON scalés → entiers parfaits, pas d'arrondi
          backgroundPosition: `${-curCol * frameWidth}px ${-curRow * frameHeight}px`,
          backgroundSize: 'auto auto', // taille naturelle du PNG (ex. 64×16 ou 64×64)
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}

export const ImageSprite = memo(ImageSpriteImpl);
export default ImageSprite;
