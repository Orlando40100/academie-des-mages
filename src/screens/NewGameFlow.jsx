import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from '../components/Background.jsx';
import PixelSprite from '../sprites/PixelSprite.jsx';
import { mage, maitreAldric } from '../sprites/library.js';
import { useGame } from '../store/gameStore.jsx';
import { sounds } from '../audio/soundEngine.js';

const CINEMATIQUE = [
  '🌟 Le royaume de Grammaticaë et Numéria est menacé !',
  'Les monstres de l\'ignorance envahissent les mondes...',
  'Seul·e un·e jeune mage en formation peut restaurer l\'équilibre.',
  'Maître Aldric t\'attend à l\'Académie. Prête ?',
];

export default function NewGameFlow({ onDone }) {
  const [step, setStep] = useState('cinema');
  const [cineIdx, setCineIdx] = useState(0);
  const { dispatch } = useGame();
  const [prenom, setPrenom] = useState('');
  const [avatar, setAvatar] = useState('mage-fille');
  const [useNativeKeyboard, setUseNativeKeyboard] = useState(false);

  const skip = () => { sounds.select(); setStep('avatar'); };

  const nextCine = () => {
    sounds.select();
    if (cineIdx < CINEMATIQUE.length - 1) setCineIdx(cineIdx + 1);
    else setStep('avatar');
  };

  const confirmAvatar = () => {
    sounds.confirm();
    dispatch({ type: 'SET_AVATAR', avatar });
    setStep('prenom');
  };

  const confirmPrenom = () => {
    if (prenom.length < 2 || prenom.length > 12) return;
    sounds.confirm();
    dispatch({ type: 'SET_PRENOM', prenom });
    setStep('tuto-question');
  };

  const proposerTuto = (choix) => {
    sounds.confirm();
    if (choix === 'oui') onDone('tutorial');
    else {
      dispatch({ type: 'COMPLETE_TUTORIAL' });
      onDone('worldmap');
    }
  };

  return (
    <Background variant="magic">
      <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 'cinema' && (
            <motion.div
              key="cinema"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center w-full max-w-2xl"
            >
              <div className="font-retro text-2xl md:text-3xl text-magic-cream mb-8 min-h-[120px]">
                {CINEMATIQUE[cineIdx]}
              </div>
              <div className="flex gap-3 justify-center">
                <button className="pixel-btn pixel-btn-gold" onClick={nextCine}>
                  ▶ Suite (Ⓐ)
                </button>
                <button className="pixel-btn pixel-btn-ghost" onClick={skip}>
                  Passer
                </button>
              </div>
            </motion.div>
          )}

          {step === 'avatar' && (
            <motion.div key="avatar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <h2 className="pixel-title text-lg md:text-2xl mb-6">Choisis ton avatar</h2>
              <div className="flex gap-6 justify-center mb-6 flex-wrap">
                <AvatarChoice id="mage-fille" sprite={mage} selected={avatar === 'mage-fille'} onClick={setAvatar} />
                <AvatarChoice id="mage-garcon" sprite={mage} selected={avatar === 'mage-garcon'} onClick={setAvatar} tint="#60a5fa" />
              </div>
              <button className="pixel-btn pixel-btn-gold" onClick={confirmAvatar}>Valider (Ⓐ)</button>
            </motion.div>
          )}

          {step === 'prenom' && (
            <motion.div key="prenom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full max-w-lg">
              <h2 className="pixel-title text-lg md:text-2xl mb-6">Quel est ton prénom ?</h2>
              <div className="pixel-card mb-4">
                <div className="font-retro text-3xl text-magic-gold min-h-[50px] flex items-center justify-center tracking-widest">
                  {prenom || '_ _ _ _'}
                </div>
                <div className="font-retro text-sm text-magic-cream/60 mt-1">
                  {prenom.length}/12 caractères
                </div>
              </div>
              {useNativeKeyboard ? (
                <input
                  autoFocus
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value.replace(/[^A-Za-zÀ-ÿ0-9\- ]/g, '').slice(0, 12))}
                  className="w-full font-retro text-2xl px-3 py-2 bg-magic-bg2 text-magic-cream border-2 border-magic-accent mb-3"
                  placeholder="Ton prénom"
                  maxLength={12}
                />
              ) : (
                <PixelKeyboard value={prenom} onChange={setPrenom} />
              )}
              <div className="flex gap-2 justify-center mt-4">
                <button className="pixel-btn pixel-btn-ghost" onClick={() => setUseNativeKeyboard(!useNativeKeyboard)}>
                  {useNativeKeyboard ? '🎮 Clavier pixel' : '⌨️ Clavier natif'}
                </button>
                <button
                  className="pixel-btn pixel-btn-gold disabled:opacity-40"
                  disabled={prenom.length < 2}
                  onClick={confirmPrenom}
                >
                  Valider
                </button>
              </div>
            </motion.div>
          )}

          {step === 'tuto-question' && (
            <motion.div key="tuto-q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-2xl">
              <div className="flex items-end justify-center gap-6 mb-4">
                <PixelSprite sprite={maitreAldric} scale={3} />
                <div className="pixel-card text-left max-w-md">
                  <div className="font-pixel text-xs text-magic-gold mb-2">Maître Aldric</div>
                  <div className="font-retro text-xl">
                    Ravi de te rencontrer, {prenom} ! Veux-tu que je te montre les bases du jeu ?
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <button className="pixel-btn pixel-btn-gold" onClick={() => proposerTuto('oui')}>
                  ✨ Oui, montre-moi (recommandé)
                </button>
                <button className="pixel-btn pixel-btn-ghost" onClick={() => proposerTuto('non')}>
                  Non merci
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Background>
  );
}

function AvatarChoice({ id, sprite, selected, onClick, tint }) {
  return (
    <button
      onClick={() => { sounds.select(); onClick(id); }}
      className={`pixel-card transition-all ${selected ? 'ring-4 ring-magic-gold scale-110' : 'opacity-80'}`}
      style={tint ? { filter: `hue-rotate(120deg)` } : {}}
    >
      <PixelSprite sprite={sprite} scale={4} />
      <div className="font-pixel text-xs mt-2 text-magic-cream">{id === 'mage-fille' ? 'Magicienne' : 'Magicien'}</div>
    </button>
  );
}

const LETTRES = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M',
  'N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
];

function PixelKeyboard({ value, onChange }) {
  const append = (c) => { sounds.select(); if (value.length < 12) onChange(value + c); };
  const back = () => { sounds.cancel(); onChange(value.slice(0, -1)); };
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-7 gap-1">
        {LETTRES.map((l) => (
          <button key={l} onClick={() => append(l)} className="font-pixel text-sm py-2 bg-magic-bg2 border border-magic-accent hover:bg-magic-accent/30">
            {l}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1">
        <button onClick={() => append(' ')} className="font-pixel text-sm py-2 bg-magic-bg2 border border-magic-accent">Espace</button>
        <button onClick={() => append('-')} className="font-pixel text-sm py-2 bg-magic-bg2 border border-magic-accent">Tiret</button>
        <button onClick={back} className="font-pixel text-sm py-2 bg-magic-red border border-black">⌫ Supprimer</button>
      </div>
    </div>
  );
}
