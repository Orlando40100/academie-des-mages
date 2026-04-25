// Mélodies par monde et contextes — partitions pour musicEngine.
// Format : ['nom-note', nb-beats] ex: ['C4', 1] = Do 4e octave pendant 1 temps.
// 'R' = silence.

// ═══════════════ THÈME ACCUEIL ═══════════════
// Magique, solennel, chaleureux
export const themeAccueil = {
  bpm: 100,
  leadType: 'triangle',
  bassType: 'square',
  leadGain: 0.12,
  bassGain: 0.06,
  lead: [
    ['C5', 1], ['E5', 1], ['G5', 1], ['C6', 1],
    ['B5', 0.5], ['A5', 0.5], ['G5', 1],
    ['E5', 1], ['G5', 1],
    ['F5', 0.5], ['E5', 0.5], ['D5', 1],
    ['C5', 2],
    ['R', 2],
  ],
  bass: [
    ['C3', 2], ['G3', 2],
    ['A3', 2], ['E3', 2],
    ['F3', 2], ['C3', 2],
    ['G3', 2], ['C3', 2],
  ],
  drums: [],
};

// ═══════════════ MONDE 1 — FORÊT DES DÉBUTANTS ═══════════════
// Gai, léger, naïf
export const monde1 = {
  bpm: 120,
  leadType: 'square',
  bassType: 'triangle',
  leadGain: 0.10,
  bassGain: 0.06,
  lead: [
    ['G4', 0.5], ['A4', 0.5], ['B4', 0.5], ['G4', 0.5],
    ['E5', 1], ['D5', 1],
    ['C5', 0.5], ['B4', 0.5], ['A4', 0.5], ['G4', 0.5],
    ['A4', 2],
    ['G4', 0.5], ['A4', 0.5], ['B4', 0.5], ['D5', 0.5],
    ['E5', 1], ['G5', 1],
    ['F5', 0.5], ['E5', 0.5], ['D5', 1],
    ['C5', 2],
  ],
  bass: [
    ['C3', 1], ['G3', 1], ['C3', 1], ['G3', 1],
    ['A3', 1], ['E3', 1], ['F3', 1], ['G3', 1],
    ['C3', 1], ['G3', 1], ['C3', 1], ['E3', 1],
    ['F3', 1], ['G3', 1], ['C3', 2],
  ],
  drums: [
    'kick', null, 'hat', null, 'snare', null, 'hat', null,
    'kick', null, 'hat', null, 'snare', null, 'hat', null,
    'kick', null, 'hat', null, 'snare', null, 'hat', null,
    'kick', null, 'hat', null, 'snare', null, 'hat', null,
  ],
};

// ═══════════════ MONDE 2 — CLAIRIÈRE DES NOMBRES ═══════════════
// Pétillant, ensoleillé
export const monde2 = {
  bpm: 130,
  leadType: 'square',
  bassType: 'triangle',
  lead: [
    ['C5', 0.5], ['E5', 0.5], ['G5', 0.5], ['E5', 0.5],
    ['C5', 0.5], ['E5', 0.5], ['G5', 1],
    ['D5', 0.5], ['F5', 0.5], ['A5', 0.5], ['F5', 0.5],
    ['D5', 0.5], ['F5', 0.5], ['A5', 1],
    ['E5', 0.5], ['G5', 0.5], ['B5', 0.5], ['G5', 0.5],
    ['E5', 1], ['D5', 1],
    ['C5', 2],
    ['R', 2],
  ],
  bass: [
    ['C3', 2], ['C3', 2],
    ['D3', 2], ['D3', 2],
    ['E3', 2], ['G3', 2],
    ['C3', 2], ['G3', 2],
  ],
  drums: [
    'kick', null, 'hat', null, 'snare', null, 'hat', null,
    'kick', null, 'hat', 'hat', 'snare', null, 'hat', null,
    'kick', null, 'hat', null, 'snare', null, 'hat', null,
    'kick', null, 'hat', 'hat', 'snare', null, 'hat', null,
  ],
};

// ═══════════════ MONDE 3 — MARAIS DES MOTS ═══════════════
// Mystérieux, lent
export const monde3 = {
  bpm: 80,
  leadType: 'triangle',
  bassType: 'sawtooth',
  leadGain: 0.11,
  bassGain: 0.05,
  lead: [
    ['D4', 1], ['F4', 1], ['A4', 1], ['F4', 1],
    ['D4', 2], ['E4', 2],
    ['F4', 1], ['A4', 1], ['D5', 1], ['A4', 1],
    ['F4', 2], ['D4', 2],
  ],
  bass: [
    ['D2', 4], ['D2', 4],
    ['F2', 4], ['A2', 4],
  ],
  drums: [],
};

