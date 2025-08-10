'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Clock, Trophy, Award, Star, ArrowLeft, Calendar, Flag, Users, Heart, Eye, Images, List } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HistoriePage() {
  const [hoveredImage, setHoveredImage] = useState(null);
  
  const milestones = [
    // První etapa: Vznik a rozvoj (2006-2012)
    {
      id: '2006',
      year: '2006',
      title: 'Založení AHC Litvínov',
      description: 'Jiří Koláček a jeho spolužák Oldřich Štěpanovský založili tým AHC Litvínov. Začali pravidelně hrát proti White Stars s jejich nejlepším útočníkem Vaškem Maternou.',
      icon: '🏛️',
      important: true,
      stage: 1,
      images: ['/images/historie/2006.jpg', '/images/historie/2006dva.jpg', '/images/historie/2006tri.jpg']
    },
    {
      id: '2007',
      year: '2007',
      title: 'Rozvoj týmu',
      description: 'První zápasy s rozhodčím, nové přátelské zápasy, první turnaje.',
      icon: '📈',
      important: false,
      stage: 1,
      images: ['/images/historie/rozvoj1.jpg', '/images/historie/rozvoj2.jpg', '/images/historie/rozvoj3.jpg', '/images/historie/rozvoj4.jpg']
    },
    {
      id: '2008',
      year: '2008',
      title: 'První mezinárodní pohár',
      description: 'První výjezd mimo domácí stadion - památný zápas v Bílině proti HC Lokomotiva a první mezinárodní zkušenosti.',
      icon: '🌍',
      important: false,
      stage: 1,
      images: ['/images/historie/20081.jpg', '/images/historie/20082.jpg', '/images/historie/20083.jpg', '/images/historie/20084.jpg']
    },
    {
      id: '2009',
      year: '2009',
      title: 'Vrchol první éry',
      description: 'Tým na vrcholu se sponzory, poprvé v lize Sportclub liga s cílem ligu vyhrát.',
      icon: '⭐',
      important: true,
      stage: 1,
      images: ['/images/historie/vrchol1.jpg', '/images/historie/vrchol2.jpg', '/images/historie/vrchol3.jpg']
    },
    {
      id: '2010',
      year: '2010',
      title: 'Těžké období',
      description: 'Vyloučení z prvního místa Sportclub ligy a ztráta sponzora. Tým ale bojoval dál.',
      icon: '💪',
      important: false,
      stage: 1
    },
    {
      id: '2011',
      year: '2011',
      title: 'Výhra na Sláča Cupu',
      description: 'První velký turnajový úspěch - vítězství na tradičním Sláča Cupu.',
      icon: '🏆',
      important: true,
      stage: 1,
      images: ['/images/historie/slaca2.png']
    },
    
    // Druhá etapa: Éra Lancers (2013-2020)
    {
      id: '2013',
      year: '2013',
      title: 'Zrození Litvínov Lancers',
      description: 'Přejmenování týmu na Litvínov Lancers. Logo nakreslil Petr, bratr Oldřicha Štěpanovského. Vstup do prestižní PAHL ligy.',
      icon: '⚔️',
      important: true,
      stage: 2,
      images: ['/images/historie/zrozeni2.jpg', '/images/historie/zrozeni3.jpg', '/images/historie/zrozeni4.jpg']
    },
    {
      id: '2013-2016',
      year: '2013-2016',
      title: 'Éra PAHL ligy',
      description: 'Tři sezóny v kvalitní a profesionální PAHL lize. Nejblíže postupu v sezóně 2015/16, kdy tým prohrál rozhodující zápas s Pazdrojem Teplice 0:2.',
      icon: '🎯',
      important: false,
      stage: 2,
      images: ['/images/historie/pahl1.jpg', '/images/historie/pahl2.jpg', '/images/historie/pahl3.jpg', '/images/historie/pahl4.jpg']
    },
    {
      id: '2013-tv',
      year: '2013',
      title: 'V hledáčku Televize',
      description: 'Tým získal mediální pozornost a objevil se v televizním vysílání.',
      icon: '📺',
      important: false,
      stage: 2,
      images: ['/images/historie/tv1.jpg', '/images/historie/tv2.jpg', '/images/historie/tv3.jpg', '/images/historie/tv4.jpg']
    },
    {
      id: '2013-germany',
      year: '2013',
      title: 'První přáteláček v Německu a spuštění fanshopu',
      description: 'Historický první mezinárodní přátelský zápas v Německu. Vytvoření prvního plakátu a spuštění oficiálního fanshopu.',
      icon: '🇩🇪',
      important: false,
      stage: 2,
      images: ['/images/historie/pratelacek1.jpg', '/images/historie/pratelacek2.jpg', '/images/historie/fanshop1.jpg', '/images/historie/fanshop2.jpg']
    },
    {
      id: '2014',
      year: '2014',
      title: 'První Winter Classic s domácím týmem',
      description: 'Historický zápas pod širým nebem. Návštěvnost přesáhla 100 diváků!',
      icon: '❄️',
      important: true,
      stage: 2,
      images: ['/images/historie/winter1.jpg']
    },
    {
      id: '2015',
      year: '2015',
      title: 'Mezinárodní zkušenost',
      description: 'Historický turnaj v Belgii - 6. místo z 12 týmů. Cenná zahraniční zkušenost.',
      icon: '🌍',
      important: true,
      stage: 2,
      images: ['/images/historie/belgie1.jpg', '/images/historie/belgie2.jpg', '/images/historie/belgie3.jpg', '/images/historie/belgie4.jpg']
    },
    {
      id: '2016',
      year: '2016',
      title: 'Památné vítězství na Sindy Cupu',
      description: 'Triumf na mezinárodním turnaji Sindy Cup - další významný úspěch v historii klubu.',
      icon: '🥇',
      important: true,
      stage: 2,
      images: ['/images/historie/SindyCup.jpg', '/images/historie/SindyCup1.jpg', '/images/historie/SindyCup2.jpg', '/images/historie/SindyCup3.jpg']
    },
    {
      id: '2016-2017',
      year: '2016-2017',
      title: 'Návrat do SportClubligy',
      description: 'Dvě sezóny zpět ve SportClublize, kde tým sbíral zkušenosti.',
      icon: '🔄',
      important: false,
      stage: 2
    },
    {
      id: '2018-2019',
      year: '2018-2019',
      title: 'Zajímavé přáteláčky, turnaje',
      description: 'Zápas s týmem Lovosice ženy, zápas v Karlových Varech, fotbalový zápas, výhra na Batman Cupu.',
      icon: '🏒',
      important: false,
      stage: 2,
      images: ['/images/historie/batmancup.jpg', '/images/historie/2019Lovosice.jpg', '/images/historie/2018Vary.jpg', '/images/historie/20181.jpg']
    },
    
    // Třetí etapa: Znovuzrození (2021-současnost)
    {
      id: '2021',
      year: '2021',
      title: 'Nový začátek',
      description: 'Znovuvybudování týmu od základů. Příchod Vaška Materny - bývalého soupeře z White Stars, který se stal součástí Lancers!',
      icon: '🔥',
      important: true,
      stage: 3
    },
    {
      id: '2022-2023',
      year: '2022-2023',
      title: 'Český pohár',
      description: 'Vstup do nové soutěže Český pohár s cílem propojit celou ČR. První ročník - 4. místo.',
      icon: '🏅',
      important: false,
      stage: 3,
      images: ['/images/historie/2022.jpg', '/images/historie/20221.jpg', '/images/historie/20222.jpg', '/images/historie/20223.jpg']
    },
    {
      id: '2023-2024',
      year: '2023-2024',
      title: 'Stabilizace',
      description: 'Druhý ročník Českého poháru - opět 4. místo. Tým se etabloval mezi špičkou.',
      icon: '📊',
      important: false,
      stage: 3,
      images: ['/images/historie/2023.jpg', '/images/historie/20231.jpg', '/images/historie/20232.jpg']
    },
    {
      id: '2024-viral',
      year: 'Únor 2024',
      title: '🔥 VIRÁLNÍ SENZACE! 🔥',
      description: 'Náš Instagram reel se stal celosvětovým hitem! 777 000 zhlédnutí jen na našem profilu, celkově přes 10 MILIONŮ zhlédnutí po všech sdíleních! Hokejový svět si všiml Lancers!',
      icon: '📱',
      important: true,
      stage: 3,
      special: true, // Speciální událost
      link: 'https://www.instagram.com/reel/C23YfD1Ium-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
      images: ['/images/historie/viral.jpg']
    },
    {
      id: '2024-lancers',
      year: '2024',
      title: 'První Lancers Cup',
      description: 'Uspořádání vlastního turnaje - historicky první Lancers Cup.',
      icon: '🏆',
      important: true,
      stage: 3,
      images: ['/images/historie/LancersCup.jpg', '/images/historie/LancersCup1.jpg', '/images/historie/LancersCup2.jpg']
    },
    {
      id: '2024-khla',
      year: '2024',
      title: 'Vstup do KHLA ligy',
      description: 'Historický milník! Lancers se stali 8. týmem prestižní KHLA ligy.',
      icon: '🎉',
      important: true,
      stage: 3,
      images: ['/images/historie/khla.jpg', '/images/historie/khla1.jpg', '/images/historie/khla2.jpg', '/images/historie/khla3.jpg']
    },
    {
      id: '2024-2025',
      year: '2024-2025',
      title: 'Úspěšná sezóna',
      description: 'Debutová sezóna v KHLA lize zakončena krásným 5. místem! V Českém poháru skvělé 2. místo!',
      icon: '🥈',
      important: true,
      stage: 3,
      images: ['/images/historie/2025.jpg', '/images/historie/20251.jpg', '/images/historie/20252.jpg', '/images/historie/20253.jpg']
    },
    {
      id: '2025-straubing',
      year: 'Léto 2025',
      title: 'Turnaj ve Straubingu',
      description: 'Mezinárodní turnaj v Německu - 6. místo! Památné semifinále o 5.-8. místo proti americkému týmu Bayern Rangers, který jsme porazili až na nájezdy!',
      icon: '🌍',
      important: true,
      stage: 3,
      images: ['/images/historie/Straubing.jpg', '/images/historie/Straubing1.jpg', '/images/historie/Straubing2.jpg', '/images/historie/Straubing3.jpg']
    },
    {
      id: '2025-new',
      year: '2025',
      title: 'Nová éra',
      description: 'Parta zůstává stejná, pokračujeme v KHLA a Českém poháru. Změna loga a objednávka nových dresů symbolizují další krok vpřed!',
      icon: '🚀',
      important: false,
      stage: 3
    }
  ];

  const founders = [
    { 
      name: 'Jiří Koláček', 
      role: 'Spoluzakladatel', 
      year: '2006',
      description: 'Iniciátor myšlenky založení týmu'
    },
    { 
      name: 'Oldřich Štěpanovský', 
      role: 'Spoluzakladatel', 
      year: '2006',
      description: 'Spolužák Jiřího, který pomohl realizovat sen o vlastním týmu'
    },
    { 
      name: 'Petr Štěpanovský', 
      role: 'Tvůrce loga', 
      year: '2013',
      description: 'Bratr Oldřicha, autor ikonického loga Lancers'
    }
  ];

  const achievements = [
    { title: 'Výhra Sláča Cup', year: '2011', icon: '🏆' },
    { title: 'Turnaj v Belgii', year: '2015', icon: '🌍', detail: '6. místo z 12 týmů' },
    { title: '2. místo Český pohár', year: '2024/25', icon: '🥈' },
    { title: '5. místo KHLA liga', year: '2024/25', icon: '🏅', detail: 'Debutová sezóna' },
    { title: 'Turnaj Straubing', year: '2025', icon: '🇩🇪', detail: '6. místo, výhra nad Bayern Rangers' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-amber-900/20 to-slate-800">
      <Navigation />
      
      {/* Header */}
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6">
            <ArrowLeft size={20} />
            <span>Zpět na hlavní stránku</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center shadow-lg">
              <Clock className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Historie klubu</h1>
              <p className="text-gray-200 mt-1">Od roku 2006 s láskou k hokeji</p>
            </div>
          </div>

          {/* Navigace mezi stránkami */}
          <div className="flex gap-4 mb-8">
            <Link href="/historie" className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700">
              <List size={20} />
              Časová osa
            </Link>
            <Link href="/historie/page2" className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-600">
              <Eye size={20} />
              Detailní historie
            </Link>
            <Link href="/historie/page3" className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-600">
              <Images size={20} />
              Galerie
            </Link>
          </div>

          {/* Etapy */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-blue-800/40 to-blue-900/40 backdrop-blur rounded-xl p-4 border border-blue-500/50 shadow-lg">
              <h3 className="text-white font-bold mb-1">1. etapa: 2006-2012</h3>
              <p className="text-gray-200 text-sm">Vznik a rozvoj AHC Litvínov</p>
            </div>
            <div className="bg-gradient-to-br from-amber-800/40 to-orange-900/40 backdrop-blur rounded-xl p-4 border border-amber-500/50 shadow-lg">
              <h3 className="text-white font-bold mb-1">2. etapa: 2013-2020</h3>
              <p className="text-gray-200 text-sm">Éra Litvínov Lancers</p>
            </div>
            <div className="bg-gradient-to-br from-green-800/40 to-emerald-900/40 backdrop-blur rounded-xl p-4 border border-green-500/50 shadow-lg">
              <h3 className="text-white font-bold mb-1">3. etapa: 2021-současnost</h3>
              <p className="text-gray-200 text-sm">Znovuzrození a úspěchy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-600 via-orange-600 to-amber-600"></div>
          
          {/* Milestones */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative flex gap-6">
                <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                  milestone.important 
                    ? 'bg-gradient-to-br from-amber-600 to-orange-600 shadow-lg shadow-amber-500/50' 
                    : 'bg-slate-700 border-2 border-amber-600'
                }`}>
                  <span className="text-2xl">{milestone.icon}</span>
                </div>
                
                <Link 
                  href={`/historie/page2#${milestone.id}`}
                  className={`flex-1 p-6 rounded-2xl cursor-pointer transform transition-all hover:scale-[1.02] ${
                    milestone.special ? 'bg-gradient-to-r from-pink-600/40 via-purple-600/40 to-blue-600/40 border-2 border-pink-500 animate-pulse shadow-2xl shadow-pink-500/50' :
                    milestone.stage === 1 ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-500/50' :
                    milestone.stage === 2 ? 'bg-gradient-to-br from-amber-900/30 to-orange-800/30 border border-amber-500/50' :
                    'bg-gradient-to-br from-green-900/30 to-emerald-800/30 border border-green-500/50'
                  } hover:brightness-110 shadow-lg`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-amber-400 font-bold text-lg">{milestone.year}</span>
                    {milestone.important && <Trophy className="text-amber-500" size={20} />}
                    {milestone.special && <span className="text-2xl animate-bounce">🎬</span>}
                    <Eye className="text-gray-400 ml-auto" size={16} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${milestone.special ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400' : 'text-white'}`}>{milestone.title}</h3>
                  <p className="text-gray-100">{milestone.description}</p>
                  
                  {milestone.link && (
                    <a href={milestone.link} target="_blank" rel="noopener noreferrer" 
                       className="inline-flex items-center gap-2 mt-3 text-pink-400 hover:text-pink-300 font-bold">
                      <span>👀 Podívat se na virální reel</span>
                    </a>
                  )}
                  
                  {milestone.images && (
                    <div className="mt-4 flex gap-3 flex-wrap">
                      {milestone.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <Image 
                            src={img} 
                            alt={`${milestone.title} - ${milestone.year} (${idx + 1})`}
                            width={200}
                            height={150}
                            className="rounded-lg object-cover shadow-md w-[200px] h-[150px] transition-transform group-hover:scale-105"
                            onMouseEnter={() => setHoveredImage(`${index}-${idx}`)}
                            onMouseLeave={() => setHoveredImage(null)}
                          />
                          {hoveredImage === `${index}-${idx}` && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center pointer-events-none">
                              <Eye className="text-white" size={32} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Zakladatelé a klíčové osobnosti */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Users className="text-amber-500" />
            Zakladatelé a klíčové osobnosti
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {founders.map((founder, index) => (
              <div key={index} className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur rounded-2xl p-6 border border-amber-500/50 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-1">{founder.name}</h3>
                <p className="text-amber-300 mb-2">{founder.role}</p>
                <p className="text-gray-300 text-sm mb-2">Od roku {founder.year}</p>
                <p className="text-gray-200 text-sm">{founder.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Úspěchy */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Trophy className="text-amber-500" />
            Hlavní úspěchy
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 backdrop-blur rounded-2xl p-6 border border-amber-500/60 text-center shadow-lg">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="text-lg font-bold text-white mb-1">{achievement.title}</h3>
                <p className="text-amber-300 text-sm">{achievement.year}</p>
                {achievement.detail && (
                  <p className="text-gray-200 text-sm mt-2">{achievement.detail}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Zajímavost */}
        <div className="mt-20 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur rounded-2xl p-8 border border-purple-500/50 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="text-pink-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Zajímavost</h2>
          </div>
          <p className="text-gray-100 leading-relaxed">
            Vašek Materna, nejlepší útočník týmu White Stars, proti kterému Lancers pravidelně hrávali 
            na začátku své historie, se v roce 2021 stal součástí Lancers! To dokazuje, že hokej není 
            jen o rivalitě, ale především o přátelství a lásce ke hře.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/70 backdrop-blur border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-300">
            <p>© 2025 HC Litvínov Lancers • Oficiální stránky</p>
            <p className="text-sm mt-2">Hrdě hrajeme od roku 2006</p>
          </div>
        </div>
      </footer>
    </div>
  );
}