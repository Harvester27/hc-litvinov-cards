'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './page.module.css';

const publicGames = [
  {
    name: 'Les stínů',
    category: 'PIXELOVÉ DOBRODRUŽSTVÍ',
    description: 'Demo pixelové hry, kde si vyzkoušíte souboj s příšerou a krátký průzkum bojiště.',
    image: '/images/games/les-stinu.png',
    imageAlt: 'Souboj s příšerou v pixelové hře Les stínů',
    status: 'HRÁT NYNÍ',
    detail: 'ZDARMA · V PROHLÍŽEČI',
    action: 'Spustit hru',
    href: '/games/les-stinu',
    statusStyle: 'live',
  },
  {
    name: 'VIP Lancers',
    category: 'HOCKEY NEXT GEN',
    description: 'Vysoce technologický hokejový projekt s ambicí porazit sérii NHL od EA Sports. Zatím je k dispozici jen místnost VIP Lancers.',
    image: '/images/games/vip-lancers.png',
    imageAlt: 'Interiér místnosti VIP Lancers',
    status: 'PŘIPRAVUJEME',
    detail: 'VE VÝVOJI',
    action: 'Zatím nedostupné',
    statusStyle: 'soon',
  },
  {
    name: 'Lancers Card',
    category: 'SBĚRATELSKÁ KARETNÍ HRA',
    description: 'Sbírejte kartičky skutečných hráčů Lancers i dalších týmů, rozbalujte balíčky a soupeřte online. Čekají vás soutěže jako KHLA a Český pohár.',
    image: '/images/games/lancers-cards.png',
    imageAlt: 'Sběratelská kartička hráče Lancers na hokejovém kluzišti',
    status: 'VSTUP DO HRY',
    detail: 'ONLINE KARETNÍ HRA',
    action: 'Spustit hru',
    href: '/games/cards',
    statusStyle: 'live',
  },
  {
    name: 'Lancers CUP',
    category: 'HOKEJOVÝ MANAŽER',
    description: 'Vyberte si tým nebo vytvořte vlastní. Uspějte ve Fofr Lize a Českém poháru a vychovejte hráče pro českou reprezentaci na MS.',
    image: '/images/games/lancers-cup.png',
    imageAlt: 'Tabulka týmů v hokejovém manažeru Lancers CUP',
    status: 'NA STEAMU',
    detail: 'PC · STEAM',
    action: 'Otevřít na Steamu',
    href: 'https://store.steampowered.com/app/4111610/Lancers_Cup/?l=czech',
    external: true,
    statusStyle: 'steam',
  },
];

function GameCard({ game, number, priority }) {
  const cardContent = (
    <>
      <div className={styles.artwork}>
        <Image src={game.image} alt="" fill sizes="(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw" className={styles.artworkBackdrop} aria-hidden="true" />
        <Image src={game.image} alt={game.imageAlt} fill sizes="(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw" className={styles.artworkImage} priority={priority} />
        <span className={styles.artworkNumber}>{String(number).padStart(2, '0')}</span>
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.cardMeta}>
          <span>{game.category}</span>
          <span className={`${styles.status} ${styles[game.statusStyle]}`}>{game.status}</span>
        </div>
        <h2>{game.name}</h2>
        <p>{game.description}</p>
        <div className={styles.cardFooter}>
          <span>{game.detail}</span>
          <strong className={game.href ? styles.activeAction : styles.inactiveAction}>
            {game.action}
            {game.href && (game.external ? <ArrowUpRight size={17} /> : <ArrowRight size={17} />)}
          </strong>
        </div>
      </div>
    </>
  );

  if (!game.href) return <article className={`${styles.card} ${styles.unavailable}`}>{cardContent}</article>;

  const label = `${game.name} – ${game.action}`;
  if (game.external) {
    return <a className={`${styles.card} ${styles.cardLink}`} href={game.href} target="_blank" rel="noopener noreferrer" aria-label={label}>{cardContent}</a>;
  }
  return <Link className={`${styles.card} ${styles.cardLink}`} href={game.href} aria-label={label}>{cardContent}</Link>;
}

export default function GamesCarousel() {
  const games = publicGames;
  const gameCount = games.length;
  const trackRef = useRef(null);
  const indexRef = useRef(0);
  const visibleRef = useRef(3);
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const maxIndex = Math.max(0, gameCount - visibleCount);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let scrollTimer;

    const cardStep = () => track.children[1]?.offsetLeft - track.children[0]?.offsetLeft || 0;
    const updateLayout = () => {
      const count = window.innerWidth >= 1100 ? 3 : window.innerWidth >= 700 ? 2 : 1;
      visibleRef.current = count;
      const next = Math.min(indexRef.current, Math.max(0, gameCount - count));
      indexRef.current = next;
      setVisibleCount(count);
      setIndex(next);
      track.scrollTo({ left: next * cardStep(), behavior: 'auto' });
    };
    const updateScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        const step = cardStep();
        if (!step) return;
        const next = Math.max(0, Math.min(Math.round(track.scrollLeft / step), gameCount - visibleRef.current));
        indexRef.current = next;
        setIndex(next);
      }, 100);
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    track.addEventListener('scroll', updateScroll, { passive: true });
    return () => {
      window.clearTimeout(scrollTimer);
      window.removeEventListener('resize', updateLayout);
      track.removeEventListener('scroll', updateScroll);
    };
  }, [gameCount]);

  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(indexRef.current + direction, gameCount - visibleRef.current));
    const step = track.children[1]?.offsetLeft - track.children[0]?.offsetLeft || 0;
    indexRef.current = next;
    setIndex(next);
    track.scrollTo({ left: next * step, behavior: 'smooth' });
  };

  const first = String(index + 1).padStart(2, '0');
  const last = String(Math.min(index + visibleCount, gameCount)).padStart(2, '0');

  return (
    <section className={styles.stage} aria-label="Výběr her Lancers">
      <div className={styles.stageTop}>
        <span>HERNÍ SVĚT LANCERS</span>
        <span aria-live="polite">{visibleCount > 1 ? `${first}–${last}` : first} / {String(gameCount).padStart(2, '0')}</span>
      </div>
      <div className={styles.carouselShell}>
        <div id="games-carousel" ref={trackRef} className={styles.track} role="region" aria-label="Hry, posunujte vodorovně">
          {games.map((game, gameIndex) => <GameCard key={game.name} game={game} number={gameIndex + 1} priority={gameIndex < 3} />)}
        </div>
        {index > 0 && (
          <button type="button" className={`${styles.arrow} ${styles.previous}`} onClick={() => move(-1)} aria-label="Předchozí hra" aria-controls="games-carousel">
            <ChevronLeft size={32} strokeWidth={1.6} />
          </button>
        )}
        {index < maxIndex && (
          <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => move(1)} aria-label="Další hra" aria-controls="games-carousel">
            <ChevronRight size={32} strokeWidth={1.6} />
          </button>
        )}
      </div>
    </section>
  );
}
