import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HUD from '../components/HUD.jsx';
import SmartSprite from '../sprites/SmartSprite.jsx';
import { marchandSprite } from '../sprites/library.js';
import { catalogue } from '../shop/catalogue.js';
import { useGame } from '../store/gameStore.jsx';
import { sounds } from '../audio/soundEngine.js';
import { TEXTURES } from '../components/GroundTexture.js';

const TABS = [
  { key: 'potions',    emoji: '🧪', label: 'Potions' },
  { key: 'sorts',      emoji: '✨', label: 'Sorts' },
  { key: 'equipement', emoji: '⚔️', label: 'Équip.' },
  { key: 'tenues',     emoji: '👗', label: 'Tenues' },
];

// Hauteurs fixes en pixels (utilisées pour position absolute → garantit overflow:scroll fiable).
const HUD_HEIGHT       = 56;  // top bar
const BANNER_HEIGHT    = 72;  // bannière marchand
const TABS_HEIGHT      = 48;  // 4 onglets en flex-1
const GAP              = 6;   // espacement entre zones

export default function ShopScreen({ navigate, onPause }) {
  const { state, dispatch } = useGame();
  const [tab, setTab] = useState('potions');
  const [notif, setNotif] = useState(null);
  const scrollRef = useRef(null);

  const items = catalogue[tab] || [];

  // Reset le scroll en haut quand on change d'onglet
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [tab]);

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

  // Boutons fallback pour scroller manuellement si le geste tactile est bloqué
  const scrollBy = (delta) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: delta, behavior: 'smooth' });
    }
  };

  // Position en pixels (hardcoded → bulletproof, pas de calc/env qui peut foirer)
  const itemsTop = HUD_HEIGHT + GAP + BANNER_HEIGHT + GAP + TABS_HEIGHT + GAP;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Fond : sol boutique */}
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

      {/* ─── Bannière marchand ─── */}
      <div
        style={{
          position: 'absolute',
          top: HUD_HEIGHT + GAP,
          left: 12, right: 12,
          height: BANNER_HEIGHT,
          background: 'linear-gradient(180deg, #92400e 0%, #78350f 100%)',
          border: '4px solid #fbbf24',
          boxShadow: '4px 4px 0 #000',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: 8,
          zIndex: 5,
        }}
      >
        <div className="animate-breathe" style={{ flexShrink: 0 }}>
          <SmartSprite assetKey="marchandIdle" fallback={marchandSprite} scale={2} direction="front" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="font-pixel text-xs text-magic-gold" style={{ lineHeight: 1.2 }}>⚜️ L'Échoppe ⚜️</div>
          <div className="font-retro text-sm text-magic-cream" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>« Mes trésors. »</div>
        </div>
        <button className="pixel-btn pixel-btn-ghost" style={{ flexShrink: 0 }} onClick={() => navigate('worldmap')}>← Carte</button>
      </div>

      {/* ─── Onglets : 4 boutons en flex-1 ─── */}
      <div
        style={{
          position: 'absolute',
          top: HUD_HEIGHT + GAP + BANNER_HEIGHT + GAP,
          left: 12, right: 12,
          height: TABS_HEIGHT,
          display: 'flex',
          gap: 4,
          background: 'linear-gradient(180deg, rgba(15,4,32,0.98) 0%, rgba(15,4,32,0.85) 100%)',
          borderBottom: '2px solid #fbbf24',
          zIndex: 5,
        }}
      >
        {TABS.map((t) => {
          const nbItems = catalogue[t.key]?.length || 0;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => { sounds.select(); setTab(t.key); }}
              className="font-pixel"
              style={{
                flex: '1 1 0',
                minWidth: 0,
                padding: '4px 2px',
                fontSize: 9,
                lineHeight: 1.1,
                background: active ? '#fbbf24' : '#2d1b4e',
                color: active ? '#1a0b2e' : '#fef3c7',
                borderBottom: active ? '4px solid #000' : '4px solid #4c2a85',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 16 }}>{t.emoji}</span>
              <span style={{ opacity: 0.85 }}>{t.label} ({nbItems})</span>
            </button>
          );
        })}
      </div>

      {/* ─── ZONE SCROLLABLE — position fixed (échappe à tout positioning context),
              hauteur calculée par top + bottom, overflow-y: auto garanti par le navigateur ─── */}
      <div
        ref={scrollRef}
        style={{
          position: 'fixed',
          top: itemsTop,
          left: 12,
          right: 12,
          bottom: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          overscrollBehavior: 'contain',
          paddingBottom: 60, // espace pour les boutons scroll fallback
          zIndex: 4,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item) => {
            const deja = estDejaPossede(state, tab, item.id);
            const peutPayer = state.player.piecesOr >= item.prix;
            return (
              <div
                key={item.id}
                style={{
                  background: 'linear-gradient(180deg, #2d1b4e 0%, #1a0b2e 100%)',
                  border: '4px solid #fbbf24',
                  boxShadow: '3px 3px 0 #000',
                  padding: 12,
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ background: '#1a0b2e', border: '2px solid #4c2a85', padding: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 30 }}>{item.icon}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="font-pixel text-xs text-magic-gold">{item.nom}</div>
                    <div className="font-retro text-sm" style={{ color: 'rgba(254,243,199,0.8)', marginTop: 4 }}>{item.desc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 8, borderTop: '2px solid rgba(76,42,133,0.4)' }}>
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
        </div>
      </div>

      {/* ─── Boutons scroll fallback — flottent à droite, garantissent l'accès aux items
              même si le geste tactile est bloqué pour une raison X ─── */}
      <div
        style={{
          position: 'fixed',
          right: 8,
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          zIndex: 30,
        }}
      >
        <button
          onClick={() => scrollBy(-300)}
          aria-label="Scroll up"
          style={{
            width: 44, height: 44,
            background: '#fbbf24',
            color: '#1a0b2e',
            border: '3px solid #000',
            boxShadow: '2px 2px 0 #000',
            fontSize: 18,
            fontFamily: "'Press Start 2P', monospace",
          }}
        >▲</button>
        <button
          onClick={() => scrollBy(300)}
          aria-label="Scroll down"
          style={{
            width: 44, height: 44,
            background: '#fbbf24',
            color: '#1a0b2e',
            border: '3px solid #000',
            boxShadow: '2px 2px 0 #000',
            fontSize: 18,
            fontFamily: "'Press Start 2P', monospace",
          }}
        >▼</button>
      </div>

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
