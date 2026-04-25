import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from '../components/Background.jsx';
import WorldBackground from '../components/WorldBackground.jsx';
import CombatArena from '../components/CombatArena.jsx';
import HUD from '../components/HUD.jsx';
import PixelSprite from '../sprites/PixelSprite.jsx';
import SmartSprite from '../sprites/SmartSprite.jsx';
import HeartBar from '../components/HeartBar.jsx';
import { WoodPanel, WoodButton } from '../components/WoodPanel.jsx';
import { useGame } from '../store/gameStore.jsx';
import { mage, slime, bouleFeuSprite, eclairSprite, miaou, hulotteSprite, braiseSprite, liliSprite, astraSprite, etincelleSprite } from '../sprites/library.js';
import { MAGE, ENNEMIS, SORTS } from '../balance/config.js';
import { getBonusEquipement } from '../balance/equipement.js';
import { getBonusCompagnon } from '../balance/compagnon-bonus.js';
import BoutiqueModal from '../components/BoutiqueModal.jsx';
import { getBoss, isBossLevel } from '../balance/bosses.js';
import { mondes } from '../data/mondes.js';
import { sounds } from '../audio/soundEngine.js';
import { haptics } from '../input/haptics.js';
import { getCompagnonById } from '../companions/companions.js';
import { useCombatEffects, CombatEffectsLayer, useShakeClass } from '../components/CombatEffects.jsx';

const COMP_SPRITES = {
  miaou, hulotte: hulotteSprite, braise: braiseSprite, lili: liliSprite, astra: astraSprite,
  croquette: braiseSprite,
  pixel: liliSprite,
  saphir: miaou,
  eclipse: hulotteSprite,
  stella: astraSprite,
  sylphe: liliSprite,
  phoenix: braiseSprite,
};

