import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Trophy, RefreshCw } from 'lucide-react';

interface VictoryScreenProps {
  onRestart: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ onRestart }) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 max-w-2xl mx-auto text-center space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-1.5 rounded-full bg-warninggold/20 border border-warninggold text-warninggold text-xs font-mono font-bold tracking-widest uppercase">
          <Trophy className="w-4 h-4" />
          <span>ZERO DAYS REMAINING</span>
        </div>

        <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight text-bone drop-shadow-[0_0_25px_rgba(214,182,106,0.4)]">
          {t('zeroDaysRemainingTitle')}
        </h1>

        <p className="font-mono text-lg md:text-2xl text-warninggold font-bold">
          {t('victorySubtitle')}
        </p>
      </div>

      <div className="w-full bg-surface border border-warninggold/80 p-6 rounded-lg shadow-2xl space-y-4 font-mono text-left rtl:text-right">
        <p className="text-bone/90 text-sm md:text-base leading-relaxed">
          You have successfully cleared every unresolved record backlog entry. No active warrants or tracking traces remain.
        </p>
      </div>

      <div className="w-full max-w-sm pt-4">
        <button
          onClick={onRestart}
          className="w-full group relative inline-flex items-center justify-center space-x-3 rtl:space-x-reverse px-8 py-4 bg-warninggold hover:bg-warninggold/90 text-obsidian font-mono font-bold text-lg rounded border border-warninggold shadow-2xl transition transform active:scale-95"
        >
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span>{t('restartExperienceCTA')}</span>
        </button>
      </div>
    </div>
  );
};
