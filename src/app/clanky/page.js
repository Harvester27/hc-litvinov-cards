'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { FileText, Calendar, User, ArrowLeft, Clock, Eye, Heart, Share2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ClankyPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const articles = [
    {
      id: 1,
      title: 'Lancers dominovali v derby, porazili rivala 5:2',
      excerpt: 'Skvělý výkon v domácím prostředí přinesl zasloužené vítězství. Hvězdou večera byl Jakub Novák s hattrickem.',
      category: 'Zápasy',
      date: '8. ledna 2025',
      author: 'Jan Novotný',
      readTime: '5 min čtení',
      image: '🏒',
      views: 1234,
      likes: 89,
      featured: true
    },
    {
      id: 2,
      title: 'Roman Šimek: "Návrat domů byl správná volba"',
      excerpt: 'Exkluzivní rozhovor s novou posilou týmu o návratu z NHL, motivaci a cílech pro tuto sezónu.',
      category: 'Rozhovory',
      date: '7. ledna 2025',
      author: 'Petra Svobodová',
      readTime: '8 min čtení',
      image: '🎤',
      views: 2456,
      likes: 156,
      featured: true
    },
    {
      id: 3,
      title: 'Analýza: Proč jsou Lancers na prvním místě',
      excerpt: 'Podrobný rozbor taktiky, výkonů jednotlivých formací a klíčových faktorů úspěchu.',
      category: 'Analýzy',
      date: '6. ledna 2025',
      author: 'Martin Dvořák',
      readTime: '10 min čtení',
      image: '📊',
      views: 876,
      likes: 45
    },
    {
      id: 4,
      title: 'Mladíci z juniorky válí v lize',
      excerpt: 'Naše juniorská akademie produkuje talenty na běžícím pásu. Kdo jsou budoucí hvězdy?',
      category: 'Mládež',
      date: '5. ledna 2025',
      author: 'Tomáš Krejčí',
      readTime: '6 min čtení',
      image: '⭐',
      views: 654,
      likes: 32
    },
    {
      id: 5,
      title: 'Trenér Růžička: "Máme nejlepší tým za poslední roky"',
      excerpt: 'Hlavní kouč hodnotí dosavadní průběh sezóny a prozrazuje plány do play-off.',
      category: 'Rozhovory',
      date: '4. ledna 2025',
      author: 'Jan Novotný',
      readTime: '7 min čtení',
      image: '🗣️',
      views: 1567,
      likes: 98
    },
    {
      id: 6,
      title: 'Historie velkých derby: Lancers vs. Dynamo',
      excerpt: 'Připomeňte si nejlepší momenty z historie vzájemných soubojů těchto tradičních rivalů.',
      category: 'Historie',
      date: '3. ledna 2025',
      author: 'Pavel Černý',
      readTime: '12 min čtení',
      image: '📚',
      views: 432,
      likes: 28
    }
  ];

  const categories = [
    { id: 'all', label: 'Všechny články' },
    { id: 'Zápasy', label: 'Zápasy' },
    { id: 'Rozhovory', label: 'Rozhovory' },
    { id: 'Analýzy', label: 'Analýzy' },
    { id: 'Mládež', label: 'Mládež' },
    { id: 'Historie', label: 'Historie' }
  ];

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900/10 to-slate-900">
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
              <FileText className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Články a novinky</h1>
              <p className="text-gray-300 mt-1">Nejnovější zprávy z klubu</p>
            </div>
          </div>

          {/* Kategorie */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured články */}
      {selectedCategory === 'all' && (
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-3xl">🔥</span>
            Doporučené články
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {articles.filter(a => a.featured).map((article) => (
              <article 
                key={article.id}
                className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 backdrop-blur rounded-2xl p-6 border border-amber-600/30 hover:border-amber-500/50 transition-all cursor-pointer group"
              >
                <div className="flex gap-6">
                  <div className="text-6xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {article.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-amber-600/20 text-amber-400 px-3 py-1 rounded-full text-sm font-semibold">
                        {article.category}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Calendar size={14} />
                        {article.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-300 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {article.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {article.readTime}
                        </span>
                      </div>
                      <button className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                        Číst více
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Seznam článků */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-white mb-6">
          {selectedCategory === 'all' ? 'Všechny články' : `Kategorie: ${selectedCategory}`}
        </h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredArticles.filter(a => !a.featured || selectedCategory !== 'all').map((article) => (
            <article 
              key={article.id}
              className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
            >
              <div className="flex gap-4">
                <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  {article.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-amber-600/20 text-amber-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {article.category}
                    </span>
                    <span className="text-gray-400 text-xs">{article.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {article.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={12} />
                        {article.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {article.readTime}
                      </span>
                    </div>
                    <button className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1">
                      Číst
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>© 2025 HC Litvínov Lancers • Oficiální stránky</p>
          </div>
        </div>
      </footer>
    </div>
  );
}