'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';

// utils
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function generateStars(count, zMin = -900, zMax = -200, sizeMin = 0.8, sizeMax = 2.6) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: rand(0, 100),
    top: rand(0, 100),
    size: rand(sizeMin, sizeMax),
    z: rand(zMin, zMax),
    twinkleDelay: rand(0, 6),
    twinkleDur: rand(3, 7),
  }));
}

export default function SpaceOdysseyGame() {
  const router = useRouter();
  const sceneRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  // vrstvy hvězd (parallax) - přidáno více vrstev pro hlubší efekt
  const farStars  = useMemo(() => (ready ? generateStars(160, -1200, -800, 0.6, 1.6)  : []), [ready]);
  const midFarStars = useMemo(() => (ready ? generateStars(120, -800, -550, 0.8, 1.8) : []), [ready]);
  const midStars  = useMemo(() => (ready ? generateStars(100, -550, -350, 1.0, 2.2)  : []), [ready]);
  const nearStars = useMemo(() => (ready ? generateStars(80,  -350, -150, 1.4, 2.8)  : []), [ready]);
  const meteors   = useMemo(() => (ready ? generateStars(10,  -600, -300, 2.0, 3.5)  : []), [ready]);

  // náklon scény podle myši - vylepšeno pro plynulejší pohyb
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      el.style.setProperty('--mx', String(x - 0.5));
      el.style.setProperty('--my', String(y - 0.5));
    };
    const handleLeave = () => {
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');
    };
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const StarField = ({ stars, className = '' }) => (
    <>
      {stars.map((s) => (
        <div
          key={`${className}-${s.id}`}
          className={`absolute rounded-full bg-white/90 will-change-transform ${className}`}
          style={{
            left: `${s.left}vw`,
            top: `${s.top}vh`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            transform: `translateZ(${s.z}px)`,
            boxShadow: `0 0 ${s.size * 3}px rgba(255,255,255,0.85)`,
            animation: `twinkle ${s.twinkleDur}s ease-in-out ${s.twinkleDelay}s infinite alternate`,
          }}
        />
      ))}
    </>
  );

  return (
    <div
      ref={sceneRef}
      data-scene
      className="relative min-h-screen bg-black overflow-hidden [perspective:1400px] [--mx:0] [--my:0]"
    >
      {/* pozadí - přidány další mlhoviny pro hloubku */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0014] to-[#020812]" />
      <div
        className="absolute -top-1/4 -left-1/3 w-[1200px] h-[1200px] rounded-full blur-3xl opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 30% 30%, rgba(112,68,255,0.25), transparent 60%)',
          transform: 'translateZ(-900px)',
        }}
      />
      <div
        className="absolute top-1/3 right-[-20%] w-[1100px] h-[1100px] rounded-full blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 70% 40%, rgba(0,168,255,0.22), transparent 65%)',
          transform: 'translateZ(-850px)',
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[10%] w-[900px] h-[900px] rounded-full blur-3xl opacity-25"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,100,200,0.18), transparent 70%)',
          transform: 'translateZ(-1000px)',
        }}
      />

      {/* hvězdné pole */}
      <StarField stars={farStars} />
      <StarField stars={midFarStars} />
      <StarField stars={midStars} />
      <StarField stars={nearStars} />

      {/* meteory - vylepšeno o delší stopy a variabilitu */}
      {meteors.map((m) => (
        <div
          key={`meteor-${m.id}`}
          className="absolute will-change-transform"
          style={{
            left: `${m.left}vw`,
            top: `${m.top}vh`,
            transform: `translateZ(${m.z}px)`,
            animation: `shoot ${6 + Math.random() * 8}s linear ${m.twinkleDelay}s infinite`,
          }}
        >
          <div className="relative">
            <div className="w-[2px] h-[2px] rounded-full bg-white" />
            <div className="absolute -left-36 -top-[1px] w-36 h-[2px] bg-gradient-to-r from-white to-transparent opacity-80" />
          </div>
        </div>
      ))}

      {/* PLANETA - vylepšena o mraky, lepší textury a další měsíc */}
      <div
        className="absolute top-24 right-36 w-[34rem] h-[34rem] [transform-style:preserve-3d] will-change-transform"
        style={{
          transform:
            'translateZ(-420px) rotateX(calc(var(--my)*8deg)) rotateY(calc(var(--mx)*-12deg))',
        }}
      >
        {/* atmosféra - přidána vrstva mraků */}
        <div
          className="absolute inset-0 rounded-full blur-[50px] opacity-80"
          style={{
            background:
              'radial-gradient(closest-side, rgba(255,140,66,0.45), rgba(255,98,41,0.18), transparent 70%)',
            transform: 'translateZ(10px)',
          }}
        />
        <div
          className="absolute inset-0 rounded-full opacity-30 mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.4), transparent 70%)',
            filter: 'blur(20px)',
            transform: 'translateZ(15px)',
            animation: 'cloud-drift 180s linear infinite',
          }}
        />
        {/* prstence - přidána třetí vrstva */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: 'translateZ(-10px) rotateX(64deg) rotateZ(22deg)',
            filter: 'drop-shadow(0 2px 6px rgba(255,160,100,0.35))',
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: '160%',
              height: '36%',
              background:
                'radial-gradient(closest-side, rgba(255,200,150,0.36), rgba(255,170,110,0.16) 55%, transparent 70%)',
              maskImage: 'radial-gradient(ellipse at center, black 55%, transparent 66%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 55%, transparent 66%)',
              animation: 'ring-glide 16s linear infinite',
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[2px] opacity-70"
            style={{
              width: '190%',
              height: '42%',
              background:
                'radial-gradient(closest-side, rgba(255,220,180,0.18), rgba(255,160,100,0.09) 55%, transparent 70%)',
              maskImage: 'radial-gradient(ellipse at center, black 58%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 58%, transparent 70%)',
              animation: 'ring-glide 28s linear infinite reverse',
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[1px] opacity-50"
            style={{
              width: '220%',
              height: '48%',
              background:
                'radial-gradient(closest-side, rgba(255,240,200,0.12), rgba(255,180,120,0.06) 55%, transparent 70%)',
              maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 72%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 72%)',
              animation: 'ring-glide 22s linear infinite',
            }}
          />
        </div>
        {/* koule - vylepšena textura */}
        <div
          className="relative w-full h-full rounded-full overflow-hidden shadow-[inset_0_-20px_60px_rgba(0,0,0,0.65)]"
          style={{
            transform: 'translateZ(0px)',
            background:
              'radial-gradient(140% 100% at 30% 40%, rgba(0,0,0,0.8) 18%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.06) 60%, rgba(255,180,120,0.04) 66%), conic-gradient(from 10deg at 50% 50%, #7a1b18, #9b2f1a, #b3431e, #ca5a22, #d66e26, #e0832b, #d16d23, #b9481c, #8f2616, #7a1b18)',
            animation: 'planet-roll 120s linear infinite',
            filter: 'saturate(1.05) contrast(1.02)',
          }}
        >
          <div
            className="absolute inset-0 opacity-35 mix-blend-overlay"
            style={{
              background:
                'repeating-linear-gradient(115deg, rgba(255,210,120,0.08) 0 6px, transparent 6px 14px), repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0 4px, transparent 4px 12px)',
              animation: 'texture-shift 90s linear infinite',
              maskImage: 'radial-gradient(circle at 50% 50%, black 65%, transparent 78%)',
              WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 65%, transparent 78%)',
            }}
          />
          <div
            className="absolute -left-2 -top-2 w-1/2 h-1/2 rounded-full opacity-25"
            style={{
              background:
                'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.65), transparent 60%)',
              filter: 'blur(18px)',
            }}
          />
        </div>
        {/* měsíce - přidán třetí měsíc */}
        <div
          className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
          style={{ transform: 'translateZ(-40px) translate(-50%,-50%)' }}
        >
          <div
            className="relative [transform-origin:0_0]"
            style={{ transform: 'rotateZ(0deg) rotateX(62deg)', animation: 'orbit 26s linear infinite' }}
          >
            <div
              className="w-10 h-10 rounded-full shadow-xl"
              style={{
                transform: 'translateX(270px)',
                background: 'radial-gradient(circle at 35% 35%, #e0e0e0, #757575 70%)',
                boxShadow: 'inset -6px -8px 12px rgba(0,0,0,0.45)',
              }}
            />
          </div>
          <div
            className="relative [transform-origin:0_0]"
            style={{ transform: 'rotateZ(0deg) rotateX(68deg)', animation: 'orbit 18s linear infinite reverse' }}
          >
            <div
              className="w-6 h-6 rounded-full shadow-md"
              style={{
                transform: 'translateX(200px)',
                background: 'radial-gradient(circle at 35% 35%, #bfe0ff, #395a7a 70%)',
                boxShadow: 'inset -4px -6px 10px rgba(0,0,0,0.45)',
              }}
            />
          </div>
          <div
            className="relative [transform-origin:0_0]"
            style={{ transform: 'rotateZ(120deg) rotateX(65deg)', animation: 'orbit 32s linear infinite' }}
          >
            <div
              className="w-8 h-8 rounded-full shadow-lg"
              style={{
                transform: 'translateX(240px)',
                background: 'radial-gradient(circle at 35% 35%, #ffdab9, #8b4513 70%)',
                boxShadow: 'inset -5px -7px 11px rgba(0,0,0,0.45)',
              }}
            />
          </div>
        </div>
      </div>

      {/* LOĎ - vylepšena o senzory, lasery a více částic */}
      <Ship />

      {/* Navigace */}
      <div className="absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/games')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Zpět na hry</span>
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 text-center">
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
                LANCERS: VESMÍRNÁ ODYSEA
              </h1>
              <p className="text-gray-400 text-sm mt-1">Průzkumná mise u planety Kepler-452b</p>
            </div>

            <div className="flex items-center gap-2 text-yellow-400">
              <Sparkles size={20} />
              <span className="font-bold">ALPHA v0.3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-md rounded-lg p-6 border border-cyan-500/30 max-w-sm">
        <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full" style={{ animation: 'glimmer 2s ease-in-out infinite' }} />
          SYSTÉMOVÁ ANALÝZA
        </h3>
        <div className="space-y-1 text-sm text-gray-300">
          <p>Loď: <span className="text-white font-bold">HC Litvínov Starfire</span></p>
          <p>Lokace: <span className="text-orange-400">Kepler-452b</span></p>
          <p>Status: <span className="text-green-400">Skenování planety...</span></p>
          <p>Vzdálenost: <span className="text-yellow-400">1,402 světelných let</span></p>
        </div>
      </div>

      {/* Akce */}
      <div className="absolute bottom-8 right-8 space-y-3">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30 flex items-center gap-2">
          <span style={{ animation: 'glimmer 2s ease-in-out infinite' }}>📡</span>
          Skenovat planetu
        </button>
        <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg shadow-green-500/30 flex items-center gap-2">
          <span style={{ animation: 'glimmer 2s ease-in-out infinite' }}>🛸</span>
          Vyslat sondu
        </button>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center gap-2 opacity-50 cursor-not-allowed">
          <span>⚔️</span>
          Bojové systémy (brzy)
        </button>
      </div>

      {/* Globální keyframes - přidány nové animace */}
      <style jsx global>{`
        [data-scene] { transform-style: preserve-3d; }
        [data-scene] .tilt {
          transform: rotateX(calc(var(--my) * 6deg)) rotateY(calc(var(--mx) * -10deg));
        }
        @keyframes twinkle {
          0% { opacity: 0.45; transform: translateZ(var(--z,0)) scale(1); }
          100% { opacity: 1; transform: translateZ(var(--z,0)) scale(1.18); }
        }
        @keyframes shoot {
          0% { transform: translate3d(0,0,0); opacity: 0; }
          7% { opacity: 1; }
          100% { transform: translate3d(-85vw, 50vh, 0); opacity: 0; }
        }
        @keyframes planet-roll {
          0% { filter: hue-rotate(0deg) saturate(1.05); }
          50% { filter: hue-rotate(-6deg) saturate(1.08); }
          100% { filter: hue-rotate(0deg) saturate(1.05); }
        }
        @keyframes ring-glide { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
        @keyframes texture-shift { 0% { background-position: 0 0; } 100% { background-position: 1200px 0; } }
        @keyframes orbit { 0% { transform: rotateZ(0deg) } 100% { transform: rotateZ(360deg) } }
        @keyframes float-ship { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        @keyframes engine-flicker { 0%,100% { opacity: .75; transform: scaleY(1) } 50% { opacity: 1; transform: scaleY(1.12) } }
        @keyframes trail { 0% { opacity:.9; transform: translateY(0) scaleX(1) } 100% { opacity:0; transform: translateY(120px) scaleX(.6) } }
        @keyframes glimmer { 0%{opacity:.2} 50%{opacity:.8} 100%{opacity:.2} }
        @keyframes cloud-drift { 0% { background-position: 0 0; } 100% { background-position: 800px 0; } }
        @keyframes sensor-pulse { 0% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.2); } 100% { opacity: 0.3; transform: scale(1); } }
      `}</style>
    </div>
  );
}

