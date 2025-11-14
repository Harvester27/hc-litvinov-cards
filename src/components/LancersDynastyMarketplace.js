'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, User, Coins, TrendingUp, X, Package, Tag
} from 'lucide-react';
import {
  getMarketplaceListings,
  getSellerListings,
  buyListing,
  cancelListing
} from '@/lib/firebaseLancersDynastyMarketplace';
import {
  calculateOverall,
  getCardById
} from '@/data/lancersDynasty/obycejneKartyLancers';

// Komponenta pro kartu v marketplace
const MarketplaceCard = ({ listing, onClick, isMyListing }) => {
  const cardInfo = getCardById(listing.card.id);
  const overall = calculateOverall(listing.card.attributes || {});

  return (
    <div
      className="relative w-56 h-96 mx-auto cursor-pointer hover:scale-105 transition-transform"
      onClick={() => onClick(listing)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl border-4 border-gray-400 shadow-2xl overflow-hidden">
          {/* Header s pozicí a overall */}
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-2">
            <div className="flex justify-between items-center">
              <span className="text-white/90 text-xs font-bold uppercase">{cardInfo.position}</span>
              <div className="flex items-center gap-1">
                <span className="text-white text-lg font-black">{overall}</span>
                <div className="text-xs text-gray-300">OVR</div>
              </div>
            </div>
          </div>

          {/* Obrázek hráče */}
          <div className="relative h-48 bg-gradient-to-b from-gray-600 to-gray-500 flex items-center justify-center">
            <img
              src={cardInfo.imageUrl}
              alt={cardInfo.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="absolute inset-0 items-center justify-center hidden">
              <User className="text-gray-400" size={60} />
            </div>

            {/* Badge "Moje nabídka" */}
            {isMyListing && (
              <div className="absolute top-2 left-2 bg-blue-600/90 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-xs font-bold">Tvoje nabídka</span>
              </div>
            )}
          </div>

          {/* Jméno hráče */}
          <div className="flex-1 flex flex-col justify-center items-center py-3 px-3 bg-gradient-to-b from-gray-700 to-gray-800">
            <h3 className="text-white font-bold text-center text-base mb-2">
              {cardInfo.name}
            </h3>

            {/* Prodejce */}
            <div className="text-gray-400 text-xs mb-2 flex items-center gap-1">
              <User size={12} />
              {listing.sellerName}
            </div>

            {/* Cena */}
            <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg px-3 py-2 w-full">
              <div className="flex items-center justify-center gap-2">
                <Coins className="text-yellow-400" size={18} />
                <span className="text-white font-black text-lg">
                  {listing.price.toLocaleString('cs-CZ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hlavní komponenta marketplace
export default function LancersDynastyMarketplace({
  onBack,
  credits,
  userId,
  userDisplayName,
  userCollection,
  onCollectionUpdate,
  onCreditsUpdate
}) {
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('all'); // 'all' nebo 'my'
  const [filter, setFilter] = useState('all'); // 'all', 'attack', 'defense', 'goalie'

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    const allListings = await getMarketplaceListings();
    const sellerListings = await getSellerListings(userId);

    setListings(allListings);
    setMyListings(sellerListings);
    setLoading(false);
  };

  const handleBuyCard = async (listing) => {
    if (listing.sellerId === userId) {
      alert('Nemůžeš koupit vlastní kartu!');
      return;
    }

    if (credits < listing.price) {
      alert('Nedostatek kreditů!');
      return;
    }

    const confirmation = confirm(
      `Chceš koupit ${getCardById(listing.card.id).name} za ${listing.price.toLocaleString('cs-CZ')} kreditů?`
    );

    if (!confirmation) return;

    const result = await buyListing(
      userId,
      userDisplayName,
      credits,
      listing.listingId,
      userCollection
    );

    if (result.success) {
      onCollectionUpdate(result.updatedCollection);
      onCreditsUpdate(result.newCredits);
      alert('Karta úspěšně koupena!');
      loadListings(); // Reload marketplace
    } else {
      alert(`Chyba: ${result.error}`);
    }
  };

  const handleCancelListing = async (listing) => {
    const confirmation = confirm(
      `Chceš stáhnout nabídku karty ${getCardById(listing.card.id).name} z marketplace?`
    );

    if (!confirmation) return;

    const result = await cancelListing(userId, listing.listingId, userCollection);

    if (result.success) {
      onCollectionUpdate(result.updatedCollection);
      alert('Nabídka byla stažena a karta vrácena do sbírky!');
      loadListings();
    } else {
      alert(`Chyba: ${result.error}`);
    }
  };

  const displayedListings = view === 'my' ? myListings : listings;
  const filteredListings = filter === 'all'
    ? displayedListings
    : displayedListings.filter(listing => {
        const cardInfo = getCardById(listing.card.id);
        if (filter === 'attack') return cardInfo.position === 'Útočník';
        if (filter === 'defense') return cardInfo.position === 'Obránce';
        if (filter === 'goalie') return cardInfo.position === 'Brankář';
        return true;
      });

  return (
    <div className="min-h-[calc(100vh-80px)] p-8">
      <div className="max-w-7xl mx-auto mb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-black text-white">Obchod</h2>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all"
          >
            Zpět na balíčky
          </button>
        </div>

        {/* Stats */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-black text-yellow-400">{listings.length}</div>
              <div className="text-gray-400 text-sm">Nabídek celkem</div>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-400">{myListings.length}</div>
              <div className="text-gray-400 text-sm">Moje nabídky</div>
            </div>
            <div>
              <div className="text-3xl font-black text-green-400">
                {credits.toLocaleString('cs-CZ')}
              </div>
              <div className="text-gray-400 text-sm">Tvoje kredity</div>
            </div>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView('all')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              view === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <ShoppingCart size={16} className="inline mr-2" />
            Všechny nabídky ({listings.length})
          </button>
          <button
            onClick={() => setView('my')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              view === 'my'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Tag size={16} className="inline mr-2" />
            Moje nabídky ({myListings.length})
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              filter === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Všechny pozice
          </button>
          <button
            onClick={() => setFilter('attack')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              filter === 'attack'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Útočníci
          </button>
          <button
            onClick={() => setFilter('defense')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              filter === 'defense'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Obránci
          </button>
          <button
            onClick={() => setFilter('goalie')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              filter === 'goalie'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Brankáři
          </button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-white text-xl">Načítám marketplace...</p>
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.listingId}>
                <MarketplaceCard
                  listing={listing}
                  onClick={(listing) => {
                    if (view === 'my') {
                      handleCancelListing(listing);
                    } else {
                      handleBuyCard(listing);
                    }
                  }}
                  isMyListing={listing.sellerId === userId}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingCart className="text-gray-600 mx-auto mb-4" size={64} />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              {view === 'my' ? 'Nemáš žádné aktivní nabídky' : 'Žádné nabídky k dispozici'}
            </h3>
            <p className="text-gray-500">
              {view === 'my' ? 'Začni prodávat karty ze své sbírky!' : 'Zkontroluj marketplace později'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