// ═══════════════════════════════════════════════════════════════
// Vue top-down JRPG : mage en bas, ennemi en haut
// ═══════════════════════════════════════════════════════════════
export default function CombatScreen({ navigate, onPause, payload }) {
  const { state, dispatch } = useGame();
  const monde = state.progression.mondeCourant;
  const niveau = state.progression.niveauCourant;
  const totalNiveaux = (mondes.find((m) => m.id === monde)?.niveaux) ?? 3;
  const isBoss = isBossLevel(monde, niveau, totalNiveaux);
  const boss = isBoss ? getBoss(monde) : null;

  const pvMaxBase = MAGE.pvParMonde[monde - 1] ?? 5;
  const pvMaxEnnemi = boss ? boss.pv : (ENNEMIS.pvParMonde[monde - 1] ?? 3);
  const dmgEnnemi = boss ? boss.dmg : (ENNEMIS.dmgParMonde[monde - 1] ?? 1);
  const compagnon = getCompagnonById(state.compagnons.actif);
  const bonusEquip = useMemo(() => getBonusEquipement(state.inventaire.equipementEquipe), [state.inventaire.equipementEquipe]);
  const bonusComp = useMemo(() => getBonusCompagnon(state.compagnons.actif), [state.compagnons.actif]);
  // Cumul équipement + passif compagnon
  const bonus = useMemo(() => ({
    attaqueBase: bonusEquip.attaqueBase,
    dmgFeu: bonusEquip.dmgFeu + bonusComp.dmgFeu + bonusComp.dmgSortsBonus,
    dmgFoudre: bonusEquip.dmgFoudre + bonusComp.dmgFoudre + bonusComp.dmgSortsBonus,
    soinBonus: bonusEquip.soinBonus + bonusComp.soinBonus,
    boucliersDoubles: bonusEquip.boucliersDoubles,
    esquive: bonusEquip.esquive + bonusComp.esquive,
    pvMaxBonus: bonusEquip.pvMaxBonus,
    piecesBonus: bonusEquip.piecesBonus,
  }), [bonusEquip, bonusComp]);
  const [tourNumber, setTourNumber] = useState(1);
  const [bossPhase, setBossPhase] = useState(1);

  const initialCharges = (() => {
    const base = payload?.charges ?? { feu: 0, foudre: 0, soin: 0, bouclier: 0, vent: 0 };
    // Bonus charges gratuites de feu pour Stella (passif +2)
    const cgFeu = bonusComp.chargesGratuitesFeu || 0;
    return { ...base, feu: (base.feu || 0) + cgFeu };
  })();
  // Lili offre +1 PV max (passif) ; robe_mage offre +2 PV max (équipement)
  const pvMaxMage = pvMaxBase + (bonusComp.pvBonus || 0) + (bonus.pvMaxBonus || 0);

  const [pvMage, setPvMage] = useState(pvMaxMage);
  const [pvEnnemi, setPvEnnemi] = useState(pvMaxEnnemi);
  const [phoenixUsed, setPhoenixUsed] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [charges, setCharges] = useState(initialCharges);
  const [bouclierActif, setBouclierActif] = useState(0);
  const [compagnonUtilise, setCompagnonUtilise] = useState(false);
  const [menu, setMenu] = useState('main');
  const [log, setLog] = useState([
    boss ? `👑 ${boss.nom} apparaît ! ${boss.dialogueIntro}` : `Un ${monde === 1 ? 'Slime rigolo' : 'monstre'} apparaît !`,
  ]);
  const [tour, setTour] = useState('mage');
  const [result, setResult] = useState(null);
  const [projectile, setProjectile] = useState(null);
  const [frame, setFrame] = useState(0);
  const [mageAction, setMageAction] = useState('idle'); // idle | attack | hurt | cast
  const [enemyAction, setEnemyAction] = useState('idle'); // idle | attack | hurt

  const effects = useCombatEffects();
  const shakeEnnemiCls = useShakeClass(effects.shake);
  const [shakeMage, setShakeMage] = useState(0);
  const shakeMageCls = useShakeClass(shakeMage);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 500);
    return () => clearInterval(id);
  }, []);

  const ajoutLog = (msg) => setLog((prev) => [...prev.slice(-3), msg]);

  const hitEnnemi = (dmg) => {
    setPvEnnemi((pv) => Math.max(0, pv - dmg));
    sounds.hit();
    effects.flashHit('red');
    effects.shakeNow();
    effects.showDamage(dmg, 'right', 'damage');
    setEnemyAction('hurt');
    setTimeout(() => setEnemyAction('idle'), 300);
  };

  const hitMage = (dmg, options = {}) => {
    let real = dmg;
    if (bouclierActif > 0 && !options.ignoreBouclier) {
      real = Math.max(0, dmg - 1);
      setBouclierActif(bouclierActif - 1);
    }
    // Eclipse : réduit 1 dmg tous les 2 tours (tours pairs)
    if ((bonusComp.reductionDmgPair || 0) > 0 && tourNumber % 2 === 0) {
      real = Math.max(0, real - bonusComp.reductionDmgPair);
    }
    // Cape de dragon (équipement) : -1 dmg subi à chaque attaque
    if ((bonus.reductionDmg || 0) > 0) {
      real = Math.max(0, real - bonus.reductionDmg);
    }
    setPvMage((pv) => {
      const next = Math.max(0, pv - real);
      // Phoenix renaissance : si KO et compagnon Phoenix non encore utilisé
      if (next === 0 && bonusComp.renaissance && !phoenixUsed) {
        setTimeout(() => {
          setPhoenixUsed(true);
          setPvMage(5);
          ajoutLog('🔥 Phoenix renaît de ses cendres ! Tu reviens avec 5 PV.');
          effects.flashHit('green');
          effects.burstParticles('left', '#fbbf24', 14);
        }, 200);
      }
      return next;
    });
    sounds.hit();
    haptics.spell();
    if (real > 0) {
      effects.flashHit('red');
      setShakeMage((s) => s + 1);
      effects.showDamage(real, 'left', 'damage');
      setMageAction('hurt');
      setTimeout(() => setMageAction('idle'), 300);
    } else {
      ajoutLog('Bouclier absorbe !');
    }
  };

  const heal = (amount) => {
    setPvMage((pv) => Math.min(pvMaxMage, pv + amount));
    sounds.heal();
    effects.flashHit('green');
    effects.showDamage(amount, 'left', 'heal');
    effects.burstParticles('left', '#22c55e', 8);
  };

  // Esquive éventuelle (équipement bottes_vent : +10%)
  const tenterEsquive = () => Math.random() < (bonus.esquive || 0);

  useEffect(() => {
    if (pvEnnemi <= 0 && !result) {
      setResult('victoire');
      sounds.victory();
      haptics.victory();
    } else if (pvMage <= 0 && !result) {
      setResult('defaite');
      sounds.gameOver();
      haptics.gameOver();
    }
  }, [pvEnnemi, pvMage]);

  useEffect(() => {
    if (result === 'victoire') {
      setTimeout(() => navigate('reward', { bonneReponses: payload?.bonneReponses, total: payload?.total }), 1400);
    }
    if (result === 'defaite') {
      setTimeout(() => navigate('gameover'), 1700);
    }
  }, [result]);

  // Braise : +1 dégât auto sur l'ennemi à chaque tour mage → ennemi
  useEffect(() => {
    if (tour === 'ennemi' && !result && (bonusComp.dmgAutoParTour || 0) > 0) {
      const dmgAuto = bonusComp.dmgAutoParTour;
      setTimeout(() => {
        hitEnnemi(dmgAuto);
        ajoutLog(`🐲 ${compagnon?.nom ?? 'Compagnon'} attaque pour ${dmgAuto} dmg !`);
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour, result]);

  // Tour ennemi — l'ennemi s'élance vers le mage
  useEffect(() => {
    if (tour === 'ennemi' && !result) {
      const t = setTimeout(() => {
        setEnemyAction('attack');
        setTimeout(() => {
          // ═══ Mécaniques boss spéciales ═══
          let dmgFinal = dmgEnnemi;
          let bossActedSpecial = false;

          if (boss) {
            // Phase 2 du boss final : rage quand <50% PV
            if (boss.mecanique === 'deux-phases' && pvEnnemi < pvMaxEnnemi / 2 && bossPhase === 1) {
              setBossPhase(2);
              ajoutLog(`🔥 ${boss.nom} entre en rage ! (+1 dégât)`);
              dmgFinal += 1;
              bossActedSpecial = true;
            } else if (boss.mecanique === 'deux-phases' && bossPhase === 2) {
              dmgFinal += 1;
            }
            // Hulotte M3 : 1 tour sur 3 brouille une charge (au lieu d'attaque)
            else if (boss.mecanique === 'oeil-percant' && tourNumber % 3 === 0) {
              const chargeTypes = Object.entries(charges).filter(([, v]) => v > 0);
              if (chargeTypes.length > 0) {
                const [randKey] = chargeTypes[Math.floor(Math.random() * chargeTypes.length)];
                setCharges((c) => ({ ...c, [randKey]: Math.max(0, (c[randKey] || 0) - 1) }));
                ajoutLog(`👁️ ${boss.nom} utilise Œil perçant ! -1 charge ${randKey}.`);
                bossActedSpecial = true;
              }
            }
            // Braise M5 : 1 tour sur 2 souffle de feu (+1 dmg)
            else if (boss.mecanique === 'souffle-feu' && tourNumber % 2 === 0) {
              dmgFinal += 1;
              ajoutLog(`🔥 ${boss.nom} crache du feu ! (+1 dégât)`);
            }
            // Lili M7 : tous les 3 tours se soigne
            else if (boss.mecanique === 'auto-heal' && tourNumber % 3 === 0) {
              setPvEnnemi((pv) => Math.min(pvMaxEnnemi, pv + 2));
              ajoutLog(`✨ ${boss.nom} se soigne de 2 PV !`);
              bossActedSpecial = true;
            }
            // Astra M9 : invulnérable 1 tour sur 3 (flag visuel seulement, géré dans hitEnnemi)
            else if (boss.mecanique === 'aura-arc-en-ciel' && tourNumber % 3 === 0) {
              ajoutLog(`🌈 ${boss.nom} est enveloppé d'une aura protectrice !`);
            }
            // Confusion cosmique M11
            else if (boss.mecanique === 'confusion-cosmique' && tourNumber % 3 === 0) {
              dmgFinal += 1;
              ajoutLog(`🌌 Vision cosmique ! (+1 dégât mystique)`);
            }
          }

          if (!bossActedSpecial) {
            if (tenterEsquive()) {
              ajoutLog('💨 Esquive grâce aux bottes du vent !');
              effects.burstParticles('left', '#a7f3d0', 6);
            } else {
              hitMage(dmgFinal);
              ajoutLog(`L'ennemi attaque (${dmgFinal} dégâts).`);
            }
          }
          setEnemyAction('idle');
          setTourNumber((n) => n + 1);
          setTimeout(() => setTour('mage'), 600);
        }, 400);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [tour, result]);

  // Lance un projectile du mage vers l'ennemi (top-down : de bas vers haut)
  // info : soit un sprite codé {frames, palette}, soit { assetKey, fallback }
  const launchProjectile = (info, colorParticle, onHit) => {
    const isWrapped = info && (info.assetKey || 'fallback' in info);
    const norm = isWrapped ? info : { fallback: info };
    setProjectile({ ...norm });
    effects.burstParticles('left', colorParticle, 6);
    setTimeout(() => {
      setProjectile(null);
      effects.burstParticles('right', colorParticle, 10);
      onHit();
    }, 500);
  };

  if (result) {
    return (
      <CombatArena monde={monde}>
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="pixel-title text-2xl md:text-4xl"
          >
            {result === 'victoire' ? '🏆 VICTOIRE !' : '💔 K.O.'}
          </motion.div>
        </div>
      </CombatArena>
    );
  }

  const attaque = () => {
    sounds.hit();
    const dmg = 1 + (bonus.attaqueBase || 0);
    ajoutLog(`Tu attaques ! (${dmg} dégât${dmg > 1 ? 's' : ''})`);
    setMageAction('attack');
    setTimeout(() => setMageAction('idle'), 400);
    launchProjectile({ assetKey: 'effects.shuriken', fallback: etincelleSprite }, '#fef3c7', () => hitEnnemi(dmg));
    setTimeout(() => setTour('ennemi'), 800);
    setMenu('main');
  };

  const lancerSort = (clef) => {
    const sort = SORTS[clef];
    if (!sort) return;
    // Cas spécial arc-en-ciel : consomme N charges de N'IMPORTE quel type
    if (sort.charge === 'mixte') {
      const total = Object.values(charges).reduce((a, b) => a + b, 0);
      if (total < sort.cout) { sounds.cancel(); ajoutLog(`Pas assez de charges (${total}/${sort.cout}) !`); return; }
      // Consomme greedy : feu d'abord, puis foudre, etc.
      const ordre = ['feu', 'foudre', 'soin', 'bouclier', 'vent'];
      let restant = sort.cout;
      const next = { ...charges };
      for (const k of ordre) {
        if (restant === 0) break;
        const dispo = next[k] || 0;
        const prend = Math.min(dispo, restant);
        next[k] = dispo - prend;
        restant -= prend;
      }
      setCharges(next);
    } else {
      const coutOk = charges[sort.charge] >= sort.cout || sort.cout === 0;
      if (!coutOk) { sounds.cancel(); ajoutLog(`Pas assez de charges ${sort.charge} !`); return; }
      setCharges((c) => ({ ...c, [sort.charge]: Math.max(0, (c[sort.charge] || 0) - sort.cout) }));
    }
    sounds.spell();
    haptics.spell();
    setMageAction('cast');
    setTimeout(() => setMageAction('idle'), 500);

    if (sort.type === 'soin') {
      // Le soin scale à 100 % des dégâts adverses (planché sur la valeur de base
      // du sort si l'ennemi tape vraiment peu sur les premiers mondes).
      // Pour le sort soin_zone (cout 2), on utilise sort.base directement.
      const soinScale = sort.cout >= 2
        ? sort.base
        : Math.max(sort.base, dmgEnnemi);
      const soinTotal = soinScale + (bonus.soinBonus || 0);
      heal(soinTotal);
      ajoutLog(`💚 Soin : +${soinTotal} PV.`);
    } else if (sort.type === 'defense') {
      // base définit la durée pour les sorts de bouclier (1 normal, 3 pour bouclier_max)
      let dureeBouclier = sort.base || 1;
      if (bonus.boucliersDoubles) dureeBouclier *= 2;
      setBouclierActif((b) => Math.max(b, dureeBouclier));
      effects.burstParticles('left', '#60a5fa', 8);
      sounds.shield();
      ajoutLog(`Bouclier dressé (${dureeBouclier} absorption${dureeBouclier > 1 ? 's' : ''}) !`);
    } else {
      const projKey = clef === 'foudre' ? 'effects.energyball'
                    : clef === 'glace' ? 'effects.icespike'
                    : 'effects.fireball';
      const projFallback = clef === 'foudre' ? eclairSprite : bouleFeuSprite;
      const color = clef === 'foudre' ? '#fcd34d' : '#f59e0b';
      if (clef === 'foudre') effects.strikeLightning();
      // Bonus dégâts via équipement
      let dmgFinal = sort.base;
      if (sort.charge === 'feu') dmgFinal += (bonus.dmgFeu || 0);
      if (sort.charge === 'foudre') dmgFinal += (bonus.dmgFoudre || 0);
      if (dmgFinal >= 3) effects.zoomPunch();
      launchProjectile({ assetKey: projKey, fallback: projFallback }, color, () => hitEnnemi(dmgFinal));
      ajoutLog(`${sort.nom} inflige ${dmgFinal} dégâts !`);
    }
    setTimeout(() => setTour('ennemi'), 800);
    setMenu('main');
  };

  const utiliserCompagnon = () => {
    if (compagnonUtilise) { sounds.cancel(); ajoutLog(`${compagnon.nom} est fatigué.`); return; }
    setCompagnonUtilise(true);
    sounds.spell();
    const dmg = compagnon.actif?.dmg ?? 2;
    if (dmg > 0) {
      launchProjectile({ fallback: etincelleSprite }, '#ec4899', () => hitEnnemi(dmg));
      ajoutLog(`${compagnon.nom} : ${compagnon.actif.nom} ! (${dmg} dégâts)`);
    } else if (compagnon.actif?.effet === 'soin5') {
      heal(5);
      ajoutLog(`${compagnon.nom} te soigne !`);
    } else {
      ajoutLog(`${compagnon.nom} utilise ${compagnon.actif.nom}.`);
    }
    setTimeout(() => setTour('ennemi'), 800);
    setMenu('main');
  };

  const defendre = () => {
    sounds.shield();
    setBouclierActif((b) => Math.max(b, 1));
    effects.burstParticles('left', '#60a5fa', 6);
    ajoutLog('Tu te mets en garde.');
    setTour('ennemi');
    setMenu('main');
  };

  const fuir = () => {
    sounds.cancel();
    ajoutLog('Tu t\'enfuis...');
    setTimeout(() => navigate('worldmap'), 500);
  };

  return (
    <CombatArena monde={monde}>
      <HUD onPause={onPause} />

      {/* ═══════════ ARÈNE TOP-DOWN ═══════════ */}
      {/* On remonte le bas de l'arène pour laisser bien plus d'espace au-dessus du HUD/menu (sinon
           le mage colle aux boutons d'action et c'est désagréable). */}
      <div className="absolute inset-x-0 top-14 bottom-72 sm:bottom-80 overflow-hidden">
        <CombatEffectsLayer effects={effects} />

        {/* Zone centrale de combat avec zoom punch — espace équilibré entre ennemi et mage */}
        <motion.div
          className="relative w-full h-full flex flex-col items-center justify-between pt-4 pb-12"
          animate={effects.zoom > 0 ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          {/* sub content starts here */}

          {/* Ennemi en haut, face au joueur (down = face caméra par défaut) */}
          <motion.div
            className={`flex flex-col items-center ${shakeEnnemiCls}`}
            animate={enemyAction === 'attack' ? { y: [0, 40, 0] } : enemyAction === 'hurt' ? { x: [0, -8, 8, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <div className={`font-pixel text-xs mb-1 px-2 py-1 border-2 ${boss ? 'bg-magic-red border-yellow-400 text-yellow-200' : 'bg-black/70 border-magic-red text-magic-red'}`}>
              {boss ? `👑 ${boss.nom.toUpperCase()} ${bossPhase === 2 ? '(RAGE)' : ''}` : '👹 Monstre'} · PV {pvEnnemi}/{pvMaxEnnemi}
            </div>
            <div className={`${boss ? 'w-60' : 'w-40'} h-2 bg-black/60 border border-magic-red overflow-hidden mb-2`}>
              <motion.div
                className="h-full"
                animate={{ width: `${(pvEnnemi / pvMaxEnnemi) * 100}%` }}
                transition={{ duration: 0.4 }}
                style={{ background: bossPhase === 2 ? '#fbbf24' : '#ef4444', boxShadow: bossPhase === 2 ? '0 0 8px #fbbf24' : '0 0 6px #ef4444' }}
              />
            </div>
            <div className={`animate-breathe ${boss ? 'drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]' : ''}`}>
              <SmartSprite
                assetKey={boss ? boss.assetKey || `enemies.${monde}` : `enemies.${monde}`}
                variant="walk"
                fallback={slime}
                scale={boss ? 6 : 4}
                frameRate={400}
              />
            </div>
            {/* Ombre au sol */}
            <div className={`${boss ? 'w-20' : 'w-12'} h-2 bg-black/40 rounded-full blur-[2px] -mt-1`} />
          </motion.div>

          {/* Projectile entre mage et ennemi — vole du bas vers le haut */}
          <AnimatePresence>
            {projectile && (
              <motion.div
                key="proj"
                initial={{ y: 140, opacity: 0, scale: 0.5 }}
                animate={{ y: -140, opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 1.6 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2"
                style={{ zIndex: 20 }}
              >
                <SmartSprite assetKey={projectile.assetKey} fallback={projectile.fallback} variant="anim" scale={3} frameRate={80} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mage + compagnon en bas, face à l'ennemi (back = dos au camera) */}
          <motion.div
            className={`flex items-end gap-3 ${shakeMageCls}`}
            animate={
              mageAction === 'attack' ? { y: [0, -50, -30, 0] }
              : mageAction === 'cast' ? { y: [0, -20, 0], scale: [1, 1.1, 1] }
              : mageAction === 'hurt' ? { x: [0, -8, 8, 0] }
              : {}
            }
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="flex flex-col items-center">
              <div className={mageAction === 'idle' ? 'animate-breathe' : ''}>
                {mageAction === 'attack' ? (
                  <SmartSprite assetKey="mageAttack" variant="idle" direction="back" fallback={mage} scale={4} />
                ) : mageAction === 'cast' ? (
                  <SmartSprite assetKey="mageSpecial1" variant="idle" direction="front" fallback={mage} scale={4} />
                ) : (
                  <SmartSprite assetKey="mageIdle" variant="idle" direction="back" fallback={mage} scale={4} />
                )}
              </div>
              <div className="w-12 h-2 bg-black/40 rounded-full blur-[2px] -mt-1" />
            </div>
            {compagnon && (
              <div className="flex flex-col items-center">
                <div className="animate-breathe" style={{ animationDelay: '0.3s' }}>
                  <SmartSprite assetKey={compagnon.id} fallback={COMP_SPRITES[compagnon.id]} scale={4} direction="back" />
                </div>
                <div className="w-10 h-2 bg-black/40 rounded-full blur-[2px] -mt-1" />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════════ HUD INFÉRIEUR (PV cœurs + menu bois) ═══════════ */}
      <div
        className="absolute bottom-0 left-0 right-0 safe-bottom"
        style={{
          background: 'linear-gradient(0deg, rgba(15,4,32,0.98), rgba(26,11,46,0.92))',
          borderTop: '3px double #fbbf24',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.5)',
        }}
      >
        {/* Barre de santé : nom + cœurs sur 1 ligne, charges dessous */}
        <div className="px-2 py-1.5 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-cinzel-r text-magic-gold font-bold shrink-0">
              {state.player.prenom || 'Mage'}
            </span>
            <HeartBar pv={pvMage} max={pvMaxMage} scale={2} />
            {bouclierActif > 0 && (
              <span className="font-pixel text-xs text-magic-blue bg-magic-blue/20 border border-magic-blue px-1">
                🛡️×{bouclierActif}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {Object.entries(charges).map(([k, v]) => (
              <span key={k} className={`charge-chip ${v > 0 ? `charge-chip-${k}` : 'charge-chip-empty'}`}>
                {({feu:'🔥',foudre:'⚡',soin:'💚',bouclier:'🛡️',vent:'🌪️'}[k])}×{v}
              </span>
            ))}
          </div>
        </div>

        {/* Log (compact) */}
        <div className="bg-magic-bg/80 border-t border-magic-accent px-3 py-1 font-retro text-base text-magic-cream h-10 overflow-hidden">
          {log[log.length - 1]}
        </div>

        {/* Menu actions */}
        <div className="bg-magic-bg2/90 border-t-2 border-magic-gold p-2">
          {tour === 'mage' && menu === 'main' && (
            <div className="grid grid-cols-3 gap-1">
              <button className="pixel-btn" onClick={attaque}>⚔️ Attaquer</button>
              <button className="pixel-btn pixel-btn-blue" onClick={() => setMenu('sorts')}>✨ Sorts</button>
              <button className="pixel-btn pixel-btn-pink" onClick={utiliserCompagnon}>🐾 {compagnon?.emoji}</button>
              <button className="pixel-btn pixel-btn-ghost" onClick={defendre}>🛡️ Défendre</button>
              <button className="pixel-btn pixel-btn-ghost" onClick={() => setMenu('sac')}>🎒 Sac</button>
              <button className="pixel-btn pixel-btn-gold" onClick={() => { sounds.select(); setShopOpen(true); }}>🏪 Boutique</button>
              <button className="pixel-btn pixel-btn-red col-span-3" onClick={fuir}>💨 Fuir</button>
            </div>
          )}
          {menu === 'sorts' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
              <SortBtn clef="feu" charges={charges} onClick={lancerSort} />
              <SortBtn clef="foudre" charges={charges} onClick={lancerSort} />
              <SortBtn clef="soin" charges={charges} onClick={lancerSort} />
              <SortBtn clef="bouclier" charges={charges} onClick={lancerSort} />
              <SortBtn clef="vent" charges={charges} onClick={lancerSort} />
              {state.inventaire.sortsAchetes.map((s) => (
                <SortBtn key={s} clef={s} charges={charges} onClick={lancerSort} />
              ))}
              <button className="pixel-btn pixel-btn-ghost col-span-full" onClick={() => setMenu('main')}>← Retour</button>
            </div>
          )}
          {menu === 'sac' && (
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(state.inventaire.potions).map(([id, qty]) => (
                qty > 0 ? (
                  <button
                    key={id}
                    className="pixel-btn pixel-btn-ghost"
                    onClick={() => {
                      let consume = true;
                      let passeTour = true;
                      if (id === 'potion_vie_petite') { heal(3); ajoutLog('Petite potion (+3 PV).'); }
                      else if (id === 'potion_vie_grande') { heal(6); ajoutLog('Grande potion (+6 PV).'); }
                      else if (id === 'potion_super_vie') { heal(10); ajoutLog('Super potion (+10 PV).'); }
                      else if (id === 'parchemin_feu') {
                        setCharges((c) => ({ ...c, feu: (c.feu || 0) + 1 }));
                        ajoutLog('📜 Parchemin de feu : +1 charge 🔥.');
                        passeTour = false;
                      }
                      else if (id === 'parchemin_orage') {
                        setCharges((c) => ({ ...c, foudre: (c.foudre || 0) + 1 }));
                        ajoutLog('📜 Parchemin d\'orage : +1 charge ⚡.');
                        passeTour = false;
                      }
                      else if (id === 'parchemin_soin') {
                        setCharges((c) => ({ ...c, soin: (c.soin || 0) + 1 }));
                        ajoutLog('📜 Parchemin de soin : +1 charge 💚.');
                        passeTour = false;
                      }
                      else if (id === 'parchemin_bouclier') {
                        setCharges((c) => ({ ...c, bouclier: (c.bouclier || 0) + 1 }));
                        ajoutLog('📜 Parchemin de bouclier : +1 charge 🛡️.');
                        passeTour = false;
                      }
                      else if (id === 'elixir_mana') {
                        setCharges((c) => ({
                          feu:      (c.feu || 0) + 1,
                          foudre:   (c.foudre || 0) + 1,
                          soin:     (c.soin || 0) + 1,
                          bouclier: (c.bouclier || 0) + 1,
                          vent:     (c.vent || 0) + 1,
                        }));
                        ajoutLog('💧 Élixir de mana : +1 de chaque charge !');
                        passeTour = false;
                      }
                      else if (id === 'baie_courage') {
                        // Pas de système de buff combat-local pour l'instant ; appliqué comme parchemin feu pour ne pas être inutile
                        setCharges((c) => ({ ...c, feu: (c.feu || 0) + 1 }));
                        ajoutLog('🍒 Baie de courage : +1 charge 🔥 d\'élan !');
                        passeTour = false;
                      }
                      else if (id === 'friandise') {
                        for (let i = 0; i < 3; i++) {
                          dispatch({ type: 'INC_AFFINITE', id: state.compagnons.actif });
                        }
                        ajoutLog(`🍬 +3 affinité avec ${compagnon?.nom ?? 'compagnon'} !`);
                        passeTour = false;
                      }
                      else if (id === 'parchemin_vent') {
                        setCharges((c) => ({ ...c, vent: (c.vent || 0) + 1 }));
                        ajoutLog('📜 Parchemin de vent : +1 charge 🌪️.');
                        passeTour = false;
                      }
                      else if (id === 'parchemin_meteore') {
                        hitEnnemi(6);
                        ajoutLog('☄️ Parchemin de météore : 6 dégâts !');
                      }
                      else if (id === 'eau_benite') {
                        const dmg = boss ? 5 : 3;
                        hitEnnemi(dmg);
                        ajoutLog(`💦 Eau bénite : ${dmg} dégâts ${boss ? 'au boss' : ''} !`);
                      }
                      else if (id === 'potion_supreme') {
                        heal(pvMaxMage);
                        ajoutLog('🏺 Potion suprême : PV restaurés au max !');
                      }
                      else if (id === 'larme_dragon') {
                        setBouclierActif(3);
                        ajoutLog('💧 Larme de dragon : bouclier 3 absorptions !');
                        passeTour = false;
                      }
                      else if (id === 'boisson_geant') {
                        setPvMage((p) => p + 5);
                        ajoutLog('🥤 Boisson du géant : +5 PV temporaires !');
                        passeTour = false;
                      }
                      else if (id === 'fil_arianne') {
                        ajoutLog('🧶 Fil d\'Ariane utilisé : tu fuies sans pénalité.');
                        setTimeout(() => navigate('worldmap'), 600);
                      }
                      else if (id === 'potion_chance') {
                        dispatch({ type: 'SET_BUFF', key: 'chanceX2', value: true });
                        ajoutLog('🍀 Chance ×2 ! Pièces doublées sur ce combat.');
                        passeTour = false;
                      }
                      else if (id === 'os_chance') {
                        dispatch({ type: 'SET_BUFF', key: 'chanceX2', value: true });
                        ajoutLog('🦴 Os porte-bonheur activé : pièces ×1.5 ce combat.');
                        passeTour = false;
                      }
                      else if (id === 'cristal_xp') {
                        dispatch({ type: 'ADD_XP', amount: 50 });
                        ajoutLog('🔷 Cristal d\'XP : +50 XP !');
                        passeTour = false;
                      }
                      else if (id === 'graine_vie') {
                        ajoutLog('🌱 Graine de vie : effet permanent (PV max +1).');
                        passeTour = false;
                      }
                      else if (id === 'potion_etude') {
                        const cur = state.buffsActifs?.bonusQuestionsEtude ?? 0;
                        dispatch({ type: 'SET_BUFF', key: 'bonusQuestionsEtude', value: cur + 2 });
                        ajoutLog('📖 +2 questions à la prochaine étude !');
                        passeTour = false;
                      }
                      else { ajoutLog(`Effet de ${id} indisponible.`); consume = false; }
                      if (consume) dispatch({ type: 'USE_POTION', id });
                      if (passeTour) setTour('ennemi');
                      setMenu('main');
                    }}
                  >
                    {libellePotion(id)} ×{qty}
                  </button>
                ) : null
              ))}
              <button className="pixel-btn pixel-btn-ghost col-span-full" onClick={() => setMenu('main')}>← Retour</button>
            </div>
          )}
        </div>
      </div>

      {/* Boutique express en modal — l'état du combat est préservé */}
      {shopOpen && <BoutiqueModal onClose={() => setShopOpen(false)} />}
    </CombatArena>
  );
}

function libellePotion(id) {
  switch (id) {
    case 'potion_vie_petite':  return '🧪 Petite potion';
    case 'potion_vie_grande':  return '🧴 Grande potion';
    case 'potion_super_vie':   return '⚗️ Super potion';
    case 'potion_supreme':     return '🏺 P. suprême';
    case 'parchemin_feu':      return '📜 Parch. 🔥';
    case 'parchemin_orage':    return '📜 Parch. ⚡';
    case 'parchemin_soin':     return '📜 Parch. 💚';
    case 'parchemin_bouclier': return '📜 Parch. 🛡️';
    case 'parchemin_vent':     return '📜 Parch. 🌪️';
    case 'parchemin_meteore':  return '☄️ Météore';
    case 'eau_benite':         return '💦 Eau bénite';
    case 'elixir_mana':        return '💧 Élixir mana';
    case 'baie_courage':       return '🍒 Baie courage';
    case 'potion_chance':      return '🍀 Chance ×2';
    case 'os_chance':          return '🦴 Os chance';
    case 'potion_etude':       return '📖 +2 quest.';
    case 'tisane_savant':      return '🍵 Tisane';
    case 'friandise':          return '🍬 Friandise';
    case 'miel_dore':          return '🍯 Miel doré';
    case 'potion_force_x2':    return '💪 Force ×2';
    case 'encens_calme':       return '🕯️ Encens';
    case 'fleur_serenite':     return '🌸 Fleur';
    case 'graine_vie':         return '🌱 Graine vie';
    case 'larme_dragon':       return '💧 Larme dragon';
    case 'potion_velocite':    return '⚡ Vélocité';
    case 'cristal_xp':         return '🔷 Cristal XP';
    case 'boisson_geant':      return '🥤 Boisson géant';
    case 'fil_arianne':        return '🧶 Fil Ariane';
    default: return id;
  }
}

const SPELL_ASSET_KEY = {
  feu: 'ui.spells.feu', foudre: 'ui.spells.foudre',
  soin: 'ui.spells.soin', bouclier: 'ui.spells.bouclier', vent: 'ui.spells.vent',
  meteore: 'ui.spells.meteore', miroir: 'ui.spells.miroir',
  glace: 'ui.spells.vent', papillons: 'ui.spells.vent',
};
const SPELL_ASSET_OFF = {
  feu: 'ui.spells.feuOff', foudre: 'ui.spells.foudreOff',
  soin: 'ui.spells.soinOff', bouclier: 'ui.spells.bouclierOff', vent: 'ui.spells.ventOff',
};

function SortBtn({ clef, charges, onClick }) {
  const sort = SORTS[clef];
  if (!sort) return null;
  const ok = (charges[sort.charge] || 0) >= sort.cout || sort.cout === 0;
  const iconKey = ok ? (SPELL_ASSET_KEY[clef] || 'ui.spells.alchemy') : (SPELL_ASSET_OFF[clef] || SPELL_ASSET_KEY[clef]);
  return (
    <button
      onClick={() => onClick(clef)}
      disabled={!ok}
      className={`pixel-btn flex items-center gap-2 ${ok ? 'pixel-btn-blue' : 'pixel-btn-ghost opacity-50 cursor-not-allowed'}`}
    >
      <SmartSprite assetKey={iconKey} scale={1.5} />
      <span className="flex-1 text-left">{sort.nom.replace(/^[^\s]+ /, '')}</span>
      {sort.cout > 0 && <span className="text-xs">({sort.cout})</span>}
    </button>
  );
}
