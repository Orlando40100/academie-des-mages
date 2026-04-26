import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import HUD from '../components/HUD.jsx';
import PixelSprite from '../sprites/PixelSprite.jsx';
import SmartSprite from '../sprites/SmartSprite.jsx';
import { useGame } from '../store/gameStore.jsx';
import { mondes } from '../data/mondes.js';
import { sounds } from '../audio/soundEngine.js';
import { mage, tuileArbreSprite } from '../sprites/library.js';
import {
  fleurRose, roseauSprite, cristalSprite, tourMageSprite,
  cactusSprite, colonneSprite, montagneSprite, toitSprite, chateauSprite, portailSprite,
} from '../sprites/decor.js';

// ═══════════════════════════════════════════════════════════════
// CARTE DU ROYAUME — Direction A : fond sombre + chemin doré + POI
// (les biomes/rivière/décor/particules ont été supprimés pour matcher
//  le design épuré du grimoire enchanté)
// ═══════════════════════════════════════════════════════════════

// 13 POI en serpent + 2 mondes bonus
const POI = [
  { id: 1,  x: 12, y: 86, icon: tuileArbreSprite, iconScale: 3, nom: 'Forêt' },
  { id: 2,  x: 28, y: 84, icon: fleurRose,        iconScale: 3, nom: 'Clairière' },
  { id: 3,  x: 44, y: 86, icon: roseauSprite,     iconScale: 2, nom: 'Marais' },
  { id: 4,  x: 62, y: 82, icon: cristalSprite,    iconScale: 2, nom: 'Caverne' },
  { id: 5,  x: 78, y: 78, icon: tourMageSprite,   iconScale: 1, nom: 'Tour' },
  { id: 6,  x: 86, y: 60, icon: cactusSprite,     iconScale: 3, nom: 'Désert' },
  { id: 7,  x: 70, y: 50, icon: colonneSprite,    iconScale: 1, nom: 'Temple' },
  { id: 8,  x: 52, y: 48, icon: montagneSprite,   iconScale: 1, nom: 'Montagne' },
  { id: 9,  x: 32, y: 44, icon: toitSprite,       iconScale: 3, nom: 'Cité' },
  { id: 10, x: 16, y: 38, icon: chateauSprite,    iconScale: 1, nom: 'Château' },
  { id: 11, x: 28, y: 22, icon: portailSprite,    iconScale: 1, nom: 'Portail' },
  { id: 12, x: 50, y: 20, icon: tuileArbreSprite, iconScale: 3, nom: 'Forêt Myst.' },
  { id: 13, x: 76, y: 18, icon: chateauSprite,    iconScale: 1, nom: 'Donjon' },
];

