import React from 'react';
import {
  LayoutDashboard,
  SlidersHorizontal,
  Activity,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Info
} from 'lucide-react';


interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenChatbot: () => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenChatbot: _onOpenChatbot,
  isExpanded,
  setIsExpanded
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard & Audit',
      description: 'Exposure trend, cards & Sanadak pipeline',
      icon: LayoutDashboard
    },
    {
      id: 'calculators',
      label: 'Statutory Calculators',
      description: '1% early settlement, DBR & mortgage LTV',
      icon: SlidersHorizontal
    },
    {
      id: 'about',
      label: 'About',
      description: 'What we do, what we offer & use cases',
      icon: Info
    },
  ];


  const handleItemClick = (item: typeof navItems[0]) => {
    setActiveTab(item.id);
  };

  return (
    <aside
      className={`bg-white dark:bg-[#0a0f1d] border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between shrink-0 select-none transition-all duration-300 z-30 py-6 ${
        isExpanded ? 'w-64 px-4' : 'w-16 sm:w-20 px-2 sm:px-3 items-center'
      }`}
    >
      
      {/* Top Brand Glyph & Expand Toggle */}
      <div className="flex flex-col gap-6">
        
        {/* Brand Header */}
        <div className={`flex items-center ${isExpanded ? 'justify-between px-2' : 'justify-center'}`}>
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
            title="ReguGraph UAE"
          >
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 p-0.5 shadow-lg shadow-cyan-950/20 dark:shadow-cyan-950/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <div className="h-full w-full bg-white dark:bg-[#0a0f1d] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>

            {isExpanded && (
              <div className="overflow-hidden">
                <div className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight leading-none flex items-center gap-1.5">
                  <span>ReguGraph</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">
                    UAE
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  CBUAE Banking Intelligence
                </div>
              </div>
            )}
          </div>

          {/* Toggle Expand/Collapse Button */}
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Collapsed Expand Quick Button */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-[#131b2e] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer mx-auto"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          </button>
        )}

        {/* Navigation Item List */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                title={!isExpanded ? item.label : undefined}
                className={`relative flex items-center transition-all cursor-pointer rounded-2xl group ${
                  isExpanded
                    ? `w-full px-3.5 py-3 gap-3 text-left ${
                        isActive
                          ? 'bg-slate-900 text-white font-bold shadow-md dark:bg-white dark:text-slate-950 dark:shadow-white/10'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`
                    : `h-12 w-12 justify-center mx-auto ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-950 dark:shadow-white/10'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white dark:text-slate-950' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                />

                {isExpanded && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold leading-tight truncate">
                        {item.label}
                      </span>
                    </div>
                    <div
                      className={`text-[10px] truncate mt-0.5 ${
                        isActive ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                )}

                {/* Left Active Pip Indicator (when collapsed) */}
                {!isExpanded && isActive && (
                  <span className="absolute -left-1 top-3 bottom-3 w-1 bg-cyan-600 dark:bg-cyan-400 rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions & Utilities */}
      <div className={`flex flex-col gap-2 ${isExpanded ? 'px-2' : 'items-center'}`}>
        
        {/* Swagger REST Docs */}
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          title="FastAPI Swagger REST Documentation"
          className={`rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center transition-colors cursor-pointer ${
            isExpanded ? 'px-3 py-2 gap-2.5 text-xs font-medium w-full' : 'h-10 w-10 justify-center'
          }`}
        >
          <ExternalLink className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
          {isExpanded && <span>REST API Swagger</span>}
        </a>

        {/* Isolated Diagnostics & Telemetry Portal Link (Port 5174) */}
        <a
          href="http://localhost:5174"
          target="_blank"
          rel="noreferrer"
          title="Open Isolated Diagnostics & Telemetry Portal (Port 5174)"
          className={`rounded-xl text-cyan-700 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-white hover:bg-cyan-50 dark:hover:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 flex items-center transition-all cursor-pointer ${
            isExpanded ? 'px-3 py-2 gap-2.5 text-xs font-semibold w-full' : 'h-10 w-10 justify-center'
          }`}
        >
          <Activity className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
          {isExpanded && (
            <div className="flex-1 min-w-0 flex items-center justify-between">
              <span className="truncate">Diagnostics (5174)</span>
              <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
            </div>
          )}
        </a>

        {/* Expand / Collapse toggle at bottom if expanded */}
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 text-xs transition-colors cursor-pointer mt-1"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
            <span>Collapse Sidebar</span>
          </button>
        )}
      </div>

    </aside>
  );
};

export default Sidebar;