/* ================== Ship & parts (JS only) ================== */

function Ship() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({ // více částic pro realističtější výfuk
        id: i,
        delay: Math.random() * 0.9,
        dur: 0.8 + Math.random() * 1.4,
        x: (Math.random() - 0.5) * 28,
        w: 16 + Math.random() * 22,
      })),
    []
  );

  return (
    <div
      className="absolute bottom-[18vh] left-1/2 -translate-x-1/2 [transform-style:preserve-3d] tilt"
      style={{
        transform:
          'translateZ(-120px) rotateX(calc(var(--my)*4deg)) rotateY(calc(var(--mx)*-8deg))',
        filter: 'drop-shadow(0 8px 28px rgba(0, 200, 255, 0.25))',
      }}
    >
      <div className="relative w-[24rem] h-[12rem]" style={{ animation: 'float-ship 6s ease-in-out infinite' }}>
        {/* stín */}
        <div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-56 h-12 rounded-full blur-2xl opacity-40"
          style={{
            background: 'radial-gradient(closest-side, rgba(0,0,0,0.6), transparent 70%)',
            transform: 'translateZ(-200px)',
          }}
        />
        {/* štít - vylepšeno o vrstvu */}
        <div className="absolute inset-0 -z-10">
          <div
            className="w-full h-full rounded-[40px] blur-3xl opacity-40"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(0,255,255,0.08), rgba(160,140,255,0.06), rgba(255,120,220,0.04))',
              transform: 'translateZ(-60px)',
            }}
          />
          <div
            className="w-full h-full rounded-[40px] blur-xl opacity-20"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(0,255,255,0.12), transparent 70%)',
              transform: 'translateZ(-50px)',
            }}
          />
        </div>

        {/* trup */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] h-[8.5rem] rounded-[120px] bg-gradient-to-br from-gray-500 via-gray-700 to-gray-900 shadow-2xl relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
            style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 10px)' }}
          />
          <div
            className="absolute inset-0 rounded-[120px] pointer-events-none"
            style={{
              background:
                'linear-gradient(120deg, rgba(255,255,255,0.22), transparent 25%, transparent 75%, rgba(255,255,255,0.08))',
              mixBlendMode: 'screen',
            }}
          />
          {/* logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl">
              <span className="text-white text-xl font-black">HC</span>
              <div className="absolute inset-0 rounded-full bg-red-500/30 blur-md" style={{ animation: 'glimmer 2.6s ease-in-out infinite' }} />
            </div>
          </div>
          {/* nápis */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 tracking-[.35em] text-[10px] text-gray-300/80">STARFIRE</div>
          {/* kokpit */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 w-36 h-12 rounded-[18px] bg-gradient-to-b from-cyan-300 via-blue-400 to-blue-700 shadow-[inset_0_-8px_16px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-0 rounded-[18px] bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
            <div className="absolute left-1/2 -translate-x-1/2 top-1 w-20 h-[2px] bg-white/60 blur-[1px]" />
          </div>
          {/* boční panely */}
          <SidePanel side="left" />
          <SidePanel side="right" />
        </div>

        {/* křídla */}
        <Wing side="left" />
        <Wing side="right" />

        {/* můstek */}
        <div className="absolute top-[-18px] left-1/2 -translate-x-1/2 w-28 h-9 rounded-t-2xl bg-gradient-to-b from-gray-500 to-gray-700 shadow-xl" />
        {/* anténa */}
        <div className="absolute top-[-52px] left-1/2 -translate-x-1/2">
          <div className="w-[2px] h-12 bg-gradient-to-t from-gray-600 to-gray-300 relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)]" style={{ animation: 'glimmer 2.4s ease-in-out infinite' }} />
          </div>
        </div>

        {/* nové: senzory - pulzující skenovací paprsek */}
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="w-[3px] h-48 bg-gradient-to-t from-cyan-400 to-transparent" style={{ animation: 'sensor-pulse 3s ease-in-out infinite' }} />
            <div className="absolute inset-0 w-[3px] h-48 bg-gradient-to-t from-blue-400/50 to-transparent blur-sm" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 border-2 border-cyan-400/50 rounded-full" style={{ animation: 'sensor-pulse 3s ease-in-out infinite' }} />
          </div>
        </div>

        {/* motory */}
        <Engines particles={particles} />
      </div>
    </div>
  );
}

function SidePanel({ side }) {
  const isLeft = side === 'left';
  const grad = isLeft ? 'bg-gradient-to-r' : 'bg-gradient-to-l';
  const base = isLeft ? 'absolute top-1/2 -translate-y-1/2 left-4' : 'absolute top-1/2 -translate-y-1/2 right-4';
  return (
    <div className={`${base} w-16 h-8 rounded-lg ${grad} from-gray-900 to-gray-700 shadow-inner`}>
      <div className="flex gap-1 items-center justify-center h-full">
        <div className="w-1 h-4 bg-cyan-400/70" />
        <div className="w-1 h-5 bg-cyan-400/70" />
        <div className="w-1 h-3 bg-cyan-400/70" />
        <div className="w-1 h-6 bg-cyan-400/70" />
      </div>
    </div>
  );
}

function Wing({ side }) {
  const isLeft = side === 'left';
  const skew = isLeft ? 'skew-y-12' : '-skew-y-12';
  const grad = isLeft ? 'bg-gradient-to-r' : 'bg-gradient-to-l';
  return (
    <div
      className={`absolute top-1/2 ${isLeft ? '-left-24' : '-right-24'} -translate-y-1/2 [transform-style:preserve-3d]`}
      style={{ transform: `translateZ(-30px) ${isLeft ? 'rotateY(8deg)' : 'rotateY(-8deg)'}` }}
    >
      <div className={`relative w-28 h-10 shadow-2xl ${skew} ${grad} from-gray-900 via-gray-700 to-gray-600`}>
        <div className={`absolute inset-0 ${isLeft ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-transparent to-white/8`} />
        <div className={`absolute top-1/2 ${isLeft ? 'left-2' : 'right-2'} -translate-y-1/2 w-14 h-[3px] bg-red-500/80`} />
        <div className={`${isLeft ? 'absolute right-1' : 'absolute left-1'} top-1/2 -translate-y-1/2`}>
          <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,60,60,0.6)]" style={{ animation: 'glimmer 2s ease-in-out infinite' }} />
        </div>
      </div>
      <div className={`absolute -bottom-2 ${isLeft ? 'left-0' : 'right-0'}`}>
        <div className="w-4 h-9 bg-gradient-to-b from-blue-400/50 to-cyan-500/50 blur-[2px]" style={{ animation: 'engine-flicker 1.6s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

function Engines({ particles }) {
  return (
    <>
      {/* boční trysky */}
      {['-24%', '24%'].map((offset, i) => (
        <div key={i} className="absolute -bottom-6 left-1/2" style={{ transform: `translateX(${offset})` }}>
          <div className="relative">
            <div className="w-7 h-16 bg-gradient-to-b from-blue-300 via-cyan-400 to-white blur-lg" style={{ animation: 'engine-flicker 1.4s ease-in-out infinite' }} />
            <div className="absolute inset-0 w-7 h-16 bg-gradient-to-b from-blue-400/50 to-cyan-500/50 blur-sm" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-10 h-24 bg-gradient-to-b from-cyan-400/30 to-transparent blur-xl" />
          </div>
        </div>
      ))}
      {/* hlavní motor */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
        <div className="relative">
          <div className="w-12 h-24 bg-gradient-to-b from-orange-300 via-yellow-400 to-white blur-lg" style={{ animation: 'engine-flicker 1.2s ease-in-out infinite' }} />
          <div className="absolute inset-0 w-12 h-24 bg-gradient-to-b from-red-400/50 to-orange-500/50 blur-sm" />
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-16 h-36 bg-gradient-to-b from-orange-400/40 to-transparent blur-xl" />
        </div>
        {/* částice výfuku */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute h-[2px] rounded-full bg-gradient-to-r from-white via-yellow-200 to-transparent"
              style={{ width: `${p.w}px`, left: `${p.x}px`, animation: `trail ${p.dur}s ease-out ${p.delay}s infinite`, opacity: 0.9 }}
            />
          ))}
        </div>
      </div>
      {/* poziční světla */}
      <div className="absolute top-8 left-8 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_12px_rgba(255,0,0,0.7)]" style={{ animation: 'glimmer 2.2s ease-in-out infinite' }} />
      <div className="absolute top-8 right-8 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_12px_rgba(0,255,0,0.7)]" style={{ animation: 'glimmer 2.2s ease-in-out infinite' }} />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.7)]" style={{ animation: 'glimmer 2.8s ease-in-out infinite' }} />
    </>
  );
}