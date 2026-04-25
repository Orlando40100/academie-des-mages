const path = require('path');

// Chemin absolu en forward-slash, anchored au répertoire de ce fichier.
const here = __dirname.replace(/\\/g, '/');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `${here}/index.html`,
    `${here}/src/**/*.{js,jsx}`,
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['VT323', 'monospace'],
        cinzel: ['"Cinzel Decorative"', 'serif'],
        cinzelR: ['Cinzel', 'serif'],
      },
      colors: {
        magic: {
          bg: '#1a0b2e',
          bg2: '#2d1b4e',
          accent: '#8b5cf6',
          gold: '#fbbf24',
          goldDeep: '#b45309',
          pink: '#ec4899',
          green: '#22c55e',
          red: '#ef4444',
          blue: '#3b82f6',
          cream: '#fef3c7',
          parchment: '#fde68a',
          ink: '#2a1503',
        },
      },
      animation: {
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'blink': 'blink 1s steps(2) infinite',
        'shake': 'shake 0.35s ease-in-out',
        'breathe': 'breathe 2.5s ease-in-out infinite',
        'pop': 'pop 0.3s ease-out',
        'spinSlow': 'spinSlow 12s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'coinSpin': 'coinSpin 2s linear infinite',
        'starPop': 'starPop 0.6s ease-out forwards',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        shake: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '15%': { transform: 'translate(-6px, 2px)' },
          '30%': { transform: 'translate(6px, -3px)' },
          '45%': { transform: 'translate(-5px, 4px)' },
          '60%': { transform: 'translate(5px, -2px)' },
          '75%': { transform: 'translate(-3px, 2px)' },
          '90%': { transform: 'translate(2px, 0)' },
        },
        breathe: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.5)', opacity: 0 },
          '60%': { transform: 'scale(1.15)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        spinSlow: {
          'from': { transform: 'translate(-50%,-50%) rotate(0deg)' },
          'to':   { transform: 'translate(-50%,-50%) rotate(360deg)' },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.7))' },
          '50%':      { filter: 'drop-shadow(0 0 24px rgba(251,191,36,1))' },
        },
        coinSpin: {
          '0%':   { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        starPop: {
          '0%':   { transform: 'scale(0) rotate(-180deg)', opacity: 0 },
          '60%':  { transform: 'scale(1.4) rotate(20deg)' },
          '100%': { transform: 'scale(1.2) rotate(0deg)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
