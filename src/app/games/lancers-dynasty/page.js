'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firebaseProfile';
import { 
  loadPlayerCollection, 
  savePlayerCollection, 
  addCardsToCollection, 
  updatePlayerCredits 
} from '@/lib/firebaseLancersDynasty';
import { 
  ArrowLeft, Package, Sparkles, User, TrendingUp, Coins,
  Star, BookOpen, Grid3x3, Send, Map
} from 'lucide-react';
import LancersDynastyCollection from '@/components/LancersDynastyCollection';
import TeamManager from '@/components/TeamManager';
import { 
  getDefaultAttributes, 
  getCardById, 
  calculateOverall 
} from '@/data/lancersDynasty/obycejneKartyLancers';

// Seznam hráčů se správnými pozicemi
const PLAYERS = [
  { id: 'adamschubadaobyc', name: 'Adam Schubada', position: 'Útočník' },
  { id: 'janschubadaobyc', name: 'Jan Schubada', position: 'Útočník' },
  { id: 'ostepanovskyobyc', name: 'Oldřich Štěpanovský', position: 'Útočník' },
  { id: 'ondrahrubyobyc', name: 'Ondřej Hrubý', position: 'Útočník' },
  { id: 'maternaobyc', name: 'Vašek Materna', position: 'Útočník' },
  { id: 'gustavtomanobyc', name: 'Gustav Toman', position: 'Útočník' },
  { id: 'mariandlugopolskyobyc', name: 'Marián Dlugopolský', position: 'Útočník' },
  { id: 'petrpetrovobyc', name: 'Petr Petrov', position: 'Útočník' },
  { id: 'pavelnovakobyc', name: 'Pavel Novák', position: 'Obránce' },
  { id: 'jindrabelingerobyc', name: 'Jindřich Belinger', position: 'Obránce' },
  { id: 'jiribelingerobyc', name: 'Jiří Belinger', position: 'Obránce' },
  { id: 'janhanusobyc', name: 'Jan Hanuš', position: 'Obránce' },
  { id: 'luboscoufalobyc', name: 'Luboš Coufal', position: 'Obránce' },
  { id: 'tomasturecekobyc', name: 'Tomáš Tureček', position: 'Obránce' },
  { id: 'vlastanistorobyc', name: 'Vlastimil Nistor', position: 'Brankář' },
  { id: 'michaelanovakovaobyc', name: 'Michaela Nováková', position: 'Brankář' }
];

