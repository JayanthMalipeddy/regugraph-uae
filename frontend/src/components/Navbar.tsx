import React, { useRef, useEffect, useState } from 'react';
import {
  Search,
  Bell,
  BellOff,
  Sun,
  Moon,
  Command,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
  Home,
  Info
} from 'lucide-react';

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
  onGoHome: () => void;
  onOpenAbout?: () => void;
  activeTab?: string;
  currentUser: UserProfile | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onLogout: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}


export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  onGoHome,
  onOpenAbout,
  activeTab,
  currentUser,
  onOpenAuth,
  onLogout,
  theme = 'dark',
  onToggleTheme
}) => {

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Close notification popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut listener for Ctrl+Space, Cmd+Space, and Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Space or Cmd+Space or Ctrl+K
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && (e.code === 'Space' || e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDownInInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        onSearchSubmit(searchQuery.trim());
      }
    } else if (e.key === 'Escape') {
      searchInputRef.current?.blur();
    }
  };

  return (
    <header className="h-20 border-b border-slate-200 dark:border-slate-800/80 px-6 sm:px-8 flex items-center justify-between bg-white/90 dark:bg-[#0a0f1d]/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      
      {/* Left Area: Home Button + Search Bar */}
      <div className="flex items-center gap-2.5">
        
        {/* Dedicated Home Button beside Search Bar (as requested by user) */}
        <button
          onClick={onGoHome}
          title="Return to Dashboard Home"
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#131b2e] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm hover:border-slate-300 dark:hover:border-slate-700 shrink-0"
        >
          <Home className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Search Input Bar with Global Focus & Execution */}
        <div className="relative w-64 sm:w-80 md:w-96">
          <div className="flex items-center bg-slate-100 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/90 rounded-2xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-300 focus-within:border-cyan-500/80 transition-all shadow-inner">
            <Search
              onClick={() => {
                searchInputRef.current?.focus();
                if (searchQuery.trim()) onSearchSubmit(searchQuery.trim());
              }}
              className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0 mr-2.5 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDownInInput}
              placeholder="Search regulations, facilities, fee caps..."
              className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-xs"
            />

            {/* Clickable Keyboard Shortcut Pill (Pressing Ctrl+Space or Clicking it focuses search) */}
            <button
              type="button"
              onClick={() => {
                searchInputRef.current?.focus();
                searchInputRef.current?.select();
              }}
              className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-mono shrink-0 ml-2 transition-colors cursor-pointer"
              title="Shortcut: Press Ctrl+Space or ⌘+Space to focus search"
            >
              <Command className="h-3 w-3" />
              <span>+ Space</span>
            </button>
          </div>
        </div>

        {/* Dedicated About Us Button beside Search Bar */}
        <button
          onClick={onOpenAbout}
          title="About ReguGraph Solution & Capabilities"
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer shadow-sm shrink-0 ${
            activeTab === 'about'
              ? 'bg-cyan-600 text-white border-cyan-600 dark:bg-cyan-500 dark:text-slate-950 dark:border-cyan-400 shadow-cyan-500/20 font-bold'
              : 'bg-slate-100 dark:bg-[#131b2e] hover:bg-slate-200 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <Info className={`h-4 w-4 ${activeTab === 'about' ? 'text-white dark:text-slate-950' : 'text-cyan-600 dark:text-cyan-400'}`} />
          <span className="hidden sm:inline">About Us</span>
        </button>
      </div>


      {/* Right User & Actions Bar */}
      <div className="flex items-center gap-3">
        
        {/* Light / Dark Mode Toggle Button */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="h-10 px-3 rounded-2xl bg-slate-100 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/90 flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-semibold hidden md:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-cyan-600" />
                <span className="text-xs font-semibold hidden md:inline">Dark</span>
              </>
            )}
          </button>
        )}

        {/* Notification Bell with Dropdown Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative h-10 w-10 rounded-2xl bg-slate-100 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/90 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer shadow-sm"
            title="CBUAE Regulatory Circular Alerts (0 Unread)"
          >
            <Bell className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    0 New
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer px-1"
                >
                  ✕
                </button>
              </div>

              {/* Empty state as requested by user */}
              <div className="py-6 text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <BellOff className="h-5 w-5 text-slate-500" />
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">No notifications</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-[220px] mx-auto">
                  You are completely up to date. All CBUAE regulatory circulars, early settlement caps, and statutory standards are active.
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-center text-slate-400 dark:text-slate-500 font-mono">
                CBUAE Consumer Protection Stream
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Auth Section: Login / Signup OR Verified Organization */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-2xl bg-slate-100 dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800/90">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 p-0.5 shrink-0">
              <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-cyan-300">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="text-left pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{currentUser.organization}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  UAE Pass
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{currentUser.name}</div>
            </div>
            <button
              onClick={onLogout}
              title="Sign out"
              className="h-8 w-8 rounded-xl bg-slate-200 dark:bg-slate-800/60 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuth('signin')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Log in</span>
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
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

export default Navbar;
