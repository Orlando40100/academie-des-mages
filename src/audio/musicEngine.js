// Moteur de musique chiptune — synthèse Web Audio, aucune ressource externe.
// Un petit séquenceur multi-pistes (mélodie + basse + percussions).

let ctx = null;
let enabled = true;
let volume = 0.08;
let currentTrack = null;
let masterGain = null;

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

export function setMusicEnabled(on) {
  enabled = on;
  if (!on && currentTrack) stopMusic();
}

export function setMusicVolume(v) {
  volume = v;
  if (masterGain) masterGain.gain.setValueAtTime(v, getCtx().currentTime);
}

// Notes MIDI → fréquences
const NOTE_FREQ = (() => {
  const out = {};
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  for (let octave = 0; octave <= 8; octave++) {
    for (let n = 0; n < 12; n++) {
      const midi = (octave + 1) * 12 + n;
      const freq = 440 * Math.pow(2, (midi - 69) / 12);
      out[`${names[n]}${octave}`] = freq;
    }
  }
  out['R'] = null; // silence
  return out;
})();

function noteFreq(n) {
  return NOTE_FREQ[n] ?? null;
}

// Joue une note à un moment donné (audio time)
function scheduleNote(when, freq, duration, type = 'square', gain = 0.12, master) {
  if (!freq) return;
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, when);
  g.gain.setValueAtTime(0, when);
  g.gain.linearRampToValueAtTime(gain, when + 0.01);
  g.gain.linearRampToValueAtTime(gain * 0.5, when + duration * 0.6);
  g.gain.linearRampToValueAtTime(0.0001, when + duration);
  osc.connect(g);
  g.connect(master);
  osc.start(when);
  osc.stop(when + duration + 0.05);
}

function scheduleDrum(when, type, master) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  if (type === 'kick') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, when);
    osc.frequency.exponentialRampToValueAtTime(50, when + 0.12);
    g.gain.setValueAtTime(0.18, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.15);
  } else if (type === 'snare') {
    // bruit blanc court simulé avec sawtooth rapide
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, when);
    g.gain.setValueAtTime(0.08, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.08);
  } else if (type === 'hat') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(8000, when);
    g.gain.setValueAtTime(0.02, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.04);
  }
  osc.connect(g);
  g.connect(master);
  osc.start(when);
  osc.stop(when + 0.2);
}

// Joue une piste en boucle.
// track = { bpm, lead, bass, drums, leadType, bassType, leadGain, bassGain }
// lead et bass sont des tableaux [ ['note', beats], ... ]
// drums est un tableau [ 'kick' | 'snare' | 'hat' | null, ... ] un item par demi-beat
export function playTrack(track) {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  stopMusic();
  masterGain = c.createGain();
  masterGain.gain.setValueAtTime(volume, c.currentTime);
  masterGain.connect(c.destination);

  const { bpm = 120, lead = [], bass = [], drums = [], leadType = 'square', bassType = 'triangle' } = track;
  const beatSec = 60 / bpm;
  const leadGain = track.leadGain ?? 0.14;
  const bassGain = track.bassGain ?? 0.10;

  const leadLength = lead.reduce((s, [, beats]) => s + beats, 0);
  const bassLength = bass.reduce((s, [, beats]) => s + beats, 0);
  const maxLength = Math.max(leadLength, bassLength, drums.length * 0.5);
  const trackSec = maxLength * beatSec;

  let stop = false;
  let loopStart = c.currentTime + 0.05;

  const scheduleLoop = () => {
    if (stop) return;
    // Schedule lead
    let t = loopStart;
    for (const [n, beats] of lead) {
      const d = beats * beatSec;
      scheduleNote(t, noteFreq(n), d * 0.95, leadType, leadGain, masterGain);
      t += d;
    }
    // Schedule bass
    t = loopStart;
    for (const [n, beats] of bass) {
      const d = beats * beatSec;
      scheduleNote(t, noteFreq(n), d * 0.95, bassType, bassGain, masterGain);
      t += d;
    }
    // Schedule drums (one per half-beat)
    drums.forEach((d, i) => {
      if (d) scheduleDrum(loopStart + i * beatSec * 0.5, d, masterGain);
    });

    loopStart += trackSec;
    const nextIn = (loopStart - c.currentTime - 0.5) * 1000;
    setTimeout(scheduleLoop, Math.max(100, nextIn));
  };

  currentTrack = { stop: () => { stop = true; } };
  scheduleLoop();
}

export function stopMusic() {
  if (currentTrack) currentTrack.stop();
  currentTrack = null;
  if (masterGain) {
    try {
      masterGain.gain.linearRampToValueAtTime(0, getCtx().currentTime + 0.3);
      const g = masterGain;
      setTimeout(() => { try { g.disconnect(); } catch {} }, 400);
    } catch {}
  }
  masterGain = null;
}
