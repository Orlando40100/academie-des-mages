import { useEffect, useRef, useState } from 'react';
import { useGame } from '../store/gameStore.jsx';

export default function SaveIndicator() {
  const { saveIndicatorRef } = useGame();
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    saveIndicatorRef.current = () => {
      setVisible(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), 900);
    };
  }, [saveIndicatorRef]);

  if (!visible) return null;
  return (
    <div className="fixed top-3 right-3 z-50 pixel-hud text-magic-gold animate-pulse-soft pointer-events-none">
      💾
    </div>
  );
}
