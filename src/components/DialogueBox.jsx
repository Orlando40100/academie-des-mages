import { motion, AnimatePresence } from 'framer-motion';
import PixelSprite from '../sprites/PixelSprite.jsx';
import SmartSprite from '../sprites/SmartSprite.jsx';
import { getAsset } from '../sprites/assetRegistry.js';

// DialogueBox : affiche une bulle de dialogue stylée pixel avec portrait (Faceset) à gauche.
// Utilise le cadre PNG Ninja Adventure si disponible, fallback pixel-card sinon.
//
// Props :
//   speaker  : string (ex: "Maître Aldric")
//   portrait : {type:'asset', key:'faces.aldric'} OU sprite codé (fallback)
//   lines    : tableau de strings
//   index    : index de la ligne affichée
//   onNext   : callback clic
//   faceAssetKey : alias pour portrait.key

export default function DialogueBox({ speaker, portrait, faceAssetKey, lines, index, onNext }) {
  const line = lines[index];
  const hasPngFace = faceAssetKey && getAsset(faceAssetKey);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        className="w-full max-w-2xl mx-auto cursor-pointer"
        onClick={onNext}
      >
        <div className="flex items-start gap-3">
          {/* Portrait Faceset 32×32 agrandi */}
          <div className="shrink-0 border-4 border-magic-gold bg-magic-bg p-1" style={{ boxShadow: '3px 3px 0 #000' }}>
            {hasPngFace ? (
              <SmartSprite assetKey={faceAssetKey} scale={2} />
            ) : portrait ? (
              <PixelSprite sprite={portrait} scale={3} />
            ) : null}
          </div>

          {/* Bulle de texte */}
          <div className="flex-1 relative bg-magic-bg2/95 border-4 border-magic-gold p-4" style={{ boxShadow: '4px 4px 0 #000' }}>
            <div className="font-pixel text-xs text-magic-gold mb-2">{speaker}</div>
            <div className="font-retro text-xl text-magic-cream leading-snug min-h-[3em]">{line}</div>
            <div className="font-pixel text-xs text-magic-accent mt-3 text-right animate-blink">
              ▼ Ⓐ
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
