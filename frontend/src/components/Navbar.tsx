import React from 'react';
import { Search, Bell, Command, LogIn, UserPlus, LogOut, ShieldCheck } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  organization: string;
  role: string;
}

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  return (
    <header className="h-20 border-b border-slate-800/80 px-6 sm:px-8 flex items-center justify-between bg-[#0a0f1d]/80 backdrop-blur-md sticky top-0 z-40">
      
      {/* Search Input Bar */}
      <div className="relative w-72 sm:w-96">
        <div className="flex items-center bg-[#131b2e] border border-slate-800/90 rounded-2xl px-4 py-2.5 text-xs text-slate-300 focus-within:border-cyan-500/80 transition-all shadow-inner">
          <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearchSubmit(searchQuery);
            }}
            placeholder="Search regulations, facilities, fee caps..."
            className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:outline-none text-xs"
          />
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono shrink-0 ml-2">
            <Command className="h-3 w-3" />
            <span>+ Space</span>
          </div>
        </div>
      </div>

      {/* Right User & Actions Bar */}
      <div className="flex items-center gap-3">
        
        {/* Notification Bell */}
        <button
          className="relative h-10 w-10 rounded-2xl bg-[#131b2e] border border-slate-800/90 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          title="CBUAE Regulatory Circular Alerts"
        >
          <Bell className="h-4 w-4 text-slate-300" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        </button>

        {/* Dynamic Auth Section: Login / Signup OR Verified Organization */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-2xl bg-[#131b2e] border border-slate-800/90">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 p-0.5 shrink-0">
              <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-cyan-300">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-left pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white leading-tight">{currentUser.organization}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  UAE Pass
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{currentUser.name}</div>
            </div>
            <button
              onClick={onLogout}
              title="Sign out"
              className="h-8 w-8 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuth('signin')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Log in</span>
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Create account</span>
            </button>
          </div>
        )}

      </div>

    </header>
  );
};
