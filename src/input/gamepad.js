// Gestion manette Xbox via l'API Gamepad standard.

const DEADZONE = 0.2;

const BUTTONS = {
  A: 0, B: 1, X: 2, Y: 3,
  LB: 4, RB: 5, LT: 6, RT: 7,
  SELECT: 8, START: 9,
  LSTICK: 10, RSTICK: 11,
  UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15,
};

export { BUTTONS };

let lastState = {};
let listeners = new Set();

function readGamepads() {
  if (!navigator.getGamepads) return [];
  return Array.from(navigator.getGamepads()).filter(Boolean);
}

function snapshot(pad) {
  const s = { buttons: {}, axes: pad.axes.slice() };
  for (const [name, idx] of Object.entries(BUTTONS)) {
    s.buttons[name] = pad.buttons[idx]?.pressed ?? false;
  }
  return s;
}

function pollOnce() {
  const pads = readGamepads();
  if (pads.length === 0) return;
  const pad = pads[0];
  const cur = snapshot(pad);
  const prev = lastState[pad.index] || { buttons: {}, axes: [0, 0, 0, 0] };

  for (const name of Object.keys(BUTTONS)) {
    const wasDown = prev.buttons[name];
    const isDown = cur.buttons[name];
    if (isDown && !wasDown) fire('buttondown', name);
    if (!isDown && wasDown) fire('buttonup', name);
  }

  const [lx, ly] = cur.axes;
  const [plx, ply] = prev.axes;
  const dirNow = stickDir(lx, ly);
  const dirPrev = stickDir(plx, ply);
  if (dirNow && dirNow !== dirPrev) fire('stick', dirNow);

  lastState[pad.index] = cur;
}

function stickDir(x, y) {
  if (Math.abs(x) < DEADZONE && Math.abs(y) < DEADZONE) return null;
  if (Math.abs(x) > Math.abs(y)) return x > 0 ? 'RIGHT' : 'LEFT';
  return y > 0 ? 'DOWN' : 'UP';
}

function fire(type, data) {
  for (const l of listeners) l({ type, data });
}

export function onGamepad(handler) {
  listeners.add(handler);
  return () => listeners.delete(handler);
}

let rafId = null;
export function startGamepadLoop() {
  if (rafId) return;
  const loop = () => {
    pollOnce();
    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);
}

export function stopGamepadLoop() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

export function vibrateGamepad(duration = 150, strong = 0.5, weak = 0.3) {
  const pads = readGamepads();
  if (pads.length === 0) return;
  const pad = pads[0];
  if (pad.vibrationActuator?.playEffect) {
    pad.vibrationActuator.playEffect('dual-rumble', {
      startDelay: 0,
      duration,
      strongMagnitude: strong,
      weakMagnitude: weak,
    });
  }
}

export function hasGamepadConnected() {
  return readGamepads().length > 0;
}
