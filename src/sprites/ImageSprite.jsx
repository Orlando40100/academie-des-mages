import { memo, useEffect, useState } from 'react';

// Affiche un PNG en pixel-art avec support de feuilles sprite.
//
// ────── Pourquoi cette structure imbriquée ? ──────
// Avant : on appliquait `transform: translate(...) scale(...)` directement sur l'<img>.
// Sur mobile (Safari iOS / Chrome Android avec DPR=2 ou 3), la combinaison
// translate(...)+scale(...) sur une image avec `overflow:hidden` au parent souffre
// d'arrondis sous-pixel : la frame adjacente "fuit" d'un demi-pixel et s'affiche.
//
// Solution robuste : on dimensionne TOUT en pixels logiques non scalés (16×16 ici),
// on translate l'<img> en coordonnées non scalées (entiers propres), puis on
// applique `scale(N)` au CONTENEUR INTERMÉDIAIRE. Le wrapper externe verrouille
// la taille de layout (frameWidth*scale × frameHeight*scale) et clippe net.
// → Pas d'arrondi sous-pixel possible : tous les offsets sont des entiers en
//   coordonnées non-scalées, le scale est appliqué après le clipping.
//
// Props :
//  - src : chemin vers le PNG
//  - scale : facteur d'agrandissement (défaut 3)
//  - frameWidth / frameHeight : taille d'UNE frame dans la feuille (si omis, image complète)
//  - col / row : position de la frame dans la grille (défaut 0,0)
//  - animate : array de [col, row] à alterner automatiquement
//  - frameRate : ms entre frames d'animation (défaut 300)
//  - flipX : inverser horizontalement
//
// Exemples :
//  <ImageSprite src="/assets/coin.png" scale={3} />
//  <ImageSprite src="/assets/mage.png" scale={3} frameWidth={16} frameHeight={16} col={0} row={0} />
//  <ImageSprite src="/assets/mage-walk.png" frameWidth={16} frameHeight={16} animate={[[0,0],[1,0],[2,0],[3,0]]} />

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

  // ─── Cas 2 : frame extraite d'une feuille sprite ───
  // Triple wrapper :
  //   1. outer : taille de layout finale (scaled), isolation pour stacking context propre
  //   2. middle : taille non scalée, scale(N) + flip appliqués, clipping net
  //   3. img : translate non scalé (entiers parfaits), display:block pour pas de baseline gap
  const sx = flipX ? -scale : scale;
  return (
    <div
      className={`pixel-sprite-wrap inline-block ${className}`}
      style={{
        width: frameWidth * scale,
        height: frameHeight * scale,
        overflow: 'hidden',
        position: 'relative',
        isolation: 'isolate',
        ...style,
      }}
    >
      <div
        style={{
          width: frameWidth,
          height: frameHeight,
          overflow: 'hidden',
          transform: `scale(${sx}, ${scale})`,
          transformOrigin: 'top left',
          // si flipX : on translate après scale négatif pour ramener dans la zone visible
          marginLeft: flipX ? frameWidth * scale : 0,
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            display: 'block',
            imageRendering: 'pixelated',
            transform: `translate(${-curCol * frameWidth}px, ${-curRow * frameHeight}px)`,
            transformOrigin: 'top left',
            // pas de width/height : on garde la taille naturelle de l'img (= sheetCols*frameWidth)
          }}
        />
      </div>
    </div>
  );
}

export const ImageSprite = memo(ImageSpriteImpl);
export default ImageSprite;
