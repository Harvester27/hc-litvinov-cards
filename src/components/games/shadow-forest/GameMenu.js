import { ArrowUpRight, ChevronRight, Play, Sparkles, Sword, Swords } from 'lucide-react';
import styles from './GameMenu.module.css';

export default function GameMenu({ profile, hasRun, status, turn, resumeScene, cinematicKind, explorationMode, loaded, savingAvailable, onNewGame, onContinue, onHelp }) {
  return (
    <div className={`${styles.menu} ${hasRun ? styles.hasRun : ''}`}>
      <div className={styles.logo}>
        <div className={styles.ornament}><span /><Swords size={23} strokeWidth={1.2} /><span /></div>
        <p>LANCERS PLAY PŘEDSTAVUJE</p>
        <h2 data-screen-title tabIndex={-1}>LES<br /><span>STÍNŮ</span></h2>
        <div className={styles.subtitle}><span /> TAHOVÉ FANTASY RPG <span /></div>
      </div>
      <div className={styles.actions}>
        {hasRun && <button type="button" className={styles.continueButton} onClick={onContinue}><Play size={17} /><span><strong>POKRAČOVAT</strong><small>{profile.name} · {resumeScene === 'camp' ? 'Rozhovor u ohně' : resumeScene === 'sanctuary' ? 'Ohořelý strážce' : resumeScene === 'exploration' ? (explorationMode === 'dawn' ? 'Svítání u ohně' : 'Průzkum starého hvozdu') : resumeScene === 'cinematic' ? (cinematicKind === 'firestorm' ? 'Poslední kouzlo' : 'Vyrušení u ohně') : status === 'won' ? 'Příběh pokračuje' : status === 'lost' ? 'Konec souboje' : `Starý hvozd · tah ${turn}`}</small></span><ChevronRight size={17} /></button>}
        <button type="button" className={styles.newButton} disabled={!loaded} onClick={onNewGame}><Sword size={19} /><span>NOVÁ HRA</span><ChevronRight size={17} /></button>
        <button type="button" className={styles.helpButton} onClick={onHelp}>Jak hrát <ArrowUpRight size={13} /></button>
      </div>
      <div className={styles.chapter}><Sparkles size={13} /><span>KAPITOLA I <b>Za hranicí světla</b></span></div>
      <p className={styles.saveNote}>{savingAvailable ? 'Příběh, postava a dokončené tahy se ukládají v tomto prohlížeči.' : 'Ukládání není dostupné. Můžeš hrát do zavření stránky.'}</p>
      <span className={styles.early}>RANÁ VERZE · ÚVOD PŘÍBĚHU A PRVNÍ SOUBOJ</span>
    </div>
  );
}
