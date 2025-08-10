'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { ArrowLeft, Images, ChevronLeft, ChevronRight, Play, Pause, Grid, List, Eye, X, ZoomIn, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function GalleryPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('slideshow'); // 'slideshow' or 'grid'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Všechny fotky s kategoriemi
  const allImages = [
    // 2006-2012
    { src: '/images/historie/2006.jpg', caption: 'Založení týmu AHC Litvínov', year: '2006', category: 'beginnings' },
    { src: '/images/historie/2006dva.jpg', caption: 'Zakládající členové', year: '2006', category: 'beginnings' },
    { src: '/images/historie/2006tri.jpg', caption: 'První zápas', year: '2006', category: 'beginnings' },
    { src: '/images/historie/rozvoj1.jpg', caption: 'První zápas s rozhodčím', year: '2007', category: 'beginnings' },
    { src: '/images/historie/rozvoj2.jpg', caption: 'Nové dresy 2007', year: '2007', category: 'beginnings' },
    { src: '/images/historie/rozvoj3.jpg', caption: 'Tým v roce 2007', year: '2007', category: 'beginnings' },
    { src: '/images/historie/rozvoj4.jpg', caption: 'První turnaj', year: '2007', category: 'tournaments' },
    { src: '/images/historie/20081.jpg', caption: 'Zápas v Bílině', year: '2008', category: 'matches' },
    { src: '/images/historie/20082.jpg', caption: 'První výjezd', year: '2008', category: 'matches' },
    { src: '/images/historie/20083.jpg', caption: 'Tým na cestách', year: '2008', category: 'matches' },
    { src: '/images/historie/20084.jpg', caption: 'Oslavy po zápase', year: '2008', category: 'celebrations' },
    { src: '/images/historie/vrchol1.jpg', caption: 'Tým se sponzory', year: '2009', category: 'milestones' },
    { src: '/images/historie/vrchol2.jpg', caption: 'První zápas SportClub ligy', year: '2009', category: 'matches' },
    { src: '/images/historie/vrchol3.jpg', caption: 'Fanoušci 2009', year: '2009', category: 'fans' },
    { src: '/images/historie/slaca2.png', caption: 'Trofej Sláča Cup', year: '2011', category: 'trophies' },
    
    // 2013-2020
    { src: '/images/historie/zrozeni2.jpg', caption: 'První logo Lancers', year: '2013', category: 'milestones' },
    { src: '/images/historie/zrozeni3.jpg', caption: 'Nové dresy Lancers', year: '2013', category: 'milestones' },
    { src: '/images/historie/zrozeni4.jpg', caption: 'Tým Litvínov Lancers', year: '2013', category: 'team' },
    { src: '/images/historie/pahl1.jpg', caption: 'Zápas PAHL ligy', year: '2014', category: 'matches' },
    { src: '/images/historie/pahl2.jpg', caption: 'Boj o play-off', year: '2015', category: 'matches' },
    { src: '/images/historie/pahl3.jpg', caption: 'Tým v sezóně 2015/16', year: '2016', category: 'team' },
    { src: '/images/historie/pahl4.jpg', caption: 'Rozhodující zápas s Teplice', year: '2016', category: 'matches' },
    { src: '/images/historie/tv1.jpg', caption: 'Natáčení reportáže', year: '2013', category: 'media' },
    { src: '/images/historie/tv2.jpg', caption: 'Rozhovor pro TV', year: '2013', category: 'media' },
    { src: '/images/historie/tv3.jpg', caption: 'Televizní štáb', year: '2013', category: 'media' },
    { src: '/images/historie/tv4.jpg', caption: 'Záběry ze zápasu', year: '2013', category: 'media' },
    { src: '/images/historie/pratelacek1.jpg', caption: 'Zápas v Německu', year: '2013', category: 'international' },
    { src: '/images/historie/pratelacek2.jpg', caption: 'Tým na cestách', year: '2013', category: 'international' },
    { src: '/images/historie/fanshop1.jpg', caption: 'První produkty fanshopu', year: '2013', category: 'milestones' },
    { src: '/images/historie/fanshop2.jpg', caption: 'Oficiální plakát', year: '2013', category: 'milestones' },
    { src: '/images/historie/winter1.jpg', caption: 'Winter Classic 2014', year: '2014', category: 'special' },
    { src: '/images/historie/belgie1.jpg', caption: 'Tým v Belgii', year: '2015', category: 'international' },
    { src: '/images/historie/belgie2.jpg', caption: 'Zápas v Belgii', year: '2015', category: 'international' },
    { src: '/images/historie/belgie3.jpg', caption: 'Oslavy výhry', year: '2015', category: 'celebrations' },
    { src: '/images/historie/belgie4.jpg', caption: 'Návštěva Bruselu', year: '2015', category: 'international' },
    { src: '/images/historie/SindyCup.jpg', caption: 'Vítězové Sindy Cupu', year: '2016', category: 'trophies' },
    { src: '/images/historie/SindyCup1.jpg', caption: 'Finálový zápas', year: '2016', category: 'matches' },
    { src: '/images/historie/SindyCup2.jpg', caption: 'Předávání poháru', year: '2016', category: 'trophies' },
    { src: '/images/historie/SindyCup3.jpg', caption: 'Oslavy vítězství', year: '2016', category: 'celebrations' },
    { src: '/images/historie/batmancup.jpg', caption: 'Vítězové Batman Cupu', year: '2019', category: 'trophies' },
    { src: '/images/historie/2019Lovosice.jpg', caption: 'Zápas s Lovosice ženy', year: '2019', category: 'special' },
    { src: '/images/historie/2018Vary.jpg', caption: 'Výjezd Karlovy Vary', year: '2018', category: 'matches' },
    { src: '/images/historie/20181.jpg', caption: 'Letní fotbal', year: '2018', category: 'special' },
    
    // 2021-současnost
    { src: '/images/historie/2022.jpg', caption: 'První zápas Českého poháru', year: '2022', category: 'matches' },
    { src: '/images/historie/20221.jpg', caption: 'Tým v sezóně 2022/23', year: '2022', category: 'team' },
    { src: '/images/historie/20222.jpg', caption: 'Důležité vítězství', year: '2022', category: 'matches' },
    { src: '/images/historie/20223.jpg', caption: 'Boj o medaile', year: '2022', category: 'matches' },
    { src: '/images/historie/2023.jpg', caption: 'Sezóna 2023/24', year: '2023', category: 'team' },
    { src: '/images/historie/20231.jpg', caption: 'Nové posily', year: '2023', category: 'team' },
    { src: '/images/historie/20232.jpg', caption: 'Týmová fotka 2023', year: '2023', category: 'team' },
    { src: '/images/historie/LancersCup.jpg', caption: 'Logo Lancers Cupu', year: '2024', category: 'tournaments' },
    { src: '/images/historie/LancersCup1.jpg', caption: 'Zahájení turnaje', year: '2024', category: 'tournaments' },
    { src: '/images/historie/LancersCup2.jpg', caption: 'Zápas Lancers Cupu', year: '2024', category: 'tournaments' },
    { src: '/images/historie/khla.jpg', caption: 'Vstup do KHLA', year: '2024', category: 'milestones' },
    { src: '/images/historie/khla1.jpg', caption: 'První zápas KHLA', year: '2024', category: 'matches' },
    { src: '/images/historie/khla2.jpg', caption: 'Logo KHLA ligy', year: '2024', category: 'milestones' },
    { src: '/images/historie/khla3.jpg', caption: 'Tým v KHLA', year: '2024', category: 'team' },
    { src: '/images/historie/2025.jpg', caption: 'Stříbro z Českého poháru', year: '2025', category: 'trophies' },
    { src: '/images/historie/20251.jpg', caption: 'Finále ČP', year: '2025', category: 'matches' },
    { src: '/images/historie/20252.jpg', caption: '5. místo KHLA', year: '2025', category: 'milestones' },
    { src: '/images/historie/20253.jpg', caption: 'Oslavy úspěšné sezóny', year: '2025', category: 'celebrations' },
    { src: '/images/historie/Straubing.jpg', caption: 'Tým ve Straubingu', year: '2025', category: 'international' },
    { src: '/images/historie/Straubing1.jpg', caption: 'Zápas s Bayern Rangers', year: '2025', category: 'international' },
    { src: '/images/historie/Straubing2.jpg', caption: 'Vítězné nájezdy', year: '2025', category: 'international' },
    { src: '/images/historie/Straubing3.jpg', caption: 'Společná fotka Straubing', year: '2025', category: 'international' }
  ];

  // Filtrované obrázky podle kategorie
  const filteredImages = selectedCategory === 'all' 
    ? allImages 
    : allImages.filter(img => img.category === selectedCategory);

  // Kategorie
  const categories = [
    { id: 'all', name: 'Vše', icon: '📸' },
    { id: 'beginnings', name: 'Začátky', icon: '🏛️' },
    { id: 'milestones', name: 'Milníky', icon: '⭐' },
    { id: 'team', name: 'Tým', icon: '👥' },
    { id: 'matches', name: 'Zápasy', icon: '🏒' },
    { id: 'tournaments', name: 'Turnaje', icon: '🎯' },
    { id: 'trophies', name: 'Trofeje', icon: '🏆' },
    { id: 'international', name: 'Mezinárodní', icon: '🌍' },
    { id: 'celebrations', name: 'Oslavy', icon: '🎉' },
    { id: 'media', name: 'Média', icon: '📺' },
    { id: 'special', name: 'Speciální', icon: '✨' },
    { id: 'fans', name: 'Fanoušci', icon: '❤️' }
  ];

  // Auto-play slideshow
  useEffect(() => {
    if (isPlaying && viewMode === 'slideshow') {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % filteredImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, filteredImages.length, viewMode]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % filteredImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-amber-900/20 to-slate-800">
      <Navigation />
      
      {/* Fullscreen overlay */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
            onClick={() => setFullscreenImage(null)}
          >
            <X size={24} />
          </button>
          <Image 
            src={fullscreenImage.src} 
            alt={fullscreenImage.caption}
            width={1920}
            height={1080}
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded">
            <p className="text-lg font-bold">{fullscreenImage.caption}</p>
            <p className="text-amber-400">{fullscreenImage.year}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/historie" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6">
            <ArrowLeft size={20} />
            <span>Zpět na časovou osu</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center shadow-lg">
              <Images className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Galerie historie</h1>
              <p className="text-gray-200 mt-1">Fotografie z naší cesty</p>
            </div>
          </div>

          {/* Navigace mezi stránkami */}
          <div className="flex gap-4 mb-8">
            <Link href="/historie" className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-600">
              <List size={20} />
              Časová osa
            </Link>
            <Link href="/historie/page2" className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-600">
              <Eye size={20} />
              Detailní historie
            </Link>
            <Link href="/historie/page3" className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700">
              <Images size={20} />
              Galerie
            </Link>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('slideshow')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  viewMode === 'slideshow' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <Play size={20} />
                Slideshow
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  viewMode === 'grid' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <Grid size={20} />
                Mřížka
              </button>
            </div>
            
            {viewMode === 'slideshow' && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-600"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {isPlaying ? 'Pauza' : 'Přehrát'}
              </button>
            )}
          </div>

          {/* Kategorie */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentSlide(0);
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="bg-black/30 px-2 py-0.5 rounded text-xs">
                  {allImages.filter(img => cat.id === 'all' || img.category === cat.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {viewMode === 'slideshow' ? (
          // Slideshow view
          <div className="relative">
            {filteredImages.length > 0 && (
              <>
                {/* Main image */}
                <div className="relative h-[600px] bg-black/50 rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src={filteredImages[currentSlide].src}
                    alt={filteredImages[currentSlide].caption}
                    fill
                    className="object-contain cursor-pointer"
                    onClick={() => setFullscreenImage(filteredImages[currentSlide])}
                  />
                  
                  {/* Navigation buttons */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                    <h3 className="text-2xl font-bold text-white">{filteredImages[currentSlide].caption}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="text-amber-400" size={16} />
                      <span className="text-amber-400">{filteredImages[currentSlide].year}</span>
                    </div>
                  </div>

                  {/* Fullscreen hint */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg flex items-center gap-2">
                    <ZoomIn size={16} />
                    <span className="text-sm">Klikněte pro zvětšení</span>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="mt-6 flex gap-2 overflow-x-auto pb-4">
                  {filteredImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`flex-shrink-0 relative ${
                        index === currentSlide ? 'ring-2 ring-amber-500' : ''
                      }`}
                    >
                      <Image 
                        src={img.src}
                        alt={img.caption}
                        width={120}
                        height={80}
                        className={`object-cover rounded-lg transition-all ${
                          index === currentSlide ? 'opacity-100' : 'opacity-60 hover:opacity-80'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-4 bg-slate-700/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${((currentSlide + 1) / filteredImages.length) * 100}%` }}
                  />
                </div>
                <p className="text-center text-gray-300 mt-2">
                  {currentSlide + 1} / {filteredImages.length}
                </p>
              </>
            )}
          </div>
        ) : (
          // Grid view
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((img, index) => (
              <div 
                key={index}
                className="relative group cursor-pointer"
                onClick={() => setFullscreenImage(img)}
              >
                <div className="relative h-48 bg-black/50 rounded-lg overflow-hidden">
                  <Image 
                    src={img.src}
                    alt={img.caption}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <p className="text-white font-bold">{img.caption}</p>
                      <p className="text-amber-400 text-sm">{img.year}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Žádné fotografie v této kategorii</p>
          </div>
        )}
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