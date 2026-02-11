
import React, { useState, useCallback, useEffect } from 'react';
import { Domain, Question, ExamSession, Analytics, DomainScore } from './types';
import { PHILOSOPHY_CART } from './data/philosophy_cart';
import { CRUD_CART } from './data/crud_cart';
import { INDEXES_CART } from './data/indexes_cart';
import { DOMAIN_WEIGHTS, DOMAIN_DESCRIPTIONS, DOMAIN_ICONS } from './constants';
import ExamView from './components/ExamView';
import AnalyticsBoard from './components/AnalyticsBoard';
import LoginPage from './components/LoginPage';
import { generateAdaptiveQuestions, getPerformanceAdvice } from './services/geminiService';
import { Play, BookOpen, GraduationCap, Trophy, Info, ArrowRight, Layers, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('dba_auth') === 'true';
  });
  const [activeSession, setActiveSession] = useState<ExamSession | null>(null);
  const [lastAnalytics, setLastAnalytics] = useState<Analytics | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [showSetPicker, setShowSetPicker] = useState<Domain | null>(null);

  useEffect(() => {
    localStorage.setItem('dba_auth', isLoggedIn.toString());
  }, [isLoggedIn]);

  // Library of all available questions
  const library = [PHILOSOPHY_CART, CRUD_CART, INDEXES_CART];

  const handleStartSet = (domain: Domain, setNum: number) => {
    const cart = library.find(c => c.domain === domain);
    const set = cart?.sets.find(s => s.setNumber === setNum);
    
    if (!set) return;

    setActiveSession({
      id: `${domain}-${setNum}-${Date.now()}`,
      domain,
      setNumber: setNum,
      questions: set.questions,
      userAnswers: new Array(set.questions.length).fill(null),
      startTime: Date.now(),
      completed: false
    });
    setShowSetPicker(null);
  };

  const handleStartFinal = () => {
    const allQuestions = library.flatMap(c => c.sets.flatMap(s => s.questions));
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const finalPool = shuffled.slice(0, 66); 

    setActiveSession({
      id: `final-${Date.now()}`,
      domain: Domain.Final,
      questions: finalPool,
      userAnswers: new Array(finalPool.length).fill(null),
      startTime: Date.now(),
      completed: false
    });
  };

  const calculateAnalytics = useCallback(async (session: ExamSession, answers: (number[] | null)[]) => {
    const questions = session.questions;
    let correct = 0;
    const domainStats: Record<string, { correct: number, total: number }> = {};
    const weakObjectives: Set<string> = new Set();

    answers.forEach((ans, idx) => {
      const q = questions[idx];
      const isCorrect = ans && 
        ans.length === q.correctAnswers.length && 
        ans.every(a => q.correctAnswers.includes(a));

      if (isCorrect) correct++;
      
      const domainKey = q.domain as string;
      if (!domainStats[domainKey]) domainStats[domainKey] = { correct: 0, total: 0 };
      domainStats[domainKey].total++;
      if (isCorrect) domainStats[domainKey].correct++;
      else weakObjectives.add(q.objectiveId);
    });

    const domainScores: DomainScore[] = Object.entries(domainStats).map(([name, stats]) => ({
      domain: name as Domain,
      score: stats.correct,
      total: stats.total,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }));

    const overallPercentage = Math.round((correct / questions.length) * 100);
    const passProbability = Math.min(100, Math.max(0, overallPercentage - (weakObjectives.size * 2)));

    const analytics: Analytics = {
      overallPercentage,
      domainScores,
      weakObjectives: Array.from(weakObjectives).slice(0, 5),
      passProbability,
      timePerQuestion: (Date.now() - session.startTime) / (1000 * questions.length)
    };

    setLastAnalytics(analytics);
    setActiveSession(null);
    const advice = await getPerformanceAdvice(analytics);
    setAiAdvice(advice);
  }, []);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  if (activeSession) {
    return (
      <ExamView 
        questions={activeSession.questions} 
        domain={activeSession.domain}
        onComplete={(answers) => calculateAnalytics(activeSession, answers)}
        onCancel={() => setActiveSession(null)}
      />
    );
  }

  if (lastAnalytics) {
    return (
      <AnalyticsBoard 
        analytics={lastAnalytics} 
        onExit={() => setLastAnalytics(null)} 
        onStartAdaptive={async (obj) => {
          setIsGenerating(true);
          const q = await generateAdaptiveQuestions(obj);
          setIsGenerating(false);
          setActiveSession({
            id: `adaptive-${Date.now()}`,
            domain: Domain.CRUD,
            questions: q,
            userAnswers: new Array(q.length).fill(null),
            startTime: Date.now(),
            completed: false
          });
          setLastAnalytics(null);
        }}
        aiAdvice={aiAdvice}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative font-sans">
      {/* Set Picker Overlay */}
      {showSetPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 glass">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-2xl w-full p-10 border border-slate-200">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900">{showSetPicker}</h2>
                <p className="text-slate-500 font-medium">Select an exam set to begin (25 questions each)</p>
              </div>
              <button onClick={() => setShowSetPicker(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <Play className="rotate-90 w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map(num => (
                <button 
                  key={num}
                  onClick={() => handleStartSet(showSetPicker, num)}
                  className="flex items-center justify-between p-6 rounded-3xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      {num}
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-slate-900">Exam Set {num}</div>
                      <div className="text-sm text-slate-500">25 High-Difficulty Scenarios</div>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-emerald-950 text-white pt-24 pb-48 px-4 relative overflow-hidden">
        <button 
          onClick={() => setIsLoggedIn(false)} 
          className="absolute top-8 right-8 flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all z-50"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-black uppercase tracking-widest border border-emerald-500/30">
              <GraduationCap className="w-5 h-5" />
              Official MongoDB 171v98 Architect
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]">
              DBA <br />
              <span className="text-emerald-500">Mastery.</span>
            </h1>
            <p className="text-emerald-100/60 text-xl max-w-xl leading-relaxed font-medium">
              8 specialized carts. 24 high-difficulty sets. 1 final simulation. 
              The ultimate path to professional certification.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button 
                onClick={handleStartFinal}
                className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black px-10 py-6 rounded-3xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-3 text-xl"
              >
                <Layers className="w-6 h-6" />
                Final MongoDBA Exam
              </button>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
             <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-xl text-center space-y-2">
                <div className="text-4xl font-black text-emerald-400">{library.reduce((acc, c) => acc + c.sets.reduce((as, s) => as + s.questions.length, 0), 0)}</div>
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Loaded Tasks</div>
             </div>
             <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-xl text-center space-y-2">
                <div className="text-4xl font-black text-emerald-400">{library.length * 3}</div>
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Active Sets</div>
             </div>
          </div>
        </div>
      </div>

      {/* Cart Grid */}
      <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        {Object.values(Domain).filter(d => d !== Domain.Final).map((domain) => (
          <div 
            key={domain}
            className="group bg-white rounded-[48px] p-10 shadow-2xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all border border-slate-100 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-3xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-inner">
                  {DOMAIN_ICONS[domain]}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-slate-200 group-hover:text-emerald-100 transition-colors">
                    {DOMAIN_WEIGHTS[domain]}%
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Weighting</div>
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">{domain}</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-10 line-clamp-2">
                {DOMAIN_DESCRIPTIONS[domain]}
              </p>
            </div>
            
            <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
               <div className="flex gap-1.5">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full bg-slate-100"></div>
                  ))}
               </div>
               <button 
                onClick={() => setShowSetPicker(domain)}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-emerald-600 transition-all"
               >
                 Launch Cart <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>

      <div className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto" />
          <h2 className="text-4xl font-black text-slate-900">Architect Grade Simulator</h2>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">
            This simulator is strictly aligned with the 171v98 guide. We prioritize scenario-based 
            thinking over rote memorization. Every question requires you to predict outcomes, 
            interpret explain plans, and manage production clusters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
