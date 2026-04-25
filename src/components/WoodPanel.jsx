// Panneau en bois 9-patch utilisant panel.png du pack Ninja Adventure.
// Utilisation :
//   <WoodPanel>Contenu</WoodPanel>
//   <WoodButton onClick={...}>Cliquer</WoodButton>

import { assetPath } from '../sprites/assetRegistry.js';

const panelUrl = assetPath('ui/theme/panel.png');
const btnUrl = assetPath('ui/theme/btn.png');
const btnHoverUrl = assetPath('ui/theme/btn-hover.png');
const btnPressedUrl = assetPath('ui/theme/btn-pressed.png');

export function WoodPanel({ children, className = '', style = {}, variant = 'default' }) {
  // Utilise border-image pour un vrai effet 9-patch
  return (
    <div
      className={`relative p-4 ${className}`}
      style={{
        imageRendering: 'pixelated',
        borderStyle: 'solid',
        borderWidth: '24px',
        borderImage: `url(${panelUrl}) 5 fill / 24px round`,
        backgroundColor: 'transparent',
        ...style,
      }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function WoodButton({ children, onClick, disabled = false, className = '', style = {}, color = 'default' }) {
  const bg = disabled ? btnUrl : btnUrl;
  const colorTint = {
    default: undefined,
    gold: 'hue-rotate-[20deg] brightness-110 saturate-150',
    red: 'hue-rotate-[-40deg] saturate-200',
    green: 'hue-rotate-[60deg] saturate-150',
    blue: 'hue-rotate-[180deg] saturate-150',
    pink: 'hue-rotate-[-80deg] saturate-200',
  }[color] ?? '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative font-pixel text-xs px-4 py-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:translate-y-[1px] hover:brightness-110'} ${colorTint} ${className}`}
      style={{
        imageRendering: 'pixelated',
        borderStyle: 'solid',
        borderWidth: '16px',
        borderImage: `url(${bg}) 3 fill / 16px round`,
        backgroundColor: 'transparent',
        color: '#fef3c7',
        textShadow: '2px 2px 0 #000',
        minHeight: '48px',
        ...style,
      }}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
