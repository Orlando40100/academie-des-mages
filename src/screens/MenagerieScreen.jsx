import { motion } from 'framer-motion';
import HUD from '../components/HUD.jsx';
import MobileScrollPane from '../components/MobileScrollPane.jsx';
import PixelSprite from '../sprites/PixelSprite.jsx';
import SmartSprite from '../sprites/SmartSprite.jsx';
import { useGame } from '../store/gameStore.jsx';
import { compagnons } from '../companions/companions.js';
import { miaou, hulotteSprite, braiseSprite, liliSprite, astraSprite, coeurSprite } from '../sprites/library.js';
import { sounds } from '../audio/soundEngine.js';
import { TEXTURES } from '../components/GroundTexture.js';

// Pour les nouveaux compagnons sans sprite codé, on réutilise un sprite existant
// thématiquement proche en attendant des assets dédiés.
const SPRITES = {
  miaou, hulotte: hulotteSprite, braise: braiseSprite, lili: liliSprite, astra: astraSprite,
  croquette: braiseSprite,
  pixel: liliSprite,
  saphir: miaou,
  eclipse: hulotteSprite,
  stella: astraSprite,
  sylphe: liliSprite,      // sprite de la forêt : silhouette féerique
  phoenix: braiseSprite,   // oiseau de feu : silhouette enflammée
};

// Chaque compagnon a son enclos avec son propre décor
const ENCLOS = {
  miaou:    { texture: TEXTURES.grass,    label: 'Jardin aux coussins',  emoji: '🌿' },
  hulotte:  { texture: TEXTURES.grassDark,label: 'Arbre aux sages',      emoji: '🌲' },
  braise:   { texture: TEXTURES.cave,     label: 'Antre volcanique',     emoji: '🔥' },
  lili:     { texture: TEXTURES.marble,   label: 'Clairière enchantée',  emoji: '✨' },
  astra:    { texture: TEXTURES.cosmic,   label: 'Écurie stellaire',     emoji: '⭐' },
  croquette:{ texture: TEXTURES.grass,    label: 'Sous-bois épineux',    emoji: '🌰' },
  pixel:    { texture: TEXTURES.grassDark,label: 'Cercle des fées',      emoji: '🍄' },
  saphir:   { texture: TEXTURES.sand,     label: 'Tanière dorée',        emoji: '🔆' },
  eclipse:  { texture: TEXTURES.stone,    label: 'Caverne d\'obsidienne',emoji: '🌑' },
  stella:   { texture: TEXTURES.cosmic,   label: 'Voie lactée privée',   emoji: '🌌' },
  sylphe:   { texture: TEXTURES.grass,    label: 'Cœur de la forêt',     emoji: '🌿' },
  phoenix:  { texture: TEXTURES.cave,     label: 'Nid de braises',       emoji: '🪶' },
};

