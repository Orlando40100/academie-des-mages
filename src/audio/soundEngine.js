// Moteur sonore 8-bit minimaliste via Web Audio API.
// Tous les sons sont synthétisés (pas de fichiers audio).

let ctx = null;
let settings = { son: true, musique: true };

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setAudioSettings(newSettings) {
  settings = { ...settings, ...newSettings };
}

function beep(freq, duration, type = 'square', volume = 0.1) {
  if (!settings.son) return;
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

function sweep(fromFreq, toFreq, duration, type = 'square', volume = 0.1) {
  if (!settings.son) return;
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(fromFreq, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(toFreq, c.currentTime + duration);
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export const sounds = {
  select: () => beep(800, 0.05, 'square', 0.08),
  confirm: () => { beep(880, 0.08); setTimeout(() => beep(1320, 0.1), 60); },
  cancel: () => beep(400, 0.1, 'sawtooth', 0.08),
  correct: () => { beep(660, 0.08); setTimeout(() => beep(880, 0.08), 80); setTimeout(() => beep(1100, 0.15), 160); },
  wrong: () => { beep(250, 0.15, 'sawtooth', 0.1); setTimeout(() => beep(200, 0.2, 'sawtooth', 0.1), 100); },
  spell: () => sweep(400, 1200, 0.3, 'triangle', 0.1),
  hit: () => beep(150, 0.1, 'sawtooth', 0.15),
  coin: () => { beep(1320, 0.05); setTimeout(() => beep(1760, 0.1), 40); },
  levelUp: () => { beep(523, 0.1); setTimeout(() => beep(659, 0.1), 100); setTimeout(() => beep(784, 0.1), 200); setTimeout(() => beep(1047, 0.2), 300); },
  gameOver: () => { sweep(400, 100, 0.6, 'sawtooth', 0.1); },
  victory: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => beep(f, 0.15, 'square', 0.1), i * 120)); },
  save: () => beep(1500, 0.05, 'sine', 0.05),
  shield: () => beep(300, 0.2, 'triangle', 0.1),
  heal: () => sweep(600, 1000, 0.3, 'sine', 0.08),
};
