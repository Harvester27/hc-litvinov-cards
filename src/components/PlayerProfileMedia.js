'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Images,
  Pause,
  Play,
  X
} from 'lucide-react';

const ROTATION_INTERVAL = 5000;
const SWIPE_THRESHOLD = 45;

export default function PlayerProfileMedia({ playerName, playerNumber, media = [] }) {
  const featuredMedia = useMemo(() => {
    const featured = media.filter((item) => item.featured);
    return featured.length > 0 ? featured : media.slice(0, 4);
  }, [media]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const [resumeDuringInteraction, setResumeDuringInteraction] = useState(false);
  const [failedSources, setFailedSources] = useState(() => new Set());
  const galleryButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const thumbnailRefs = useRef([]);
  const touchStartX = useRef(null);
  const galleryTouchStartX = useRef(null);

  const isGalleryOpen = galleryIndex !== null;
  const safeActiveIndex = featuredMedia.length > 0
    ? activeIndex % featuredMedia.length
    : 0;
  const isInteractionPaused = (isHovered || hasFocus) && !resumeDuringInteraction;
  const isAutoplayRunning = (
    featuredMedia.length > 1
    && !isAutoplayPaused
    && !isInteractionPaused
    && !isGalleryOpen
    && isPageVisible
    && !reduceMotion
  );

  const showPreviousSlide = useCallback(() => {
    setActiveIndex((current) => (
      current === 0 ? featuredMedia.length - 1 : current - 1
    ));
  }, [featuredMedia.length]);

  const showNextSlide = useCallback(() => {
    setActiveIndex((current) => (current + 1) % featuredMedia.length);
  }, [featuredMedia.length]);

  const showPreviousGalleryImage = useCallback(() => {
    setGalleryIndex((current) => {
      if (current === null) return null;
      return current === 0 ? media.length - 1 : current - 1;
    });
  }, [media.length]);

  const showNextGalleryImage = useCallback(() => {
    setGalleryIndex((current) => {
      if (current === null) return null;
      return (current + 1) % media.length;
    });
  }, [media.length]);

  const closeGallery = useCallback(() => {
    setGalleryIndex(null);
    window.requestAnimationFrame(() => galleryButtonRef.current?.focus());
  }, []);

  const handleImageError = useCallback((src) => {
    setFailedSources((current) => {
      if (current.has(src)) return current;
      const next = new Set(current);
      next.add(src);
      return next;
    });
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    setGalleryIndex(null);
    setIsAutoplayPaused(false);
    setResumeDuringInteraction(false);
    setFailedSources(new Set());
  }, [playerName]);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreference = () => setReduceMotion(motionQuery.matches);
    const handleVisibility = () => setIsPageVisible(!document.hidden);

    handleMotionPreference();
    handleVisibility();
    motionQuery.addEventListener('change', handleMotionPreference);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      motionQuery.removeEventListener('change', handleMotionPreference);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (!isAutoplayRunning) return undefined;

    const timeout = window.setTimeout(showNextSlide, ROTATION_INTERVAL);
    return () => window.clearTimeout(timeout);
  }, [
    safeActiveIndex,
    isAutoplayRunning,
    showNextSlide
  ]);

  useEffect(() => {
    if (!isGalleryOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const galleryRoot = document.getElementById('player-gallery-overlay');
    const backgroundElements = Array.from(document.body.children)
      .filter((element) => (
        element !== galleryRoot
        && element.tagName !== 'SCRIPT'
        && element.tagName !== 'STYLE'
      ))
      .map((element) => ({
        element,
        wasInert: element.inert,
        ariaHidden: element.getAttribute('aria-hidden')
      }));

    backgroundElements.forEach(({ element }) => {
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
    });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeGallery();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPreviousGalleryImage();
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showNextGalleryImage();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      backgroundElements.forEach(({ element, wasInert, ariaHidden }) => {
        element.inert = wasInert;
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      });
    };
  }, [
    closeGallery,
    isGalleryOpen,
    showNextGalleryImage,
    showPreviousGalleryImage
  ]);

  useEffect(() => {
    if (galleryIndex === null) return;
    thumbnailRefs.current[galleryIndex]?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }, [galleryIndex, reduceMotion]);

  if (featuredMedia.length === 0) return null;

  const activeMedia = featuredMedia[safeActiveIndex];
  const activeGalleryMedia = galleryIndex === null ? null : media[galleryIndex];

  const openGallery = () => {
    const matchingIndex = media.findIndex((item) => item.src === activeMedia.src);
    setGalleryIndex(matchingIndex >= 0 ? matchingIndex : 0);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null || featuredMedia.length <= 1) {
      touchStartX.current = null;
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    if (distance > 0) showPreviousSlide();
    else showNextSlide();
  };

  const handleGalleryTouchEnd = (event) => {
    if (galleryTouchStartX.current === null || media.length <= 1) {
      galleryTouchStartX.current = null;
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? galleryTouchStartX.current;
    const distance = endX - galleryTouchStartX.current;
    galleryTouchStartX.current = null;

    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    if (distance > 0) showPreviousGalleryImage();
    else showNextGalleryImage();
  };

  return (
    <>
      <div
        className="mx-auto w-full max-w-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setResumeDuringInteraction(false);
        }}
        onFocusCapture={() => setHasFocus(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setHasFocus(false);
            setResumeDuringInteraction(false);
          }
        }}
      >
        <div
          className="group relative aspect-[4/5] touch-pan-y overflow-hidden rounded-3xl bg-slate-950 shadow-2xl ring-1 ring-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          role="region"
          aria-label={`Profilové fotografie hráče ${playerName}`}
          aria-roledescription="karusel"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              showPreviousSlide();
            } else if (event.key === 'ArrowRight') {
              event.preventDefault();
              showNextSlide();
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => { touchStartX.current = null; }}
        >
          {featuredMedia.map((item, index) => {
            const isActive = index === safeActiveIndex;

            return (
              <div
                key={item.src}
                className={`absolute inset-0 ${
                  reduceMotion ? '' : 'transition-opacity duration-700 ease-in-out'
                } ${isActive ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                aria-hidden={!isActive}
              >
                {failedSources.has(item.src) ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-900 to-red-950 px-6 text-center text-white">
                    <ImageOff size={44} aria-hidden="true" />
                    <span className="font-bold">Fotografii se nepodařilo načíst</span>
                  </div>
                ) : (
                  <>
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 88vw, 360px"
                      className="scale-110 object-cover opacity-45 blur-2xl"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-transparent to-red-950/45" />
                    <Image
                      src={item.src}
                      alt={isActive ? item.alt : ''}
                      fill
                      sizes="(max-width: 767px) 88vw, 360px"
                      priority={index === 0}
                      className="object-contain"
                      onError={() => handleImageError(item.src)}
                    />
                  </>
                )}
              </div>
            );
          })}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />

          <div className="absolute left-4 top-4 rounded-full bg-red-600 px-4 py-2 text-xl font-black text-white shadow-lg ring-2 ring-white/80">
            #{playerNumber ?? '—'}
          </div>

          <div className="absolute right-4 top-4 rounded-full bg-black/65 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
            {safeActiveIndex + 1} / {featuredMedia.length}
          </div>

          {!reduceMotion && featuredMedia.length > 1 && (
            <button
              type="button"
              onClick={() => {
                if (isAutoplayRunning) {
                  setIsAutoplayPaused(true);
                  setResumeDuringInteraction(false);
                } else {
                  setIsAutoplayPaused(false);
                  setResumeDuringInteraction(true);
                }
              }}
              className="absolute right-4 top-16 flex h-11 w-11 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={isAutoplayRunning
                ? 'Pozastavit automatické přepínání fotografií'
                : 'Spustit automatické přepínání fotografií'}
              aria-pressed={!isAutoplayRunning}
            >
              {isAutoplayRunning
                ? <Pause size={20} aria-hidden="true" />
                : <Play size={20} aria-hidden="true" />}
            </button>
          )}

          {featuredMedia.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPreviousSlide}
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-90 shadow-lg backdrop-blur-sm transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                aria-label="Předchozí profilová fotografie"
              >
                <ChevronLeft size={26} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={showNextSlide}
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-90 shadow-lg backdrop-blur-sm transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                aria-label="Další profilová fotografie"
              >
                <ChevronRight size={26} aria-hidden="true" />
              </button>
            </>
          )}

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center">
            {featuredMedia.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={`Zobrazit profilovou fotografii ${index + 1}`}
                aria-current={index === safeActiveIndex ? 'true' : undefined}
              >
                <span className={`h-2.5 rounded-full transition-all ${
                  index === safeActiveIndex
                    ? 'w-8 bg-red-500'
                    : 'w-2.5 bg-white/70 hover:bg-white'
                }`} />
              </button>
            ))}
          </div>
        </div>

        <p
          className="sr-only"
          aria-live={isAutoplayRunning ? 'off' : 'polite'}
        >
          {activeMedia.alt}
        </p>

        <button
          ref={galleryButtonRef}
          type="button"
          onClick={openGallery}
          className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-red-600 bg-white px-4 py-2.5 font-bold text-red-600 transition hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
        >
          <Images size={20} aria-hidden="true" />
          Zobrazit galerii ({media.length})
        </button>
      </div>

      {isGalleryOpen && activeGalleryMedia && typeof document !== 'undefined' && createPortal(
        <div
          id="player-gallery-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md sm:p-6"
          style={{
            paddingTop: 'max(0.5rem, env(safe-area-inset-top))',
            paddingRight: 'max(0.5rem, env(safe-area-inset-right))',
            paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
            paddingLeft: 'max(0.5rem, env(safe-area-inset-left))'
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeGallery();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="player-gallery-title"
            tabIndex={-1}
            className="relative flex h-full max-h-full w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-gray-950 shadow-2xl sm:h-[min(92vh,900px)]"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <h2 id="player-gallery-title" className="truncate text-lg font-black text-white sm:text-2xl">
                  Galerie {playerName}
                </h2>
                <p className="text-sm font-semibold text-gray-400">
                  Fotografie {galleryIndex + 1} z {media.length}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeGallery}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Zavřít galerii"
              >
                <X size={26} aria-hidden="true" />
              </button>
            </div>

            <div
              className="relative min-h-0 flex-1 touch-pan-y"
              onTouchStart={(event) => {
                galleryTouchStartX.current = event.changedTouches[0]?.clientX ?? null;
              }}
              onTouchEnd={handleGalleryTouchEnd}
              onTouchCancel={() => { galleryTouchStartX.current = null; }}
            >
              <div className="absolute inset-3 sm:inset-6">
                {failedSources.has(activeGalleryMedia.src) ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-white">
                    <ImageOff size={52} aria-hidden="true" />
                    <span className="font-bold">Fotografii se nepodařilo načíst</span>
                  </div>
                ) : (
                  <Image
                    src={activeGalleryMedia.src}
                    alt={activeGalleryMedia.alt}
                    fill
                    sizes="96vw"
                    className="object-contain"
                    onError={() => handleImageError(activeGalleryMedia.src)}
                  />
                )}
              </div>

              {media.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousGalleryImage}
                    className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-5"
                    aria-label="Předchozí fotografie v galerii"
                  >
                    <ChevronLeft size={30} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={showNextGalleryImage}
                    className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white shadow-lg backdrop-blur-sm transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-5"
                    aria-label="Další fotografie v galerii"
                  >
                    <ChevronRight size={30} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            <div className="border-t border-white/10 bg-black/35 px-3 py-3 sm:px-6">
              <p className="mb-3 text-center text-sm font-semibold text-gray-200 sm:text-base" aria-live="polite">
                {activeGalleryMedia.caption}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Náhledy galerie">
                {media.map((item, index) => (
                  <button
                    key={item.src}
                    ref={(element) => { thumbnailRefs.current[index] = element; }}
                    type="button"
                    onClick={() => setGalleryIndex(index)}
                    className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-20 sm:w-28 ${
                      index === galleryIndex
                        ? 'border-red-500 opacity-100'
                        : 'border-transparent opacity-55 hover:opacity-100'
                    }`}
                    aria-label={`Zobrazit fotografii ${index + 1}: ${item.caption}`}
                    aria-current={index === galleryIndex ? 'true' : undefined}
                  >
                    {failedSources.has(item.src) ? (
                      <span className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-300">
                        <ImageOff size={24} aria-hidden="true" />
                      </span>
                    ) : (
                      <Image
                        src={item.src}
                        alt=""
                        fill
                        sizes="112px"
                        className="object-cover"
                        aria-hidden="true"
                        onError={() => handleImageError(item.src)}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
