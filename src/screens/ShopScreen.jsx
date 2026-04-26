import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HUD from '../components/HUD.jsx';
import PixelSprite from '../sprites/PixelSprite.jsx';
import SmartSprite from '../sprites/SmartSprite.jsx';
import { marchandSprite } from '../sprites/library.js';
import { catalogue } from '../shop/catalogue.js';
import { useGame } from '../store/gameStore.jsx';
import { sounds } from '../audio/soundEngine.js';
import { TEXTURES } from '../components/GroundTexture.js';

const TABS = [
  { key: 'potions',    label: '🧪 Potions',    color: '#22c55e' },
  { key: 'sorts',      label: '✨ Sorts',      color: '#8b5cf6' },
  { key: 'equipement', label: '⚔️ Équipement', color: '#ef4444' },
  { key: 'tenues',     label: '👗 Tenues',     color: '#ec4899' },
];

export default function ShopScreen({ navigate, onPause }) {
  const { state, dispatch } = useGame();
  const [tab, setTab] = useState('potions');
  const [notif, setNotif] = useState(null);

  const items = catalogue[tab] || [];

  const acheter = (item) => {
    if (state.player.piecesOr < item.prix) {
      setNotif({ text: 'Pas assez de pièces !', type: 'error' });
      sounds.cancel();
      setTimeout(() => setNotif(null), 1800);
      return;
    }
    const deja = estDejaPossede(state, tab, item.id);
    if (deja) {
      setNotif({ text: 'Déjà possédé !', type: 'error' });
      sounds.cancel();
      setTimeout(() => setNotif(null), 1800);
      return;
    }
    dispatch({ type: 'ADD_PIECES', amount: -item.prix });
    sounds.coin();
    if (tab === 'potions') {
      dispatch({ type: 'ADD_POTION', id: item.id, qty: 1 });
      setNotif({ text: `+1 ${item.nom}`, type: 'success' });
    } else if (tab === 'sorts') {
      dispatch({ type: 'ADD_SORT', id: item.id });
      setNotif({ text: `${item.nom} appris !`, type: 'success' });
    } else if (tab === 'equipement') {
      dispatch({ type: 'ADD_EQUIPEMENT', id: item.id });
      dispatch({ type: 'EQUIP_ITEM', slot: item.slot, id: item.id });
      setNotif({ text: `${item.nom} équipé !`, type: 'success' });
    } else if (tab === 'tenues') {
      if (item.id === 'astra') {
        dispatch({ type: 'UNLOCK_COMPAGNON', id: 'astra' });
        setNotif({ text: '🦄 Astra rejoint l\'équipe !', type: 'success' });
      } else if (item.id === 'stella') {
        dispatch({ type: 'UNLOCK_COMPAGNON', id: 'stella' });
        setNotif({ text: '🌟 Stella rejoint l\'équipe !', type: 'success' });
      } else {
        dispatch({ type: 'ADD_TENUE', id: item.id });
        setNotif({ text: `${item.nom} ajoutée.`, type: 'success' });
      }
    }
    setTimeout(() => setNotif(null), 1800);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Fond : sol boutique (pavés médiéval) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: TEXTURES.city,
          backgroundSize: '64px 64px',
          imageRendering: 'pixelated',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, transparent 30%, rgba(0,0,0,0.5) 90%)' }}
      />

      <HUD onPause={onPause} />

      {/* ════════════════════════════════════════════════════════════════
          ZONE 1 : Bannière marchand — fixée en haut, sous le HUD
          (position absolute, hauteur fixe, pas dans le flux scrollable)
          ════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute left-3 right-3 flex items-center gap-2 p-2 border-4 border-magic-gold"
        style={{
          top: 'calc(56px + 4px)', // sous le HUD (top-14 = 56px)
          background: 'linear-gradient(180deg, #92400e 0%, #78350f 100%)',
          boxShadow: '4px 4px 0 #000',
          zIndex: 5,
        }}
      >
        <div className="relative shrink-0">
          <div className="animate-breathe">
            <SmartSprite assetKey="marchandIdle" fallback={marchandSprite} scale={2} direction="front" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-pixel text-xs text-magic-gold leading-tight">⚜️ L'Échoppe du Mage Marchand ⚜️</div>
          <div className="font-retro text-sm text-magic-cream truncate">« Jette un œil à mes trésors. »</div>
        </div>
        <button className="pixel-btn pixel-btn-ghost shrink-0" onClick={() => navigate('worldmap')}>← Carte</button>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          ZONE 2 : Onglets — fixés sous la bannière
          (4 boutons en flex-1, plus rien coupé)
          ════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute left-3 right-3 flex gap-1 py-1"
        style={{
          top: 'calc(56px + 4px + 64px + 4px)', // HUD + gap + banner ~64px + gap
          background: 'linear-gradient(180deg, rgba(15,4,32,0.98) 0%, rgba(15,4,32,0.85) 100%)',
          borderBottom: '2px solid #fbbf24',
          zIndex: 5,
        }}
      >
        {TABS.map((t) => {
          const nbItems = catalogue[t.key]?.length || 0;
          return (
            <button
              key={t.key}
              onClick={() => { sounds.select(); setTab(t.key); }}
              className={`font-pixel border-b-4 transition-all flex flex-col items-center justify-center ${
                tab === t.key
                  ? 'bg-magic-gold text-magic-bg border-black'
                  : 'bg-magic-bg2 text-magic-cream border-magic-accent'
              }`}
              style={{ flex: '1 1 0', minWidth: 0, padding: '4px 2px', fontSize: 9, lineHeight: 1.1 }}
            >
              <span style={{ fontSize: 14 }}>{t.label.split(' ')[0]}</span>
              <span className="opacity-80">{t.label.split(' ').slice(1).join(' ')} ({nbItems})</span>
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          ZONE 3 : Items — position absolute avec top et bottom explicites
          → hauteur = 100dvh - top - bottom, garantie par le browser layout.
          overflow-y: auto fonctionne TOUJOURS dans ce cas (pas de flex
          ambiguity, pas de min-height auto, pas de framer-motion).
          ════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute left-3 right-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl mx-auto"
        style={{
          top: 'calc(56px + 4px + 64px + 4px + 56px + 8px)', // HUD + banner + tabs + gaps
          bottom: 'env(safe-area-inset-bottom, 0px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          overscrollBehavior: 'contain',
          paddingBottom: 12,
        }}
      >
        {items.map((item) => {
          const deja = estDejaPossede(state, tab, item.id);
          const peutPayer = state.player.piecesOr >= item.prix;
          return (
            <div
              key={item.id}
              className="bg-gradient-to-br from-magic-bg2 to-magic-bg border-4 border-magic-gold p-3 relative"
              style={{ boxShadow: '3px 3px 0 #000' }}
            >
              <div className="flex items-start gap-2">
                <div className="bg-magic-bg border-2 border-magic-accent p-2 shrink-0">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="font-pixel text-xs text-magic-gold">{item.nom}</div>
                  <div className="font-retro text-sm text-magic-cream/80 mt-1">{item.desc}</div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t-2 border-magic-accent/30">
                <span className="font-pixel text-sm text-magic-gold">🪙 {item.prix}</span>
                <button
                  onClick={() => acheter(item)}
                  disabled={deja || !peutPayer}
                  className={`pixel-btn ${deja ? 'pixel-btn-ghost opacity-60' : peutPayer ? 'pixel-btn-gold' : 'pixel-btn-ghost opacity-60'}`}
                >
                  {deja ? '✓ Possédé' : peutPayer ? 'Acheter' : 'Trop cher'}
                </button>
              </div>
            </div>
          );
        })}

        {/* Notification achat */}
        <AnimatePresence>
          {notif && (
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`fixed top-20 left-1/2 -translate-x-1/2 border-4 px-4 py-2 z-40 font-pixel text-sm ${
                notif.type === 'success' ? 'bg-magic-green border-black text-white' : 'bg-magic-red border-black text-white'
              }`}
              style={{ boxShadow: '3px 3px 0 #000' }}
            >
              {notif.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function estDejaPossede(state, tab, id) {
  if (tab === 'sorts') return state.inventaire.sortsAchetes.includes(id);
  if (tab === 'equipement') return state.inventaire.equipementPossede.includes(id);
  if (tab === 'tenues') {
    if (id === 'astra')  return state.compagnons.debloques.includes('astra');
    if (id === 'stella') return state.compagnons.debloques.includes('stella');
    return state.inventaire.tenuesAchetees.includes(id);
  }
  return false;
}
