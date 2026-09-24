'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Award, BarChart3, ChevronDown, Clock, FileText, Gamepad2,
  LogIn, LogOut, Menu, Swords, Trophy, User, Users, X,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { label: 'Soupisky', href: '/soupisky', Icon: Users },
  { label: 'Výsledky', href: '/vysledky', Icon: Trophy },
  { label: 'Články', href: '/clanky', Icon: FileText },
  { label: 'Tabulky', href: '/tabulky', Icon: BarChart3 },
  { label: 'Turnaje', href: '/turnaje', Icon: Swords },
  { label: 'Historie', href: '/historie', Icon: Clock },
  { label: 'Síň slávy', href: '/sin-slavy', Icon: Award },
  { label: 'Hry', href: '/games', Icon: Gamepad2 },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!accountOpen) return;
    const onOutsideClick = (event) => {
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false);
    };
    const onEscape = (event) => {
      if (event.key === 'Escape') setAccountOpen(false);
    };
    document.addEventListener('pointerdown', onOutsideClick);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('pointerdown', onOutsideClick);
      document.removeEventListener('keydown', onEscape);
    };
  }, [accountOpen]);

  const logout = async () => {
    await signOut(auth);
    setAccountOpen(false);
    setMobileOpen(false);
    router.push('/');
  };

  const accountName = user?.displayName || user?.email?.split('@')[0] || 'Můj účet';

  return (
    <nav
      aria-label="Hlavní navigace"
      className={`fixed inset-x-0 top-0 z-40 border-b border-white/10 transition-colors duration-300 ${scrolled ? 'bg-black shadow-xl' : 'bg-black/90 backdrop-blur-lg'}`}
    >
      <div className="mx-auto max-w-[1500px] px-4">
        <div className="flex h-28 items-center justify-between gap-4">
          <Link href="/" className="group flex shrink-0 items-center gap-4" onClick={() => setMobileOpen(false)}>
            <Image
              src="/images/loga/lancers-logo.png"
              alt="HC Litvínov Lancers"
              width={96}
              height={96}
              className="h-24 w-24 object-contain transition-transform group-hover:scale-105"
            />
            <span className="hidden sm:block">
              <span className="block text-xl font-black text-white">LITVÍNOV</span>
              <span className="-mt-1 block text-sm font-black text-red-500">LANCERS</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {navItems.map(({ label, href, Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 font-semibold text-gray-300 transition-colors hover:bg-white/10 hover:text-white">
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            ))}

            <div className="relative ml-4" ref={accountRef}>
              {!loading && (user ? (
                <>
                  <button
                    type="button"
                    aria-expanded={accountOpen}
                    aria-controls="account-menu"
                    onClick={() => setAccountOpen((open) => !open)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-white transition-colors hover:bg-white/10"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-700"><User size={20} aria-hidden="true" /></span>
                    <span className="max-w-28 truncate text-sm font-semibold">{accountName}</span>
                    <ChevronDown size={16} className={accountOpen ? 'rotate-180' : ''} aria-hidden="true" />
                  </button>
                  {accountOpen && (
                    <div id="account-menu" className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 text-gray-900 shadow-2xl">
                      <div className="truncate border-b border-gray-200 px-3 py-2 text-xs text-gray-500">{user.email}</div>
                      <Link href="/profil" onClick={() => setAccountOpen(false)} className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-red-50">
                        <User size={18} aria-hidden="true" /> Můj účet
                      </Link>
                      <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-red-700 hover:bg-red-50">
                        <LogOut size={18} aria-hidden="true" /> Odhlásit se
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/auth" className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-red-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-600">
                  <LogIn size={18} aria-hidden="true" /> Přihlásit se
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? 'Zavřít nabídku' : 'Otevřít nabídku'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg p-2 text-white hover:bg-white/10 xl:hidden"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {mobileOpen && (
          <div id="mobile-navigation" className="max-h-[calc(100vh-7rem)] overflow-y-auto border-t border-gray-200 bg-white p-4 xl:hidden">
            {navItems.map(({ label, href, Icon }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-gray-800 hover:bg-red-50 hover:text-red-700">
                <Icon size={18} aria-hidden="true" /> {label}
              </Link>
            ))}
            <div className="mt-2 border-t border-gray-200 pt-3">
              {!loading && (user ? (
                <>
                  <div className="truncate px-4 py-2 text-sm text-gray-500">{user.email}</div>
                  <Link href="/profil" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-gray-800 hover:bg-red-50">
                    <User size={18} aria-hidden="true" /> Můj účet
                  </Link>
                  <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-semibold text-red-700 hover:bg-red-50">
                    <LogOut size={18} aria-hidden="true" /> Odhlásit se
                  </button>
                </>
              ) : (
                <Link href="/auth" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-3 font-semibold text-white">
                  <LogIn size={18} aria-hidden="true" /> Přihlásit se / Registrovat
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
