// Boutique modale — accessible pendant un combat, ne perd pas l'état du combat.
// Affiche uniquement les potions (les sorts/équipement ont moins de sens en pleine action).

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../store/gameStore.jsx';
import { catalogue } from '../shop/catalogue.js';
import { sounds } from '../audio/soundEngine.js';

export default function BoutiqueModal({ onClose }) {
  const { state, dispatch } = useGame();
  const [notif, setNotif] = useState(null);
  const [tab, setTab] = useState('potions');

  const items = catalogue[tab] || [];

  const acheter = (item) => {
    if (state.player.piecesOr < item.prix) {
      sounds.cancel();
      setNotif({ text: 'Pas assez de pièces !', type: 'error' });
      setTimeout(() => setNotif(null), 1500);
      return;
    }
    const deja = estDejaPossede(state, tab, item.id);
    if (deja) {
      sounds.cancel();
      setNotif({ text: 'Déjà possédé !', type: 'error' });
      setTimeout(() => setNotif(null), 1500);
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
    }
    setTimeout(() => setNotif(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="pixel-card-victory w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <div className="font-cinzel text-xl text-magic-gold flex-1" style={{ fontWeight: 900 }}>
            🏪 Boutique express
          </div>
          <div className="font-pixel text-sm text-magic-gold">🪙 {state.player.piecesOr}</div>
          <button className="pixel-btn pixel-btn-ghost" onClick={onClose}>✕ Fermer</button>
        </div>

        {/* Onglets simplifiés */}
        <div className="flex gap-1 mb-2 shrink-0">
          {[['potions', '🧪 Potions'], ['sorts', '✨ Sorts'], ['equipement', '⚔️ Équip.']].map(([k, l]) => (
            <button
              key={k}
              onClick={() => { sounds.select(); setTab(k); }}
              className={`font-pixel text-xs px-2 py-1.5 border-b-4 transition-all whitespace-nowrap ${
                tab === k
                  ? 'bg-magic-gold text-magic-bg border-black'
                  : 'bg-magic-bg2 text-magic-cream border-magic-accent'
              }`}
            >
              {l} ({catalogue[k]?.length || 0})
            </button>
          ))}
        </div>

        <div className="font-retro text-sm text-magic-cream/70 mb-2 shrink-0">
          💡 Le combat reprend à l'identique quand tu fermes la boutique.
        </div>

        {/* Liste articles scrollable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto flex-1 pr-1">
          {items.map((item) => {
            const deja = estDejaPossede(state, tab, item.id);
            const peutPayer = state.player.piecesOr >= item.prix;
            return (
              <div
                key={item.id}
                className="bg-gradient-to-br from-magic-bg2 to-magic-bg border-2 border-magic-gold p-2 relative"
                style={{ boxShadow: '2px 2px 0 #000' }}
              >
                <div className="flex items-start gap-2">
                  <div className="bg-magic-bg border-2 border-magic-accent p-1 shrink-0">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-pixel text-[10px] text-magic-gold leading-tight">{item.nom}</div>
                    <div className="font-retro text-xs text-magic-cream/80 mt-1 leading-tight">{item.desc}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 pt-1 border-t border-magic-accent/30">
                  <span className="font-pixel text-xs text-magic-gold">🪙 {item.prix}</span>
                  <button
                    onClick={() => acheter(item)}
                    disabled={deja || !peutPayer}
                    className={`pixel-btn text-[10px] px-2 py-1 ${deja ? 'pixel-btn-ghost opacity-60' : peutPayer ? 'pixel-btn-gold' : 'pixel-btn-ghost opacity-60'}`}
                  >
                    {deja ? '✓ Possédé' : peutPayer ? 'Acheter' : 'Trop cher'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notif achat */}
        <AnimatePresence>
          {notif && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed top-20 left-1/2 -translate-x-1/2 border-4 px-4 py-2 z-50 font-pixel text-sm ${
                notif.type === 'success' ? 'bg-magic-green border-black text-white' : 'bg-magic-red border-black text-white'
              }`}
              style={{ boxShadow: '3px 3px 0 #000' }}
            >
              {notif.text}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function estDejaPossede(state, tab, id) {
  if (tab === 'sorts') return state.inventaire.sortsAchetes.includes(id);
  if (tab === 'equipement') return state.inventaire.equipementPossede.includes(id);
  return false;
}