export default function WorldMapScreen({ navigate, onPause }) {
  const { state, dispatch } = useGame();
  const deverr = state.progression.mondesDeverrouilles;
  const mondeCourant = state.progression.mondeCourant;
  const [magePos, setMagePos] = useState(() => POI.find((p) => p.id === mondeCourant) ?? POI[0]);
  const [selected, setSelected] = useState(null);
  const [walking, setWalking] = useState(false);
  const [walkDir, setWalkDir] = useState('front');

  useEffect(() => {
    const p = POI.find((p) => p.id === mondeCourant);
    if (p) setMagePos(p);
  }, [mondeCourant]);

  const onSelectMonde = (poi) => {
    if (!deverr.includes(poi.id)) { sounds.cancel(); return; }
    sounds.select();
    setSelected(poi);
  };

  const launchMonde = () => {
    if (!selected) return;
    sounds.confirm();
    const dx = selected.x - magePos.x;
    const dy = selected.y - magePos.y;
    const dir = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? 'right' : 'left')
      : (dy > 0 ? 'front' : 'back');
    setWalkDir(dir);
    setWalking(true);
    setMagePos(selected);
    setTimeout(() => {
      // Si on relance le monde courant, on conserve la progression (niveauCourant).
      // Sinon, on commence (ou recommence) un autre monde au niveau 1.
      const mondeData = mondes.find((m) => m.id === selected.id);
      const totalNiveaux = mondeData?.niveaux ?? 3;
      let niveauCible = 1;
      if (selected.id === mondeCourant) {
        // Reprendre la progression en cours, en clampant au max
        niveauCible = Math.min(state.progression.niveauCourant || 1, totalNiveaux);
      }
      dispatch({ type: 'SET_NIVEAU_COURANT', monde: selected.id, niveau: niveauCible });
      navigate('study');
    }, 1200);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.18) 0%, transparent 70%),' +
          'linear-gradient(180deg, #1a0b2e 0%, #0f0420 100%)',
      }}
    >
      <HUD onPause={onPause} />
      <MapCanvas
        magePos={magePos}
        selected={selected}
        walking={walking}
        walkDir={walkDir}
        deverr={deverr}
        mondeCourant={mondeCourant}
        niveauCourant={state.progression.niveauCourant}
        etoiles={state.progression.etoilesParNiveau}
        onSelect={onSelectMonde}
      />

      {selected && !walking && (() => {
        const m = mondes.find((mm) => mm.id === selected.id);
        const tot = m?.niveaux ?? 3;
        const isCurrent = selected.id === mondeCourant;
        const niveauReprise = Math.min(state.progression.niveauCourant || 1, tot);
        const labelBtn = isCurrent
          ? `▶ Reprendre ${niveauReprise}/${tot}`
          : '▶ Y aller';
        return (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 w-[min(92%,30rem)]"
        >
          <div className="pixel-card-victory">
            <div className="flex items-center gap-4">
              {/* Icône monde dans cadre doré */}
              <div
                className="shrink-0 flex items-center justify-center"
                style={{
                  width: 72, height: 72, borderRadius: 12,
                  border: '3px solid #fbbf24',
                  background: 'linear-gradient(180deg, #4c2a85, #1a0b2e)',
                  boxShadow: 'inset 0 0 0 1px #000, 0 0 16px rgba(251,191,36,0.45)',
                }}
              >
                <PixelSprite sprite={selected.icon} scale={selected.iconScale ?? 2} />
              </div>
              {/* Texte monde */}
              <div className="flex-1">
                <div className="font-pixel text-[10px] text-magic-gold tracking-wider mb-1">
                  MONDE {selected.id}
                </div>
                <div
                  className="font-cinzel text-xl text-magic-cream uppercase leading-none"
                  style={{ fontWeight: 900, letterSpacing: '0.04em' }}
                >
                  {m?.nom}
                </div>
                <div className="font-retro text-sm text-magic-cream/70 mt-1">
                  {m?.theme}
                </div>
                {isCurrent && (
                  <div className="font-pixel text-[10px] text-magic-green mt-2">
                    💾 Niveau {niveauReprise}/{tot} en cours
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="pixel-btn pixel-btn-ghost flex-1" onClick={() => setSelected(null)}>
                Annuler
              </button>
              <button className="pixel-btn pixel-btn-gold flex-[2]" onClick={launchMonde}>
                {labelBtn}
              </button>
            </div>
          </div>
        </motion.div>
        );
      })()}

      {!selected && (
        <div
          className="absolute bottom-0 inset-x-0 safe-bottom z-30 px-2 py-1.5"
          style={{
            background: 'linear-gradient(0deg, rgba(15,4,32,0.98), rgba(26,11,46,0.92))',
            borderTop: '3px double #fbbf24',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.5)',
          }}
        >
          {/* 7 boutons en flex-1 : se répartissent toute la largeur dispo, jamais de débordement */}
          <div className="flex gap-1 w-full">
            <NavBtn color="gold"  emoji="🏪" label="Shop"      onClick={() => { sounds.select(); navigate('shop'); }} />
            <NavBtn color="pink"  emoji="🐾" label="Pets"      onClick={() => { sounds.select(); navigate('menagerie'); }} />
            <NavBtn color="ghost" emoji="📖" label="Livre"     onClick={() => { sounds.select(); navigate('grimoire'); }} />
            <NavBtn color="blue"  emoji="📅" label="Défi"      onClick={() => { sounds.select(); navigate('defi'); }} />
            <NavBtn color="blue"  emoji="🎮" label="Jeux"      onClick={() => { sounds.select(); navigate('minijeux'); }} />
            <NavBtn color="ghost" emoji="🏛️" label="Arène"    onClick={() => { sounds.select(); navigate('arene'); }} />
            <NavBtn color="ghost" emoji="🏠" label="Tour"      onClick={() => { sounds.select(); navigate('tour'); }} />
          </div>
        </div>
      )}
    </div>
  );
}

