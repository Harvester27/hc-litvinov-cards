"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, ChevronLeft, Send, Camera, Paperclip, Smile, 
  MoreVertical, Phone, Video, Search, Mic, ChevronDown,
  Users, UserPlus, Edit2, Check, X, Trophy
} from 'lucide-react';

// Import zpráv od hráčů
import { getPlayerMessages } from './playerChats/messageManager';
import { 
  getCardById, 
  canInvitePlayer, 
  getDaysUntilCanInvite,
  updatePlayerCooldown 
} from '@/data/lancersDynasty/obycejneKartyLancers';

// NOVÉ - Import aktivit pro dva hráče
import SwimmingActivityPlayer2 from './activities/SwimmingActivityPlayer2';
import RunningActivityPlayer2 from './activities/RunningActivityPlayer2';

/**
 * WhatsApp aplikace pro mobil
 * NOVÉ: Podpora přátelských zápasů a pojmenování kontaktů
 */
export default function MobilWhatsApp({
  teamPlayers = [],
  myCollection = [],
  messages,
  setMessages,
  privateMessages,
  setPrivateMessages,
  onlinePlayers,
  setOnlinePlayers,
  unreadCount,
  setUnreadCount,
  onBack,
  onNewMessage,
  addNotification,
  currentDate = new Date(),
  onActivityComplete = () => {},
  shouldShowMatchInvite = false, // NOVÉ - trigger pro zobrazení pozvánky na zápas
  onMatchScheduled = () => {} // NOVÉ - callback když je zápas domluven
}) {
  // WhatsApp specifické stavy
  const [currentChat, setCurrentChat] = useState(null);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // NOVÉ - State pro aktivity
  const [showActivity, setShowActivity] = useState(null);
  const [activityPartner, setActivityPartner] = useState(null);
  
  // NOVÉ - State pro přátelské zápasy
  const [matchInviteShown, setMatchInviteShown] = useState(false);
  const [matchConversationStage, setMatchConversationStage] = useState(0);
  const [matchDetails, setMatchDetails] = useState({
    date: null,
    time: null,
    venue: null
  });
  
  // NOVÉ - State pro pojmenování kontaktů
  const [contactNames, setContactNames] = useState({});
  const [editingContactName, setEditingContactName] = useState(null);
  const [tempContactName, setTempContactName] = useState("");
  
  // Scroll management
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const messageIdCounter = useRef(0);
  const previousPlayersCount = useRef(0);
  
  // NOVÉ - Definice aktivit s požadavky na vztah
  const activityInvitations = [
    { 
      id: 'swimming', 
      text: "Pojď si zaplavat! 🏊‍♂️", 
      minRelationship: 2,
      component: SwimmingActivityPlayer2,
      name: "Plavání"
    },
    { 
      id: 'running', 
      text: "Půjdeš si zaběhat? 🏃‍♂️", 
      minRelationship: 2,
      component: RunningActivityPlayer2,
      name: "Běhání"
    },
  ];
  
  // NOVÉ - Zobrazit pozvánku na přátelský zápas
  useEffect(() => {
    if (shouldShowMatchInvite && !matchInviteShown) {
      // Počkat 2 sekundy a pak zobrazit zprávu od Dana
      setTimeout(() => {
        const matchInviteMessage = {
          id: generateUniqueId('match-invite'),
          type: 'player',
          sender: 'Neznámé číslo',
          senderId: 'unknown-dan',
          senderAvatar: '📱',
          text: "Ahoj. Slyšel jsem, že dáváš do kupy tým. A my hledáme s kým by jsme si zahráli přáteláček. Nechtěli by jste si s náma zahrát? Dan z Gurmánů Žatec :)",
          timestamp: new Date(),
          isMatchInvite: true
        };
        
        // Přidat do soukromých zpráv
        setPrivateMessages(prev => ({
          ...prev,
          'unknown-dan': [matchInviteMessage]
        }));
        
        setMatchInviteShown(true);
        addNotification("📱 Nová zpráva od neznámého čísla!");
        onNewMessage(1);
      }, 2000);
    }
  }, [shouldShowMatchInvite, matchInviteShown]);
  
  // Hráči dostupní pro soukromé chaty (z kolekce, ale nejsou v týmu)
  const availableForPrivateChat = myCollection.filter(card => 
    !teamPlayers.find(p => p.id === card.id)
  ).map(card => {
    const cardInfo = getCardById(card.id);
    return {
      id: card.id,
      uniqueId: card.id + '-collection',
      name: cardInfo?.name || 'Neznámý hráč',
      position: cardInfo?.position || 'Neznámá pozice',
      isInvitable: true,
      relationship: card.relationship || 0,
      lastInviteRefused: card.lastInviteRefused || null
    };
  });
  
  // NOVÉ - Přidat neznámé číslo do seznamu chatů pokud existuje zpráva
  const unknownContact = privateMessages['unknown-dan'] && privateMessages['unknown-dan'].length > 0 ? {
    uniqueId: 'unknown-dan',
    name: contactNames['unknown-dan'] || 'Neznámé číslo',
    isUnknown: true,
    avatar: '📱'
  } : null;
  
  // Předvolené zprávy pro oslovení hráčů
  const quickMessages = [
    "Ahoj! Chceš se připojit k našemu týmu? 🏒",
    "Hledáme hráče na tvou pozici, máš zájem?",
    "Jaké jsou tvé herní statistiky?",
    "Kdy máš čas na rozhovor o týmu?",
    "Můžeme si popovídat o hokejových cílech?"
  ];
  
  // Formátování času
  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('cs-CZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Generovat unikátní ID
  const generateUniqueId = (prefix) => {
    messageIdCounter.current += 1;
    return `${prefix}-${Date.now()}-${messageIdCounter.current}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  // Získat avatar hráče
  const getPlayerAvatar = (player) => {
    if (!player) return '🏒';
    if (player.position === 'Útočník') return '⚔️';
    if (player.position === 'Obránce') return '🛡️';
    if (player.position === 'Brankář') return '🥅';
    return '🏒';
  };
  
  // NOVÉ - Handler pro pojmenování kontaktu
  const handleSaveContactName = (contactId) => {
    if (tempContactName.trim()) {
      setContactNames(prev => ({
        ...prev,
        [contactId]: tempContactName.trim()
      }));
      addNotification(`✅ Kontakt uložen jako "${tempContactName.trim()}"`);
    }
    setEditingContactName(null);
    setTempContactName("");
  };
  
  // NOVÉ - Handler pro odpovědi na pozvánku na zápas
  const handleMatchInviteResponse = (accept) => {
    if (accept) {
      const acceptMessage = {
        id: generateUniqueId('match-accept'),
        type: 'me',
        text: "Super! Rádi si s vámi zahrajeme!",
        timestamp: new Date()
      };
      
      setPrivateMessages(prev => ({
        ...prev,
        'unknown-dan': [...(prev['unknown-dan'] || []), acceptMessage]
      }));
      
      // Dan odpoví s dotazem na datum
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        
        const danResponse = {
          id: generateUniqueId('dan-date'),
          type: 'player',
          sender: contactNames['unknown-dan'] || 'Dan - Gurmáni Žatec',
          senderId: 'unknown-dan',
          senderAvatar: '🏒',
          text: "Super! Kdy a kde byste mohli? My můžeme o víkendu mezi 11:00 a 20:00.",
          timestamp: new Date()
        };
        
        setPrivateMessages(prev => ({
          ...prev,
          'unknown-dan': [...(prev['unknown-dan'] || []), danResponse]
        }));
        
        setMatchConversationStage(1);
      }, 1500);
    } else {
      const rejectMessage = {
        id: generateUniqueId('match-reject'),
        type: 'me',
        text: "Díky za nabídku, ale teď nemůžeme.",
        timestamp: new Date()
      };
      
      setPrivateMessages(prev => ({
        ...prev,
        'unknown-dan': [...(prev['unknown-dan'] || []), rejectMessage]
      }));
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        
        const danResponse = {
          id: generateUniqueId('dan-reject'),
          type: 'player',
          sender: contactNames['unknown-dan'] || 'Dan - Gurmáni Žatec',
          senderId: 'unknown-dan',
          senderAvatar: '🏒',
          text: "Škoda, třeba příště! Hodně štěstí v sezóně! 🏒",
          timestamp: new Date()
        };
        
        setPrivateMessages(prev => ({
          ...prev,
          'unknown-dan': [...(prev['unknown-dan'] || []), danResponse]
        }));
      }, 1500);
    }
  };
  
  // NOVÉ - Handler pro výběr data zápasu
  const handleSelectMatchDate = (date, venue) => {
    const dateMessage = {
      id: generateUniqueId('match-date'),
      type: 'me',
      text: `${date} na ${venue}`,
      timestamp: new Date()
    };
    
    setPrivateMessages(prev => ({
      ...prev,
      'unknown-dan': [...(prev['unknown-dan'] || []), dateMessage]
    }));
    
    setMatchDetails(prev => ({ ...prev, date, venue }));
    
    // Dan se zeptá na čas
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const danResponse = {
        id: generateUniqueId('dan-time'),
        type: 'player',
        sender: contactNames['unknown-dan'] || 'Dan - Gurmáni Žatec',
        senderId: 'unknown-dan',
        senderAvatar: '🏒',
        text: "Výborně! V kolik hodin?",
        timestamp: new Date()
      };
      
      setPrivateMessages(prev => ({
        ...prev,
        'unknown-dan': [...(prev['unknown-dan'] || []), danResponse]
      }));
      
      setMatchConversationStage(2);
    }, 1500);
  };
  
  // NOVÉ - Handler pro výběr času zápasu
  const handleSelectMatchTime = (time) => {
    const timeMessage = {
      id: generateUniqueId('match-time'),
      type: 'me',
      text: time,
      timestamp: new Date()
    };
    
    setPrivateMessages(prev => ({
      ...prev,
      'unknown-dan': [...(prev['unknown-dan'] || []), timeMessage]
    }));
    
    setMatchDetails(prev => ({ ...prev, time }));
    
    // Dan potvrdí domluvu
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const danResponse = {
        id: generateUniqueId('dan-confirm'),
        type: 'player',
        sender: contactNames['unknown-dan'] || 'Dan - Gurmáni Žatec',
        senderId: 'unknown-dan',
        senderAvatar: '🏒',
        text: `Ok domluveno :) Vidíme se ${matchDetails.date} v ${time} na ${matchDetails.venue}! Těšíme se na zápas! 🏒`,
        timestamp: new Date()
      };
      
      setPrivateMessages(prev => ({
        ...prev,
        'unknown-dan': [...(prev['unknown-dan'] || []), danResponse]
      }));
      
      // Uložit zápas
      const fullMatchDetails = {
        ...matchDetails,
        time,
        opponent: 'Gurmáni Žatec',
        invitedBy: 'Dan'
      };
      
      onMatchScheduled(fullMatchDetails);
      addNotification(`🏒 Přátelský zápas domluven na ${matchDetails.date} v ${time}!`);
      
      setMatchConversationStage(3);
    }, 1500);
  };
  
  // NOVÉ - Získat možná data pro zápas (pouze víkendy)
  const getAvailableMatchDates = () => {
    const dates = [];
    const today = new Date(currentDate);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      
      const dayOfWeek = checkDate.getDay();
      // Pouze sobota (6) nebo neděle (0)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        const dateStr = checkDate.toLocaleDateString('cs-CZ', {
          weekday: 'short',
          day: 'numeric',
          month: 'numeric'
        });
        dates.push(dateStr);
      }
    }
    
    return dates.slice(0, 4); // Vrátit max 4 nejbližší víkendy
  };
  
  // NOVÉ - Logika AI odpovědí na pozvání
  const getActivityResponse = (activity, relationship) => {
    // Pokud nemá dostatečný vztah - vždy odmítne
    if (relationship < activity.minRelationship) {
      return {
        accept: false,
        message: [
          "Sorry, nemám čas 😕",
          "Dneska nemůžu",
          "Možná jindy, díky",
          "Ne, díky za pozvání",
          "Teď fakt nemůžu"
        ][Math.floor(Math.random() * 5)]
      };
    }
    
    // Má dostatečný vztah - šance na souhlas
    const bonusChance = (relationship - activity.minRelationship) * 0.15;
    const baseChance = 0.3;
    const acceptChance = Math.min(0.8, baseChance + bonusChance);
    const accepts = Math.random() < acceptChance;
    
    if (accepts) {
      return {
        accept: true,
        message: [
          "Jasně, jdu do toho! 💪",
          "Super nápad, pojďme!",
          "Jo, taky to potřebuju 👍",
          "Dobře, bude to fajn!",
          "Výborně, těším se!"
        ][Math.floor(Math.random() * 5)]
      };
    } else {
      return {
        accept: false,
        message: [
          "Dneska se mi moc nechce 😴",
          "Jsem dost unavený, sorry",
          "Možná příště, díky",
          "Teď nemůžu, promiň",
          "Bohužel, mám jiný plán"
        ][Math.floor(Math.random() * 5)]
      };
    }
  };
  
  // NOVÉ - Handler pro pozvání na aktivitu
  const handleActivityInvite = (activity, player) => {
    const cardData = myCollection.find(c => c.id === player.id);
    if (!cardData) {
      console.error('Karta nenalezena:', player.id);
      return;
    }
    
    const relationship = cardData.relationship || 0;
    
    // Kontrola cooldownu
    if (!canInvitePlayer(cardData, currentDate)) {
      const daysLeft = getDaysUntilCanInvite(cardData, currentDate);
      addNotification(`⌛ ${player.name} můžeš pozvat znovu za ${daysLeft} dní`);
      return;
    }
    
    // Odeslat pozvánku
    const inviteMessage = {
      id: generateUniqueId('invite'),
      type: 'me',
      text: activity.text,
      timestamp: new Date(),
      isActivityInvite: true,
      activityId: activity.id
    };
    
    setPrivateMessages(prev => ({
      ...prev,
      [player.uniqueId]: [...(prev[player.uniqueId] || []), inviteMessage]
    }));
    
    // AI odpověď podle vztahu
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = getActivityResponse(activity, relationship);
      
      const responseMsg = {
        id: generateUniqueId('response'),
        type: 'player',
        sender: player.name,
        senderAvatar: getPlayerAvatar(player),
        text: response.message,
        timestamp: new Date()
      };
      
      setPrivateMessages(prev => ({
        ...prev,
        [player.uniqueId]: [...(prev[player.uniqueId] || []), responseMsg]
      }));
      
      if (response.accept) {
        // Hráč souhlasil - spustit aktivitu!
        setTimeout(() => {
          setActivityPartner(player);
          setShowActivity(activity);
          addNotification(`✅ ${player.name} půjde s tebou na ${activity.name}!`);
        }, 1000);
      } else {
        // Hráč odmítl - nastavit cooldown
        const updatedCard = updatePlayerCooldown(cardData, currentDate);
        addNotification(`⌛ ${player.name} odmítl pozvání (cooldown 30 dní)`);
      }
    }, 1500 + Math.random() * 1000);
  };
  
  // Scroll handler
  const handleScroll = (e) => {
    const element = e.target;
    const isNearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 10;
    setIsAtBottom(isNearBottom);
    
    if (isNearBottom) {
      setHasUnreadMessages(false);
    }
  };
  
  // Scroll to bottom manually
  const scrollToBottomManually = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setHasUnreadMessages(false);
      setIsAtBottom(true);
    }
  };
  
  // Inicializace týmu
  useEffect(() => {
    if (teamPlayers.length > 0 && teamPlayers.length !== previousPlayersCount.current) {
      console.log('WhatsApp - nový tým s', teamPlayers.length, 'hráči');
      previousPlayersCount.current = teamPlayers.length;
      
      // Reset
      setMessages([]);
      setPrivateMessages(prev => {
        // Zachovat unknown-dan chat pokud existuje
        const newPrivate = {};
        if (prev['unknown-dan']) {
          newPrivate['unknown-dan'] = prev['unknown-dan'];
        }
        return newPrivate;
      });
      setOnlinePlayers([]);
      messageIdCounter.current = 0;
      setUnreadCount(0);
      setHasUnreadMessages(false);
      setIsAtBottom(true);
      
      // Systémová zpráva
      const systemMsg = {
        id: generateUniqueId('system'),
        type: 'system',
        text: 'Vytvořil jsi skupinu "HC Litvínov Lancers 🏒"',
        timestamp: new Date()
      };
      
      const newMessages = [systemMsg];
      const newOnlinePlayers = [];
      const newPrivateMessages = privateMessages['unknown-dan'] ? { 'unknown-dan': privateMessages['unknown-dan'] } : {};
      
      // Přidat každého hráče
      teamPlayers.forEach((player, index) => {
        // Systémová zpráva
        const joinMsg = {
          id: generateUniqueId(`join-${index}`),
          type: 'system',
          text: `Přidal jsi ${player.name}`,
          timestamp: new Date()
        };
        newMessages.push(joinMsg);
        
        // Online status
        if (Math.random() > 0.3) {
          newOnlinePlayers.push(player.uniqueId || player.id);
        }
        
        // První zpráva do skupiny
        const playerMessages = getPlayerMessages(player);
        if (playerMessages && playerMessages.length > 0) {
          const randomMessage = playerMessages[Math.floor(Math.random() * playerMessages.length)];
          
          const playerMsg = {
            id: generateUniqueId(`msg-${index}`),
            type: 'player',
            sender: player.name,
            senderAvatar: getPlayerAvatar(player),
            text: randomMessage,
            timestamp: new Date(),
            playerId: player.uniqueId || player.id
          };
          newMessages.push(playerMsg);
        }
      });
      
      // Inicializovat soukromé chaty pro hráče z kolekce
      availableForPrivateChat.forEach(player => {
        newPrivateMessages[player.uniqueId] = [];
      });
      
      // Postupně přidávat zprávy
      let messageIndex = 0;
      const addNextMessage = () => {
        if (messageIndex < newMessages.length) {
          setMessages(prev => [...prev, newMessages[messageIndex]]);
          
          if (newMessages[messageIndex].type === 'player') {
            onNewMessage(1);
          }
          
          messageIndex++;
          setTimeout(addNextMessage, 500);
        }
      };
      
      addNextMessage();
      setOnlinePlayers(newOnlinePlayers);
      setPrivateMessages(prev => ({ ...prev, ...newPrivateMessages }));
    }
    
    if (teamPlayers.length === 0) {
      previousPlayersCount.current = 0;
      setMessages([]);
      // Zachovat unknown-dan chat
      setPrivateMessages(prev => {
        if (prev['unknown-dan']) {
          return { 'unknown-dan': prev['unknown-dan'] };
        }
        return {};
      });
      setOnlinePlayers([]);
      messageIdCounter.current = 0;
      setUnreadCount(0);
      setHasUnreadMessages(false);
      setIsAtBottom(true);
    }
  }, [teamPlayers.length, availableForPrivateChat.length]);
  
  // Odeslání zprávy
  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const myMessage = {
      id: generateUniqueId('my'),
      type: 'me',
      text: inputText,
      timestamp: new Date()
    };
    
    if (currentChat === 'team') {
      setMessages(prev => [...prev, myMessage]);
      
      // Simulace odpovědi
      if (teamPlayers.length > 0 && Math.random() > 0.3) {
        setIsTyping(true);
        
        setTimeout(() => {
          setIsTyping(false);
          const randomPlayer = teamPlayers[Math.floor(Math.random() * teamPlayers.length)];
          const playerMessages = getPlayerMessages(randomPlayer);
          
          if (playerMessages && playerMessages.length > 0) {
            const randomMessage = playerMessages[Math.floor(Math.random() * playerMessages.length)];
            
            const responseMsg = {
              id: generateUniqueId('response'),
              type: 'player',
              sender: randomPlayer.name,
              senderAvatar: getPlayerAvatar(randomPlayer),
              text: randomMessage,
              timestamp: new Date(),
              playerId: randomPlayer.uniqueId || randomPlayer.id
            };
            
            setMessages(prev => [...prev, responseMsg]);
            
            if (!isAtBottom) {
              setHasUnreadMessages(true);
            }
            
            onNewMessage(1);
          }
        }, 2000 + Math.random() * 2000);
      }
    } else {
      // Soukromá zpráva
      setPrivateMessages(prev => ({
        ...prev,
        [currentChat]: [...(prev[currentChat] || []), myMessage]
      }));
      
      // Najít hráče
      const player = availableForPrivateChat.find(p => p.uniqueId === currentChat);
      if (player && Math.random() > 0.4) {
        setIsTyping(true);
        
        setTimeout(() => {
          setIsTyping(false);
          
          // Speciální odpovědi podle typu zprávy
          let responses;
          
          if (inputText.includes('tým') || inputText.includes('připojit')) {
            responses = [
              'Výborně! Kdy můžu začít? 🏒',
              'Díky za příležitost! Budu makat na 110%! 💪',
              'Super! Těším se na spolupráci s týmem!',
              'Skvělé! Kdy je první trénink?',
              'Díky trenére! Nezklamu vás!'
            ];
          } else if (inputText.includes('statistiky') || inputText.includes('herní')) {
            responses = [
              'Minulou sezónu jsem dal 15 gólů a 12 asistencí',
              'Hraju už 10 let, zkušenosti mám',
              'Jsem silný v přesilovkách a oslabení',
              'Moje silná stránka je rychlost a technika',
              'Statistiky pošlu mejlem, máte adresu?'
            ];
          } else if (inputText.includes('rozhovor') || inputText.includes('čas')) {
            responses = [
              'Mám čas každý den odpoledne',
              'Můžeme se potkat tento týden',
              'Kdy vám to vyhovuje?',
              'Jsem flexibilní, určete si čas',
              'Preferuju osobní setkání'
            ];
          } else {
            responses = [
              'Jo, jasně trenére!',
              'Dobře, chápu 👍',
              'Díky za zprávu!',
              'Budu se na to těšit',
              'Super, díky!',
              'Určitě!'
            ];
          }
          
          const responseMsg = {
            id: generateUniqueId('private-response'),
            type: 'player',
            sender: player.name,
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date()
          };
          
          setPrivateMessages(prev => ({
            ...prev,
            [currentChat]: [...(prev[currentChat] || []), responseMsg]
          }));
          
          if (!isAtBottom) {
            setHasUnreadMessages(true);
          }
        }, 1500 + Math.random() * 1500);
      }
    }
    
    setInputText("");
  };
  
  // Odeslání rychlé zprávy
  const sendQuickMessage = (message) => {
    setInputText(message);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };
  
  // WhatsApp seznam chatů
  const WhatsAppList = () => {
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    
    return (
      <div className="h-full bg-white flex flex-col">
        {/* Header */}
        <div className="bg-green-600 text-white p-4">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ChevronLeft size={20} />
              <span className="text-sm">Zpět</span>
            </button>
            <h3 className="font-bold">WhatsApp</h3>
            <div className="flex gap-3">
              <Search size={20} />
              <MoreVertical size={20} />
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-6 text-sm">
            <button className="font-bold border-b-2 border-white pb-1">CHATY</button>
            <button className="opacity-70">STAV</button>
            <button className="opacity-70">HOVORY</button>
          </div>
        </div>
        
        {/* Seznam chatů */}
        <div className="flex-1 overflow-y-auto">
          {/* NOVÉ - Neznámé číslo (Dan) */}
          {unknownContact && (
            <button
              onClick={() => setCurrentChat('unknown-dan')}
              className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 relative"
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl">
                {unknownContact.avatar}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold flex items-center gap-2">
                  {contactNames['unknown-dan'] || 'Neznámé číslo'}
                  {privateMessages['unknown-dan']?.[0]?.isMatchInvite && (
                    <Trophy className="text-green-500" size={14} />
                  )}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {privateMessages['unknown-dan']?.[privateMessages['unknown-dan'].length - 1]?.text || 'Nová zpráva'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">
                  {privateMessages['unknown-dan']?.[privateMessages['unknown-dan'].length - 1]?.timestamp 
                    ? formatTime(privateMessages['unknown-dan'][privateMessages['unknown-dan'].length - 1].timestamp)
                    : ''}
                </div>
                {privateMessages['unknown-dan']?.filter(m => !m.read && m.type === 'player').length > 0 && (
                  <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1 ml-auto">
                    {privateMessages['unknown-dan'].filter(m => !m.read && m.type === 'player').length}
                  </div>
                )}
              </div>
            </button>
          )}
          
          {/* Týmový chat */}
          {teamPlayers.length > 0 && (
            <button
              onClick={() => setCurrentChat('team')}
              className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                🏒
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">HC Litvínov Lancers</div>
                <div className="text-sm text-gray-500 truncate">
                  {lastMessage?.text || 'Žádné zprávy'}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {lastMessage && lastMessage.timestamp ? formatTime(lastMessage.timestamp) : ''}
              </div>
            </button>
          )}
          
          {/* Soukromé chaty - pouze hráči z kolekce, kteří NEJSOU v týmu */}
          {availableForPrivateChat.map(player => {
            const playerId = player.uniqueId;
            const playerChat = privateMessages[playerId] || [];
            const lastPlayerMessage = playerChat.length > 0 ? playerChat[playerChat.length - 1] : null;
            const unreadPlayerCount = playerChat.filter(m => m.type === 'player' && !m.read).length;
            const canInvite = canInvitePlayer(
              myCollection.find(c => c.id === player.id), 
              currentDate
            );
            
            return (
              <button
                key={playerId}
                onClick={() => setCurrentChat(playerId)}
                className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100"
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl">
                  {getPlayerAvatar(player)}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold flex items-center gap-2">
                    {player.name}
                    {player.isInvitable && (
                      <span className="text-blue-500 text-xs">
                        {canInvite ? '📅' : '⏳'}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {lastPlayerMessage?.text || 'Klikni pro chat'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">
                    {lastPlayerMessage && lastPlayerMessage.timestamp ? formatTime(lastPlayerMessage.timestamp) : ''}
                  </div>
                  {unreadPlayerCount > 0 && (
                    <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1 ml-auto">
                      {unreadPlayerCount}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Plovoucí tlačítko */}
        <button className="absolute bottom-4 right-4 bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          <MessageCircle size={24} />
        </button>
      </div>
    );
  };
  
  // Chat detail
  const ChatDetail = () => {
    const isTeamChat = currentChat === 'team';
    const isUnknownChat = currentChat === 'unknown-dan';
    const currentMessages = isTeamChat ? messages : (privateMessages[currentChat] || []);
    const chatPlayer = isUnknownChat 
      ? { name: contactNames['unknown-dan'] || 'Neznámé číslo', avatar: '📱' }
      : availableForPrivateChat.find(p => p.uniqueId === currentChat) || 
        teamPlayers.find(p => (p.uniqueId || p.id) === currentChat);
    
    const showNewMessagesButton = !isAtBottom && hasUnreadMessages;
    
    return (
      <div className="h-full bg-white flex flex-col">
        {/* Header */}
        <div className="bg-green-600 text-white p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentChat(null)}>
                <ChevronLeft size={24} />
              </button>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">
                  {isTeamChat ? '🏒' : isUnknownChat ? '📱' : getPlayerAvatar(chatPlayer)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">
                    {isTeamChat ? 'HC Litvínov Lancers' : chatPlayer?.name}
                  </h3>
                  {/* NOVÉ - Tlačítko pro pojmenování kontaktu */}
                  {isUnknownChat && !editingContactName && (
                    <button
                      onClick={() => {
                        setEditingContactName('unknown-dan');
                        setTempContactName(contactNames['unknown-dan'] || '');
                      }}
                      className="text-white/70 hover:text-white"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                </div>
                {/* NOVÉ - Input pro pojmenování */}
                {isUnknownChat && editingContactName === 'unknown-dan' && (
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="text"
                      value={tempContactName}
                      onChange={(e) => setTempContactName(e.target.value)}
                      placeholder="Zadej jméno kontaktu"
                      className="bg-white/20 px-2 py-1 rounded text-sm flex-1"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveContactName('unknown-dan')}
                      className="text-green-300 hover:text-white"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingContactName(null);
                        setTempContactName("");
                      }}
                      className="text-red-300 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {!editingContactName && (
                  <p className="text-xs opacity-80">
                    {isTeamChat 
                      ? `${onlinePlayers.length} online` 
                      : isUnknownChat
                        ? '+420 xxx xxx xxx'
                        : chatPlayer?.isInvitable ? 'dostupný pro pozvání' : 'offline'}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Video size={20} />
              <Phone size={20} />
              <MoreVertical size={20} />
            </div>
          </div>
        </div>
        
        {/* Zprávy */}
        <div 
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-3 space-y-2 relative"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dcf8c6' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundColor: '#e5ddd5'
          }}
        >
          {currentMessages.map((message) => {
            if (!message || !message.type) return null;
            
            if (message.type === 'system') {
              return (
                <div key={message.id} className="text-center">
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {message.text}
                  </span>
                </div>
              );
            }
            
            if (message.type === 'me') {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className={`rounded-lg rounded-br-none px-3 py-2 max-w-[70%] ${
                    message.isActivityInvite 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-green-500 text-white'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 text-right mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              );
            }
            
            if (message.type === 'player') {
              return (
                <div key={message.id} className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                    {isTeamChat ? message.senderAvatar : isUnknownChat ? '📱' : getPlayerAvatar(chatPlayer)}
                  </div>
                  <div className="bg-white rounded-lg rounded-bl-none px-3 py-2 max-w-[70%] shadow-sm">
                    {(isTeamChat || isUnknownChat) && (
                      <p className="text-xs text-green-600 font-bold mb-1">
                        {message.sender}
                      </p>
                    )}
                    <p className="text-sm text-gray-800">{message.text}</p>
                    <p className="text-xs text-gray-500 text-right mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                    
                    {/* NOVÉ - Tlačítka pro pozvánku na zápas */}
                    {message.isMatchInvite && matchConversationStage === 0 && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleMatchInviteResponse(true)}
                          className="bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600"
                        >
                          ✅ Přijmout
                        </button>
                        <button
                          onClick={() => handleMatchInviteResponse(false)}
                          className="bg-red-500 text-white px-3 py-1 rounded-full text-xs hover:bg-red-600"
                        >
                          ❌ Odmítnout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            
            return null;
          })}
          
          {isTyping && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
              <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
          
          {/* Tlačítko "Nové zprávy" */}
          {showNewMessagesButton && (
            <button
              onClick={scrollToBottomManually}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce"
            >
              <ChevronDown size={16} />
              <span className="text-sm">Nové zprávy</span>
            </button>
          )}
        </div>
        
        {/* NOVÉ - Rychlé odpovědi pro domlouvání zápasu */}
        {isUnknownChat && matchConversationStage === 1 && (
          <div className="bg-gray-50 p-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Vyber datum a místo:</div>
            <div className="flex flex-wrap gap-1">
              {getAvailableMatchDates().map((date, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectMatchDate(date, idx % 2 === 0 ? 'Zimní stadion Litvínov' : 'Zimní stadion Žatec')}
                  className="bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full hover:bg-blue-200"
                >
                  {date} - {idx % 2 === 0 ? 'Litvínov' : 'Žatec'}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {isUnknownChat && matchConversationStage === 2 && (
          <div className="bg-gray-50 p-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Vyber čas:</div>
            <div className="flex flex-wrap gap-1">
              {['11:00', '13:00', '15:00', '17:00', '19:00'].map((time) => (
                <button
                  key={time}
                  onClick={() => handleSelectMatchTime(time)}
                  className="bg-green-100 text-green-800 text-xs px-3 py-1.5 rounded-full hover:bg-green-200"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* NOVÉ - Pozvánky na aktivity */}
        {!isTeamChat && !isUnknownChat && chatPlayer?.isInvitable && (
          <div className="bg-gray-50 p-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Users size={14} />
              Pozvat na aktivitu:
            </div>
            <div className="flex flex-wrap gap-1">
              {activityInvitations.map((activity) => {
                const cardData = myCollection.find(c => c.id === chatPlayer.id);
                const canInvite = canInvitePlayer(cardData, currentDate);
                const relationship = cardData?.relationship || 0;
                const hasRelationship = relationship >= activity.minRelationship;
                const daysLeft = getDaysUntilCanInvite(cardData, currentDate);
                
                return (
                  <button
                    key={activity.id}
                    onClick={() => handleActivityInvite(activity, chatPlayer)}
                    disabled={!canInvite || !hasRelationship}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                      canInvite && hasRelationship
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    title={
                      !hasRelationship 
                        ? `Potřebuje vztah ${activity.minRelationship}/10 (má ${relationship}/10)` 
                        : !canInvite 
                          ? `Cooldown: ${daysLeft} dní`
                          : ''
                    }
                  >
                    {activity.text}
                    {!hasRelationship && (
                      <span className="text-[10px]">({activity.minRelationship}❤️)</span>
                    )}
                    {!canInvite && hasRelationship && (
                      <span className="text-[10px]">({daysLeft}d)</span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Info o vztahu */}
            <div className="mt-2 text-[10px] text-gray-400">
              Vztah s hráčem: {(myCollection.find(c => c.id === chatPlayer.id)?.relationship || 0)}/10
            </div>
          </div>
        )}
        
        {/* Rychlé zprávy - jen pro soukromé chaty s pozvatelnými hráči */}
        {!isTeamChat && !isUnknownChat && chatPlayer?.isInvitable && currentMessages.length === 0 && (
          <div className="bg-gray-50 p-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Rychlé zprávy:</div>
            <div className="flex flex-wrap gap-1">
              {quickMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => sendQuickMessage(msg)}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  {msg.length > 30 ? msg.substring(0, 30) + '...' : msg}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input */}
        <div className="bg-gray-100 p-3">
          <div className="flex items-center gap-2">
            <button className="text-gray-600">
              <Smile size={24} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Zpráva"
              className="flex-1 bg-white rounded-full px-4 py-2 text-sm outline-none"
            />
            <button className="text-gray-600">
              <Paperclip size={20} />
            </button>
            <button className="text-gray-600">
              <Camera size={20} />
            </button>
            {inputText ? (
              <button 
                onClick={sendMessage}
                className="bg-green-500 text-white rounded-full p-2"
              >
                <Send size={18} />
              </button>
            ) : (
              <button className="bg-green-500 text-white rounded-full p-2">
                <Mic size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // NOVÉ - Zobrazit aktivitu když hráč souhlasí
  if (showActivity && activityPartner) {
    const ActivityComponent = showActivity.component;
    
    return (
      <div className="fixed inset-0 z-[60]">
        <ActivityComponent
          onComplete={() => {
            // Označit aktivitu jako dokončenou
            onActivityComplete(showActivity.id);
            setShowActivity(null);
            
            // Poslat děkovnou zprávu
            setTimeout(() => {
              const thankMsg = {
                id: generateUniqueId('thanks'),
                type: 'player',
                sender: activityPartner.name,
                senderAvatar: getPlayerAvatar(activityPartner),
                text: "Díky, bylo to super! 👍 Příště zase!",
                timestamp: new Date()
              };
              
              setPrivateMessages(prev => ({
                ...prev,
                [activityPartner.uniqueId]: [
                  ...(prev[activityPartner.uniqueId] || []), 
                  thankMsg
                ]
              }));
              
              setActivityPartner(null);
              addNotification(`✅ Aktivita "${showActivity.name}" dokončena s ${activityPartner.name}!`);
            }, 500);
          }}
          onBack={() => {
            setShowActivity(null);
            setActivityPartner(null);
          }}
          withPlayer={activityPartner} // Info že aktivita je společná
        />
      </div>
    );
  }
  
  // Render podle stavu
  if (currentChat) {
    return <ChatDetail />;
  }
  
  return <WhatsAppList />;
}