import { useRef } from 'react';

/**
 * Zone scrollable bulletproof pour mobile.
 *
 * Pourquoi : sur certains WebKit mobile (Samsung Galaxy / Chrome Android),
 * les conteneurs scrollables internes (`flex-1 overflow-y-auto`,
 * `grid-template-rows: 1fr`, etc.) ne déclenchent pas toujours `overflow-y`
 * de manière fiable. La solution la plus robuste : `position: fixed` avec
 * `top` et `bottom` explicites, ce qui force le navigateur à calculer une
 * hauteur déterministe.
 *
 * En complément : 2 boutons ▲▼ flottants à droite déclenchent
 * `scrollBy(±300)` directement en JS — filet de sécurité au cas où le geste
 * tactile serait bloqué pour une raison quelconque (framer-motion,
 * touch-action, GPU layer, etc.).
 *
 * Props :
 *  - topOffset : hauteur en pixels à laisser au-dessus (HUD + header) — défaut 100
 *  - bottomOffset : hauteur en pixels à laisser en dessous — défaut env(safe-area)
 *  - sideMargin : marges latérales — défaut 12
 *  - children : contenu à scroller
 *  - showButtons : afficher les boutons ▲▼ — défaut true
 *  - scrollDelta : nombre de pixels par tap sur les boutons — défaut 300
 */
export default function MobileScrollPane({
  topOffset = 100,
  bottomOffset = 0,
  sideMargin = 12,
  showButtons = true,
  scrollDelta = 300,
  children,
  style = {},
}) {
  const scrollRef = useRef(null);

  const scrollBy = (delta) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: delta, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div
        ref={scrollRef}
        style={{
          position: 'fixed',
          top: topOffset,
          left: sideMargin,
          right: sideMargin,
          bottom: bottomOffset,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          overscrollBehavior: 'contain',
          paddingBottom: 60, // espace pour les boutons ▲▼ qui flottent par-dessus
          zIndex: 4,
          ...style,
        }}
      >
        {children}
      </div>

      {showButtons && (
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
            type="button"
            onClick={() => scrollBy(-scrollDelta)}
            aria-label="Scroll up"
            style={{
              width: 44, height: 44,
              background: '#fbbf24',
              color: '#1a0b2e',
              border: '3px solid #000',
              boxShadow: '2px 2px 0 #000',
              fontSize: 18,
              fontFamily: "'Press Start 2P', monospace",
              cursor: 'pointer',
            }}
          >▲</button>
          <button
            type="button"
            onClick={() => scrollBy(scrollDelta)}
            aria-label="Scroll down"
            style={{
              width: 44, height: 44,
              background: '#fbbf24',
              color: '#1a0b2e',
              border: '3px solid #000',
              boxShadow: '2px 2px 0 #000',
              fontSize: 18,
              fontFamily: "'Press Start 2P', monospace",
              cursor: 'pointer',
            }}
          >▼</button>
        </div>
      )}
    </>
  );
}
