// Gestionnaire d'entrée unifié : manette + clavier + tactile.
// Émet des "actions" abstraites (A, B, X, Y, UP, DOWN, LEFT, RIGHT, START, SELECT, LB, RB).

import { onGamepad, startGamepadLoop, hasGamepadConnected } from './gamepad.js';

const KEY_MAP = {
  ' ': 'A', Enter: 'A',
  Escape: 'B', Backspace: 'B',
  f: 'X', F: 'X',
  c: 'Y', C: 'Y',
  q: 'LB', Q: 'LB',
  e: 'RB', E: 'RB',
  p: 'START', P: 'START',
  g: 'SELECT', G: 'SELECT',
  ArrowUp: 'UP', w: 'UP', W: 'UP',
  ArrowDown: 'DOWN', s: 'DOWN', S: 'DOWN',
  ArrowLeft: 'LEFT', a: 'LEFT', A: 'LEFT',
  ArrowRight: 'RIGHT', d: 'RIGHT', D: 'RIGHT',
};

let listeners = new Set();
let started = false;
let inputMode = 'keyboard'; // 'keyboard' | 'gamepad' | 'touch'
let modeListeners = new Set();

function setInputMode(mode) {
  if (mode !== inputMode) {
    inputMode = mode;
    for (const l of modeListeners) l(mode);
  }
}

export function getInputMode() { return inputMode; }

export function onInputModeChange(handler) {
  modeListeners.add(handler);
  return () => modeListeners.delete(handler);
}

function fire(action, source) {
  if (!action) return;
  for (const l of listeners) l({ action, source });
}

export function emitAction(action, source = 'touch') {
  setInputMode(source);
  fire(action, source);
}

export function onAction(handler) {
  listeners.add(handler);
  return () => listeners.delete(handler);
}

export function startInputSystem() {
  if (started) return;
  started = true;
  window.addEventListener('keydown', (e) => {
    const action = KEY_MAP[e.key];
    if (action) {
      e.preventDefault();
      setInputMode('keyboard');
      fire(action, 'keyboard');
    }
  });
  window.addEventListener('gamepadconnected', () => {
    setInputMode('gamepad');
    startGamepadLoop();
  });
  onGamepad(({ type, data }) => {
    if (type === 'buttondown') {
      setInputMode('gamepad');
      fire(data, 'gamepad');
    } else if (type === 'stick') {
      setInputMode('gamepad');
      fire(data, 'gamepad');
    }
  });
  if (hasGamepadConnected()) startGamepadLoop();

  window.addEventListener('touchstart', () => {
    if (inputMode !== 'touch') setInputMode('touch');
  }, { passive: true });
}
