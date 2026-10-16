import React from 'react';
import {
  LayoutDashboard,
  SlidersHorizontal,
  Bot,
  Activity,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ChevronLeft
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
  onOpenChatbot,
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
      id: 'ai-agent',
      label: 'AI Audit Agent',
      description: 'Conversational CBUAE RAG assistant',
      icon: Bot,
      isAction: true
    },
    {
      id: 'diagnostics',
      label: 'Diagnostics & Telemetry',
      description: 'System health, Chroma & benchmark suite',
      icon: Activity
    },
  ];

  const handleItemClick = (item: typeof navItems[0]) => {
    if (item.isAction) {
      onOpenChatbot();
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <aside
      className={`bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none transition-all duration-300 z-30 py-6 ${
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
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 p-0.5 shadow-lg shadow-cyan-950/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <div className="h-full w-full bg-[#0a0f1d] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-cyan-400" />
              </div>
            </div>

            {isExpanded && (
              <div className="overflow-hidden">
                <div className="text-sm font-extrabold text-white tracking-tight leading-none flex items-center gap-1.5">
                  <span>ReguGraph</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    UAE
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  CBUAE Banking Intelligence
                </div>
              </div>
            )}
          </div>

          {/* Toggle Expand/Collapse Button */}
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
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
            className="h-8 w-8 rounded-xl bg-[#131b2e] hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer mx-auto"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4 text-cyan-400" />
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
                          ? 'bg-white text-slate-950 font-bold shadow-lg shadow-white/10'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`
                    : `h-12 w-12 justify-center mx-auto ${
                        isActive
                          ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-slate-950' : item.isAction ? 'text-cyan-400' : ''
                  }`}
                />

                {isExpanded && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold leading-tight truncate">
                        {item.label}
                      </span>
                      {item.isAction && (
                        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                      )}
                    </div>
                    <div
                      className={`text-[10px] truncate mt-0.5 ${
                        isActive ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                )}

                {/* Left Active Pip Indicator (when collapsed) */}
                {!isExpanded && isActive && (
                  <span className="absolute -left-1 top-3 bottom-3 w-1 bg-cyan-400 rounded-r-full" />
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
          className={`rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 flex items-center transition-colors cursor-pointer ${
            isExpanded ? 'px-3 py-2 gap-2.5 text-xs font-medium w-full' : 'h-10 w-10 justify-center'
          }`}
        >
          <ExternalLink className="h-4 w-4 shrink-0 text-cyan-400" />
          {isExpanded && <span>REST API Swagger</span>}
        </a>

        {/* Diagnostics & Help Link */}
        <button
          onClick={() => setActiveTab('diagnostics')}
          title="System Architecture & Diagnostics"
          className={`rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 flex items-center transition-colors cursor-pointer ${
            isExpanded ? 'px-3 py-2 gap-2.5 text-xs font-medium w-full' : 'h-10 w-10 justify-center'
          }`}
        >
          <Activity className="h-4 w-4 shrink-0" />
          {isExpanded && <span>Diagnostics & Telemetry</span>}
        </button>

        {/* Expand / Collapse toggle at bottom if expanded */}
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 text-xs transition-colors cursor-pointer mt-1"
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