function MapCanvas({ magePos, selected, walking, walkDir, deverr, mondeCourant, niveauCourant, etoiles, onSelect }) {
  // Chemin entre POI consécutifs via courbes SVG (pour effet sinueux)
  const pathStr = useMemo(() => {
    let d = '';
    for (let i = 0; i < POI.length - 1; i++) {
      const a = POI[i];
      const b = POI[i + 1];
      if (i === 0) d += `M ${a.x} ${a.y} `;
      const midX = (a.x + b.x) / 2 + (i % 2 === 0 ? 5 : -5);
      const midY = (a.y + b.y) / 2 + (i % 2 === 0 ? -3 : 3);
      d += `Q ${midX} ${midY} ${b.x} ${b.y} `;
    }
    return d;
  }, []);

  return (
    <div className="absolute inset-0 pt-14 pb-20">
      {/* ═══════════ Chemin doré pointillé entre POI (Direction A) ═══════════ */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ zIndex: 8 }}
      >
        {/* Trace ombrée */}
        <path d={pathStr} fill="none" stroke="#000" strokeWidth="1.1" strokeLinecap="round" opacity="0.35" />
        {/* Trace dorée pointillée animée (.map-path) */}
        <path
          d={pathStr}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="0.8"
          strokeLinecap="round"
          className="map-path"
          style={{ filter: 'drop-shadow(0 0 1.5px rgba(251,191,36,0.7))' }}
        />
      </svg>

      {/* ═══════════ POI (mondes) — disque doré Direction A ═══════════
           La plaque-nom alterne entre dessous (POI impairs) et dessus (POI pairs)
           pour éviter les superpositions entre POI voisins sur la worldmap. */}
      {POI.map((poi) => {
        const unlocked = deverr.includes(poi.id);
        const stars = Object.keys(etoiles)
          .filter((k) => k.startsWith(`${poi.id}-`))
          .reduce((s, k) => s + etoiles[k], 0);
        const maxStars = (mondes.find((m) => m.id === poi.id)?.niveaux ?? 3) * 3;
        const current = poi.id === mondeCourant;
        const isSelected = selected?.id === poi.id;
        const m = mondes.find((mm) => mm.id === poi.id);
        const tot = m?.niveaux ?? 3;
        const done = Object.keys(etoiles).filter((k) => k.startsWith(`${poi.id}-`)).length;
        const subLabel = current
          ? `⚔️ ${niveauCourant}/${tot}`
          : (done >= tot ? '✓ Terminé' : (unlocked ? `${done}/${tot}` : '🔒'));
        // Position du nom : alterne au-dessus / au-dessous selon la parité du POI
        const labelAbove = poi.id % 2 === 0;
        const labelBlock = (
          <>
            <div className={`map-poi-label ${!unlocked ? 'locked' : ''} text-center`}>
              <div>{poi.id}. {poi.nom}</div>
              <div className="mt-0.5" style={{ fontSize: 6 }}>{subLabel}</div>
            </div>
            {unlocked && stars > 0 && (
              <div className="font-pixel text-[10px] text-magic-gold mt-1 drop-shadow-[1px_1px_0_#000]">
                {'⭐'.repeat(Math.min(3, Math.ceil((stars / maxStars) * 3)))}
              </div>
            )}
          </>
        );
        return (
          <button
            key={poi.id}
            onClick={() => onSelect(poi)}
            disabled={!unlocked || walking}
            className={`absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none ${!unlocked ? 'cursor-not-allowed' : 'cursor-pointer hover:z-30'}`}
            style={{ left: `${poi.x}%`, top: `${poi.y}%`, touchAction: 'manipulation', zIndex: 20 }}
          >
            <div className={`flex flex-col items-center gap-1.5 ${isSelected ? 'scale-125' : ''} transition-transform`}>
              {/* Si label au-dessus : on l'affiche AVANT le disque */}
              {labelAbove && labelBlock}

              {/* Disque POI Direction A */}
              <div className={`map-poi-disc ${!unlocked ? 'locked' : ''} ${current ? 'current' : ''}`}>
                {unlocked ? (
                  <PixelSprite sprite={poi.icon} scale={poi.iconScale ?? 2} frame={0} />
                ) : (
                  <span style={{ fontSize: 22 }}>🔒</span>
                )}
                {/* Drapeau "monde courant" */}
                {current && <div className="map-poi-flag" />}
              </div>

              {/* Sinon (POI impair) : label en dessous */}
              {!labelAbove && labelBlock}
            </div>
          </button>
        );
      })}

      {/* ═══════════ Mage animé — collé au POI courant (au-dessus à gauche) ═══════════
           On utilise une variable CSS pour adapter la taille au mobile (scale 3) vs desktop (scale 4). */}
      <motion.div
        className="absolute pointer-events-none worldmap-mage"
        initial={false}
        animate={{ left: `${magePos.x}%`, top: `${magePos.y}%` }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      >
        <div className={walking ? '' : 'animate-breathe'}>
          {walking ? (
            <SmartSprite assetKey="mageWalk" variant="walk" direction={walkDir} fallback={mage} scale={3} frameRate={160} />
          ) : (
            <SmartSprite assetKey="mageIdle" variant="idle" direction="front" fallback={mage} scale={3} />
          )}
        </div>
        <div className="w-10 h-2 bg-black/45 rounded-full blur-[2px] mx-auto -mt-[2px]" />
      </motion.div>

      {/* ═══════════ Titre en parchemin (ribbon doré Direction A) ═══════════ */}
      <div className="absolute top-14 left-0 right-0 flex justify-center z-30 pointer-events-none">
        <div
          className="ribbon ribbon-banner ribbon-gold"
          style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 14, fontWeight: 900 }}
        >
          ⚜  ROYAUME DE GRAMMATICAË  ⚜
        </div>
      </div>

    </div>
  );
}

// (Les anciens systèmes biomes / rivière / décor / particules / rose-des-vents
//  ont été supprimés pour matcher le design Direction A — fond sombre épuré.)

// Bouton de navigation ultra-compact pour faire tenir 7 boutons sur un écran
// de 390px (iPhone SE et autres) : flex-1 avec min-w-0, icône uniquement,
// label minuscule. Le 1er bouton mobile = ~50px de large, lisible et tappable.
function NavBtn({ emoji, label, color = 'ghost', onClick }) {
  const colorCls = {
    gold:  'pixel-btn-gold',
    pink:  'pixel-btn-pink',
    blue:  'pixel-btn-blue',
    ghost: 'pixel-btn-ghost',
  }[color] || 'pixel-btn-ghost';
  return (
    <button
      onClick={onClick}
      className={`pixel-btn ${colorCls} flex flex-col items-center justify-center gap-0`}
      style={{ flex: '1 1 0', minWidth: 0, padding: '3px 2px', lineHeight: 1 }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>
      <span className="font-pixel" style={{ fontSize: 7, marginTop: 2 }}>{label}</span>
    </button>
  );
}
