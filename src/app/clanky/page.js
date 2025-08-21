'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { getAllArticles } from '@/data/articleData';
import { FileText, Calendar, User, ArrowLeft, Clock, Eye, Heart, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ClankyPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Získat články z dat
  const articles = getAllArticles();

  const categories = [
    { id: 'all', label: 'Všechny články' },
    { id: 'Turnaje', label: 'Turnaje' },
    { id: 'Zápasy', label: 'Zápasy' },
    { id: 'Klub', label: 'Klub' },
    { id: 'Mládež', label: 'Mládež' }
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

      {/* Seznam článků */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {filteredArticles.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <Link 
                key={article.id}
                href={`/clanky/${article.slug}`}
                className="block"
              >
                <article className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex gap-4">
                    {article.featuredImage ? (
                      <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                        <img 
                          src={article.featuredImage} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {article.image}
                      </div>
                    )}
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
                            5 min čtení
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
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-white mb-2">Zatím žádné články</h2>
            <p className="text-gray-400">V této kategorii zatím nejsou žádné články.</p>
          </div>
        )}
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