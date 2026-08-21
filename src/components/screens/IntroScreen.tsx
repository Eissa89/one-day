import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

interface IntroScreenProps {
  onEnter: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  const { t, isRTL } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 text-center max-w-3xl mx-auto space-y-8">
      {/* Title block */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full border border-crimson/50 bg-crimson/10 text-crimson text-xs font-mono tracking-widest uppercase">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>CLASSIFIED SIMULATION</span>
        </div>

        <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight text-bone drop-shadow-lg">
          ONE DAY
        </h1>

        <div className="text-crimson font-mono text-base md:text-xl lg:text-2xl font-bold tracking-wider space-y-1">
          <p>{t('introSubtitle')}</p>
        </div>
      </div>

      {/* Warning Box */}
      <div className="w-full bg-surface border border-crimson/40 p-4 md:p-6 rounded-lg shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-crimson animate-pulse" />
        <div className="flex items-start space-x-3 rtl:space-x-reverse text-left rtl:text-right">
          <AlertTriangle className="w-6 h-6 text-crimson flex-shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-bone/90 leading-relaxed font-mono">
            {t('introWarning')}
          </p>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="pt-4 w-full max-w-sm">
        <button
          onClick={onEnter}
          className="w-full group relative inline-flex items-center justify-center space-x-3 rtl:space-x-reverse px-8 py-4 bg-crimson hover:bg-crimson/90 text-bone font-mono font-bold text-lg rounded border border-crimson/80 shadow-lg hover:shadow-crimson/30 transition transform active:scale-95"
        >
          <span>{t('enterCaseCTA')}</span>
          <ArrowRight className={`w-5 h-5 transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
};
