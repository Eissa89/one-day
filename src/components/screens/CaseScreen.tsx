import React, { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Case } from '../../types/game';
import { FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';

interface CaseScreenProps {
  currentCase: Case | null;
  currentDay: number;
  onAcceptFate: () => void;
}

export const CaseScreen: React.FC<CaseScreenProps> = ({
  currentCase,
  currentDay,
  onAcceptFate,
}) => {
  const { t, isRTL } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [currentCase]);

  const caseTitle = currentCase ? t(currentCase.titleKey, currentCase.defaultTitle) : t('caseTitleDefault');
  const caseDesc = currentCase ? t(currentCase.descriptionKey, currentCase.defaultDescription) : t('caseDescDefault');
  const caseNum = currentCase ? currentCase.caseNumber : '#001';
  const multiplier = currentCase ? currentCase.multiplier : 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 max-w-2xl mx-auto space-y-6">
      <div className="w-full text-center space-y-2">
        <span className="text-xs font-mono tracking-widest text-warninggold uppercase px-3 py-1 rounded bg-surfacelight border border-warninggold/30">
          {t('dayLabel')} 0{currentDay} — {t('casePrefix')} {caseNum}
        </span>
        <h2 className="font-display font-black text-3xl md:text-5xl text-bone tracking-wide mt-2">
          {caseTitle}
        </h2>
      </div>

      {/* Case File Card */}
      <div ref={cardRef} className="w-full bg-surface border border-surfacelight hover:border-crimson/50 transition p-6 rounded-lg space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-surfacelight pb-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-crimson text-sm font-mono font-bold">
            <FileText className="w-4 h-4" />
            <span>{t('statusActive')}</span>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-mono bg-deepred/40 border border-crimson/30 px-3 py-1 rounded text-bone">
            <ShieldCheck className="w-3.5 h-3.5 text-warninggold" />
            <span>{t('currentPenalty')}: ×{multiplier}</span>
          </div>
        </div>

        <p className="text-bone/90 font-mono text-base md:text-lg leading-relaxed text-left rtl:text-right">
          {caseDesc}
        </p>

        <div className="text-xs font-mono text-bone/50 border-t border-surfacelight pt-4 text-left rtl:text-right">
          • NON-CRIMINAL ABSTRACT SIMULATION MECHANIC
          <br />
          • ACCEPTING ASSIGNS A MANDATORY 24-HOUR COUNTDOWN
        </div>
      </div>

      {/* Accept CTA */}
      <div className="w-full max-w-md pt-2">
        <button
          onClick={onAcceptFate}
          className="w-full group relative inline-flex items-center justify-center space-x-3 rtl:space-x-reverse px-8 py-4 bg-crimson hover:bg-crimson/90 text-bone font-mono font-bold text-lg rounded border border-crimson/80 shadow-xl transition transform active:scale-95"
        >
          <span>{t('acceptFateCTA')}</span>
          <ArrowRight className={`w-5 h-5 transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
};
