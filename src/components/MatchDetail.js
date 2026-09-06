'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Check, Clock3, Goal, ListOrdered, MapPin, Shield, Timer, Users, X } from 'lucide-react';
import { getPlayerByName } from '@/data/playerData';
import { getOpponentPlayerPhoto } from '@/data/opponentPlayers';
import {
  getLineupGroups, getPeriodScores, getRegulationGoals, getShootoutAttempts,
  getShootoutResult, getTeamLogo, getTimelineEvents, isLancersTeam,
} from './matchDetailData';
import styles from './MatchDetail.module.css';

const tabs = [
  { id: 'overview', label: 'Přehled', icon: Goal },
  { id: 'lineups', label: 'Soupisky', icon: Users },
  { id: 'timeline', label: 'Průběh', icon: ListOrdered },
];
const formatAssists = (assists) => Array.isArray(assists)
  ? assists.join(', ')
  : String(assists || '').replace(/^\(|\)$/g, '').trim();
const displayName = (name) => !name || name === '?' ? 'Hráč bude doplněn' : name;

function PlayerAvatar({ name, player, photo = player?.photo, compact = false }) {
  const [failedSource, setFailedSource] = useState(null);
  return (
    <div className={`${styles.avatar} ${compact ? styles.avatarCompact : ''}`}>
      {photo && failedSource !== photo ? (
        <Image src={photo} alt={`Portrét hráče ${name}`} width={160} height={180}
          className={styles.portrait} style={{ objectPosition: player?.photoPosition }}
          sizes={compact ? '48px' : '76px'} onError={() => setFailedSource(photo)} />
      ) : (
        <svg viewBox="0 0 100 112" role="img" aria-label={`Fotografie: ${displayName(name)} – zatím není k dispozici`} className={styles.silhouette}>
          <circle cx="50" cy="35" r="21" fill="currentColor" />
          <path d="M7 112c1-30 16-48 43-48s42 18 43 48H7Z" fill="currentColor" />
          <path d="m33 66 17 18 17-18" fill="none" stroke="#202733" strokeWidth="5" />
        </svg>
      )}
      {player?.number != null && <span className={styles.jerseyNumber}>#{player.number}</span>}
    </div>
  );
}

function TeamLogo({ name, small = false }) {
  const [failed, setFailed] = useState(false);
  const logo = getTeamLogo(name);
  return (
    <span className={`${styles.teamLogo} ${small ? styles.teamLogoSmall : ''}`}>
      {logo && !failed
        ? <Image src={logo} alt={name} width={88} height={88} onError={() => setFailed(true)} />
        : <Shield size={small ? 24 : 44} aria-hidden="true" />}
    </span>
  );
}

function MatchDialog({ match, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const dialogRef = useRef(null);
  const overlayRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const uid = useId();
  onCloseRef.current = onClose;

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    const background = Array.from(document.body.children)
      .filter((element) => !element.contains(overlayRef.current) && !['SCRIPT', 'STYLE'].includes(element.tagName))
      .map((element) => ({ element, inert: element.inert }));
    background.forEach(({ element }) => { element.inert = true; });
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]') || [])
        .filter((element) => element.tabIndex >= 0 && element.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
        event.preventDefault(); first?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach(({ element, inert }) => { element.inert = inert; });
      document.removeEventListener('keydown', handleKey);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const isOurSide = (side) => isLancersTeam(side === 'home' ? match.homeTeam : side === 'away' ? match.awayTeam : '');
  const getPlayer = (name, side) => isOurSide(side) ? getPlayerByName(name) : null;
  const getTeam = (side) => side === 'home' ? match.homeTeam : side === 'away' ? match.awayTeam : '';
  const getOpponentPhoto = (name, side) => isOurSide(side) ? undefined : getOpponentPlayerPhoto(getTeam(side), name);
  const goals = getRegulationGoals(match);
  const shootouts = getShootoutAttempts(match);
  const events = getTimelineEvents(match);
  const periods = getPeriodScores(match.periods);
  const skaterStatsKnown = Array.isArray(match.goals) && (match.skaterStatsComplete ?? match.statsComplete) !== false;
  const hasLineups = match.homeLineup || match.awayLineup;
  const playerLink = (name, side) => {
    const player = getPlayer(name, side);
    return player ? <Link href={`/profil/${player.id}`} onClick={onClose} className={styles.playerLink}>{displayName(name)}</Link> : <span>{displayName(name)}</span>;
  };
  const renderGoal = (goal, index) => (
    <div key={`${goal.time}-${index}`} className={`${styles.goalRow} ${isOurSide(goal.team) ? styles.ourEvent : ''}`}>
      <span className={styles.eventTime}>{goal.time || '—'}</span>
      <PlayerAvatar compact name={goal.scorer} player={getPlayer(goal.scorer, goal.team)} photo={getOpponentPhoto(goal.scorer, goal.team)} />
      <div className={styles.eventCopy}>
        <div className={styles.eventName}>{playerLink(goal.scorer, goal.team)}</div>
        {formatAssists(goal.assists) && <p>Asistence: {formatAssists(goal.assists)}</p>}
      </div>
      <strong className={styles.eventScore}>{goal.score}</strong>
    </div>
  );
  const renderShootouts = () => shootouts.length > 0 && (
    <section className={styles.section} aria-label="Samostatné nájezdy">
      <div className={styles.sectionHeading}><h3>Samostatné nájezdy</h3><Goal size={18} /></div>
      <div className={styles.shootoutList}>
        {shootouts.map((attempt, index) => {
          const entry = typeof attempt === 'object' && attempt !== null ? attempt : null;
          const name = entry?.player || entry?.scorer;
          const converted = entry?.scored ?? entry?.converted ?? entry?.result;
          const result = getShootoutResult(entry);
          return <div key={index} className={styles.shootoutRow}>
            <span className={styles.attemptNumber}>{index + 1}</span>
            <div className={styles.eventCopy}>
              <strong>{name ? playerLink(name, entry?.team) : typeof attempt === 'string' ? attempt : 'Nájezd'}</strong>
              {entry?.team && <p>{getTeam(entry.team)}</p>}{entry?.time && <p>{entry.time}</p>}
            </div>
            {entry?.score && <strong>{entry.score}</strong>}
            {result && <span className={`${styles.shootoutResult} ${converted === true ? styles.converted : ''}`}>{converted === true && <Check size={14} />}{result}</span>}
          </div>;
        })}
      </div>
    </section>
  );
  const renderLineup = (side) => {
    const lineup = side === 'home' ? match.homeLineup : match.awayLineup;
    if (!lineup) return null;
    const team = getTeam(side);
    const groups = getLineupGroups(lineup);
    return <section key={side} className={styles.lineupTeam} aria-label={`Sestava ${team}`}>
      <div className={`${styles.lineupHeader} ${isOurSide(side) ? styles.lineupHeaderOurs : ''}`}>
        <TeamLogo name={team} small />
        <div><span>{side === 'home' ? 'Domácí' : 'Hosté'}</span><h3>{team}</h3></div>
        <span className={styles.lineupCount} aria-label="Počet hráčů">{groups.reduce((total, group) => total + group.players.length, 0)}</span>
      </div>
      <div className={styles.lineupGroups}>
        {groups.map((group) => <div key={group.label}>
          <h4 className={styles.groupHeading}>{group.label}</h4>
          <div className={styles.playerGrid}>
            {group.players.map((name, index) => {
              const player = getPlayer(name, side);
              const variants = player ? [player.name, ...(player.aliases || [])] : [name];
              const goalCount = goals.filter((goal) => goal.team === side && variants.includes(goal.scorer)).length;
              const assistCount = goals.filter((goal) => goal.team === side && formatAssists(goal.assists).split(',').some((assist) => variants.includes(assist.trim()))).length;
              const Tag = player ? Link : 'div';
              return <Tag key={`${name}-${index}`} className={`${styles.playerCard} ${player ? styles.linkedCard : ''}`}
                {...(player ? { href: `/profil/${player.id}`, onClick: onClose } : {})}>
                <PlayerAvatar name={name} player={player} photo={getOpponentPhoto(name, side)} />
                <div className={styles.playerCardCopy}>
                  <strong>{displayName(name)}</strong>
                  {skaterStatsKnown && group.label !== 'Brankář' && name !== '?'
                    ? <span className={goalCount || assistCount ? styles.hasPoints : ''}>{goalCount} G <span>·</span> {assistCount} A</span>
                    : <span>{group.label === 'Brankář' ? 'Brankář' : 'Statistiky nedoplněny'}</span>}
                </div>
                {player && <ArrowUpRight size={14} className={styles.profileArrow} aria-hidden="true" />}
              </Tag>;
            })}
          </div>
        </div>)}
      </div>
    </section>;
  };
  const changeTabWithKeyboard = (event, index) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault(); setActiveTab(tabs[next].id);
    document.getElementById(`${uid}-${tabs[next].id}-tab`)?.focus();
  };

  if (typeof document === 'undefined') return null;
  return createPortal(
    <div ref={overlayRef} className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`${uid}-title`} className={styles.dialog}>
        <header className={styles.toolbar}>
          <div><span className={styles.liveDot} /><h2 id={`${uid}-title`}>Detail zápasu</h2><span className={styles.toolbarSeason}>{match.season}</span></div>
          <button ref={closeRef} type="button" aria-label="Zavřít detail zápasu" onClick={onClose} className={styles.closeButton}><X size={22} /></button>
        </header>
        <div className={styles.scrollArea}>
          <section className={styles.scoreboard} aria-label="Výsledek zápasu">
            <div className={styles.matchBadge}>{match.category}{match.status === 'completed' && <><span />Odehráno</>}</div>
            <div className={styles.scoreGrid}>
              <div className={styles.scoreTeam}><TeamLogo name={match.homeTeam} /><span>Domácí</span><h3>{match.homeTeam}</h3></div>
              <div className={styles.scoreCenter}><strong>{match.score}</strong><span>Konečný výsledek</span></div>
              <div className={styles.scoreTeam}><TeamLogo name={match.awayTeam} /><span>Hosté</span><h3>{match.awayTeam}</h3></div>
            </div>
            {periods.length > 0 ? <div className={styles.periods}>{periods.map((score, index) => <div key={index}><span>{index < 3 ? `${index + 1}. třetina` : 'Prodloužení'}</span><strong>{score}</strong></div>)}</div>
              : match.periods ? <p className={styles.periodsText}>{match.periods}</p> : null}
            <div className={styles.matchMeta}>
              {match.date && <span><CalendarDays size={14} />{match.date}</span>}
              {match.time && <span><Clock3 size={14} />{match.time}</span>}
              {match.location && <span><MapPin size={14} />{match.location}</span>}
              {match.format && <span><Timer size={14} />{match.format}</span>}
            </div>
          </section>
          <nav className={styles.tabs} role="tablist" aria-label="Obsah detailu zápasu">
            {tabs.map(({ id, label, icon: Icon }, index) => <button key={id} type="button" role="tab" id={`${uid}-${id}-tab`}
              aria-selected={activeTab === id} aria-controls={`${uid}-panel`} tabIndex={activeTab === id ? 0 : -1}
              className={`${styles.tab} ${activeTab === id ? styles.activeTab : ''}`} onClick={() => setActiveTab(id)} onKeyDown={(event) => changeTabWithKeyboard(event, index)}>
              <Icon size={17} />{label}
            </button>)}
          </nav>
          <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-${activeTab}-tab`} tabIndex={0} className={styles.content}>
            {activeTab === 'overview' && <>
              <div className={styles.overviewGrid}>
                <section className={styles.section}>
                  <div className={styles.sectionHeading}><h3>Góly zápasu</h3><span>{goals.length > 0 ? `Zapsané góly: ${goals.length}` : 'Zápis utkání'}</span></div>
                  {goals.length > 0 ? <div>{goals.map(renderGoal)}</div> : <div className={styles.emptyState}><Goal size={30} /><p>Podrobný zápis gólů zatím není k dispozici.</p></div>}
                </section>
                <aside className={styles.summaryCard}>
                  <span className={styles.eyebrow}>PO ZÁPASE</span><h3>Jak se hrálo</h3>
                  <p>{match.summary || match.excerpt || 'Shrnutí zápasu zatím není k dispozici.'}</p>
                  {hasLineups && <button className={styles.textButton} type="button" onClick={() => {
                    setActiveTab('lineups');
                    document.getElementById(`${uid}-lineups-tab`)?.focus();
                  }}>Prohlédnout soupisky <ArrowUpRight size={16} /></button>}
                </aside>
              </div>
              {match.saves && <section className={styles.savesCard} aria-label="Zásahy brankářů"><Shield size={22} /><div><h3>Zásahy brankářů</h3><p>{match.homeTeam} / {match.awayTeam}</p></div><strong>{match.saves.home ?? '—'} <span>:</span> {match.saves.away ?? '—'}</strong></section>}
              {renderShootouts()}
            </>}
            {activeTab === 'lineups' && <>
              <div className={styles.panelHeading}><div><h3>Kdo nastoupil</h3><p>Sestavy týmů pro tento zápas.</p></div><span>G = góly · A = asistence</span></div>
              {hasLineups ? <div className={`${styles.lineups} ${!match.homeLineup || !match.awayLineup ? styles.singleLineup : ''}`}>{renderLineup('home')}{renderLineup('away')}</div>
                : <div className={styles.emptyState}><Users size={32} /><p>Soupisky zatím nejsou k dispozici.</p></div>}
            </>}
            {activeTab === 'timeline' && <>
              <div className={styles.panelHeading}><div><h3>Minutu po minutě</h3><p>Góly a vyloučení v pořadí, v jakém přišly.</p></div><span>Události: {events.length}</span></div>
              {events.length > 0 ? <ol className={styles.timeline}>
                {events.map((event, index) => <li key={index} className={`${styles.timelineEvent} ${event.kind === 'goal' ? styles.timelineGoal : styles.timelinePenalty}`}>
                  <span className={styles.timelineTime}>{event.time || '—'}</span>
                  <span className={styles.timelineDot}>{event.kind === 'goal' ? <Goal size={16} /> : <Timer size={16} />}</span>
                  <div className={`${styles.timelineCard} ${isOurSide(event.team) ? styles.ourEvent : ''}`}>
                    <div className={styles.timelineLabel}><strong>{event.kind === 'goal' ? 'GÓL' : 'VYLOUČENÍ'}</strong><span>{getTeam(event.team)}</span>{event.kind === 'goal' ? <b>{event.score}</b> : <b>{event.duration}</b>}</div>
                    <div className={styles.timelinePerson}>
                      <PlayerAvatar compact name={event.kind === 'goal' ? event.scorer : event.servedBy || event.player}
                        player={getPlayer(event.kind === 'goal' ? event.scorer : event.servedBy || event.player, event.team)}
                        photo={getOpponentPhoto(event.kind === 'goal' ? event.scorer : event.servedBy || event.player, event.team)} />
                      <div className={styles.eventCopy}>
                        <div className={styles.eventName}>{playerLink(event.kind === 'goal' ? event.scorer : event.player, event.team)}</div>
                        {event.kind === 'goal' ? formatAssists(event.assists) && <p>Asistence: {formatAssists(event.assists)}</p> : <p>{event.reason}</p>}
                        {event.servedBy && <p>Trest odpykal: {playerLink(event.servedBy, event.team)}</p>}
                      </div>
                    </div>
                  </div>
                </li>)}
              </ol> : <div className={styles.emptyState}><ListOrdered size={32} /><p>Podrobný průběh zápasu zatím není k dispozici.</p></div>}
              {renderShootouts()}
            </>}
          </div>
        </div>
        <footer className={styles.footer}><span>HC LITVÍNOV LANCERS</span><span>{match.homeTeam} <b>{match.score}</b> {match.awayTeam}</span></footer>
      </div>
    </div>, document.body,
  );
}

export default function MatchDetail({ match, isOpen, onClose }) {
  return isOpen && match ? <MatchDialog key={match.id} match={match} onClose={onClose} /> : null;
}
