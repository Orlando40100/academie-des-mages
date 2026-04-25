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
          className="absolute bottom-0 inset-x-0 safe-bottom z-30 px-3 py-2"
          style={{
            background: 'linear-gradient(0deg, rgba(15,4,32,0.98), rgba(26,11,46,0.92))',
            borderTop: '3px double #fbbf24',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.5)',
          }}
        >
          <div className="grid grid-cols-3 gap-1.5 mb-1.5">
            <button className="pixel-btn pixel-btn-gold" onClick={() => { sounds.select(); navigate('shop'); }}>🏪 Boutique</button>
            <button className="pixel-btn pixel-btn-pink" onClick={() => { sounds.select(); navigate('menagerie'); }}>🐾 Ménagerie</button>
            <button className="pixel-btn pixel-btn-ghost" onClick={() => { sounds.select(); navigate('grimoire'); }}>📖 Grimoire</button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            <button className="pixel-btn pixel-btn-blue text-[10px]" onClick={() => { sounds.select(); navigate('defi'); }}>📅 Défi</button>
            <button className="pixel-btn pixel-btn-blue text-[10px]" onClick={() => { sounds.select(); navigate('minijeux'); }}>🎮 Jeux</button>
            <button className="pixel-btn pixel-btn-ghost text-[10px]" onClick={() => { sounds.select(); navigate('arene'); }}>🏛️ Arène</button>
            <button className="pixel-btn pixel-btn-ghost text-[10px]" onClick={() => { sounds.select(); navigate('tour'); }}>🏠 Tour</button>
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
    <div className="absolute inset-0 pt-14 pb-24">
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

      {/* ═══════════ POI (mondes) — disque doré Direction A ═══════════ */}
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
        return (
          <button
            key={poi.id}
            onClick={() => onSelect(poi)}
            disabled={!unlocked || walking}
            className={`absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none ${!unlocked ? 'cursor-not-allowed' : 'cursor-pointer hover:z-30'}`}
            style={{ left: `${poi.x}%`, top: `${poi.y}%`, touchAction: 'manipulation', zIndex: 20 }}
          >
            <div className={`flex flex-col items-center ${isSelected ? 'scale-125' : ''} transition-transform`}>
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

              {/* Plaque parchemin nom + progression */}
              <div className={`map-poi-label mt-2 ${!unlocked ? 'locked' : ''} text-center`}>
                <div>{poi.id}. {poi.nom}</div>
                <div className="mt-0.5" style={{ fontSize: 6 }}>{subLabel}</div>
              </div>

              {/* Étoiles cumulées */}
              {unlocked && stars > 0 && (
                <div className="font-pixel text-[10px] text-magic-gold mt-1 drop-shadow-[1px_1px_0_#000]">
                  {'⭐'.repeat(Math.min(3, Math.ceil((stars / maxStars) * 3)))}
                </div>
              )}
            </div>
          </button>
        );
      })}

      {/* ═══════════ Mage animé — collé au POI courant (au-dessus à gauche) ═══════════ */}
      <motion.div
        className="absolute pointer-events-none"
        initial={false}
        animate={{ left: `${magePos.x}%`, top: `${magePos.y}%` }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
        // Mage agrandi (scale 4 = 64×64) pour qu'on distingue clairement le visage,
        // ancré en oblique haut-gauche du disque POI courant.
        style={{ transform: 'translate(calc(-50% - 48px), calc(-50% - 48px))', zIndex: 25 }}
      >
        <div className={walking ? '' : 'animate-breathe'}>
          {walking ? (
            <SmartSprite assetKey="mageWalk" variant="walk" direction={walkDir} fallback={mage} scale={4} frameRate={160} />
          ) : (
            <SmartSprite assetKey="mageIdle" variant="idle" direction="front" fallback={mage} scale={4} />
          )}
        </div>
        <div className="w-12 h-2 bg-black/45 rounded-full blur-[2px] mx-auto -mt-[2px]" />
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
