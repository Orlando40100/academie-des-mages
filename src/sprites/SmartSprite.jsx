import ImageSprite from './ImageSprite.jsx';
import PixelSprite from './PixelSprite.jsx';
import { getAsset } from './assetRegistry.js';

// Composant unifié qui choisit entre PNG externe (si présent dans le registre) et sprite codé (fallback).
//
// Props :
//   assetKey : chemin dans ASSETS (ex: "mage", "enemies.1", "bosses.5", "effects.fireball")
//   fallback : objet sprite codé à utiliser si assetKey est absent
//   variant  : "idle" (défaut), "walk", "anim" — choix du type d'animation
//   direction : "front" | "back" | "left" | "right" — pour les persos 4-directions
//   scale, flipX, className, style : passés au composant enfant
//
// Exemples :
//   <SmartSprite assetKey="mage" scale={3} direction="front" fallback={mageCoded} />
//   <SmartSprite assetKey="enemies.1" scale={3} variant="walk" fallback={slimeCoded} />

export default function SmartSprite({
  assetKey,
  fallback,
  variant = 'idle',
  direction = 'front',
  scale = 3,
  flipX = false,
  className = '',
  style = {},
  frameRate = 350,
}) {
  const asset = assetKey ? getAsset(assetKey) : null;

  if (asset && asset.src) {
    // PNG simple sans feuille sprite
    if (!asset.frameWidth) {
      return (
        <ImageSprite
          src={asset.src}
          scale={scale}
          flipX={flipX}
          className={className}
          style={style}
        />
      );
    }

    // Détermine quelles frames afficher
    let animate = null;
    let col = 0;
    let row = 0;

    if (variant === 'walk') {
      // Cherche l'anim marche pour la direction
      const dirKey = direction; // 'front' / 'back' / ...
      if (Array.isArray(asset[dirKey])) {
        animate = asset[dirKey];
      } else if (Array.isArray(asset.walk)) {
        animate = asset.walk;
      } else if (asset[dirKey] && typeof asset[dirKey] === 'object') {
        col = asset[dirKey].col;
        row = asset[dirKey].row;
      }
    } else if (variant === 'anim') {
      if (Array.isArray(asset.anim)) animate = asset.anim;
    } else {
      // idle — si la direction a un tableau de frames, on anime aussi (breathe)
      const d = asset[direction];
      if (Array.isArray(d)) {
        animate = d;
      } else if (d && typeof d === 'object') {
        col = d.col;
        row = d.row;
      } else if (asset.idle && typeof asset.idle === 'object') {
        col = asset.idle.col ?? 0;
        row = asset.idle.row ?? 0;
      } else {
        col = 0;
        row = 0;
      }
    }

    return (
      <ImageSprite
        src={asset.src}
        scale={scale}
        frameWidth={asset.frameWidth}
        frameHeight={asset.frameHeight}
        col={col}
        row={row}
        animate={animate}
        frameRate={frameRate}
        flipX={flipX}
        className={className}
        style={style}
      />
    );
  }

  // Fallback : sprite codé
  if (fallback) {
    return (
      <PixelSprite
        sprite={fallback}
        scale={scale}
        className={className}
        style={flipX ? { ...style, transform: 'scaleX(-1)' } : style}
      />
    );
  }

  return null;
}
