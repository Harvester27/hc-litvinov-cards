"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, CheckCircle, Send, Edit3 } from 'lucide-react';

/**
 * Aktivita - Napsat inzerát
 * Hledání nových talentů přes internet
 */
export default function JobPostingActivity({ onComplete, onBack }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [writtenText, setWrittenText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const templates = [
    {
      id: 'young',
      title: 'Mladé talenty',
      text: 'HC Litvínov Lancers hledá mladé talentované hráče do svého týmu! Nabízíme profesionální zázemí, zkušené trenéry a možnost růstu. Věk 16-20 let.',
      focus: 'Zaměření na mladé hráče'
    },
    {
      id: 'experienced',
      title: 'Zkušení hráči',
      text: 'Posilte náš tým! HC Litvínov hledá zkušené hráče s extraligovými zkušenostmi. Nabízíme konkurenceschopné podmínky a ambiciózní tým.',
      focus: 'Zaměření na zkušené hráče'
    },
    {
      id: 'goalie',
      title: 'Brankáři',
      text: 'Hledáme talentované brankáře! HC Litvínov nabízí příležitost pro ambiciózní gólmany. Profesionální trenérský tým a špičkové zázemí.',
      focus: 'Specializace na brankáře'
    }
  ];
  
  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 100);
  }, []);
  
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setIsWriting(true);
    
    // Simulace psaní textu
    let index = 0;
    const text = template.text;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setWrittenText(text.substring(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowResult(true), 1000);
      }
    }, 30);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-900">
      {/* Animované pozadí */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {/* Plovoucí ikony */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            {['📝', '💼', '🏒', '📢', '🎯'][i % 5]}
          </div>
        ))}
      </div>
      
      {/* Hlavní obsah */}
      <div className={`
        relative bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-3xl w-full mx-4
        transform transition-all duration-500 border border-purple-400/30
        ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Zpět</span>
          </button>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="text-4xl">💼</span>
            Napsat inzerát
          </h2>
          <div className="w-20" />
        </div>
        
        {/* Obsah */}
        {!showResult ? (
          <div className="space-y-6">
            {!isWriting ? (
              /* Výběr šablony */
              <>
                <div className="text-center mb-6">
                  <Edit3 className="text-purple-400 mx-auto mb-3" size={60} />
                  <p className="text-white text-lg">
                    Vyber typ inzerátu pro hledání nových hráčů
                  </p>
                </div>
                
                <div className="grid gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className="bg-black/30 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-400 rounded-xl p-4 text-left transition-all hover:scale-[1.02] group"
                    >
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300">
                        {template.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {template.focus}
                      </p>
                      <div className="text-purple-400 text-xs">
                        Klikni pro napsání →
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              /* Psaní inzerátu */
              <div>
                <div className="bg-black/30 rounded-xl p-6 border border-purple-500/30 min-h-[200px]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-500 text-xs ml-2">inzerat.txt</span>
                  </div>
                  
                  <div className="font-mono text-white text-sm leading-relaxed">
                    {writtenText}
                    <span className="animate-pulse">|</span>
                  </div>
                </div>
                
                {writtenText.length === selectedTemplate?.text.length && (
                  <div className="mt-4 text-center">
                    <p className="text-green-400 text-sm animate-pulse">
                      ✓ Inzerát napsán! Odesílám...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Výsledek */
          <div className="text-center space-y-6">
            <div className="py-8">
              <CheckCircle className="text-green-400 mx-auto mb-4 animate-bounce" size={80} />
              <h3 className="text-2xl font-bold text-white mb-2">
                Inzerát odeslán!
              </h3>
              <p className="text-green-400 text-lg">
                Brzy se ozvou noví uchazeči
              </p>
            </div>
            
            {/* Info o inzerátu */}
            <div className="bg-black/30 rounded-xl p-4 space-y-2">
              <h4 className="text-yellow-400 font-bold mb-3">Očekávané výsledky:</h4>
              <div className="text-white text-sm space-y-1">
                <p>📧 3-5 odpovědí během příštích dnů</p>
                <p>🎯 Zaměření: {selectedTemplate?.title}</p>
                <p>⏰ Aktivní po dobu 7 dnů</p>
              </div>
            </div>
            
            <button
              onClick={onComplete}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-xl"
            >
              Dokončit aktivitu
            </button>
          </div>
        )}
      </div>
      
      {/* CSS animace */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}