import Background from '../components/Background.jsx';
import HUD from '../components/HUD.jsx';
import { useGame } from '../store/gameStore.jsx';
import { useState } from 'react';
import { sounds } from '../audio/soundEngine.js';
import { BADGES } from '../balance/badges.js';

function Stub({ title, emoji, children, navigate, onPause, variant = 'magic' }) {
  return (
    <Background variant={variant}>
      <HUD onPause={onPause} />
      <div className="absolute inset-0 pt-14 pb-4 px-4 flex flex-col items-center">
        <div className="flex items-center gap-2 w-full max-w-3xl mb-4">
          <h2 className="pixel-title text-lg md:text-2xl flex-1">{emoji} {title}</h2>
          <button className="pixel-btn pixel-btn-ghost" onClick={() => navigate('worldmap')}>← Carte</button>
        </div>
        <div className="w-full max-w-3xl flex-1 overflow-y-auto">{children}</div>
      </div>
    </Background>
  );
}

export function GrimoireScreen({ navigate, onPause }) {
  const { state } = useGame();
  const fiches = state.grimoire.fichesDebloquees;
  const stats = state.historiqueQuestions.statistiques;
  return (
    <Stub title="Grimoire" emoji="📖" navigate={navigate} onPause={onPause}>
      <div className="pixel-card mb-3">
        <div className="font-pixel text-xs text-magic-gold mb-2">Progression globale</div>
        <div className="font-retro text-lg">
          {stats.total === 0 ? 'Aucune question encore.' : `${stats.correctes}/${stats.total} bonnes (${Math.round(stats.correctes / Math.max(1, stats.total) * 100)}%)`}
        </div>
      </div>
      <div className="pixel-card mb-3">
        <div className="font-pixel text-xs text-magic-gold mb-2">Fiches débloquées</div>
        {fiches.length === 0 ? (
          <div className="font-retro text-magic-cream/60">Aucune fiche encore. Réussis des niveaux pour enrichir ton grimoire !</div>
        ) : (
          <ul className="font-retro text-magic-cream">
            {fiches.map((f) => <li key={f}>• {f}</li>)}
          </ul>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        <button className="pixel-btn" onClick={() => navigate('bestiaire')}>📚 Bestiaire</button>
        <button className="pixel-btn" onClick={() => navigate('badges')}>🏆 Badges</button>
        <button className="pixel-btn" onClick={() => navigate('arene')}>🏛️ Arène</button>
      </div>
    </Stub>
  );
}

export function BestiaireScreen({ navigate, onPause }) {
  const { state } = useGame();
  const cartes = state.bestiaire.cartesCollectees;
  return (
    <Stub title="Bestiaire" emoji="📚" navigate={navigate} onPause={onPause}>
      <div className="pixel-card">
        <div className="font-retro text-magic-cream">
          {cartes.length === 0 ? 'Aucune carte encore. Bats des ennemis pour commencer ta collection !' : `${cartes.length}/25 cartes`}
        </div>
      </div>
    </Stub>
  );
}

export function BadgesScreen({ navigate, onPause }) {
  const { state } = useGame();
  const debloques = new Set(state.badges?.debloques || []);
  const total = BADGES.length;
  const obtenus = BADGES.filter((b) => debloques.has(b.id)).length;
  return (
    <Stub title="Badges" emoji="🏆" navigate={navigate} onPause={onPause}>
      <div className="pixel-card mb-3 text-center">
        <div className="font-pixel text-xs text-magic-gold mb-1">Progression</div>
        <div className="font-retro text-2xl text-magic-cream">
          <span className="text-magic-gold font-bold">{obtenus}</span> / {total} trophées
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {BADGES.map((b) => {
          const debloque = debloques.has(b.id);
          return (
            <div
              key={b.id}
              className={`pixel-card text-center ${debloque ? '' : 'opacity-40 grayscale'}`}
              title={b.desc}
            >
              <div className="text-3xl mb-1">{debloque ? b.emoji : '🔒'}</div>
              <div className="font-pixel text-[10px] text-magic-gold leading-tight mb-1">{b.nom}</div>
              <div className="font-retro text-xs text-magic-cream/70 leading-tight">{b.desc}</div>
            </div>
          );
        })}
      </div>
    </Stub>
  );
}

export function AreneScreen({ navigate, onPause }) {
  const { state } = useGame();
  const ok = state.progression.bossFinalVaincu;
  return (
    <Stub title="Arène des Champions" emoji="🏛️" navigate={navigate} onPause={onPause}>
      <div className="pixel-card text-center">
        {ok ? (
          <>
            <div className="font-retro text-xl mb-2">Meilleur palier : {state.arene.meilleurPalier}</div>
            <div className="font-retro text-magic-cream/80">Combats joués : {state.arene.combatsJoues}</div>
            <button className="pixel-btn pixel-btn-gold mt-3">▶ Démarrer un combat</button>
          </>
        ) : (
          <div className="font-retro text-xl text-magic-cream/70">
            🔒 Débloquée après avoir vaincu le boss du Château Final.
          </div>
        )}
      </div>
    </Stub>
  );
}

export function TourDeMageScreen({ navigate, onPause }) {
  const { state } = useGame();
  return (
    <Stub title="Ma Tour" emoji="🏠" navigate={navigate} onPause={onPause}>
      <div className="pixel-card">
        <div className="font-retro text-xl mb-2">Bienvenue chez toi, {state.player.prenom || 'jeune mage'} !</div>
        <div className="font-retro text-magic-cream/80">
          Papier peint : {state.tourDeMage.papierPeint}. Objets placés : {state.tourDeMage.objetsPlaces.length}.
        </div>
        <div className="font-retro text-sm text-magic-cream/60 mt-3">
          (La personnalisation sera étendue dans les prochaines versions. Tes objets achetés en boutique apparaîtront ici comme décoration.)
        </div>
      </div>
    </Stub>
  );
}

export function ModeParentScreen({ navigate }) {
  const { state } = useGame();
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const codeParent = state.parametres.codeParent;

  return (
    <Background variant="magic">
      <div className="absolute inset-0 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 max-w-3xl mx-auto mb-4">
          <h2 className="pixel-title text-lg md:text-2xl flex-1">🔒 Mode Parent</h2>
          <button className="pixel-btn pixel-btn-ghost" onClick={() => navigate('home')}>← Retour</button>
        </div>

        {!unlocked ? (
          <div className="pixel-card max-w-md mx-auto">
            <div className="font-retro text-lg mb-2">
              {codeParent ? 'Entre ton PIN à 4 chiffres' : 'Choisis un PIN à 4 chiffres'}
            </div>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full font-retro text-2xl px-3 py-2 bg-magic-bg2 text-magic-cream border-2 border-magic-accent tracking-widest text-center"
              placeholder="****"
            />
            <button
              className="pixel-btn pixel-btn-gold w-full mt-3"
              onClick={() => {
                if (!codeParent && pin.length === 4) {
                  state.parametres.codeParent = pin;
                  setUnlocked(true);
                  sounds.confirm();
                } else if (codeParent === pin) {
                  setUnlocked(true);
                  sounds.confirm();
                } else {
                  sounds.cancel();
                }
              }}
              disabled={pin.length !== 4}
            >
              {codeParent ? 'Entrer' : 'Définir'}
            </button>
          </div>
        ) : (
          <Dashboard state={state} />
        )}
      </div>
    </Background>
  );
}

function Dashboard({ state }) {
  const s = state.historiqueQuestions.statistiques;
  const ratio = s.total === 0 ? 0 : Math.round(s.correctes / s.total * 100);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
      <div className="pixel-card">
        <div className="font-pixel text-xs text-magic-gold mb-1">Temps de jeu</div>
        <div className="font-retro text-xl">{Math.round(state.totalPlayTime / 60000)} min</div>
      </div>
      <div className="pixel-card">
        <div className="font-pixel text-xs text-magic-gold mb-1">Questions</div>
        <div className="font-retro text-xl">{s.correctes}/{s.total} correctes ({ratio}%)</div>
      </div>
      <div className="pixel-card">
        <div className="font-pixel text-xs text-magic-gold mb-1">Progression</div>
        <div className="font-retro">
          Monde {state.progression.mondeCourant}, niveau {state.progression.niveauCourant}
        </div>
        <div className="font-retro text-sm text-magic-cream/60">
          Mondes débloqués : {state.progression.mondesDeverrouilles.length}
        </div>
      </div>
      <div className="pixel-card">
        <div className="font-pixel text-xs text-magic-gold mb-1">Économie</div>
        <div className="font-retro">🪙 {state.player.piecesOr} · XP {state.player.xp}</div>
      </div>
      <div className="pixel-card">
        <div className="font-pixel text-xs text-magic-gold mb-1">Compagnons</div>
        <div className="font-retro">{state.compagnons.debloques.length} débloqués · actif : {state.compagnons.actif}</div>
      </div>
      <div className="pixel-card">
        <div className="font-pixel text-xs text-magic-gold mb-1">Badges</div>
        <div className="font-retro">{state.badges.debloques.length} obtenus</div>
      </div>
    </div>
  );
}