// ═══════════════ MONDE 4 — CAVERNE DES OPÉRATIONS ═══════════════
// Sombre, caverneux
export const monde4 = {
  bpm: 90,
  leadType: 'triangle',
  bassType: 'square',
  leadGain: 0.12,
  bassGain: 0.05,
  lead: [
    ['A4', 1], ['C5', 1], ['E5', 2],
    ['D5', 1], ['C5', 1], ['B4', 2],
    ['A4', 1], ['E4', 1], ['A4', 2],
    ['G4', 1], ['F4', 1], ['E4', 2],
  ],
  bass: [
    ['A2', 2], ['E2', 2],
    ['F2', 2], ['E2', 2],
    ['A2', 2], ['E2', 2],
    ['A2', 2], ['A2', 2],
  ],
  drums: [
    'kick', null, null, null, null, null, null, null,
    'kick', null, null, null, 'snare', null, null, null,
    'kick', null, null, null, null, null, null, null,
    'kick', null, null, null, 'snare', null, null, null,
  ],
};

// ═══════════════ MONDE 5 — TOUR DE CONJUGAISON ═══════════════
// Mystique, étoilé
export const monde5 = {
  bpm: 110,
  leadType: 'triangle',
  bassType: 'square',
  leadGain: 0.11,
  bassGain: 0.05,
  lead: [
    ['F#4', 1], ['A4', 1], ['C#5', 1], ['E5', 1],
    ['D5', 1], ['C#5', 1], ['B4', 2],
    ['A4', 1], ['F#4', 1], ['E4', 1], ['F#4', 1],
    ['A4', 2], ['E4', 2],
  ],
  bass: [
    ['F#2', 2], ['C#3', 2],
    ['D3', 2], ['A2', 2],
    ['B2', 2], ['F#2', 2],
    ['A2', 2], ['F#2', 2],
  ],
  drums: [],
};

// ═══════════════ MONDE 6 — DÉSERT DES FRACTIONS ═══════════════
// Oriental, chaud
export const monde6 = {
  bpm: 100,
  leadType: 'square',
  bassType: 'triangle',
  lead: [
    ['D5', 1], ['E5', 0.5], ['F5', 0.5], ['E5', 1], ['D5', 1],
    ['C5', 0.5], ['D5', 0.5], ['E5', 1], ['D5', 2],
    ['F5', 1], ['G5', 0.5], ['A5', 0.5], ['G5', 1], ['F5', 1],
    ['E5', 0.5], ['F5', 0.5], ['D5', 2], ['R', 1],
  ],
  bass: [
    ['D3', 2], ['A2', 2],
    ['D3', 2], ['F3', 2],
    ['D3', 2], ['A2', 2],
    ['D3', 4],
  ],
  drums: [
    'kick', null, 'hat', null, null, null, 'hat', null,
    'kick', null, 'hat', null, 'snare', null, 'hat', null,
    'kick', null, 'hat', null, null, null, 'hat', null,
    'kick', null, 'hat', null, 'snare', null, 'hat', null,
  ],
};

// ═══════════════ MONDE 7 — TEMPLE DE LA GRAMMAIRE ═══════════════
// Noble, solennel
export const monde7 = {
  bpm: 95,
  leadType: 'triangle',
  bassType: 'triangle',
  lead: [
    ['E5', 1], ['D5', 1], ['C5', 1], ['B4', 1],
    ['C5', 1], ['D5', 1], ['E5', 2],
    ['F5', 1], ['E5', 1], ['D5', 1], ['C5', 1],
    ['G4', 2], ['C5', 2],
  ],
  bass: [
    ['C3', 2], ['G2', 2],
    ['F3', 2], ['C3', 2],
    ['F3', 2], ['G3', 2],
    ['C3', 4],
  ],
  drums: [],
};

// ═══════════════ MONDE 8 — MONTAGNE DE GÉOMÉTRIE ═══════════════
// Majestueux, large
export const monde8 = {
  bpm: 85,
  leadType: 'sawtooth',
  bassType: 'triangle',
  leadGain: 0.10,
  bassGain: 0.06,
  lead: [
    ['G4', 2], ['B4', 1], ['D5', 1],
    ['G5', 2], ['F5', 1], ['E5', 1],
    ['D5', 2], ['C5', 1], ['B4', 1],
    ['A4', 2], ['G4', 2],
  ],
  bass: [
    ['G2', 4], ['C3', 4],
    ['D3', 4], ['G2', 4],
  ],
  drums: [],
};

// ═══════════════ MONDE 9 — CITÉ DE L'ORTHOGRAPHE ═══════════════
// Médiéval, marché animé
export const monde9 = {
  bpm: 115,
  leadType: 'square',
  bassType: 'triangle',
  lead: [
    ['D5', 0.5], ['F5', 0.5], ['A5', 1], ['F5', 1], ['D5', 1],
    ['C5', 0.5], ['D5', 0.5], ['E5', 1], ['D5', 2],
    ['A4', 1], ['D5', 1], ['F5', 1], ['D5', 1],
    ['E5', 0.5], ['D5', 0.5], ['C5', 1], ['D5', 2],
  ],
  bass: [
    ['D3', 1], ['A2', 1], ['D3', 1], ['A2', 1],
    ['C3', 1], ['G2', 1], ['C3', 1], ['G2', 1],
    ['D3', 1], ['A2', 1], ['D3', 1], ['A2', 1],
    ['C3', 1], ['A2', 1], ['D3', 2],
  ],
  drums: [
    'kick', null, 'hat', null, 'snare', null, 'hat', null,
    'kick', null, 'hat', null, 'snare', null, 'hat', null,
    'kick', null, 'hat', null, 'snare', null, 'hat', null,
    'kick', null, 'hat', null, 'snare', null, 'hat', 'hat',
  ],
};

