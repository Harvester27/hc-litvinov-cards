'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Navigation from '@/components/Navigation';
import {
  Trophy,
  Star,
  Calendar,
  ArrowLeft,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Share2,
  Crown,
  Shield,
  Medal,
  Award,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function SinSlavyPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Vše');
  const [sortDir, setSortDir] = useState('desc'); // 'asc' | 'desc'
  const [selected, setSelected] = useState(null); // trophy object

  // ====== DATA ==============================================================
  const trophies = useMemo(
    () => [
      {
        id: 1,
        name: 'Slacia Cup 2008',
        year: 2008,
        image: '/trofeje/SlacaCup2008.png',
        description: 'Vítězství v prestižním mezinárodním turnaji Slavia Cup.',
        category: 'Mezinárodní turnaj',
        details: 'Finále: HC Litvínov – Slavia Praha 4:2',
        icon: null,
      },
      {
        id: 2,
        name: 'Slacia Cup 2008 - 1. místo',
        year: 2008,
        image: '/trofeje/SlacaCup20081.png',
        description: 'Zlatá medaile z prestižního mezinárodního turnaje Slavia Cup.',
        category: 'Mezinárodní turnaj',
        details: 'Dominantní výkon v celém turnaji, neporaženi.',
        icon: null,
      },
      {
        id: 3,
        name: 'Sindy Cup 2009',
        year: 2009,
        image: '/trofeje/SindyCup2009.png',
        description: 'Triumf na mezinárodním turnaji Sindy Cup.',
        category: 'Mezinárodní turnaj',
        details: 'Finále: HC Litvínov – HC Kometa Brno 5:3',
        icon: null,
      },
      {
        id: 4,
        name: 'Pohár Prezidenta ČR',
        year: 2010,
        image: '/trofeje/PoharPCR.png',
        description: 'Vítězství v prestižním Poháru prezidenta České republiky.',
        category: 'Domácí pohár',
        details: 'Finále: HC Litvínov – Sparta Praha 3:1. Historický úspěch.',
        icon: null,
      },
      {
        id: 5,
        name: 'AMC Trophy',
        year: 2011,
        image: '/trofeje/AMC.png',
        description: 'Vítězství v mezinárodním turnaji AMC.',
        category: 'Mezinárodní turnaj',
        details: 'Finále proti týmu z KHL, vítězství 4:2.',
        icon: null,
      },
      {
        id: 6,
        name: 'Extraliga – Mistr',
        year: 2015,
        image: null,
        description: 'Mistrovský titul v české Extralize.',
        category: 'Domácí soutěž',
        details: 'Finálová série 4:2 proti Liberci.',
        icon: <Trophy className="w-16 h-16" aria-hidden />,
      },
      {
        id: 7,
        name: 'European Trophy',
        year: 2012,
        image: null,
        description: 'Triumf v European Trophy.',
        category: 'Mezinárodní turnaj',
        details: 'Neporaženi v celém turnaji.',
        icon: <Shield className="w-16 h-16" aria-hidden />,
      },
      {
        id: 8,
        name: 'Základní část',
        year: 2013,
        image: null,
        description: 'Vítězství v základní části Extraligy.',
        category: 'Domácí soutěž',
        details: 'Historický rekord 108 bodů.',
        icon: <Medal className="w-16 h-16" aria-hidden />,
      },
      {
        id: 9,
        name: 'Memoriál I. Hlinky',
        year: 2018,
        image: null,
        description: 'Vítězství na Memoriálu Ivana Hlinky.',
        category: 'Mezinárodní turnaj',
        details: 'Finále: HC Litvínov – Mountfield HK 5:3.',
        icon: <Award className="w-16 h-16" aria-hidden />,
      },
      {
        id: 10,
        name: 'Spengler Cup',
        year: 2009,
        image: null,
        description: 'Účast ve finále Spengler Cupu.',
        category: 'Mezinárodní turnaj',
        details: 'Historický úspěch v Davosu.',
        icon: <Trophy className="w-16 h-16" aria-hidden />,
      },
      {
        id: 11,
        name: 'Pohár T. Radějovského',
        year: 2014,
        image: null,
        description: 'Vítězství v poháru T. Radějovského.',
        category: 'Domácí pohár',
        details: 'Finále: HC Litvínov – Mladá Boleslav 4:3.',
        icon: <Star className="w-16 h-16" aria-hidden />,
      },
      {
        id: 12,
        name: 'Tipsport Cup',
        year: 2011,
        image: null,
        description: 'Triumf v Tipsport Cupu.',
        category: 'Domácí pohár',
        details: 'Vítězství ve všech zápasech.',
        icon: <Crown className="w-16 h-16" aria-hidden />,
      },
      {
        id: 13,
        name: 'Extraliga – 2. místo',
        year: 2019,
        image: null,
        description: 'Stříbrné medaile v Extralize.',
        category: 'Domácí soutěž',
        details: 'Finále proti Třinci.',
        icon: <Medal className="w-16 h-16" aria-hidden />,
      },
      {
        id: 14,
        name: 'Straubing Tigers Cup 2025',
        year: 2025,
        image: '/trofeje/Straubing2025.png',
        description: 'Vítězství na prestižním mezinárodním turnaji v Německu.',
        category: 'Mezinárodní turnaj',
        details: 'Finále: HC Litvínov – Straubing Tigers 6:4. Historický triumf na německém ledě.',
        icon: null,
      },
    ],
    []
  );

  const categories = useMemo(
    () => ['Vše', ...Array.from(new Set(trophies.map((t) => t.category)))],
    [trophies]
  );

  // ====== FILTERING & SORTING ==============================================
  const filtered = useMemo(() => {
    let arr = [...trophies];
    if (category !== 'Vše') arr = arr.filter((t) => t.category === category);

    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.details && t.details.toLowerCase().includes(q))
      );
    }

    arr.sort((a, b) => (sortDir === 'asc' ? a.year - b.year : b.year - a.year));
    return arr;
  }, [trophies, category, query, sortDir]);

  const lastYear = useMemo(() => Math.max(...trophies.map((t) => t.year)), [trophies]);
  const stats = useMemo(() => ({
    total: trophies.length,
    mezinarodni: trophies.filter((t) => t.category === 'Mezinárodní turnaj').length,
    domaci: trophies.filter((t) => t.category === 'Domácí soutěž').length,
    pohary: trophies.filter((t) => t.category === 'Domácí pohár').length,
  }), [trophies]);

  // ====== MODAL NAVIGATION ==================================================
  const openById = useCallback((id) => {
    const idx = filtered.findIndex((t) => t.id === id);
    if (idx !== -1) setSelected({ item: filtered[idx], index: idx });
  }, [filtered]);

  const closeModal = useCallback(() => setSelected(null), []);
  const showPrev = useCallback(() => {
    if (!selected) return;
    const i = (selected.index - 1 + filtered.length) % filtered.length;
    setSelected({ item: filtered[i], index: i });
  }, [selected, filtered]);
  const showNext = useCallback(() => {
    if (!selected) return;
    const i = (selected.index + 1) % filtered.length;
    setSelected({ item: filtered[i], index: i });
  }, [selected, filtered]);

  useEffect(() => {
    const onKey = (e) => {
      if (!selected) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, closeModal, showPrev, showNext]);

  // Deep-link: #trophy-<id>
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    const id = hash.startsWith('#trophy-') ? Number(hash.replace('#trophy-', '')) : null;
    if (id) setTimeout(() => openById(id), 50);
  }, [openById]);

  // ====== HELPERS ===========================================================
  const copyLink = async (id) => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#trophy-${id}`;
      await navigator.clipboard.writeText(url);
      alert('Odkaz zkopírován do schránky');
    } catch (e) {
      console.warn(e);
    }
  };

  // ====== UI ================================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navigation />

      {/* HERO */}
      <section className="relative pt-28 pb-10 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.15),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(234,88,12,0.12),transparent_35%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6">
            <ArrowLeft size={18} />
            <span>Zpět na hlavní stránku</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Síň slávy <span className="text-amber-400">HC Litvínov Lancers</span>
              </h1>
              <p className="text-gray-300 mt-3">
                Prozkoumej naše trofeje, rekordy a milníky. Teď v nové vitríně git add .se „světlem reflektoru" při najetí myší.
              </p>
            </div>
            {/* quick stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <StatCard icon={<Trophy />} label="Trofejí" value={stats.total} />
              <StatCard icon={<Shield />} label="Domácí" value={stats.domaci} />
              <StatCard icon={<Award />} label="Poháry" value={stats.pohary} />
            </div>
          </div>
        </div>
      </section>

      {/* FILTRY */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 md:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300"><Filter size={16} /> Kategorie:</div>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition ${
                    category === c
                      ? 'bg-amber-500/20 border-amber-400/40 text-amber-200'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2 w-full lg:w-80">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Hledat trofej, finále, rok…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-amber-400/50"
                />
              </div>
              <button
                onClick={() => setSortDir((p) => (p === 'asc' ? 'desc' : 'asc'))}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:bg-white/10"
                title="Přepnout řazení"
              >
                <ArrowUpDown size={16} />
                {sortDir === 'asc' ? 'Od nejstarších' : 'Od nejnovějších'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* VITRÍNA */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-slate-800/50 to-slate-900/70 p-4 md:p-6 overflow-hidden">
          {/* sklo – odlesk */}
          <div className="pointer-events-none absolute -inset-x-20 -top-1/3 h-1/2 rotate-6 bg-gradient-to-b from-white/15 to-transparent blur-2xl" />
          {/* police */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 120px)'
            }}
          />
          {/* jemný šum */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '3px 3px'
            }}
          />

          <div className="relative z-10">
            {filtered.length === 0 ? (
              <div className="text-center text-gray-400 py-20">Nic nenalezeno. Zkus upravit filtr nebo hledání.</div>
            ) : (
              <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((t, i) => (
                  <TrophyCard
                    key={t.id}
                    t={t}
                    index={i}
                    onOpen={() => setSelected({ item: t, index: filtered.findIndex((x) => x.id === t.id) })}
                    onShare={() => copyLink(t.id)}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black/40 border-t border-white/10 mt-10">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400">
          © {new Date().getFullYear()} HC Litvínov Lancers • Oficiální stránky
        </div>
      </footer>

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-6"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 p-2 rounded-full bg-white/5 hover:bg-white/10"
                aria-label="Zavřít"
              >
                <X />
              </button>

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold">{selected.item.name}</h2>
                <span className="inline-flex items-center gap-2 text-sm text-gray-300"><Calendar size={16} /> {selected.item.year}</span>
              </div>

              <div className="relative mt-4 rounded-xl border border-white/10 bg-black/20 overflow-hidden aspect-[16/9]">
                {selected.item.image ? (
                  <Image src={selected.item.image} alt={selected.item.name} fill sizes="(max-width:768px) 100vw, 66vw" className="object-contain p-4" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    {selected.item.icon}
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs border border-amber-400/40 bg-amber-500/10 text-amber-200">
                    {selected.item.category}
                  </span>
                </div>
                <p className="text-gray-300">{selected.item.description}</p>
                {selected.item.details && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-amber-300 text-sm font-semibold mb-1">Detail</p>
                    <p className="text-gray-200">{selected.item.details}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button onClick={showPrev} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                  <ChevronLeft /> Předchozí
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={() => copyLink(selected.item.id)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                    <Share2 size={16} /> Sdílet
                  </button>
                  <button onClick={closeModal} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-100">
                    Zavřít
                  </button>
                </div>
                <button onClick={showNext} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                  Další <ChevronRight />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM INFO */}
      <section className="max-w-7xl mx-auto px-4 my-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
          Poslední trofej: <span className="text-white font-semibold">{lastYear}</span>. Počet mezinárodních: <span className="text-white font-semibold">{stats.mezinarodni}</span>.
        </div>
      </section>
    </div>
  );
}

// === Vitrína – karta s reflektorem =========================================
function TrophyCard({ t, index, onOpen, onShare }) {
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);

  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    setMx(e.clientX - r.left);
    setMy(e.clientY - r.top);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.02 }}
      onMouseMove={onMove}
      className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-slate-800/60 to-slate-900/60 p-4 overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10"
      style={{
        // CSS proměnné pro pozici reflektoru
        ['--mx']: `${mx}px`,
        ['--my']: `${my}px`,
      }}
    >
      {/* reflektor – spotlight následující kurzor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-200"
        style={{
          background:
            'radial-gradient(260px 180px at var(--mx) var(--my), rgba(255,241,200,0.28), rgba(255,241,200,0.12) 35%, transparent 60%)'
        }}
      />

      {/* jemná záře okolo karty */}
      <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition" aria-hidden>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-400/10 blur-3xl rounded-full" />
      </div>

      {/* police – stín pod kartou aby působila, že stojí na polici */}
      <div className="pointer-events-none absolute left-4 right-4 bottom-2 h-3 rounded-full bg-black/40 blur" />

      {/* Image / Icon */}
      <div className="relative aspect-[4/3] rounded-xl bg-black/25 border border-white/10 overflow-hidden mb-3">
        {t.image ? (
          <Image src={t.image} alt={t.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex items-center justify-center h-full">
            {t.icon}
          </div>
        )}
        {/* extra světelný kužel jen přes trofejní okno */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-200"
          style={{
            background:
              'radial-gradient(200px 140px at var(--mx) var(--my), rgba(255,255,255,0.22), transparent 60%)'
          }}
        />
        {/* třpytky */}
        <div className="pointer-events-none absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition">
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
      </div>

      {/* Content */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold leading-tight">{t.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
            <Calendar size={16} />
            <span>{t.year}</span>
          </div>
        </div>
        <span className="shrink-0 inline-flex px-2.5 py-1 rounded-full text-xs border border-amber-400/40 bg-amber-500/10 text-amber-200">
          {t.category}
        </span>
      </div>

      <p className="text-gray-300 text-sm mt-2 line-clamp-2">{t.description}</p>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={onOpen}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-100"
        >
          <Trophy size={16} /> Detail
        </button>
        <button
          onClick={onShare}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200"
          title="Zkopírovat odkaz na trofej"
        >
          <Share2 size={16} /> Sdílet
        </button>
      </div>
    </motion.article>
  );
}

// === Small helper component =================================================
function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-center">
      <div className="flex justify-center mb-1 opacity-80">{icon}</div>
      <div className="text-2xl font-extrabold text-amber-300 leading-none">{value}</div>
      <div className="text-xs text-gray-300 mt-1">{label}</div>
    </div>
  );
}