// Komponenta pro zobrazení karty
const PlayerCard = ({ player, isRevealing, index, style, isInCollection = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    if (isRevealing) {
      setTimeout(() => {
        setIsFlipped(true);
        // Přidat září po flipu
        setTimeout(() => setShowGlow(true), 700);
      }, index * 200);
    } else if (isInCollection) {
      setIsFlipped(true);
    }
  }, [isRevealing, index, isInCollection]);

  return (
    <div 
      className="relative w-56 h-80 mx-auto preserve-3d"
      style={style}
    >
      {/* Záře kolem karty (jen při rozbalování) */}
      {showGlow && !isInCollection && (
        <div className="absolute inset-0 -m-4 animate-pulse">
          <div className="absolute inset-0 bg-gray-400/30 blur-xl rounded-3xl animate-glow" />
        </div>
      )}

      <div 
        className={`absolute inset-0 transition-all duration-700 preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Zadní strana - Otazník */}
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-4 border-gray-700 shadow-2xl flex items-center justify-center">
            <div className="text-6xl text-gray-600 animate-pulse">?</div>
          </div>
        </div>

        {/* Přední strana - Hráč */}
        <div 
          className="absolute inset-0 rotate-y-180 backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl border-4 border-gray-400 shadow-2xl overflow-hidden">
            {/* Header s pozicí a overall */}
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-2">
              <div className="flex justify-between items-center">
                <span className="text-white/90 text-xs font-bold uppercase">{player.position}</span>
                <div className="flex items-center gap-1">
                  <span className="text-white text-lg font-black">1</span>
                  <div className="text-xs text-gray-300">OVR</div>
                </div>
              </div>
            </div>

            {/* Obrázek hráče */}
            <div className="relative h-48 bg-gradient-to-b from-gray-600 to-gray-500 flex items-center justify-center">
              <img 
                src={`/CardGames/obyckartylancers/${player.id}.png`}
                alt={player.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 items-center justify-center hidden">
                <User className="text-gray-400" size={60} />
              </div>
            </div>

            {/* Jméno hráče a typ karty s logem */}
            <div className="flex-1 flex flex-col justify-center items-center py-4 px-3 bg-gradient-to-b from-gray-700 to-gray-800">
              <h3 className="text-white font-bold text-center text-base mb-3">
                {player.name}
              </h3>
              
              {/* Logo a typ karty */}
              <div className="flex items-center gap-2">
                <img 
                  src="/images/loga/lancers-logo.png"
                  alt="HC Litvínov"
                  className="h-6 w-6 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="text-gray-400 text-sm font-medium">
                  Obyčejná karta
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LancersDynastyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [openedCards, setOpenedCards] = useState([]);
  const [showCards, setShowCards] = useState(false);
  const [cardsAnimating, setCardsAnimating] = useState(false);
  const [currentView, setCurrentView] = useState('packs'); // 'packs', 'collection' nebo 'manager'
  const [myCollection, setMyCollection] = useState([]); // Sbírka z Firebase
  const [credits, setCredits] = useState(12000); // Kredity z Firebase
  const [user, setUser] = useState(null); // Firebase user
  const [authLoading, setAuthLoading] = useState(true); // Čekání na auth

  useEffect(() => {
    // Počkat na Firebase Auth
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        loadProfileAndCollection(firebaseUser);
      } else {
        setAuthLoading(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadProfileAndCollection = async (firebaseUser) => {
    try {
      // Načti profil
      const profileData = await getUserProfile(firebaseUser.uid);
      setProfile(profileData);
      setCredits(profileData.credits || 12000);
      
      // Načti sbírku z Firebase
      const dynastyData = await loadPlayerCollection(firebaseUser.uid);
      setMyCollection(dynastyData.collection || []);
      
      console.log('Loaded collection:', dynastyData.collection?.length || 0, 'cards');
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setAuthLoading(false);
      setLoading(false);
    }
  };

  const openPack = () => {
    setIsOpening(true);
    
    // Náhodně vybrat 3 karty
    const shuffled = [...PLAYERS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    // Animace otevírání
    setTimeout(() => {
      setOpenedCards(selected);
      setCardsAnimating(true);
      // Počkat na animaci karet shora dolů
      setTimeout(() => {
        setShowCards(true);
        setCardsAnimating(false);
      }, 800);
    }, 1000);
  };

  const sendToCollection = async () => {
    if (!user) return;
    
    // Přidat karty do sbírky S DEFAULTNÍMI ATRIBUTY a unikátním ID
    const cardsWithAttributes = openedCards.map((card, index) => ({
      ...card,
      attributes: getDefaultAttributes(), // Přidáme defaultní atributy (všechny na 1)
      level: 1,
      acquiredAt: new Date().toISOString(),
      uniqueId: `${card.id}-${Date.now()}-${index}` // Unikátní ID pro každou kartu
    }));
    
    // Aktualizovat lokální state
    const newCollection = [...myCollection, ...cardsWithAttributes];
    setMyCollection(newCollection);
    
    // Uložit do Firebase
    await addCardsToCollection(user.uid, cardsWithAttributes);
    
    // Reset stavu
    setIsOpening(false);
    setShowCards(false);
    setOpenedCards([]);
    setCardsAnimating(false);
    
    console.log('Karty přidány do sbírky a uloženy do Firebase!');
  };

  const handleUpgradeCard = async (cardUniqueId, attrKey, cost) => {
    if (!user) return;
    
    if (credits < cost) {
      alert('Nedostatek kreditů!');
      return;
    }
    
    // Najít kartu podle unikátního ID
    const updatedCollection = myCollection.map((card) => {
      if (card.uniqueId === cardUniqueId) {
        return {
          ...card,
          attributes: {
            ...card.attributes,
            [attrKey]: Math.min((card.attributes[attrKey] || 1) + 1, 10) // Max level je 10
          }
        };
      }
      return card;
    });
    
    // Aktualizovat lokální state
    setMyCollection(updatedCollection);
    const newCredits = credits - cost;
    setCredits(newCredits);
    
    // Uložit do Firebase
    await savePlayerCollection(user.uid, updatedCollection);
    await updatePlayerCredits(user.uid, newCredits);
    
    console.log(`Upgraded ${attrKey} for card ${cardUniqueId}, cost: ${cost}`);
  };

  const resetPack = () => {
    setIsOpening(false);
    setShowCards(false);
    setOpenedCards([]);
    setCardsAnimating(false);
  };

  // Pokud se načítá auth nebo profil, zobraz loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-white text-xl">Načítám hru...</p>
        </div>
      </div>
    );
  }

  // Pokud není přihlášený
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-black/50 backdrop-blur-sm rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-4">Nejsi přihlášený</h2>
          <p className="text-gray-400 mb-6">Pro hraní Lancers Dynasty se musíš přihlásit</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
          >
            Zpět na hlavní stránku
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={() => router.push('/games')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Zpět na hry</span>
            </button>

            {/* Game Title with Tabs */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <h1 className="text-2xl font-black text-white mb-2">
                LANCERS DYNASTY
              </h1>
              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentView('packs')}
                  className={`px-4 py-1 rounded-lg font-bold transition-all flex items-center gap-2 ${
                    currentView === 'packs'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Package size={16} />
                  Balíčky
                </button>
                <button
                  onClick={() => setCurrentView('collection')}
                  className={`px-4 py-1 rounded-lg font-bold transition-all flex items-center gap-2 ${
                    currentView === 'collection'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Grid3x3 size={16} />
                  Sbírka ({myCollection.length})
                </button>
                <button
                  onClick={() => setCurrentView('manager')}
                  className={`px-4 py-1 rounded-lg font-bold transition-all flex items-center gap-2 ${
                    currentView === 'manager'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Map size={16} />
                  Manažér týmu
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-yellow-400" size={20} />
                <span className="text-white font-bold">
                  Level {profile?.level || 1}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="text-yellow-400" size={20} />
                <span className="text-white font-bold">
                  {credits.toLocaleString('cs-CZ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                  <User className="text-white" size={16} />
                </div>
                <span className="text-white font-medium">
                  {profile?.displayName || 'Hráč'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'collection' ? (
        <LancersDynastyCollection 
          collection={myCollection} 
          onBack={() => setCurrentView('packs')}
          credits={credits}
          onUpgradeCard={handleUpgradeCard}
        />
      ) : currentView === 'manager' ? (
        <TeamManager 
          myCollection={myCollection}
          credits={credits}
          getCardById={getCardById}
          calculateOverall={calculateOverall}
          onBack={() => setCurrentView('packs')}
        />
      ) : (
        <div className="relative min-h-[calc(100vh-80px)] p-8">
          {/* Pack Section - Top Left */}
          <div className="absolute top-8 left-8">
            {!isOpening ? (
              <div className="text-center">
                <h3 className="text-white font-bold mb-4">Starter Pack</h3>
                {/* Pack */}
                <div 
                  onClick={openPack}
                  className="relative inline-block cursor-pointer group"
                >
                  <div className="relative w-48 h-64 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-2">
                    {/* Pack Design */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Package className="text-white/80" size={60} />
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <div className="text-white font-black text-lg">STARTER</div>
                        <div className="text-white/80 text-xs">3 karty</div>
                      </div>
                    </div>
                    
                    {/* Sparkles */}
                    <Sparkles className="absolute -top-3 -right-3 text-yellow-400 animate-pulse" size={24} />
                    <Sparkles className="absolute -bottom-2 -left-2 text-yellow-400 animate-pulse animation-delay-300" size={20} />
                  </div>
                </div>

                <div className="mt-4">
                  <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-sm rounded-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg">
                    Otevřít zdarma
                  </button>
                </div>
              </div>
            ) : (
              /* Opening Animation */
              <div className="text-center">
                <h3 className="text-white font-bold mb-4">Otvírám...</h3>
                <div className="relative w-48 h-64 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-2xl animate-shake">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="text-white/80 animate-bounce" size={60} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cards Display Area - Bottom Center */}
          {(showCards || cardsAnimating) && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
              <div className="grid grid-cols-3 gap-8">
                {openedCards.map((player, index) => (
                  <PlayerCard 
                    key={`${player.id}-${index}`}  // Unikátní klíč
                    player={player} 
                    isRevealing={showCards}
                    index={index}
                    style={cardsAnimating ? {
                      animation: `dropDown 0.8s ease-out ${index * 0.1}s forwards`,
                      opacity: 0,
                      transform: 'translateY(-400px)'
                    } : undefined}
                  />
                ))}
              </div>

              {showCards && (
                <div className="text-center mt-8">
                  <button
                    onClick={sendToCollection}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto"
                  >
                    <Send size={20} />
                    Odeslat do sbírky
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes dropDown {
          0% {
            opacity: 0;
            transform: translateY(-400px) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translateY(-100px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
}