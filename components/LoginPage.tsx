
import React, { useState } from 'react';
import { Lock, User, LogIn, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'DBA' && password === 'ABD') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.4)] mb-6 transform -rotate-6">
            <ShieldCheck className="w-10 h-10 text-emerald-950" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Architect Portal</h1>
          <p className="text-emerald-100/50 font-medium">MongoDB Associate DBA Exam Simulator</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[40px] border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-emerald-400 uppercase tracking-widest mb-2 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-emerald-100/30" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter DBA ID"
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-emerald-100/20 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none font-medium"
                />
              </div>
              <p className="mt-2 text-[10px] text-emerald-100/30 font-bold uppercase tracking-tighter ml-1">Hint: DBA</p>
            </div>

            <div>
              <label className="block text-xs font-black text-emerald-400 uppercase tracking-widest mb-2 ml-1">Access Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-emerald-100/30" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Security Code"
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-emerald-100/20 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none font-medium"
                />
              </div>
              <p className="mt-2 text-[10px] text-emerald-100/30 font-bold uppercase tracking-tighter ml-1">Hint: ABD</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm font-bold bg-red-400/10 p-4 rounded-2xl border border-red-400/20 animate-shake">
                <AlertCircle className="w-4 h-4" />
                Invalid architectural credentials.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 text-lg group"
            >
              Initialize Simulator
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="mt-10 text-center space-y-4">
          <p className="text-emerald-100/20 text-xs font-bold uppercase tracking-[0.2em]">Certified Exam Environment 171v98</p>
          <div className="flex justify-center gap-6 grayscale opacity-20 contrast-150">
             {/* Subtle brand decor */}
             <div className="w-8 h-8 rounded-full border-2 border-white"></div>
             <div className="w-8 h-8 rounded-lg border-2 border-white rotate-45"></div>
             <div className="w-8 h-8 border-2 border-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
