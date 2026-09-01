'use client';

import { useEffect, useRef, useState } from 'react';

const SLIDES = [
  {
    src: '/images/home-hero/team-trophy.webp',
    kind: 'trophy',
  },
  {
    src: '/images/home-hero/team-lineup.webp',
    kind: 'lineup',
  },
];

const COLUMNS = 6;
const ROWS = 4;
const ROTATION_INTERVAL = 5000;
const TILE_ASSEMBLY_DURATION = 1400;
const BASE_IMAGE_FADE_DURATION = 950;

const TILES = Array.from({ length: COLUMNS * ROWS }, (_, index) => ({
  index,
  column: index % COLUMNS,
  row: Math.floor(index / COLUMNS),
}));

export default function HeroTeamCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState(null);
  const [transitionCount, setTransitionCount] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const currentIndexRef = useRef(0);
  const finishTimeoutRef = useRef(null);
  const tileCleanupTimeoutRef = useRef(null);

  useEffect(() => {
    SLIDES.forEach(({ src }) => {
      const image = new window.Image();
      image.src = src;
    });

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreference = () => setReduceMotion(mediaQuery.matches);

    handleMotionPreference();
    mediaQuery.addEventListener('change', handleMotionPreference);

    return () => mediaQuery.removeEventListener('change', handleMotionPreference);
  }, []);

  useEffect(() => {
    setIncomingIndex(null);

    const rotateSlide = () => {
      if (document.hidden) return;

      const nextIndex = (currentIndexRef.current + 1) % SLIDES.length;

      if (reduceMotion) {
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
        return;
      }

      setIncomingIndex(nextIndex);
      setTransitionCount((count) => count + 1);

      finishTimeoutRef.current = window.setTimeout(() => {
        currentIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex);

        tileCleanupTimeoutRef.current = window.setTimeout(() => {
          setIncomingIndex(null);
        }, BASE_IMAGE_FADE_DURATION);
      }, TILE_ASSEMBLY_DURATION);
    };

    const interval = window.setInterval(rotateSlide, ROTATION_INTERVAL);

    return () => {
      window.clearInterval(interval);
      if (finishTimeoutRef.current) {
        window.clearTimeout(finishTimeoutRef.current);
      }
      if (tileCleanupTimeoutRef.current) {
        window.clearTimeout(tileCleanupTimeoutRef.current);
      }
    };
  }, [reduceMotion]);

  const incomingSlide = incomingIndex === null ? null : SLIDES[incomingIndex];

  return (
    <div className="hero-team-carousel" aria-hidden="true">
      <div className="hero-ambient" />

      {SLIDES.map((slide, index) => (
        <div
          key={slide.src}
          className={`hero-slide hero-art--${slide.kind} ${
            index === currentIndex ? 'is-active' : ''
          } ${
            incomingIndex !== null && incomingIndex !== currentIndex && index === currentIndex
              ? 'is-leaving'
              : ''
          }`}
          style={{ '--hero-image': `url("${slide.src}")` }}
        />
      ))}

      {incomingSlide && !reduceMotion && (
        <div
          key={`${incomingSlide.src}-${transitionCount}`}
          className="tile-grid"
        >
          {TILES.map(({ index, column, row }) => {
            const revealOrder = (index * 7 + transitionCount * 5) % TILES.length;
            const rotateOnXAxis = (index + transitionCount) % 2 === 0;

            return (
              <span
                key={index}
                className="tile"
                style={{
                  '--tile-left': `${column * -100}%`,
                  '--tile-top': `${row * -100}%`,
                  '--tile-delay': `${revealOrder * 24}ms`,
                  '--rotate-x': rotateOnXAxis ? '90deg' : '0deg',
                  '--rotate-y': rotateOnXAxis ? '0deg' : '90deg',
                }}
              >
                <span
                  className={`tile-art hero-art--${incomingSlide.kind}`}
                  style={{ '--hero-image': `url("${incomingSlide.src}")` }}
                />
              </span>
            );
          })}
        </div>
      )}

      <div className="hero-vignette" />

      <style jsx>{`
        .hero-team-carousel {
          position: absolute;
          inset: 0;
          isolation: isolate;
          overflow: hidden;
          pointer-events: none;
          background: #030712;
        }

        .hero-ambient {
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(circle at 72% 48%, rgba(220, 38, 38, 0.32), transparent 45%),
            radial-gradient(circle at 28% 32%, rgba(71, 85, 105, 0.32), transparent 40%),
            linear-gradient(135deg, #020617 0%, #111827 54%, #25040a 100%);
        }

        .hero-slide {
          position: absolute;
          inset: -1px;
          z-index: 1;
          opacity: 0;
          background-image: var(--hero-image);
          background-repeat: no-repeat;
          filter: brightness(0.72) saturate(0.95);
          transform: scale(1.015);
          transition:
            opacity 900ms ease,
            filter 1200ms ease,
            transform 1800ms ease;
          will-change: opacity, filter, transform;
        }

        .hero-slide.is-active {
          opacity: 1;
          transform: scale(1);
        }

        .hero-slide.is-leaving {
          opacity: 0.18;
          filter: blur(8px) brightness(0.32) saturate(0.72);
          transform: scale(1.045);
        }

        .hero-art--trophy {
          background-position: center 62%;
          background-size: cover;
        }

        .hero-art--lineup {
          background-image:
            var(--hero-image),
            radial-gradient(circle at 54% 52%, rgba(153, 27, 27, 0.54), transparent 48%),
            linear-gradient(135deg, #020617 0%, #111827 56%, #25040a 100%);
          background-position: center 57%, center, center;
          background-size: min(94vw, 1500px) auto, cover, cover;
        }

        .tile-grid {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          grid-template-rows: repeat(4, minmax(0, 1fr));
          perspective: 1600px;
        }

        .tile {
          position: relative;
          overflow: hidden;
          opacity: 0;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
          transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) scale(0.78);
          transform-origin: center;
          animation: reveal-tile 720ms cubic-bezier(0.2, 0.75, 0.2, 1) forwards;
          animation-delay: var(--tile-delay);
          backface-visibility: hidden;
          will-change: opacity, transform;
        }

        .tile-art {
          position: absolute;
          top: var(--tile-top);
          left: var(--tile-left);
          width: 600%;
          height: 400%;
          background-image: var(--hero-image);
          background-repeat: no-repeat;
          filter: brightness(0.72) saturate(0.95);
        }

        .hero-vignette {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.54) 38%, rgba(0, 0, 0, 0.26) 62%, rgba(0, 0, 0, 0.7) 100%),
            linear-gradient(180deg, rgba(0, 0, 0, 0.18) 0%, transparent 34%, rgba(0, 0, 0, 0.58) 100%);
        }

        @keyframes reveal-tile {
          0% {
            opacity: 0;
            box-shadow: inset 0 0 0 1px rgba(248, 113, 113, 0.2);
          }
          65% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            box-shadow: inset 0 0 0 1px transparent;
            transform: rotateX(0deg) rotateY(0deg) scale(1);
          }
        }

        @media (max-width: 900px) {
          .hero-art--trophy {
            background-position: 54% 58%;
          }

          .hero-art--lineup {
            background-position: center 42%, center, center;
            background-size: auto 62%, cover, cover;
          }

          .hero-vignette {
            background:
              linear-gradient(180deg, rgba(0, 0, 0, 0.58) 0%, rgba(0, 0, 0, 0.32) 44%, rgba(0, 0, 0, 0.82) 100%),
              linear-gradient(90deg, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.28) 70%, rgba(0, 0, 0, 0.58) 100%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-slide {
            transform: none !important;
            transition: opacity 900ms linear;
          }

          .tile-grid {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
