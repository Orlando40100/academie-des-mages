// Bouton plein écran flottant : visible tant qu'on n'est pas en fullscreen.
// Sur Android Chrome → bascule en immersif via requestFullscreen().
// Sur iOS Safari → l'API n'existe pas pour les éléments non-vidéo, on cache
// le bouton et l'utilisateur doit installer en PWA pour avoir le vrai plein écran.

import { useEffect, useState } from 'react';

function isStandaloneMode() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: fullscreen)').matches ||
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function canRequestFullscreen() {
  if (typeof document === 'undefined') return false;
  const el = document.documentElement;
  return !!(
    el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.msRequestFullscreen
  );
}

export default function FullscreenButton() {
  const [isFs, setIsFs] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const update = () => {
      const fs = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFs(fs);
    };
    update();
    document.addEventListener('fullscreenchange', update);
    document.addEventListener('webkitfullscreenchange', update);

    // Si déjà en mode standalone PWA, ou si l'API n'existe pas (iOS Safari pur),
    // on cache le bouton — il ne servirait à rien.
    if (isStandaloneMode() || !canRequestFullscreen()) {
      setHidden(true);
    }
    return () => {
      document.removeEventListener('fullscreenchange', update);
      document.removeEventListener('webkitfullscreenchange', update);
    };
  }, []);

  if (hidden || isFs) return null;

  const enter = () => {
    const el = document.documentElement;
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.msRequestFullscreen;
    if (req) {
      try { req.call(el, { navigationUI: 'hide' }); } catch { try { req.call(el); } catch {} }
    }
  };

  return (
    <button
      onClick={enter}
      aria-label="Plein écran"
      title="Passer en plein écran"
      className="fixed z-40 bottom-3 right-3 w-11 h-11 rounded-full bg-magic-bg/85 border-2 border-magic-gold text-magic-gold font-pixel flex items-center justify-center shadow-[2px_2px_0_#000] active:translate-y-0.5"
      style={{ fontSize: 18 }}
    >
      ⛶
    </button>
  );
}
