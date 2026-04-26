// Tour du Mage — espace personnel à customiser : papier peint + objets décoratifs.

import { useState } from 'react';
import { motion } from 'framer-motion';
import Background from '../components/Background.jsx';
import HUD from '../components/HUD.jsx';
import MobileScrollPane from '../components/MobileScrollPane.jsx';
import { useGame } from '../store/gameStore.jsx';
import { sounds } from '../audio/soundEngine.js';
import { TEXTURES } from '../components/GroundTexture.js';

const PAPIERS = [
  { id: 'base',    nom: 'Mur de pierre',     prix: 0,   texture: TEXTURES.stone },
  { id: 'foret',   nom: 'Mur sylvestre',     prix: 30,  texture: TEXTURES.grassDark },
  { id: 'cosmos',  nom: 'Mur cosmique',      prix: 80,  texture: TEXTURES.cosmic },
  { id: 'lave',    nom: 'Mur de braises',    prix: 100, texture: TEXTURES.cave },
  { id: 'royal',   nom: 'Mur royal',         prix: 200, texture: TEXTURES.castle },
  { id: 'marbre',  nom: 'Mur de marbre',     prix: 150, texture: TEXTURES.marble },
];

const OBJETS_DECO = [
  { id: 'tapis_or',     nom: 'Tapis doré',         prix: 40,  emoji: '🟨' },
  { id: 'globe_magique',nom: 'Globe magique',      prix: 60,  emoji: '🔮' },
  { id: 'bibliotheque', nom: 'Bibliothèque',       prix: 80,  emoji: '📚' },
  { id: 'chaudron',     nom: 'Chaudron',           prix: 50,  emoji: '🪣' },
  { id: 'cristal_fee',  nom: 'Cristal de fée',     prix: 100, emoji: '💎' },
  { id: 'banniere',     nom: 'Bannière mage',      prix: 70,  emoji: '🚩' },
  { id: 'horloge',      nom: 'Horloge ancienne',   prix: 90,  emoji: '🕰️' },
  { id: 'autel',        nom: 'Autel sacré',        prix: 200, emoji: '⛩️' },
];

const SLOT_POSITIONS = [
  { x: 15, y: 70 }, { x: 38, y: 75 }, { x: 60, y: 72 }, { x: 82, y: 68 },
  { x: 24, y: 50 }, { x: 75, y: 52 },
];

