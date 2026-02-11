
import React, { useState, useEffect } from 'react';
import { Question, Domain } from '../types';
import { ChevronLeft, ChevronRight, Timer, AlertCircle, ArrowLeft } from 'lucide-react';

interface ExamViewProps {
  questions: Question[];
  onComplete: (answers: (number[] | null)[]) => void;
  onCancel: () => void;
  domain: Domain;
}

const ExamView: React.FC<ExamViewProps> = ({ questions, onComplete, onCancel, domain }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number[] | null)[]>(new Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(questions.length * 90);

  useEffect(() => {
    if (!questions?.length) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answers, onComplete, questions.length]);

  if (!questions?.length) return null;

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    const currentSelection = answers[currentIndex] || [];
    let newSelection: number[];

    if (currentQuestion.type === 'single') {
      newSelection = [index];
    } else {
      if (currentSelection.includes(index)) {
        newSelection = currentSelection.filter(i => i !== index);
      } else {
        if (currentSelection.length < (currentQuestion.selectCount || 2)) {
          newSelection = [...currentSelection, index];
        } else {
          return; // Max selections reached
        }
      }
    }

    const newAnswers = [...answers];
    newAnswers[currentIndex] = newSelection;
    setAnswers(newAnswers);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <button onClick={onCancel} className="p-3 hover:bg-slate-50 rounded-2xl transition-all">
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </button>
        <div className="flex flex-col items-center">
          <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">{domain}</div>
          <div className="flex gap-1.5">
            {questions.map((_, idx) => (
              <div key={idx} className={`w-1.5 h-1.5 rounded-full ${currentIndex === idx ? 'bg-slate-900' : answers[idx] ? 'bg-emerald-400' : 'bg-slate-100'}`} />
            ))}
          </div>
        </div>
        <div className={`flex items-center gap-3 px-6 py-2 rounded-full font-black font-mono text-xl ${timeLeft < 180 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>
          <Timer className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase">
              {currentQuestion.difficulty}
            </span>
            <span className="text-slate-400 text-xs font-bold">Obj: {currentQuestion.objectiveId}</span>
          </div>

          <h2 className="text-3xl font-black text-slate-900 leading-tight mb-8">
            {currentQuestion.scenario}
          </h2>

          {currentQuestion.code && (
            <div className="bg-slate-950 rounded-[32px] p-10 mb-10 overflow-x-auto shadow-2xl border border-slate-800">
              <pre className="text-emerald-400 text-sm font-mono leading-relaxed">
                <code>{currentQuestion.code}</code>
              </pre>
            </div>
          )}

          <div className="p-6 bg-amber-50 rounded-2xl border-l-8 border-amber-400 text-amber-900 font-black text-lg mb-10 italic">
            {currentQuestion.questionText}
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentIndex]?.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-8 rounded-[32px] border-4 transition-all flex items-start gap-6 group ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10' 
                      : 'border-slate-50 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`mt-1 w-8 h-8 rounded-xl border-4 flex-shrink-0 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-200'
                  }`}>
                    {isSelected && <div className="w-3 h-3 bg-white rounded-md" />}
                  </div>
                  <span className={`text-lg font-bold leading-relaxed ${isSelected ? 'text-emerald-900' : 'text-slate-600'}`}>
                    <code className="font-mono bg-white/50 px-2 py-1 rounded text-sm group-hover:bg-white">{option}</code>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center py-10 border-t border-slate-100">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-3 text-slate-400 font-black disabled:opacity-20 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
            Previous
          </button>

          <button
            onClick={() => {
              if (currentIndex === questions.length - 1) {
                onComplete(answers);
              } else {
                setCurrentIndex(prev => prev + 1);
              }
            }}
            className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-lg flex items-center gap-3 hover:bg-emerald-600 transition-all shadow-xl"
          >
            {currentIndex === questions.length - 1 ? 'Submit Final' : 'Next Scenario'}
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamView;
