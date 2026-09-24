'use client';

import { Heart, Minus, Plus, Shield, Sword, Wind, X, Zap } from 'lucide-react';
import { ATTRIBUTES, deriveHero, BASE_ATTRIBUTE, ATTRIBUTE_POINTS } from './combat.mjs';
import styles from './CharacterSheet.module.css';

const PRESETS = [
  { name: 'Válečník', Icon: Sword, attributes: { strength: 9, speed: 5, vitality: 7, defense: 5 } },
  { name: 'Šermíř', Icon: Zap, attributes: { strength: 5, speed: 10, vitality: 6, defense: 5 } },
  { name: 'Strážce', Icon: Shield, attributes: { strength: 6, speed: 5, vitality: 7, defense: 8 } },
];

const DETAILS = {
  strength: { Icon: Sword, name: 'Síla', accusative: 'sílu' },
  speed: { Icon: Wind, name: 'Obratnost', accusative: 'obratnost' },
  vitality: { Icon: Heart, name: 'Odolnost', accusative: 'odolnost' },
  defense: { Icon: Shield, name: 'Obrana', accusative: 'obranu' },
};

export default function CharacterSheet({ attributes, onChange, readOnly = false, returnLabel = 'ZPĚT DO SOUBOJE', onClose }) {
  const hero = deriveHero(attributes);
  const spentPoints = ATTRIBUTES.reduce((sum, { key }) => sum + attributes[key] - BASE_ATTRIBUTE, 0);
  const remainingPoints = Math.max(0, ATTRIBUTE_POINTS - spentPoints);
  const benefits = {
    strength: `Meč ${hero.attackDamage} · těžký úder ${hero.powerDamage}`,
    speed: `Úhyb ${hero.dodgeChance} % · iniciativa ${hero.initiative}`,
    vitality: `${hero.maxHealth} životů · zbroj ${hero.armor}`,
    defense: `Automatický blok ${hero.blockChance} % · zachytí ${hero.guardPercent} % zásahu`,
  };

  function adjust(key, direction) {
    if (readOnly) return;
    const value = attributes[key] + direction;
    if (value < BASE_ATTRIBUTE || value > BASE_ATTRIBUTE + ATTRIBUTE_POINTS) return;
    if (direction > 0 && remainingPoints === 0) return;
    onChange({ ...attributes, [key]: value });
  }

  return (
    <div className={styles.sheet}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>LES STÍNŮ · HRDINA</p>
        <h2 id="character-title">Tvá postava</h2>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Zavřít postavu">
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      <p className={styles.intro}>
        {readOnly ? 'Atributy lze měnit při tvorbě nové postavy.' : `Rozděl ${ATTRIBUTE_POINTS} bodů nebo vyber svůj styl.`}
      </p>

      <div className={styles.presets} aria-label="Předvolby postavy">
        {PRESETS.map(({ name, Icon, attributes: preset }) => {
          const selected = ATTRIBUTES.every(({ key }) => attributes[key] === preset[key]);
          return (
            <button
              key={name}
              type="button"
              className={`${styles.preset} ${selected ? styles.selected : ''}`}
              aria-pressed={selected}
              disabled={readOnly}
              onClick={() => onChange({ ...preset })}
            >
              <Icon size={14} aria-hidden="true" />
              <span>{name}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.points}>
        <span>VOLNÉ BODY</span>
        <output aria-live="polite" aria-atomic="true" aria-label="Zbývající body">
          {remainingPoints}<span> / {ATTRIBUTE_POINTS}</span>
        </output>
      </div>

      <div className={styles.attributes}>
        {ATTRIBUTES.map(({ key }) => {
          const { Icon, name, accusative } = DETAILS[key];
          return (
            <div className={styles.attribute} key={key} role="group" aria-labelledby={`attribute-${key}`}>
              <div className={styles.attributeTop}>
                <span className={styles.attributeName} id={`attribute-${key}`}>
                  <Icon size={15} aria-hidden="true" />
                  {name}
                </span>
                <div className={styles.stepper}>
                  <button
                    type="button"
                    aria-label={`Snížit ${accusative}`}
                    onClick={() => adjust(key, -1)}
                    disabled={readOnly || attributes[key] <= BASE_ATTRIBUTE}
                  >
                    <Minus size={13} aria-hidden="true" />
                  </button>
                  <output aria-label={name}>{attributes[key]}</output>
                  <button
                    type="button"
                    aria-label={`Zvýšit ${accusative}`}
                    onClick={() => adjust(key, 1)}
                    disabled={readOnly || remainingPoints === 0 || attributes[key] >= BASE_ATTRIBUTE + ATTRIBUTE_POINTS}
                  >
                    <Plus size={13} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <p className={styles.benefit}>{benefits[key]}</p>
            </div>
          );
        })}
      </div>

      <p className={styles.footnote}>
        Úhyb i blok probíhají automaticky. Zbroj snižuje zásahy; vyšší iniciativa přináší častější tahy.
      </p>
      <button type="button" className={styles.ready} onClick={onClose}>
        {readOnly ? returnLabel : 'PŘIPRAVENO'}
      </button>
    </div>
  );
}