export default function TourDeMageScreen({ navigate, onPause }) {
  const { state, dispatch } = useGame();
  const [tab, setTab] = useState('view'); // view | papier | objets
  const papierActif = PAPIERS.find((p) => p.id === state.tourDeMage.papierPeint) || PAPIERS[0];
  const objetsPlaces = state.tourDeMage.objetsPlaces || [];

  // Achat papier (consomme pieces, change papier)
  const achatPapier = (papier) => {
    if (state.player.piecesOr < papier.prix) { sounds.cancel(); return; }
    sounds.coin();
    if (papier.prix > 0) dispatch({ type: 'ADD_PIECES', amount: -papier.prix });
    dispatch({ type: 'SET_TOUR_PAPIER', papier: papier.id });
  };

  // Toggle objet (achat puis place / retire)
  const toggleObjet = (obj) => {
    const dejaPlace = objetsPlaces.includes(obj.id);
    // Si pas placé et pas encore acheté (pas dans tourDeMage), il faut payer
    const dejaAchete = objetsPlaces.includes(obj.id) || (state.tourDeMage.objetsAchetes || []).includes(obj.id);
    if (!dejaAchete && state.player.piecesOr < obj.prix) { sounds.cancel(); return; }
    sounds.select();
    if (!dejaAchete) {
      dispatch({ type: 'ADD_PIECES', amount: -obj.prix });
    }
    dispatch({ type: 'TOGGLE_TOUR_OBJET', id: obj.id });
  };

  return (
    <Background variant="magic">
      <HUD onPause={onPause} />

      {/* Header fixé sous le HUD */}
      <div
        style={{
          position: 'absolute', top: 60, left: 12, right: 12, zIndex: 5,
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <h2 className="pixel-title text-xl" style={{ flex: 1 }}>🏠 Ma Tour</h2>
        <button className="pixel-btn pixel-btn-ghost" onClick={() => navigate('worldmap')}>← Carte</button>
      </div>

      {/* Zone scrollable bulletproof */}
      <MobileScrollPane topOffset={108}>
        <div className="flex flex-col">
        {/* Onglets */}
        <div className="flex gap-1 mb-3 justify-center">
          {[['view','👁️ Vue'],['papier','🖼️ Murs'],['objets','📦 Objets']].map(([k, l]) => (
            <button
              key={k}
              className={`font-pixel text-xs px-3 py-2 border-b-4 transition-all ${tab === k ? 'bg-magic-gold text-magic-bg border-black scale-105' : 'bg-magic-bg2 text-magic-cream border-magic-accent'}`}
              onClick={() => { sounds.select(); setTab(k); }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Vue : aperçu de la tour */}
        {tab === 'view' && (
          <PreviewTour papier={papierActif} objetsPlaces={objetsPlaces} prenom={state.player.prenom} />
        )}

        {/* Onglet papier peint */}
        {tab === 'papier' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto w-full overflow-y-auto">
            {PAPIERS.map((p) => {
              const possede = state.tourDeMage.papierPeint === p.id;
              const peutAcheter = state.player.piecesOr >= p.prix;
              return (
                <div key={p.id} className="pixel-card text-center">
                  <div
                    className="w-full h-20 mb-2 border-2 border-black"
                    style={{ backgroundImage: p.texture, backgroundSize: '32px 32px', imageRendering: 'pixelated' }}
                  />
                  <div className="font-pixel text-xs text-magic-gold mb-1">{p.nom}</div>
                  <div className="font-pixel text-xs text-magic-cream/70 mb-2">
                    {p.prix > 0 ? `🪙 ${p.prix}` : 'Gratuit'}
                  </div>
                  <button
                    className={`pixel-btn w-full ${possede ? 'pixel-btn-ghost opacity-60' : peutAcheter ? 'pixel-btn-gold' : 'pixel-btn-ghost opacity-60'}`}
                    onClick={() => achatPapier(p)}
                    disabled={possede || (!peutAcheter && p.prix > 0)}
                  >
                    {possede ? '✓ Actif' : peutAcheter || p.prix === 0 ? 'Choisir' : 'Trop cher'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Onglet objets */}
        {tab === 'objets' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto w-full overflow-y-auto">
            {OBJETS_DECO.map((o) => {
              const place = objetsPlaces.includes(o.id);
              const peutAcheter = state.player.piecesOr >= o.prix || place;
              const slotPlein = !place && objetsPlaces.length >= SLOT_POSITIONS.length;
              return (
                <div key={o.id} className={`pixel-card text-center ${place ? 'border-magic-gold' : ''}`}>
                  <div className="text-4xl mb-1">{o.emoji}</div>
                  <div className="font-pixel text-[10px] text-magic-gold mb-1 leading-tight">{o.nom}</div>
                  <div className="font-pixel text-[10px] text-magic-cream/70 mb-2">🪙 {o.prix}</div>
                  <button
                    className={`pixel-btn w-full text-xs ${place ? 'pixel-btn-pink' : peutAcheter && !slotPlein ? 'pixel-btn-gold' : 'pixel-btn-ghost opacity-60'}`}
                    onClick={() => toggleObjet(o)}
                    disabled={!peutAcheter || (slotPlein && !place)}
                  >
                    {place ? 'Retirer' : slotPlein ? 'Plein' : peutAcheter ? 'Placer' : 'Trop cher'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        </div>
      </MobileScrollPane>
    </Background>
  );
}

function PreviewTour({ papier, objetsPlaces, prenom }) {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-96 border-4 border-magic-gold overflow-hidden" style={{ boxShadow: '6px 6px 0 #000' }}>
      {/* Mur de fond (papier peint) */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: papier.texture, backgroundSize: '64px 64px', imageRendering: 'pixelated' }}
      />
      {/* Sol */}
      <div
        className="absolute bottom-0 inset-x-0 h-24"
        style={{ background: 'linear-gradient(180deg, #4c2a85 0%, #1a0b2e 100%)', borderTop: '3px solid #fbbf24' }}
      />
      {/* Plaque "Maison de X" */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 ribbon ribbon-gold ribbon-banner" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
        🏠 Tour de {prenom || 'Mage'}
      </div>
      {/* Objets placés */}
      {objetsPlaces.map((id, idx) => {
        const obj = OBJETS_DECO.find((o) => o.id === id);
        const pos = SLOT_POSITIONS[idx % SLOT_POSITIONS.length];
        if (!obj) return null;
        return (
          <motion.div
            key={id}
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            className="absolute text-5xl"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,0.5))',
            }}
            title={obj.nom}
          >
            {obj.emoji}
          </motion.div>
        );
      })}
      {objetsPlaces.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="font-retro text-magic-cream/50 text-center">
            Personnalise ta tour avec des objets !<br />
            <span className="text-sm">→ Onglet « Objets »</span>
          </div>
        </div>
      )}
    </div>
  );
}
