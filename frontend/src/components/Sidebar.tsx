import React from 'react';
import {
  LayoutDashboard,
  SlidersHorizontal,
  BookOpen,
  Activity,
  HelpCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Audit', icon: LayoutDashboard },
    { id: 'calculators', label: 'Statutory Calculators', icon: SlidersHorizontal },
    { id: 'codex', label: 'CBUAE Regulatory Codex', icon: BookOpen },
    { id: 'diagnostics', label: 'Diagnostics & Architecture', icon: Activity },
  ];

  return (
    <aside className="w-16 sm:w-20 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col items-center py-6 justify-between shrink-0 select-none">
      
      {/* Top Brand Glyph */}
      <div className="flex flex-col items-center gap-8">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 p-0.5 shadow-lg shadow-cyan-950/50 flex items-center justify-center cursor-pointer">
          <div className="h-full w-full bg-[#0a0f1d] rounded-[14px] flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-cyan-400" />
          </div>
        </div>

        {/* Navigation Icon Stack */}
        <nav className="flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`relative h-12 w-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-slate-950' : ''}`} />
                {isActive && (
                  <span className="absolute -left-1 top-3 bottom-3 w-1 bg-cyan-400 rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center gap-3">
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          title="Swagger REST Documentation"
          className="h-10 w-10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 flex items-center justify-center transition-colors cursor-pointer"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
        <button
          onClick={() => setActiveTab('diagnostics')}
          title="Regulatory Guidance & Help"
          className="h-10 w-10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 flex items-center justify-center transition-colors cursor-pointer"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>

    </aside>
  );
};