export default function MenagerieScreen({ navigate, onPause }) {
  const { state, dispatch } = useGame();

  return (
    <div className="relative w-full h-full overflow-hidden bg-magic-bg2">
      <HUD onPause={onPause} />

      {/* Header fixé sous le HUD */}
      <div
        style={{
          position: 'absolute', top: 60, left: 12, right: 12, zIndex: 5,
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <h2 className="pixel-title text-lg md:text-2xl" style={{ flex: 1 }}>🐾 La Ménagerie</h2>
        <button className="pixel-btn pixel-btn-ghost" onClick={() => navigate('worldmap')}>← Carte</button>
      </div>

      {/* Zone scrollable bulletproof */}
      <MobileScrollPane topOffset={108}>
        <div className="font-retro text-magic-cream/80 mb-3 text-center">
          Rends visite à tes compagnons dans leur enclos
        </div>

        {/* Grille enclos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl mx-auto w-full">
          {compagnons.map((c) => {
            const debloque = state.compagnons.debloques.includes(c.id);
            const actif = state.compagnons.actif === c.id;
            const affinite = state.compagnons.affinites[c.id] ?? 0;
            const sprite = SPRITES[c.id];
            const enclos = ENCLOS[c.id];

            return (
              <motion.div
                key={c.id}
                whileHover={debloque ? { scale: 1.02 } : {}}
                className={`relative overflow-hidden border-4 ${actif ? 'border-magic-gold' : 'border-magic-accent'} ${!debloque ? 'opacity-60 grayscale' : ''}`}
                style={{ boxShadow: actif ? '0 0 20px #fbbf24, 4px 4px 0 #000' : '4px 4px 0 #000' }}
              >
                {/* Sol d'enclos */}
                <div
                  className="relative h-40 overflow-hidden"
                  style={{
                    backgroundImage: debloque ? enclos.texture : TEXTURES.stone,
                    backgroundSize: '48px 48px',
                    imageRendering: 'pixelated',
                  }}
                >
                  {/* Clôture haute (simule barrière) */}
                  <div className="absolute top-0 inset-x-0 h-2 bg-magic-bg/80" />
                  {/* Vignette */}
                  <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
                  }} />

                  {/* Sprite compagnon au centre */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {debloque ? (
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative"
                      >
                        <SmartSprite assetKey={c.id} fallback={sprite} scale={4} direction="front" />
                        <div className="w-10 h-2 bg-black/40 rounded-full blur-[2px] mx-auto mt-[-4px]" />
                      </motion.div>
                    ) : (
                      <div className="text-6xl opacity-40">🔒</div>
                    )}
                  </div>

                  {/* Badge actif */}
                  {actif && (
                    <div className="absolute top-2 right-2 bg-magic-gold text-magic-bg px-2 py-0.5 font-pixel text-xs border-2 border-black">
                      ACTIF
                    </div>
                  )}

                  {/* Emoji thème en haut gauche */}
                  <div className="absolute top-2 left-2 text-2xl drop-shadow-[1px_1px_0_#000]">
                    {debloque ? enclos.emoji : '🔒'}
                  </div>
                </div>

                {/* Infos sous l'enclos */}
                <div className="bg-magic-bg2 p-3">
                  <div className="font-pixel text-sm text-magic-gold mb-1 flex items-center gap-2">
                    {c.emoji} {c.nom}
                  </div>
                  <div className="font-retro text-sm text-magic-cream/80 mb-1">
                    {debloque ? enclos.label : debloqueInfo(c.debloquePar)}
                  </div>

                  {debloque ? (
                    <>
                      <div className="font-retro text-xs text-magic-cream/70">
                        ⚡ {c.passif}
                      </div>
                      <div className="font-retro text-xs text-magic-cream/70">
                        ⭐ {c.actif.nom}
                      </div>
                      {/* Cœurs d'affinité */}
                      <div className="flex items-center gap-[2px] mt-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className={i < affinite ? 'opacity-100' : 'opacity-25 grayscale'}>
                            <PixelSprite sprite={coeurSprite} scale={2} />
                          </div>
                        ))}
                        <span className="font-pixel text-xs text-magic-pink ml-1">{affinite}/10</span>
                      </div>
                      <button
                        disabled={actif}
                        onClick={() => { sounds.confirm(); dispatch({ type: 'SET_COMPAGNON_ACTIF', id: c.id }); }}
                        className={`pixel-btn w-full mt-2 ${actif ? 'pixel-btn-ghost opacity-60' : 'pixel-btn-gold'}`}
                      >
                        {actif ? '✓ Compagnon actif' : 'Équiper'}
                      </button>
                    </>
                  ) : (
                    <div className="font-retro text-xs text-magic-cream/50 mt-1">
                      🔒 Verrouillé
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </MobileScrollPane>
    </div>
  );
}

function debloqueInfo(code) {
  return {
    'debut': 'Ton fidèle ami depuis le début',
    'boss-monde-2': 'Se libère après le boss du Monde 2',
    'boss-monde-3': 'Se libère après le boss du Monde 3',
    'boss-monde-4': 'Se libère après le boss du Monde 4',
    'boss-monde-5': 'Se libère après le boss du Monde 5',
    'boss-monde-6': 'Se libère après le boss du Monde 6',
    'boss-monde-7': 'Se libère après le boss du Monde 7',
    'boss-monde-8': 'Se libère après le boss du Monde 8',
    'boutique-ou-boss-monde-9':  'Achetable à 300 🪙 ou boss M9',
    'boutique-ou-boss-monde-11': 'Achetable à 500 🪙 ou boss M11',
    'boss-monde-12': 'Se libère après le boss du Monde 12 (Forêt Mystique)',
    'boss-monde-13': 'Récompense du Donjon Éternel — épreuve ultime',
  }[code] ?? code;
}
