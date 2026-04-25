import { memo, useEffect, useState } from 'react';

// Affiche un PNG en pixel-art avec support de feuilles sprite.
// Utilise un container `overflow: hidden` + img translaté+scalé.
// Aucune nécessité de connaître la taille native de la feuille.
//
// Props :
//  - src : chemin vers le PNG
//  - scale : facteur d'agrandissement (défaut 3)
//  - frameWidth / frameHeight : taille d'UNE frame dans la feuille (si omis, affiche l'image complète)
//  - col / row : position de la frame dans la grille (défaut 0,0)
//  - animate : array de [col, row] à alterner automatiquement
//  - frameRate : ms entre frames d'animation (défaut 300)
//  - flipX : inverser horizontalement
//
// Exemples :
//  <ImageSprite src="/assets/coin.png" scale={3} />                         // image complète
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

  if (!frameWidth || !frameHeight) {
    // Image complète, simplement agrandie
    return (
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`inline-block align-bottom ${className}`}
        style={{
          imageRendering: 'pixelated',
          transform: `scale(${scale})${flipX ? ' scaleX(-1)' : ''}`,
          transformOrigin: 'top left',
          ...style,
        }}
      />
    );
  }

  // Frame extraite d'une feuille sprite
  return (
    <div
      className={`inline-block ${className}`}
      style={{
        width: frameWidth * scale,
        height: frameHeight * scale,
        overflow: 'hidden',
        transform: flipX ? 'scaleX(-1)' : undefined,
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          imageRendering: 'pixelated',
          transform: `translate(${-curCol * frameWidth * scale}px, ${-curRow * frameHeight * scale}px) scale(${scale})`,
          transformOrigin: 'top left',
        }}
      />
    </div>
  );
}

export const ImageSprite = memo(ImageSpriteImpl);
export default ImageSprite;
