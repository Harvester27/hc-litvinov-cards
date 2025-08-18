"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, Heart, MessageCircle, Send, Bookmark, 
  MoreVertical, Plus, Camera, Search, Home, UserPlus
} from 'lucide-react';

/**
 * Instagram aplikace pro mobil
 */
export default function MobilInstagram({
  teamPlayers = [],
  myCollection = [],
  onBack
}) {
  const [currentView, setCurrentView] = useState('feed'); // 'feed', 'story'
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  
  // Získat avatar hráče
  const getPlayerAvatar = (player) => {
    if (!player) return '🏒';
    if (player.position === 'Útočník') return '⚔️';
    if (player.position === 'Obránce') return '🛡️';
    if (player.position === 'Brankář') return '🥅';
    return '🏒';
  };
  
  // Instagram posty s hokejovým obsahem
  const [instagramPosts, setInstagramPosts] = useState([
    {
      id: 1,
      user: 'hc_litvinov',
      username: 'HC Litvínov',
      avatar: '🏒',
      verified: true,
      image: null,
      likes: 1234,
      caption: 'Skvělý trénink týmu dnes! Příprava na novou sezónu je v plném proudu 💪 #Lancers #Hockey #Training',
      time: '2h',
      comments: [
        { user: 'fan_hokeje', text: 'Jedeme Lancers! 🔥', likes: 12 },
        { user: 'hockey_love', text: 'Kdy první zápas?', likes: 8 }
      ]
    },
    {
      id: 2,
      user: 'sportcz',
      username: 'Sport.cz',
      avatar: '⚽',
      verified: true,
      image: null,
      likes: 5678,
      caption: 'Začíná nová hokejová sezóna! Které týmy budou letos bojovat o titul? 🏆 #Czech Hockey',
      time: '5h',
      comments: [
        { user: 'hokej_fan', text: 'Litvínov má letos šanci!', likes: 25 },
        { user: 'ice_hockey', text: 'Nejlepší liga na světě! 🥅', likes: 15 }
      ]
    },
    {
      id: 3,
      user: 'nhl_czech',
      username: 'NHL Czech',
      avatar: '🇨🇿',
      verified: true,
      image: null,
      likes: 3456,
      caption: 'Čeští hráči v NHL září! Pastrňák další hattrick 🎯 #NHL #CzechHockey',
      time: '8h',
      comments: [
        { user: 'czech_pride', text: 'Pastrňák je king! 👑', likes: 45 },
        { user: 'boston_fan', text: 'Best player ever!', likes: 23 }
      ]
    }
  ]);
  
  // Stories data
  const storiesData = [
    { id: 'my', user: 'Váš příběh', avatar: '📸', isOwn: true },
    ...teamPlayers.slice(0, 8).map((player, index) => ({
      id: player.id || `player-${index}`,
      user: player.name?.split(' ')[0] || 'Hráč',
      avatar: getPlayerAvatar(player),
      isOwn: false,
      hasStory: Math.random() > 0.3
    })),
    { id: 'hc_litvinov', user: 'HC Litvínov', avatar: '🏒', hasStory: true },
    { id: 'czech_hockey', user: 'Czech Hockey', avatar: '🇨🇿', hasStory: true }
  ];
  
  // Like/Unlike post
  const toggleLike = (postId) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
        // Snížit počet likes
        setInstagramPosts(posts => 
          posts.map(post => 
            post.id === postId 
              ? { ...post, likes: post.likes - 1 }
              : post
          )
        );
      } else {
        newLiked.add(postId);
        // Zvýšit počet likes
        setInstagramPosts(posts => 
          posts.map(post => 
            post.id === postId 
              ? { ...post, likes: post.likes + 1 }
              : post
          )
        );
      }
      return newLiked;
    });
  };
  
  // Save/Unsave post
  const toggleSave = (postId) => {
    setSavedPosts(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(postId)) {
        newSaved.delete(postId);
      } else {
        newSaved.add(postId);
      }
      return newSaved;
    });
  };
  
  // Přidat nový příspěvek od týmu po chvíli
  useEffect(() => {
    if (teamPlayers.length > 0) {
      const timer = setTimeout(() => {
        const randomPlayer = teamPlayers[Math.floor(Math.random() * teamPlayers.length)];
        const playerPosts = [
          `Připraven na dnešní trénink! 💪 #HockeyLife`,
          `Skvělý pocit být součástí týmu Lancers! 🏒`,
          `Makáme na nové sezóně 🔥 #TeamWork`,
          `Hokej je můj život ❤️ #Passion`,
          `Díky fanouškům za podporu! 🙌`
        ];
        
        const newPost = {
          id: Date.now(),
          user: randomPlayer.name?.toLowerCase().replace(/\s+/g, '_') || 'player',
          username: randomPlayer.name || 'Hráč',
          avatar: getPlayerAvatar(randomPlayer),
          verified: false,
          image: null,
          likes: Math.floor(Math.random() * 200) + 50,
          caption: playerPosts[Math.floor(Math.random() * playerPosts.length)],
          time: 'právě teď',
          comments: []
        };
        
        setInstagramPosts(prev => [newPost, ...prev]);
      }, 10000); // Po 10 sekundách
      
      return () => clearTimeout(timer);
    }
  }, [teamPlayers]);
  
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack}>
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Instagram
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Plus size={24} className="text-black" />
            <Heart size={24} className="text-black" />
            <MessageCircle size={24} className="text-black" />
          </div>
        </div>
      </div>
      
      {/* Stories */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="flex gap-3 overflow-x-auto px-4 scrollbar-hide">
          {storiesData.map(story => (
            <div key={story.id} className="flex-shrink-0 text-center">
              <div className={`relative w-16 h-16 rounded-full p-0.5 ${
                story.hasStory || story.isOwn 
                  ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' 
                  : 'bg-gray-300'
              }`}>
                <div className="w-full h-full bg-white rounded-full p-0.5">
                  <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                    {story.avatar}
                  </div>
                </div>
                {story.isOwn && (
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Plus size={12} className="text-white" />
                  </div>
                )}
              </div>
              <div className="text-xs mt-1 w-16 truncate text-center">
                {story.user}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        {instagramPosts.map(post => (
          <div key={post.id} className="border-b border-gray-100 bg-white">
            {/* Post header */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg">{post.avatar}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm">{post.username}</span>
                    {post.verified && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-[8px]">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{post.time}</div>
                </div>
              </div>
              <MoreVertical size={16} className="text-gray-600" />
            </div>
            
            {/* Image/Content */}
            <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center relative">
              {post.image ? (
                <img src={post.image} alt="Post" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-2">🏒</div>
                  <div className="text-gray-500 text-sm">Hokejový obsah</div>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className="transition-colors"
                  >
                    <Heart 
                      size={24} 
                      className={likedPosts.has(post.id) ? 'text-red-500 fill-red-500' : 'text-black'} 
                    />
                  </button>
                  <button>
                    <MessageCircle size={24} className="text-black" />
                  </button>
                  <button>
                    <Send size={24} className="text-black" />
                  </button>
                </div>
                <button onClick={() => toggleSave(post.id)}>
                  <Bookmark 
                    size={24} 
                    className={savedPosts.has(post.id) ? 'text-black fill-black' : 'text-black'} 
                  />
                </button>
              </div>
              
              {/* Likes */}
              <div className="font-semibold text-sm mb-2">
                {post.likes.toLocaleString('cs-CZ')} To se mi líbí
              </div>
              
              {/* Caption */}
              <div className="text-sm mb-2">
                <span className="font-semibold mr-2">{post.username}</span>
                <span>{post.caption}</span>
              </div>
              
              {/* Comments */}
              {post.comments && post.comments.length > 0 && (
                <div className="space-y-1">
                  <button className="text-gray-500 text-sm">
                    Zobrazit všech {post.comments.length} komentářů
                  </button>
                  {post.comments.slice(0, 2).map((comment, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-semibold mr-2">{comment.user}</span>
                      <span>{comment.text}</span>
                      <button className="ml-2 text-xs text-gray-500">
                        {comment.likes} ❤️
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add comment */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <input
                  type="text"
                  placeholder="Přidat komentář..."
                  className="flex-1 text-sm outline-none"
                />
                <button className="text-blue-500 text-sm font-semibold">
                  Zveřejnit
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* End of feed message */}
        <div className="p-8 text-center">
          <div className="text-gray-400 text-sm">
            📸 Prohlédli jste si všechny příspěvky
          </div>
          <div className="text-gray-400 text-xs mt-1">
            Sledujte více účtů, abyste viděli další obsah
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation (Instagram style) */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button className="p-2">
            <Home size={24} className="text-black" />
          </button>
          <button className="p-2">
            <Search size={24} className="text-gray-400" />
          </button>
          <button className="p-2">
            <Plus size={24} className="text-gray-400" />
          </button>
          <button className="p-2">
            <Heart size={24} className="text-gray-400" />
          </button>
          <button className="p-2">
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs">👤</span>
            </div>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}