// ═══════════════ MONDE 10 — CHÂTEAU FINAL ═══════════════
// Épique, menaçant
export const monde10 = {
  bpm: 110,
  leadType: 'sawtooth',
  bassType: 'square',
  leadGain: 0.13,
  bassGain: 0.07,
  lead: [
    ['A3', 1], ['C4', 1], ['E4', 1], ['A4', 1],
    ['G4', 2], ['F4', 2],
    ['E4', 1], ['D4', 1], ['C4', 1], ['B3', 1],
    ['A3', 4],
  ],
  bass: [
    ['A1', 1], ['A1', 1], ['A1', 1], ['A1', 1],
    ['F2', 1], ['F2', 1], ['F2', 1], ['F2', 1],
    ['E2', 1], ['E2', 1], ['E2', 1], ['E2', 1],
    ['A1', 1], ['A1', 1], ['A1', 1], ['A1', 1],
  ],
  drums: [
    'kick', null, null, null, 'kick', null, null, null,
    'kick', null, 'snare', null, 'kick', null, 'snare', null,
    'kick', null, null, null, 'kick', null, null, null,
    'kick', null, 'snare', null, 'kick', 'kick', 'snare', 'snare',
  ],
};

// ═══════════════ MONDE 11 — PORTAIL STELLAIRE ═══════════════
// Cosmique, étrange
export const monde11 = {
  bpm: 75,
  leadType: 'triangle',
  bassType: 'triangle',
  leadGain: 0.10,
  bassGain: 0.06,
  lead: [
    ['E5', 1], ['G#5', 1], ['B5', 2],
    ['A5', 1], ['F#5', 1], ['D5', 2],
    ['C#5', 1], ['E5', 1], ['G#5', 2],
    ['F#5', 2], ['E5', 2],
  ],
  bass: [
    ['E2', 4], ['A2', 4],
    ['F#2', 4], ['E2', 4],
  ],
  drums: [],
};

// ═══════════════ THÈME COMBAT ═══════════════
// Dynamique, intense
export const themeCombat = {
  bpm: 140,
  leadType: 'square',
  bassType: 'sawtooth',
  leadGain: 0.11,
  bassGain: 0.07,
  lead: [
    ['A4', 0.5], ['C5', 0.5], ['E5', 0.5], ['A5', 0.5],
    ['G5', 0.5], ['E5', 0.5], ['D5', 1],
    ['A4', 0.5], ['C5', 0.5], ['E5', 0.5], ['A5', 0.5],
    ['G5', 0.5], ['F5', 0.5], ['E5', 1],
    ['D5', 1], ['C5', 1], ['B4', 1], ['A4', 1],
  ],
  bass: [
    ['A2', 0.5], ['A2', 0.5], ['E3', 1],
    ['A2', 0.5], ['A2', 0.5], ['E3', 1],
    ['F2', 0.5], ['F2', 0.5], ['C3', 1],
    ['G2', 0.5], ['G2', 0.5], ['D3', 1],
    ['A2', 0.5], ['A2', 0.5], ['E3', 0.5], ['A2', 0.5],
    ['D3', 0.5], ['D3', 0.5], ['G2', 0.5], ['E3', 0.5],
  ],
  drums: [
    'kick', null, 'hat', null, 'snare', null, 'hat', null,
    'kick', null, 'hat', 'hat', 'snare', null, 'hat', null,
    'kick', null, 'hat', null, 'snare', null, 'hat', null,
    'kick', 'kick', 'hat', 'hat', 'snare', null, 'hat', 'hat',
  ],
};

// ═══════════════ THÈME VICTOIRE (fanfare courte) ═══════════════
export const themeVictoire = {
  bpm: 140,
  leadType: 'square',
  bassType: 'triangle',
  lead: [
    ['C5', 0.5], ['E5', 0.5], ['G5', 0.5], ['C6', 1],
    ['B5', 0.5], ['C6', 2],
    ['R', 4],
  ],
  bass: [
    ['C3', 1], ['G3', 1], ['C4', 2],
    ['R', 4],
  ],
  drums: [],
};

export const tracksByMonde = {
  1: monde1, 2: monde2, 3: monde3, 4: monde4, 5: monde5,
  6: monde6, 7: monde7, 8: monde8, 9: monde9, 10: monde10, 11: monde11,
};
