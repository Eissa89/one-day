import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { GameState } from '../../types/game';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface EscapedScreenProps {
  gameState: GameState;
  onNextDay: () => void;
}

export const EscapedScreen: React.FC<EscapedScreenProps> = ({
  gameState,
  onNextDay,
}) => {
  const { t, isRTL } = useI18n();

  const remainingRecords = gameState.record.filter((r) => r.status === 'active').length;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 max-w-2xl mx-auto text-center space-y-8">
      {/* Escaped Banner */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-1.5 rounded-full bg-warninggold/20 border border-warninggold text-warninggold text-xs font-mono font-bold tracking-widest uppercase">
          <ShieldCheck className="w-4 h-4" />
          <span>{t('noCaptureDetected')}</span>
        </div>

        <h1 className="font-display font-black text-6xl md:text-8xl tracking-tight text-bone drop-shadow-[0_0_20px_rgba(233,228,216,0.3)]">
          {t('escapedTitle')}
        </h1>

        <p className="font-mono text-xl md:text-2xl font-bold text-warninggold">
          {t('youGotAway')}
        </p>
      </div>

      {/* Record Deletion Animation Feedback Card */}
      <div className="w-full bg-surface border border-warninggold/60 p-6 rounded-lg shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-surfacelight pb-3 text-xs font-mono">
          <span className="text-bone/60">{t('hoursComplete')}</span>
          <span className="text-warninggold font-bold">{t('dayLabel')} 0{gameState.currentDay}</span>
        </div>

        <div className="bg-obsidian border border-warninggold/30 p-4 rounded text-left rtl:text-right flex items-center space-x-3 rtl:space-x-reverse text-warninggold">
          <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-warninggold animate-bounce" />
          <div>
            <div className="font-mono text-sm font-bold text-bone">
              1 RECORD ENTRY RESOLVED & REMOVED
            </div>
            <div className="font-mono text-xs text-bone/60 mt-0.5">
              {remainingRecords} {t('remainingRecords')}
            </div>
          </div>
        </div>
      </div>

      {/* Next Day CTA */}
      <div className="w-full max-w-sm pt-2">
        <button
          onClick={onNextDay}
          className="w-full group relative inline-flex items-center justify-center space-x-3 rtl:space-x-reverse px-8 py-4 bg-warninggold hover:bg-warninggold/90 text-obsidian font-mono font-bold text-lg rounded border border-warninggold shadow-2xl transition transform active:scale-95"
        >
          <span>{t('nextDayCTA')}</span>
          <ArrowRight className={`w-5 h-5 transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
};
