import { motion } from 'framer-motion';
import Background from '../components/Background.jsx';
import PixelSprite from '../sprites/PixelSprite.jsx';
import { mage, miaou } from '../sprites/library.js';
import { useGame } from '../store/gameStore.jsx';

export default function GameOverScreen({ navigate }) {
  const { state } = useGame();
  return (
    <Background variant="dungeon">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        {/* Vignette rouge sombre */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 90%)',
        }} />
        {/* Cercle rune éteinte */}
        <div className="absolute" style={{
          width: 280, height: 280, left: '50%', top: '36%', transform: 'translate(-50%,-50%)',
          border: '2px solid #7f1d1d', borderRadius: '50%',
          boxShadow: 'inset 0 0 20px rgba(127,29,29,0.4)', opacity: 0.5, pointerEvents: 'none',
        }} />

        {/* Bannière défaite */}
        <motion.div
          initial={{ y: -40, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="defeat-banner mb-8 relative z-10"
        >
          💫 ÉVANOUIE...
        </motion.div>

        {/* Mage allongée + Miaou veille */}
        <div className="flex items-end gap-4 mb-8 relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 90 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="origin-bottom"
            style={{ filter: 'drop-shadow(4px 4px 0 #000) grayscale(0.3) brightness(0.85)' }}
          >
            <PixelSprite sprite={mage} scale={3} />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="animate-float"
          >
            <PixelSprite sprite={miaou} scale={3} />
          </motion.div>
        </div>

        {/* Sparks autour de Miaou (signe d'espoir) */}
        <div className="magic-spark" style={{ left: '64%', top: '38%', animationDelay: '0s', background: '#fbbf24' }} />
        <div className="magic-spark" style={{ left: '70%', top: '42%', animationDelay: '0.7s', background: '#fbbf24' }} />

        {/* Carte message */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pixel-card-defeat max-w-md w-full mb-6 relative z-10"
        >
          <div className="font-cinzel text-2xl text-magic-cream leading-tight mb-2">
            Miaou veille sur toi.<br />Tu peux réessayer !
          </div>
          <div style={{ height: 0, borderTop: '3px double #fbbf24', opacity: 0.6, margin: '12px 0' }} />
          <div className="font-retro text-base text-magic-cream/70">
            Tu conserves tes pièces : <span className="text-magic-gold font-bold">🪙 {state.player.piecesOr}</span>
          </div>
        </motion.div>

        {/* Boutons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col gap-2 w-full max-w-md relative z-10"
        >
          <button className="pixel-btn pixel-btn-gold" onClick={() => navigate('study')}>
            🔁 Réessayer
          </button>
          <div className="flex gap-2 flex-wrap justify-center">
            <button className="pixel-btn pixel-btn-ghost flex-1" onClick={() => navigate('worldmap')}>
              🗺️ Carte
            </button>
            <button className="pixel-btn pixel-btn-pink flex-1" onClick={() => navigate('shop')}>
              🏪 Boutique
            </button>
            <button className="pixel-btn pixel-btn-ghost flex-1" onClick={() => navigate('menagerie')}>
              🐾 Compagnon
            </button>
          </div>
        </motion.div>
      </div>
    </Background>
  );
}
