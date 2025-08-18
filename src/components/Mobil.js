"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Wifi, Battery, X, LockKeyhole, Smartphone, MessageCircle,
  Mail
} from 'lucide-react';

// Import aplikací
import MobilWhatsApp from './MobilWhatsApp';
import MobilInstagram from './MobilInstagram';

/**
 * Hlavní mobilní telefon s iOS rozhraním
 * OPRAVENO: Přidány props pro přátelské zápasy
 */
export default function Mobil({ 
  teamPlayers = [], 
  myCollection = [],
  currentDate = new Date(), 
  onNewMessage = () => {},
  shouldShowMatchInvite = false, // NOVÉ - trigger pro zobrazení pozvánky na zápas
  onMatchScheduled = () => {} // NOVÉ - callback když je zápas domluven
}) {
  // Základní stavy telefonu
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // WhatsApp stavy - předáváme do MobilWhatsApp
  const [messages, setMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({});
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // NOVÉ - Když přijde trigger pro zápas, otevřít telefon a WhatsApp
  useEffect(() => {
    if (shouldShowMatchInvite && !isPhoneVisible) {
      console.log('Mobil: Přišel trigger pro přátelský zápas, otevírám telefon...');
      setIsPhoneVisible(true);
      setTimeout(() => {
        setCurrentApp('whatsapp');
        addNotification('message', 'WhatsApp', 'Nová zpráva od neznámého čísla', 'Neznámé číslo');
      }, 500);
    }
  }, [shouldShowMatchInvite]);
  
  // Čas
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Baterie klesá pomalu
  useEffect(() => {
    const batteryTimer = setInterval(() => {
      setBatteryLevel(prev => Math.max(10, prev - 1));
    }, 60000); // Každou minutu -1%
    return () => clearInterval(batteryTimer);
  }, []);
  
  // Formátování času
  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('cs-CZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Přidat notifikaci
  const addNotification = (type, title, message, sender = null) => {
    const notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      sender,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Automaticky odstranit po 5 sekundách
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };
  
  // Aplikace na domovské obrazovce
  const apps = [
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: 'bg-green-500', notifications: unreadCount },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-gradient-to-br from-purple-600 to-pink-500' },
    { id: 'mail', name: 'Mail', icon: '📧', color: 'bg-blue-500', notifications: 3 },
    { id: 'calendar', name: 'Kalendář', icon: '📅', color: 'bg-red-500' },
    { id: 'photos', name: 'Fotky', icon: '🖼️', color: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-blue-400' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-600' },
    { id: 'maps', name: 'Mapy', icon: '🗺️', color: 'bg-green-600' },
    { id: 'music', name: 'Hudba', icon: '🎵', color: 'bg-gradient-to-br from-red-500 to-pink-500' },
    { id: 'weather', name: 'Počasí', icon: '☀️', color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { id: 'notes', name: 'Poznámky', icon: '📝', color: 'bg-yellow-500' },
    { id: 'settings', name: 'Nastavení', icon: '⚙️', color: 'bg-gray-600' }
  ];
  
  // Komponenta Lock Screen
  const LockScreen = () => (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white">
      <div className="text-6xl font-thin mb-2">{formatTime(currentTime)}</div>
      <div className="text-lg mb-8">
        {currentTime.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
      
      {/* Notifikace na lock screenu */}
      {notifications.length > 0 && (
        <div className="absolute top-20 left-4 right-4 space-y-2">
          {notifications.slice(0, 2).map(notif => (
            <div key={notif.id} className="bg-white/10 backdrop-blur-md rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="text-2xl">💬</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{notif.title}</div>
                  <div className="text-xs opacity-80">{notif.message}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={() => setIsLocked(false)}
        className="mt-auto mb-8 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm"
      >
        Přejeďte pro odemknutí
      </button>
    </div>
  );
  
  // Komponenta Home Screen
  const HomeScreen = () => (
    <div className="h-full bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 p-4">
      {/* Aplikace */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {apps.slice(0, 12).map(app => (
          <button
            key={app.id}
            onClick={() => setCurrentApp(app.id)}
            className="relative"
          >
            <div className={`${app.color} rounded-2xl h-14 w-14 flex items-center justify-center text-2xl shadow-lg`}>
              {app.icon}
            </div>
            <div className="text-white text-[10px] text-center mt-1 font-medium">
              {app.name}
            </div>
            {app.notifications && app.notifications > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {app.notifications}
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Bottom dock */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3">
          <div className="grid grid-cols-4 gap-3">
            <button className="bg-green-500 rounded-xl h-12 w-12 flex items-center justify-center text-xl mx-auto">
              📞
            </button>
            <button className="bg-blue-500 rounded-xl h-12 w-12 flex items-center justify-center text-xl mx-auto">
              🌐
            </button>
            <button className="bg-gray-700 rounded-xl h-12 w-12 flex items-center justify-center text-xl mx-auto">
              📷
            </button>
            <button 
              onClick={() => setCurrentApp('whatsapp')}
              className="bg-green-600 rounded-xl h-12 w-12 flex items-center justify-center text-xl mx-auto relative"
            >
              💬
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {unreadCount}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Mail aplikace (dočasně)
  const MailApp = () => (
    <div className="h-full bg-white flex flex-col items-center justify-center">
      <button onClick={() => setCurrentApp(null)} className="absolute top-4 left-4">
        <X size={24} />
      </button>
      <Mail size={48} className="text-blue-500 mb-4" />
      <div className="text-lg font-semibold">3 nové emaily</div>
      <div className="text-sm text-gray-500 mt-2">Funkce bude brzy dostupná</div>
    </div>
  );
  
  // Render aplikace podle currentApp
  const renderApp = () => {
    switch(currentApp) {
      case 'whatsapp':
        return (
          <MobilWhatsApp
            teamPlayers={teamPlayers}
            myCollection={myCollection}
            messages={messages}
            setMessages={setMessages}
            privateMessages={privateMessages}
            setPrivateMessages={setPrivateMessages}
            onlinePlayers={onlinePlayers}
            setOnlinePlayers={setOnlinePlayers}
            unreadCount={unreadCount}
            setUnreadCount={setUnreadCount}
            onBack={() => setCurrentApp(null)}
            onNewMessage={onNewMessage}
            addNotification={addNotification}
            currentDate={currentDate} // NOVÉ - předat aktuální datum
            shouldShowMatchInvite={shouldShowMatchInvite} // NOVÉ - trigger pro přátelský zápas
            onMatchScheduled={onMatchScheduled} // NOVÉ - callback pro domluvení zápasu
          />
        );
      case 'instagram':
        return (
          <MobilInstagram
            teamPlayers={teamPlayers}
            myCollection={myCollection}
            onBack={() => setCurrentApp(null)}
          />
        );
      case 'mail':
        return <MailApp />;
      default:
        return <HomeScreen />;
    }
  };
  
  // Pokud telefon není viditelný, zobrazit jen tlačítko
  if (!isPhoneVisible) {
    return (
      <button
        onClick={() => {
          setIsPhoneVisible(true);
          setUnreadCount(0); // Reset počítadla při otevření
        }}
        className={`fixed top-4 right-4 z-[10000] px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all ${
          unreadCount > 0 || shouldShowMatchInvite
            ? 'bg-green-500 text-white animate-pulse hover:bg-green-600' 
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        <div className="flex items-center gap-2">
          <Smartphone size={18} />
          <span>Mobil</span>
          {(unreadCount > 0 || shouldShowMatchInvite) && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 animate-bounce">
              {unreadCount > 0 ? unreadCount : '!'}
            </span>
          )}
        </div>
      </button>
    );
  }
  
  return (
    <>
      {/* Tlačítko pro skrytí telefonu */}
      <button
        onClick={() => setIsPhoneVisible(false)}
        className="fixed top-4 right-4 z-[10001] px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-red-600"
      >
        <X size={18} />
      </button>
      
      {/* Telefon */}
      <div className="fixed top-20 right-4 z-[9999]" style={{ zIndex: 9999 }}>
        {/* iPhone rám */}
        <div className="relative w-[320px] h-[640px] bg-black rounded-[40px] p-2 shadow-2xl"
             style={{ boxShadow: '0 0 50px rgba(0,0,0,0.8)' }}>
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[20px] bg-black rounded-b-xl z-50" />
          
          {/* Obrazovka */}
          <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
            
            {/* Status bar */}
            <div className="absolute top-0 left-0 right-0 bg-black/5 px-6 py-1 flex justify-between items-center text-xs z-40">
              <span className="font-bold text-black">{formatTime(currentTime)}</span>
              <div className="flex items-center gap-1 text-black">
                <Wifi size={14} />
                <Battery size={14} />
                <span>{batteryLevel}%</span>
              </div>
            </div>
            
            {/* Obsah */}
            <div className="h-full pt-6">
              {isLocked ? <LockScreen /> : renderApp()}
            </div>
            
            {/* Notifikace */}
            {notifications.length > 0 && !isLocked && (
              <div className="absolute top-8 left-2 right-2 z-50 space-y-2">
                {notifications.map(notif => (
                  <div 
                    key={notif.id}
                    className="bg-white rounded-lg shadow-lg p-3 border border-gray-200 animate-slideDown"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-xl">
                        {notif.type === 'message' ? '💬' : '🔔'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{notif.title}</div>
                        <div className="text-xs text-gray-600">{notif.message}</div>
                      </div>
                      <button 
                        onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                        className="text-gray-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>
        
        {/* Tlačítko pro zamknutí */}
        <button
          onClick={() => setIsLocked(!isLocked)}
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs text-gray-400 hover:text-gray-600"
        >
          <LockKeyhole size={16} className="mx-auto mb-1" />
          {isLocked ? 'Odemknout' : 'Zamknout'}
        </button>
      </div>
      
      <style jsx>{`
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
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}