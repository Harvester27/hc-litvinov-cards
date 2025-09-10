'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield, Menu, X, ChevronDown, Users, Trophy,
  Calendar, Clock, Star, Gamepad2, User, LogIn,
  FileText, BarChart3, Award, LogOut,
  AlertCircle, Coins, Zap, Package, Gift, Swords
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, createUserProfile } from '@/lib/firebaseProfile';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const profileDropdownRef = useRef(null);
  const { user, loading } = useAuth();

  // Změna pozadí navigace při scrollu
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Načíst profil po přihlášení
  useEffect(() => {
    if (user && !profile && !profileLoading) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user || profileLoading) return;
    
    setProfileLoading(true);
    setProfileError(false);
    
    try {
      console.log('Načítám profil pro uživatele:', user.uid);
      
      // Nejdřív zkusit načíst existující profil
      let profileData = await getUserProfile(user.uid);
      
      // Pokud profil neexistuje, AUTOMATICKY ho vytvořit
      if (!profileData) {
        console.log('Profil neexistuje, vytvářím nový...');
        const displayName = user.displayName || `Hráč${Math.floor(Math.random() * 9999)}`;
        profileData = await createUserProfile(user.uid, user.email, displayName);
        console.log('Nový profil vytvořen:', profileData);
        
        // Počkat chvíli, aby se profil stačil uložit do databáze
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Zkusit načíst znovu pro jistotu
        profileData = await getUserProfile(user.uid);
        if (!profileData) {
          // Pokud stále není, použít lokální data
          profileData = {
            displayName: displayName,
            email: user.email,
            level: 1,
            xp: 0,
            credits: 12000,
            collectedCards: [],
            pendingRewards: 0,
            avatar: null
          };
        }
      }
      
      console.log('Profil načten:', profileData);
      setProfile(profileData);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Chyba při načítání profilu:', error);
      
      // Pokud je to permission error a máme méně než 3 pokusy, zkusit znovu
      if (error.code === 'permission-denied' && retryCount < 3) {
        console.log(`Pokus ${retryCount + 1}/3 - zkouším znovu za 2 sekundy...`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => loadProfile(), 2000);
      } else {
        setProfileError(true);
        
        // Použít fallback profil
        const fallbackProfile = {
          displayName: user.displayName || `Hráč${Math.floor(Math.random() * 9999)}`,
          email: user.email,
          level: 1,
          xp: 0,
          credits: 12000,
          collectedCards: [],
          pendingRewards: 0,
          avatar: null
        };
        setProfile(fallbackProfile);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Zavírání dropdownu při kliku mimo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setProfile(null); // Vyčistit profil při odhlášení
      setIsProfileDropdownOpen(false);
      setRetryCount(0);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { id: 'soupisky', label: 'Soupisky', href: '/soupisky', icon: <Users size={18} /> },
    { id: 'vysledky', label: 'Výsledky', href: '/vysledky', icon: <Trophy size={18} /> },
    { id: 'clanky', label: 'Články', href: '/clanky', icon: <FileText size={18} /> },
    { id: 'tabulky', label: 'Tabulky', href: '/tabulky', icon: <BarChart3 size={18} /> },
    { id: 'turnaje', label: 'Turnaje', href: '/turnaje', icon: <Swords size={18} /> },
    { id: 'historie', label: 'Historie', href: '/historie', icon: <Clock size={18} /> },
    { id: 'sin-slavy', label: 'Síň slávy', href: '/sin-slavy', icon: <Award size={18} /> },
    { id: 'hry', label: 'Hry', href: '/games', icon: <Gamepad2 size={18} /> },
  ];

  const level = profile?.level ?? 1;
  const credits = profile?.credits ?? 0;
  const displayName = profile?.displayName || user?.displayName || 'Hráč';
  const pendingRewards = profile?.pendingRewards || 0;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-black shadow-2xl' : 'bg-black/90 backdrop-blur-lg'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-28">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-24 h-24 relative group-hover:scale-110 transition-transform">
              <Image
                src="/images/loga/lancers-logo.png"
                alt="HC Litvínov Lancers"
                width={96}
                height={96}
                className="object-contain filter drop-shadow-lg"
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-black text-xl">LITVÍNOV</div>
              <div className="text-red-500 text-sm font-black -mt-1">LANCERS</div>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 font-semibold"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Profile dropdown */}
            <div className="relative ml-4" ref={profileDropdownRef}>
              {!loading && (
                <>
                  {user ? (
                    <>
                      <button
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        className="flex items-center gap-3 px-3 py-2 text-gray-100 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                      >
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center ring-2 ring-white/10 relative">
                          {profile?.avatar ? (
                            <Image
                              src={profile.avatar}
                              alt="Avatar"
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={20} className="text-white" />
                          )}
                          {pendingRewards > 0 && (
                            <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                              {pendingRewards}
                            </div>
                          )}
                        </div>

                        {/* User info */}
                        <div className="text-left">
                          <div className="font-semibold text-sm leading-tight">
                            {displayName}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-400/30">
                              <Zap size={12} className="mr-1" />
                              Lvl {level}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/20 text-green-300 ring-1 ring-green-400/30">
                              <Coins size={12} className="mr-1" />
                              {credits.toLocaleString('cs-CZ')}
                            </span>
                          </div>
                        </div>

                        <ChevronDown className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                      </button>

                      {isProfileDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
                          {/* Profile header */}
                          <div className="p-4 bg-gradient-to-r from-red-600 to-red-700">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 rounded-full overflow-hidden bg-white p-0.5 relative">
                                {profile?.avatar ? (
                                  <Image
                                    src={profile.avatar}
                                    alt="Avatar"
                                    width={64}
                                    height={64}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                                    <User size={28} className="text-white" />
                                  </div>
                                )}
                                {pendingRewards > 0 && (
                                  <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                                    {pendingRewards}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 text-white">
                                <div className="font-bold text-lg">{displayName}</div>
                                <div className="text-xs opacity-90">{user.email}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-500/20 text-yellow-100 ring-1 ring-yellow-300/40">
                                    <Zap size={12} className="mr-1" />
                                    Level {level}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-300/40">
                                    <Coins size={12} className="mr-1" />
                                    {credits.toLocaleString('cs-CZ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* XP Progress bar */}
                          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">XP Progress</span>
                              <span className="text-xs text-gray-600">{profile?.xp || 0} XP</span>
                            </div>
                            <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-red-600 to-red-700 transition-all"
                                style={{ width: '30%' }}
                              />
                            </div>
                          </div>

                          <div className="p-2">
                            {pendingRewards > 0 && (
                              <Link
                                href="/profil/odmeny"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-all text-gray-700 hover:text-red-600 relative"
                                onClick={() => setIsProfileDropdownOpen(false)}
                              >
                                <Gift size={18} />
                                <span>Odměny za kvízy</span>
                                <span className="absolute right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                                  {pendingRewards} nové
                                </span>
                              </Link>
                            )}
                            <Link
                              href="/sbirka-karet"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-all text-gray-700 hover:text-red-600"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <Package size={18} />
                              <span>Sbírka karet</span>
                            </Link>
                            <Link
                              href="/profil"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-all text-gray-700 hover:text-red-600"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <User size={18} />
                              <span>Můj profil</span>
                            </Link>
                            <Link
                              href="/uspechy"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-all text-gray-700 hover:text-red-600"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <Trophy size={18} />
                              <span>Úspěchy</span>
                            </Link>
                            <Link
                              href="/zebricek"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-all text-gray-700 hover:text-red-600"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <Trophy size={18} />
                              <span>Žebříček hráčů</span>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-all text-red-600 hover:text-red-700"
                            >
                              <LogOut size={18} />
                              <span>Odhlásit se</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // Tlačítko pro přihlášení/registraci
                    <Link
                      href="/auth"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <LogIn size={18} />
                      <span>Přihlásit se</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white hover:text-red-500 transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white rounded-b-2xl border-t border-gray-200 animate-slideDown">
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-2 mt-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-red-600 font-bold">Profil</div>
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center ring-2 ring-red-200/40">
                          <User size={24} className="text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{displayName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-500/20 text-yellow-700">
                              <Zap size={12} className="mr-1" />
                              Lvl {level}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-700">
                              <Coins size={12} className="mr-1" />
                              {credits.toLocaleString('cs-CZ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/zebricek"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Trophy size={18} />
                      <span>Žebříček hráčů</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all font-semibold"
                    >
                      <LogOut size={18} />
                      <span>Odhlásit se</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth"
                    className="flex items-center justify-center gap-2 mx-4 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn size={18} />
                    <span>Přihlásit se / Registrovat</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </nav>
  );
}