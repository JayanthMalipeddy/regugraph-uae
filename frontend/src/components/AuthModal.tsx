import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; organization: string; role: string }) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('compliance@emiratescorp.ae');
  const [password, setPassword] = useState('••••••••••••');
  const [orgName, setOrgName] = useState('Emirates Commercial Enterprises LLC');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      name: mode === 'signin' ? 'Khalid Al-Qasimi' : 'New Enterprise Borrower',
      email: email,
      organization: orgName,
      role: 'Corporate Borrower & Treasury Director'
    });
    onClose();
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      name: 'Khalid Al-Qasimi',
      email: 'treasury@almansouri-group.ae',
      organization: 'Al Mansouri Investment Group LLC',
      role: 'Treasury & Risk Director'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#0f172a] border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 p-0.5 mx-auto shadow-lg shadow-cyan-950/50 flex items-center justify-center">
            <div className="h-full w-full bg-[#0a0f1d] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === 'signin' ? 'Sign in to ReguGraph' : 'Open Institutional Account'}
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Central Bank of the UAE (CBUAE) Regulatory Credit Intelligence & Restitution Platform
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-[#0a0f1d] p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              mode === 'signin' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
              mode === 'signup' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create account
          </button>
        </div>

        {/* Demo Fast Login Pill Button */}
        <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Explore Demo Corporate Session</span>
            </div>
            <div className="text-[10px] text-slate-400">
              One-click instant access to verified enterprise dashboard
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Enter Demo
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Enterprise / Borrower Legal Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Al Mansouri Investment LLC"
                className="w-full bg-[#0a0f1d] border border-slate-800 rounded-2xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Work Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0f1d] border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0f1d] border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>{mode === 'signin' ? 'Sign in to Portal' : 'Register Enterprise Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* CBUAE Security Notice */}
        <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
          <CheckCircle2 className="h-3 w-3 text-cyan-400" />
          <span>AES-256 Banking Grade Security & UAE Data Sovereignty</span>
        </div>

      </div>
    </div>
  );
};
