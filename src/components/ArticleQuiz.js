'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  Star, 
  Check, 
  X as XIcon, 
  ChevronRight, 
  Sparkles,
  Coins,
  Gift,
  Loader,
  Lock,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  checkQuizCompletion, 
  saveQuizCompletion,
  straubingQuizData 
} from '@/lib/firebaseQuiz';
import { getUserProfile } from '@/lib/firebaseProfile';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

export default function ArticleQuiz({ quizId = 'straubing-2025-quiz' }) {
  const { user } = useAuth();
  const router = useRouter();
  
  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingCompletion, setSavingCompletion] = useState(false);
  
  const quiz = straubingQuizData;
  
  // Check if user already completed this quiz
  useEffect(() => {
    if (user) {
      checkUserQuizStatus();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const checkUserQuizStatus = async () => {
    try {
      const completed = await checkQuizCompletion(user.uid, quizId);
      setAlreadyCompleted(completed);
    } catch (error) {
      console.error('Error checking quiz status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Start quiz
  const startQuiz = () => {
    if (!user) {
      router.push('/');
      return;
    }
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
  };
  
  // Handle answer selection
  const selectAnswer = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    
    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Quiz finished
        checkAnswers(newAnswers);
      }
    }, 500);
  };
  
  // Check answers and show results
  const checkAnswers = async (answers) => {
    const correctCount = quiz.questions.filter(
      (q, index) => q.correctAnswer === answers[index]
    ).length;
    
    setShowResult(true);
    
    if (correctCount === quiz.questions.length) {
      setQuizCompleted(true);
      fireConfetti();
      
      // Uložit dokončení kvízu (ale bez výběru karty)
      setSavingCompletion(true);
      try {
        await saveQuizCompletion(user.uid, quizId);
        // ODSTRANĚNO automatické přesměrování - hráč musí kliknout sám
      } catch (error) {
        console.error('Error saving quiz completion:', error);
      } finally {
        setSavingCompletion(false);
      }
    }
  };
  
  // Fire confetti animation
  const fireConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
  };
  
  // Go to rewards page
  const goToRewards = () => {
    router.push('/profil/odmeny');
  };
  
  // Go to collection
  const goToCollection = () => {
    router.push('/sbirka-karet');
  };
  
  // Reset quiz for retry
  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setQuizCompleted(false);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="animate-spin text-red-600" size={32} />
      </div>
    );
  }
  
  // Already completed state
  if (alreadyCompleted) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 my-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <Check className="text-green-600" size={40} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Kvíz již splněn!
        </h3>
        <p className="text-gray-600 mb-6">
          Tento kvíz jste již úspěšně dokončili.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={goToRewards}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all inline-flex items-center justify-center gap-2"
          >
            <Gift size={20} />
            Zobrazit odměny
          </button>
          <button
            onClick={goToCollection}
            className="px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-all inline-flex items-center justify-center gap-2"
          >
            <Package size={20} />
            Moje sbírka
          </button>
        </div>
      </div>
    );
  }
  
  // Not logged in state
  if (!user) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 my-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-4">
          <Lock className="text-gray-600" size={40} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Přihlaste se pro kvíz
        </h3>
        <p className="text-gray-600 mb-6">
          Pro účast v kvízu a získání odměn se musíte přihlásit.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
        >
          Přihlásit se
        </button>
      </div>
    );
  }
  
  // Success screen after completion
  if (quizCompleted) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 via-red-50 to-orange-50 rounded-3xl p-8 my-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4 animate-bounce">
            <Trophy className="text-white" size={48} />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">
            Gratulujeme! 🎉
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Úspěšně jste dokončili kvíz!
          </p>
          
          {/* Rewards info */}
          <div className="bg-white rounded-2xl p-6 mb-6 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Vaše odměny:
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-green-50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Coins className="text-white" size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">1000 kreditů</div>
                    <div className="text-xs text-gray-600">Přidáno k vašemu účtu</div>
                  </div>
                </div>
                <Check className="text-green-600" size={24} />
              </div>
              
              <div className="flex items-center justify-between bg-purple-50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Star className="text-white" size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">150 XP</div>
                    <div className="text-xs text-gray-600">Pro postup na další level</div>
                  </div>
                </div>
                <Check className="text-purple-600" size={24} />
              </div>
              
              <div className="flex items-center justify-between bg-yellow-50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Gift className="text-white" size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Speciální karta</div>
                    <div className="text-xs text-gray-600">Čeká na vyzvednutí</div>
                  </div>
                </div>
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  NOVÁ!
                </div>
              </div>
            </div>
          </div>
          
          {/* Tlačítka pro akce - hráč musí kliknout sám */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={goToRewards}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-black text-lg hover:from-red-700 hover:to-red-800 transition-all inline-flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <Gift size={24} />
              Vybrat speciální kartu
              <ArrowRight size={24} />
            </button>
            
            <button
              onClick={() => router.push('/clanky')}
              className="px-6 py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-all inline-flex items-center justify-center gap-2"
            >
              Zpět na články
            </button>
          </div>
          
          {savingCompletion && (
            <div className="mt-4 text-sm text-gray-500">
              <Loader className="animate-spin inline mr-2" size={16} />
              Ukládám dokončení kvízu...
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Quiz result screen (if not all correct)
  if (showResult && !quizCompleted) {
    const correctCount = quiz.questions.filter(
      (q, index) => q.correctAnswer === selectedAnswers[index]
    ).length;
    
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 my-12">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XIcon className="text-red-600" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Skoro to bylo!
          </h3>
          <p className="text-gray-600">
            Správně jste odpověděli na {correctCount} z {quiz.questions.length} otázek.
          </p>
        </div>
        
        {/* Show correct answers */}
        <div className="space-y-3 mb-6">
          {quiz.questions.map((q, index) => {
            const isCorrect = q.correctAnswer === selectedAnswers[index];
            return (
              <div key={q.id} className="bg-white rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isCorrect ? (
                      <Check className="text-white" size={14} />
                    ) : (
                      <XIcon className="text-white" size={14} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      {q.question}
                    </p>
                    <p className="text-sm text-gray-600">
                      Správná odpověď: {q.options[q.correctAnswer]}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-gray-500 mt-1">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
          >
            Zkusit znovu
          </button>
        </div>
      </div>
    );
  }
  
  // Quiz in progress
  if (quizStarted) {
    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
    
    return (
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 my-12">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Otázka {currentQuestion + 1} z {quiz.questions.length}
            </span>
            <span className="text-sm font-semibold text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-700 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Question */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {question.question}
          </h3>
          
          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className={`
                  w-full text-left p-4 rounded-xl border-2 transition-all
                  ${selectedAnswers[currentQuestion] === index 
                    ? 'border-red-600 bg-red-50' 
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${selectedAnswers[currentQuestion] === index 
                      ? 'border-red-600 bg-red-600' 
                      : 'border-gray-400'
                    }
                  `}>
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Initial quiz card
  return (
    <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 my-12 text-white">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Left side - info */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 mb-4">
            <Sparkles size={16} />
            <span className="text-sm font-bold">BONUSOVÝ KVÍZ</span>
          </div>
          
          <h2 className="text-3xl font-black mb-4">
            {quiz.title}
          </h2>
          
          <p className="text-white/90 mb-6">
            {quiz.description}
          </p>
          
          {/* Rewards preview */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Coins className="text-yellow-300" size={20} />
              </div>
              <span className="font-bold">
                +1000 kreditů za dokončení
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="text-yellow-300" size={20} />
              </div>
              <span className="font-bold">
                +150 XP pro další level
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Award className="text-yellow-300" size={20} />
              </div>
              <span className="font-bold">
                Speciální karta Straubing 2025
              </span>
            </div>
          </div>
          
          <button
            onClick={startQuiz}
            className="px-8 py-4 bg-white text-red-600 rounded-xl font-black text-lg hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            Začít kvíz
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Right side - decorative */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="w-48 h-48 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur">
              <Trophy className="text-yellow-300" size={80} />
            </div>
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 rounded-full w-12 h-12 flex items-center justify-center font-black">
              5
            </div>
            <div className="absolute -bottom-2 -left-2 bg-white text-red-600 rounded-full px-3 py-1 font-bold text-sm">
              otázek
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder component for missing icon
const Package = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);