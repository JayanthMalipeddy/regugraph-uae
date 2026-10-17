import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Percent,
  TrendingDown,
  Scale,
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';

interface HeroCarouselProps {
  onAuditFacility: () => void;
  onOpenCalculators: () => void;
  onSelectCaseStudy: (scenarioId: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onAuditFacility,
  onOpenCalculators,
  onSelectCaseStudy
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const slides = [
    {
      id: 'slide-audit',
      badge: 'CBUAE Notice 3877/2019 & Circular 8/2020',
      title: 'Audit Credit Facilities & Detect Unlawful Overcharges',
      description:
        'Instantly scan bank facility agreements and loan sanction letters against Central Bank of the UAE statutory fee caps. Uncover hidden exit penalties, predatory compound interest clauses, and unauthorized tenure extensions.',
      ctaText: 'Audit Credit Facility Now',
      ctaAction: () => onAuditFacility(),
      accentColor: 'from-cyan-500 via-blue-600 to-indigo-700',
      tagColor: 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20',
      visual: (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0f1d] border border-cyan-200 dark:border-cyan-500/30 space-y-3 shadow-lg dark:shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              Apex Gulf Finance Personal Loan
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
              UNLAWFUL EXIT FEE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-transparent">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Bank Quoted Exit Penalty</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">AED 12,000.00 (3%)</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-transparent">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">CBUAE Statutory Cap</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">AED 4,000.00 (1%)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/40 flex items-center justify-between text-xs">
            <span className="text-cyan-900 dark:text-cyan-200 font-semibold">Immediate Restitution Due:</span>
            <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm">AED 8,000.00 Refund</span>
          </div>
        </div>
      )
    },
    {
      id: 'slide-settlement',
      badge: 'CBUAE Standardized Retail Fee Schedule',
      title: 'Enforce 1% Statutory Prepayment Fee Ceiling',
      description:
        'Article 4.3 strictly prohibits retail banks from charging early loan payoff fees above the lower of 1.0% of the outstanding principal or AED 10,000. Calculate statutory overcharges and demand instant restitution.',
      ctaText: 'Launch 1% Fee Calculator',
      ctaAction: () => onOpenCalculators(),
      accentColor: 'from-emerald-500 via-teal-600 to-cyan-700',
      tagColor: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
      visual: (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0f1d] border border-emerald-200 dark:border-emerald-500/30 space-y-3 shadow-lg dark:shadow-2xl">
          <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Prepayment Settlement Audit
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Notice 3877/2019</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Outstanding Principal:</span>
              <span className="text-slate-900 dark:text-white font-mono font-semibold">AED 850,000.00</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Bank Debited Penalty:</span>
              <span className="text-rose-600 dark:text-rose-400 font-mono font-semibold">AED 25,500.00</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>CBUAE Permissible Cap:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">AED 8,500.00</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs">
            <span className="text-emerald-900 dark:text-emerald-200 font-semibold">Net Restitution Credited:</span>
            <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm">+AED 17,000.00</span>
          </div>
        </div>
      )
    },
    {
      id: 'slide-dbr',
      badge: 'CBUAE Notice 2011/23 Article 2',
      title: '50% Debt Burden Ratio (DBR) & Pensioner 30% Stress-Testing',
      description:
        'Simulate aggregated monthly retail debt commitments across personal loans, auto financing, mortgage obligations, and 5% of credit card limits. Guarantee statutory DBR compliance and avoid over-leveraged borrowing.',
      ctaText: 'Simulate DBR Borrowing Limits',
      ctaAction: () => onOpenCalculators(),
      accentColor: 'from-blue-600 via-indigo-600 to-purple-800',
      tagColor: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
      visual: (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0f1d] border border-blue-200 dark:border-blue-500/30 space-y-3 shadow-lg dark:shadow-2xl">
          <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Percent className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              Debt Burden Leverage Monitor
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              SAFE: 33.8% DBR
            </span>
          </div>

          {/* DBR Progress Bar */}
          <div className="space-y-1">
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex gap-0.5">
              <div className="w-[50%] bg-cyan-500 rounded-l-full" title="Personal Loan" />
              <div className="w-[30%] bg-emerald-500" title="Auto Loan" />
              <div className="w-[20%] bg-amber-500" title="Credit Cards 5%" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0%</span>
              <span className="text-cyan-600 dark:text-cyan-400">Current (33.8%)</span>
              <span className="text-amber-600 dark:text-amber-400">Cap (50.0%)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 flex items-center justify-between text-xs">
            <span className="text-slate-700 dark:text-slate-300">Available Borrowing Headroom:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">AED 4,050.00/mo</span>
          </div>
        </div>
      )
    },
    {
      id: 'slide-sanadak',
      badge: 'UAE Consumer Protection Standards',
      title: 'Escalate Unlawful Overcharges to CBUAE Sanadak',
      description:
        'Track consumer ombudsman complaint filings, view restitution award mandates, and benchmark lending compliance scores across UAE commercial banks to safeguard statutory borrower rights.',
      ctaText: 'Inspect Bank Compliance Index',
      ctaAction: () => onSelectCaseStudy('scenario-1'),
      accentColor: 'from-amber-600 via-orange-600 to-rose-700',
      tagColor: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
      visual: (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0f1d] border border-amber-200 dark:border-amber-500/30 space-y-3 shadow-lg dark:shadow-2xl">
          <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Sanadak Dispute Docket
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">#SND-2024-9182</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="text-slate-800 dark:text-slate-300 font-semibold">Apex Gulf Finance Restitution Mandate</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Circular 8/2020 Art 4.3 statutory violation upheld by ombudsman.</p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-center justify-between text-xs">
            <span className="text-amber-900 dark:text-amber-200 font-semibold">Mandated Restitution Award:</span>
            <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">AED 12,000.00 Awarded</span>
          </div>
        </div>
      )
    }
  ];

  // Auto-play timer
  useEffect(() => {
    if (isPaused || isDismissed) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, isDismissed, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (isDismissed) {
    return (
      <div className="flex justify-end">
        <button
          onClick={() => setIsDismissed(false)}
          className="text-xs text-cyan-700 dark:text-cyan-400 hover:text-cyan-600 flex items-center gap-1.5 py-1 px-3 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Show Platform Guide & Features</span>
        </button>
      </div>
    );
  }

  const slide = slides[currentSlide];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-50 via-white to-cyan-50/40 dark:from-[#0c1324] dark:via-[#090e1c] dark:to-[#070b14] border border-slate-200 dark:border-slate-800/90 shadow-xl dark:shadow-2xl p-6 sm:p-8 transition-all duration-300"
    >
      {/* Background Ambient Glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Slide Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
        
        {/* Left Text Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${slide.tagColor}`}>
              {slide.badge}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Platform Guide {currentSlide + 1} of {slides.length}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {slide.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
            {slide.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={slide.ctaAction}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/20 dark:shadow-xl transition-all cursor-pointer group"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onSelectCaseStudy('scenario-1')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#131b2e] dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs transition-all cursor-pointer shadow-sm"
            >
              <FileText className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Explore Predatory Case Study</span>
            </button>
          </div>

        </div>

        {/* Right Visual Graphic Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          {slide.visual}
        </div>

      </div>

      {/* Bottom Controls Bar: Dots, Navigation Arrows & Dismiss */}
      <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-200 dark:border-slate-800/60 relative z-10">
        
        {/* Slide Indicator Pills */}
        <div className="flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'w-8 bg-cyan-600 dark:bg-cyan-400 shadow-md shadow-cyan-500/30'
                  : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next / Previous & Dismiss Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="h-8 w-8 rounded-xl bg-white hover:bg-slate-100 dark:bg-[#131b2e] dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
            title="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="h-8 w-8 rounded-xl bg-white hover:bg-slate-100 dark:bg-[#131b2e] dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
            title="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-2 py-1 transition-colors cursor-pointer ml-1"
            title="Hide guide banner"
          >
            Hide Guide
          </button>
        </div>

      </div>

    </div>
  );
};
