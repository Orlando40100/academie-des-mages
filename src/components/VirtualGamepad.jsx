import { emitAction } from '../input/inputManager.js';
import { sounds } from '../audio/soundEngine.js';

function Pad({ label, color, onPress, className = '' }) {
  const handle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    sounds.select();
    onPress();
  };
  return (
    <button
      onTouchStart={handle}
      onMouseDown={handle}
      className={`font-pixel text-xs w-14 h-14 rounded-full border-b-4 border-r-4 border-black flex items-center justify-center select-none ${color} ${className}`}
      style={{ touchAction: 'none' }}
    >
      {label}
    </button>
  );
}

function DPad({ onPress }) {
  const btn = (label, action, extra) => (
    <button
      onTouchStart={(e) => { e.preventDefault(); onPress(action); }}
      onMouseDown={(e) => { e.preventDefault(); onPress(action); }}
      className={`w-10 h-10 bg-magic-bg2 text-magic-cream font-pixel flex items-center justify-center border-2 border-magic-accent ${extra}`}
      style={{ touchAction: 'none' }}
    >
      {label}
    </button>
  );
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-0 w-32 h-32">
      <div />
      {btn('▲', 'UP')}
      <div />
      {btn('◀', 'LEFT')}
      <div className="bg-magic-bg2 border-2 border-magic-accent" />
      {btn('▶', 'RIGHT')}
      <div />
      {btn('▼', 'DOWN')}
      <div />
    </div>
  );
}

export default function VirtualGamepad({ compact = false }) {
  const press = (action) => emitAction(action, 'touch');
  if (compact) {
    return (
      <div className="flex items-center justify-between px-2 pb-2 gap-2">
        <DPad onPress={press} />
        <div className="grid grid-cols-2 gap-2">
          <Pad label="Y" color="bg-magic-gold text-magic-bg" onPress={() => press('Y')} />
          <Pad label="B" color="bg-magic-red text-white" onPress={() => press('B')} />
          <Pad label="X" color="bg-magic-blue text-white" onPress={() => press('X')} />
          <Pad label="A" color="bg-magic-green text-white" onPress={() => press('A')} />
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-x-0 bottom-0 safe-bottom pointer-events-none z-30">
      <div className="flex items-end justify-between px-3 pb-3 pointer-events-auto">
        <DPad onPress={press} />
        <div className="grid grid-cols-2 gap-2">
          <Pad label="Y" color="bg-magic-gold text-magic-bg" onPress={() => press('Y')} />
          <Pad label="B" color="bg-magic-red text-white" onPress={() => press('B')} />
          <Pad label="X" color="bg-magic-blue text-white" onPress={() => press('X')} />
          <Pad label="A" color="bg-magic-green text-white" onPress={() => press('A')} />
        </div>
      </div>
    </div>
  );
}
