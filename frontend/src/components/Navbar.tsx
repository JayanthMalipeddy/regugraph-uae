import React from 'react';
import { Search, Bell, ChevronDown, Command } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit
}) => {
  return (
    <header className="h-20 border-b border-slate-800/80 px-6 sm:px-8 flex items-center justify-between bg-[#0a0f1d]/80 backdrop-blur-md sticky top-0 z-40">
      
      {/* Search Input Bar (matching fintechui.jpeg) */}
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
      <div className="flex items-center gap-4">
        
        {/* Notification Bell with indicator */}
        <button
          className="relative h-11 w-11 rounded-2xl bg-[#131b2e] border border-slate-800/90 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          title="Regulatory Alerts"
        >
          <Bell className="h-4 w-4 text-slate-300" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        </button>

        {/* User Profile Pill (matching Jack Dawson in fintechui.jpeg) */}
        <div className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-2xl bg-[#131b2e] border border-slate-800/90 cursor-pointer hover:border-slate-700 transition-all">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 p-0.5 shrink-0">
            <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
              <span className="text-white text-xs font-semibold">JD</span>
            </div>
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-white leading-tight">Jack Dawson</div>
            <div className="text-[10px] text-slate-400 font-mono">@jack_dawson</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-1" />
        </div>

      </div>

    </header>
  );
};
