'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Check, ChevronRight, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';

const quiz = {
  title: 'Kvíz: Turnaj ve Straubingu 2025',
  description: 'Jak dobře si pamatuješ hokejový víkend Lancers ve Straubingu?',
  questions: [
    {
      id: 1,
      question: 'Jaké bylo konečné umístění HC Litvínov Lancers na turnaji?',
      options: ['4. místo', '5. místo', '6. místo', '7. místo'],
      correctAnswer: 2,
      explanation: 'Lancers obsadili 6. místo z 12 týmů.',
    },
    {
      id: 2,
      question: 'Kdo dal rozhodující nájezd v semifinále proti Bayern Rangers?',
      options: ['Tomáš Tureček', 'Michal Koreš', 'Jan Hanuš', 'Dan Kačeňák'],
      correctAnswer: 1,
      explanation: 'Michal Koreš dal rozhodující nájezd v sudden death.',
    },
    {
      id: 3,
      question: 'Který tým porazili Lancers ve skupině?',
      options: ['Bayern Rangers', 'RSC Pilnach', 'Cologne Ravens', 'Bruno der Bär'],
      correctAnswer: 2,
      explanation: 'Jediné vítězství ve skupině bylo proti Cologne Ravens 2:1.',
    },
    {
      id: 4,
      question: 'V jakém městě se turnaj konal?',
      options: ['Mnichov', 'Straubing', 'Norimberk', 'Stuttgart'],
      correctAnswer: 1,
      explanation: 'Turnaj se konal ve Straubingu v Německu.',
    },
    {
      id: 5,
      question: 'Kolik hráčů z Lancers se turnaje zúčastnilo?',
      options: ['6 hráčů', '7 hráčů', '8 hráčů', '9 hráčů'],
      correctAnswer: 3,
      explanation: 'Z Lancers se zúčastnilo celkem 9 hráčů včetně Dana Kačeňáka, Lukáše Zmeškala a Pepy.',
    },
  ],
};

function celebrate() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  confetti({
    particleCount: 95,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#dc2626', '#fbbf24', '#ffffff'],
  });
}

export default function ArticleQuiz() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const advanceTimer = useRef(null);

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  const score = quiz.questions.filter(
    (question, index) => question.correctAnswer === selectedAnswers[index],
  ).length;

  const resetQuiz = () => {
    clearTimeout(advanceTimer.current);
    setStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setAdvancing(false);
  };

  const selectAnswer = (answerIndex) => {
    if (advancing) return;

    const nextAnswers = [...selectedAnswers];
    nextAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(nextAnswers);
    setAdvancing(true);

    advanceTimer.current = setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
        if (quiz.questions.every((question, index) => question.correctAnswer === nextAnswers[index])) {
          celebrate();
        }
      }
      setAdvancing(false);
    }, 450);
  };

  if (showResult) {
    const perfect = score === quiz.questions.length;

    return (
      <section className="my-12 rounded-3xl bg-gradient-to-br from-red-50 via-white to-amber-50 p-5 sm:p-8" aria-label="Výsledek kvízu">
        <div className="text-center">
          <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${perfect ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
            <Trophy size={38} aria-hidden="true" />
          </div>
          <h2 className="mb-3 text-3xl font-black text-gray-900 sm:text-4xl">
            {perfect ? 'Výborně, znáš Straubing!' : 'Kvíz dokončen'}
          </h2>
          <p className="text-lg text-gray-700">
            Správně máš <strong>{score} z {quiz.questions.length}</strong> otázek.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-600">
            Kvíz je teď pro zábavu. Odměny a sbírání karet pro Lancers Card připravujeme v nové verzi hry.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {quiz.questions.map((question, index) => {
            const correct = selectedAnswers[index] === question.correctAnswer;
            return (
              <div key={question.id} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${correct ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                    {correct ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900">{question.question}</h3>
                    <p className="mt-2 text-sm text-gray-700">
                      Správná odpověď: <strong>{question.options[question.correctAnswer]}</strong>
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{question.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={resetQuiz}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
          >
            <RotateCcw size={18} aria-hidden="true" />
            Zkusit znovu
          </button>
          <Link
            href="/clanky"
            className="inline-flex items-center justify-center rounded-xl bg-gray-800 px-6 py-3 font-bold text-white transition-colors hover:bg-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Zpět na články
          </Link>
        </div>
      </section>
    );
  }

  if (started) {
    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
      <section className="my-12 rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 p-5 sm:p-8" aria-label="Kvíz o turnaji ve Straubingu">
        <div className="mb-6">
          <div className="mb-2 flex justify-between gap-3 text-sm font-semibold text-gray-700">
            <span>Otázka {currentQuestion + 1} z {quiz.questions.length}</span>
            <span>{Math.round(progress)} %</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-valuenow={currentQuestion + 1} aria-valuemin={0} aria-valuemax={quiz.questions.length} aria-label="Postup v kvízu">
            <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 sm:p-6">
          <h2 className="mb-5 text-xl font-bold text-gray-900" aria-live="polite">{question.question}</h2>
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const selected = selectedAnswers[currentQuestion] === index;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectAnswer(index)}
                  disabled={advancing}
                  aria-pressed={selected}
                  className={`w-full rounded-xl border-2 p-4 text-left font-semibold text-gray-900 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-default ${selected ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-gray-600">Výsledek se neukládá k účtu.</p>
      </section>
    );
  }

  return (
    <section className="my-12 rounded-3xl bg-gradient-to-br from-red-600 to-red-700 p-5 text-white sm:p-8" aria-label="Kvíz o turnaji ve Straubingu">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="flex-1">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
            <Sparkles size={16} aria-hidden="true" />
            KVÍZ K ČLÁNKU
          </div>
          <h2 className="mb-4 text-3xl font-black">{quiz.title}</h2>
          <p className="mb-3 text-white/95">{quiz.description}</p>
          <p className="mb-6 text-sm leading-6 text-white/90">
            Pět otázek, pět odpovědí. Hrát můžeš i bez přihlášení. Odměny Lancers Card se právě připravují.
          </p>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 font-black text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Začít kvíz
            <ChevronRight size={19} aria-hidden="true" />
          </button>
        </div>
        <div className="hidden h-44 w-44 shrink-0 items-center justify-center rounded-3xl bg-white/10 md:flex" aria-hidden="true">
          <Trophy size={78} className="text-amber-300" />
        </div>
      </div>
    </section>
  );
}
