import { useState } from 'react';
import Background from '../components/Background.jsx';
import DialogueBox from '../components/DialogueBox.jsx';
import { maitreAldric, miaou, bouleFeuSprite, piece, marchandSprite } from '../sprites/library.js';
import { chapitres } from '../tutorial/tutorial.js';
import { useGame } from '../store/gameStore.jsx';
import PixelSprite from '../sprites/PixelSprite.jsx';
import { sounds } from '../audio/soundEngine.js';

export default function TutorialScreen({ onDone }) {
  const { dispatch } = useGame();
  const [chapIdx, setChapIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(null);

  const chap = chapitres[chapIdx];
  const isLastChap = chapIdx >= chapitres.length - 1;
  const isLastLine = lineIdx >= chap.aldric.length - 1;
  const hasQuiz = chap.id === 'etude' && !quizAnswered;

  const next = () => {
    sounds.select();
    if (!isLastLine) {
      setLineIdx(lineIdx + 1);
      return;
    }
    if (hasQuiz) return; // attend la réponse au quiz
    if (isLastChap) {
      dispatch({ type: 'COMPLETE_TUTORIAL' });
      dispatch({ type: 'ADD_POTION', id: 'potion_vie_petite', qty: 1 });
      onDone('worldmap');
      return;
    }
    setChapIdx(chapIdx + 1);
    setLineIdx(0);
  };

  const answerQuiz = (choice) => {
    const correct = choice === chap.questionTest.reponse;
    setQuizAnswered({ choice, correct });
    if (correct) sounds.correct(); else sounds.wrong();
  };

  return (
    <Background variant="magic">
      <div className="absolute inset-0 flex flex-col p-4 overflow-y-auto">
        <h2 className="pixel-title text-sm md:text-lg text-center mb-3">{chap.titre}</h2>

        {/* Zone visuelle selon chapitre */}
        <div className="flex-1 flex items-center justify-center gap-6 flex-wrap mb-4 min-h-[140px]">
          {chap.id === 'carte' && <div className="text-6xl">🗺️</div>}
          {chap.id === 'etude' && <div className="text-6xl">📖</div>}
          {chap.id === 'combat' && (
            <>
              <PixelSprite sprite={miaou} scale={3} />
              <PixelSprite sprite={bouleFeuSprite} scale={3} />
            </>
          )}
          {chap.id === 'compagnon' && <PixelSprite sprite={miaou} scale={4} />}
          {chap.id === 'boutique' && (
            <div className="flex items-end gap-4">
              <PixelSprite sprite={marchandSprite} scale={3} />
              <PixelSprite sprite={piece} scale={3} />
            </div>
          )}
          {chap.id === 'grimoire' && <div className="text-6xl">📖✨</div>}
        </div>

        <DialogueBox
          speaker="Maître Aldric"
          portrait={maitreAldric}
          faceAssetKey="faces.aldric"
          lines={chap.aldric}
          index={lineIdx}
          onNext={next}
        />

        {/* Quiz intégré au chapitre Étude */}
        {chap.id === 'etude' && isLastLine && (
          <div className="mt-4">
            <div className="pixel-card">
              <div className="font-retro text-xl mb-3 text-center">{chap.questionTest.enonce}</div>
              <div className="grid grid-cols-2 gap-2">
                {chap.questionTest.choix.map((c) => {
                  let cls = 'study-choice';
                  if (quizAnswered) {
                    if (c === chap.questionTest.reponse) cls += ' correct';
                    else if (c === quizAnswered.choice) cls += ' wrong';
                  }
                  return (
                    <button
                      key={c}
                      className={cls}
                      disabled={!!quizAnswered}
                      onClick={() => answerQuiz(c)}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
              {quizAnswered && (
                <div className="mt-3 font-retro text-lg">
                  <div className="text-magic-gold">✨ {chap.questionTest.explication}</div>
                  <button className="pixel-btn pixel-btn-gold mt-3" onClick={next}>
                    Continuer ▶
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-3">
          <div className="font-retro text-sm text-magic-cream/60">
            Chapitre {chapIdx + 1} / {chapitres.length}
          </div>
          <button className="pixel-btn pixel-btn-ghost" onClick={() => {
            dispatch({ type: 'COMPLETE_TUTORIAL' });
            onDone('worldmap');
          }}>
            Passer le tuto
          </button>
        </div>
      </div>
    </Background>
  );
}
