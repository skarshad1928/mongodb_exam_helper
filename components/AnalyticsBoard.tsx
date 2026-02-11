
import React from 'react';
import { Analytics, DomainScore, Domain } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Target, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';

interface AnalyticsBoardProps {
  analytics: Analytics;
  onExit: () => void;
  onStartAdaptive: (objective: string) => void;
  aiAdvice: string;
}

const AnalyticsBoard: React.FC<AnalyticsBoardProps> = ({ analytics, onExit, onStartAdaptive, aiAdvice }) => {
  const getPassProbabilityColor = (prob: number) => {
    if (prob > 80) return 'text-emerald-500';
    if (prob > 50) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Exam Performance Analysis</h1>
          <p className="text-gray-500 mt-2">Deep architectural review of your MongoDB Associate DBA readiness.</p>
        </div>
        <button 
          onClick={onExit}
          className="text-gray-500 hover:text-gray-900 font-semibold flex items-center gap-2"
        >
          Return to Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center col-span-1">
          <div className={`text-6xl font-black mb-2 ${getPassProbabilityColor(analytics.overallPercentage)}`}>
            {Math.round(analytics.overallPercentage)}%
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Accuracy</div>
        </div>

        <div className="bg-emerald-900 p-8 rounded-3xl shadow-xl text-white col-span-1 md:col-span-2 relative overflow-hidden">
          <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-emerald-800 opacity-20" />
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Pass Probability Prediction
          </h3>
          <div className="text-4xl font-black mb-2">
            {analytics.passProbability}%
          </div>
          <p className="text-emerald-100 text-sm opacity-80 leading-relaxed">
            Based on current speed, domain weighting, and complexity handling. 
            A minimum of 78% overall is usually required for the actual 171v98 exam.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 col-span-1">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Critical Gaps
          </h3>
          <div className="space-y-2">
            {analytics.weakObjectives.map(obj => (
              <div key={obj} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full inline-block mr-2">
                Obj {obj}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Domain-wise Proficiency</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics.domainScores}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="domain" tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar
                name="Proficiency"
                dataKey="percentage"
                stroke="#059669"
                fill="#10b981"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Objective Mastery</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.domainScores}>
              <XAxis dataKey="domain" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                {analytics.domainScores.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.percentage > 70 ? '#10b981' : '#f43f5e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-yellow-300" />
            Architect AI Feedback
          </h3>
          <p className="mt-4 text-indigo-100 leading-relaxed font-medium">
            {aiAdvice || "Calculating architectural recommendations..."}
          </p>
        </div>
        
        <div className="p-8">
          <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Suggested Corrective Practice</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.weakObjectives.map((obj) => (
              <button
                key={obj}
                onClick={() => onStartAdaptive(obj)}
                className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 group transition-all"
              >
                <div className="text-left">
                  <div className="text-xs font-black text-gray-400 uppercase mb-1">Objective</div>
                  <div className="text-xl font-extrabold text-gray-800">{obj}</div>
                </div>
                <div className="bg-white p-3 rounded-full shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsBoard;
