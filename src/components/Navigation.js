'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Shield, Menu, X, ChevronDown, Users, Trophy, 
  Calendar, Clock, Star, Gamepad2, User, LogIn,
  FileText, BarChart3, Award, LogOut, Flame,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGamesDropdownOpen, setIsGamesDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const gamesDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const { user, loading } = useAuth();

  // Detekce scrollu pro změnu pozadí navigace
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Zavření dropdownů při kliknutí mimo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gamesDropdownRef.current && !gamesDropdownRef.current.contains(event.target)) {
        setIsGamesDropdownOpen(false);
      }
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
      setIsProfileDropdownOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { 
      id: 'soupisky',
      label: 'Soupisky', 
      href: '/soupisky',
      icon: <Users size={18} />
    },
    { 
      id: 'vysledky',
      label: 'Výsledky', 
      href: '/vysledky',
      icon: <Trophy size={18} />
    },
    { 
      id: 'clanky',
      label: 'Články', 
      href: '/clanky',
      icon: <FileText size={18} />
    },
    { 
      id: 'tabulky',
      label: 'Tabulky', 
      href: '/tabulky',
      icon: <BarChart3 size={18} />
    },
    { 
      id: 'historie',
      label: 'Historie', 
      href: '/historie',
      icon: <Clock size={18} />
    },
    { 
      id: 'sin-slavy',
      label: 'Síň slávy', 
      href: '/sin-slavy',
      icon: <Award size={18} />
    }
  ];

  const games = [
    {
      id: 'cards',
      name: 'HC Cards',
      description: 'Sbírej hokejové kartičky!',
      href: '/games/cards',
      icon: '🃏',
      badge: 'NOVÁ HRA'
    }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-black shadow-2xl' : 'bg-black/90 backdrop-blur-lg'
    }`}>
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
            
            {/* Games dropdown */}
            <div className="relative" ref={gamesDropdownRef}>
              <button
                onClick={() => setIsGamesDropdownOpen(!isGamesDropdownOpen)}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 font-semibold"
              >
                <Gamepad2 size={18} />
                <span>Hry</span>
                <ChevronDown className={`transition-transform ${isGamesDropdownOpen ? 'rotate-180' : ''}`} size={16} />
              </button>
              
              {isGamesDropdownOpen && (
                <div className="absolute top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
                  <div className="p-2">
                    {games.map((game) => (
                      <Link
                        key={game.id}
                        href={game.href}
                        className="block p-4 rounded-lg hover:bg-red-50 transition-all group"
                        onClick={() => setIsGamesDropdownOpen(false)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{game.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                                {game.name}
                              </h3>
                              {game.badge && (
                                <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                                  {game.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{game.description}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 p-3 bg-gray-50">
                    <p className="text-xs text-gray-500 text-center">
                      Více her přijde brzy! 🎮
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative ml-4" ref={profileDropdownRef}>
              {!loading && (
                <>
                  {user ? (
                    <>
                      <button
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all font-semibold"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                          <User size={16} className="text-white" />
                        </div>
                        <span className="max-w-[100px] truncate">
                          {user.displayName || user.email?.split('@')[0] || 'Profil'}
                        </span>
                        <ChevronDown className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                      </button>
                      
                      {isProfileDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
                          <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                                <User size={24} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-gray-900 truncate">
                                  {user.displayName || 'Hráč'}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-2">
                            <Link
                              href="/games/cards"
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-all text-gray-700 hover:text-red-600"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <Flame size={18} />
                              <span>Moje HC Cards</span>
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
                    // REGISTRACE DOČASNĚ VYPNUTA - místo tlačítka zobrazíme informaci
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-400 rounded-lg cursor-not-allowed">
                      <AlertCircle size={18} />
                      <span className="text-sm">Registrace dočasně nedostupná</span>
                    </div>
                    
                    // PŮVODNÍ KÓD PRO REGISTRACI (ZAKOMENTOVANÝ):
                    /* 
                    <Link
                      href="/games/cards"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-bold shadow-lg"
                    >
                      <LogIn size={18} />
                      <span>Přihlásit se</span>
                    </Link>
                    */
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
                <div className="px-4 py-2 text-red-600 font-bold">Hry</div>
                {games.map((game) => (
                  <Link
                    key={game.id}
                    href={game.href}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-2xl">{game.icon}</span>
                    <div>
                      <div className="font-bold">{game.name}</div>
                      <div className="text-xs text-gray-500">{game.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-red-600 font-bold">Profil</div>
                    <div className="px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {user.displayName || 'Hráč'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all font-semibold"
                    >
                      <LogOut size={18} />
                      <span>Odhlásit se</span>
                    </button>
                  </>
                ) : (
                  // REGISTRACE DOČASNĚ VYPNUTA - místo tlačítka zobrazíme informaci
                  <div className="flex items-center justify-center gap-2 mx-4 px-4 py-3 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
                    <AlertCircle size={18} />
                    <span className="text-sm font-semibold">Registrace dočasně nedostupná</span>
                  </div>
                  
                  // PŮVODNÍ KÓD PRO REGISTRACI (ZAKOMENTOVANÝ):
                  /*
                  <Link
                    href="/games/cards"
                    className="flex items-center justify-center gap-2 mx-4 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn size={18} />
                    <span>Přihlásit se</span>
                  </Link>
                  */
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
}