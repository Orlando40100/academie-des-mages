// Retour haptique mobile (Vibration API) + manette.
import { vibrateGamepad } from './gamepad.js';

let enabled = true;
let gamepadEnabled = 'normale'; // off | faible | normale | forte

export function setHapticsSettings(mobile, gamepad) {
  enabled = mobile;
  gamepadEnabled = gamepad;
}

function mobileVibe(pattern) {
  if (!enabled) return;
  if (navigator.vibrate) navigator.vibrate(pattern);
}

function padVibe(duration, strength) {
  if (gamepadEnabled === 'off') return;
  const mul = { faible: 0.3, normale: 0.6, forte: 1.0 }[gamepadEnabled] ?? 0.6;
  vibrateGamepad(duration, strength * mul, strength * mul * 0.7);
}

export const haptics = {
  correct: () => { mobileVibe(50); padVibe(80, 0.4); },
  wrong: () => { mobileVibe([30, 30, 30]); padVibe(120, 0.5); },
  spell: () => { mobileVibe(100); padVibe(150, 0.7); },
  gameOver: () => { mobileVibe(400); padVibe(500, 0.9); },
  victory: () => { mobileVibe([50, 50, 50, 50, 200]); padVibe(400, 0.8); },
  save: () => { mobileVibe(15); },
};
