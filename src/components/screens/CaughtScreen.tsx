import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { GameState } from '../../types/game';
import { Skull, ArrowRight } from 'lucide-react';

interface CaughtScreenProps {
  gameState: GameState;
  onContinue: () => void;
}

export const CaughtScreen: React.FC<CaughtScreenProps> = ({
  gameState,
  onContinue,
}) => {
  const { t, isRTL } = useI18n();

  const prevMultiplier = Math.max(1, Math.floor(gameState.penaltyMultiplier / 2));
  const newMultiplier = gameState.penaltyMultiplier;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 max-w-2xl mx-auto text-center space-y-8 animate-warning-flash">
      {/* Caught Banner */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-1.5 rounded-full bg-crimson border border-crimson text-bone text-xs font-mono font-bold tracking-widest uppercase">
          <Skull className="w-4 h-4" />
          <span>{t('caseClosed')}</span>
        </div>

        <h1 className="font-display font-black text-6xl md:text-8xl tracking-tight text-crimson drop-shadow-[0_0_20px_rgba(177,18,38,0.5)]">
          {t('caughtTitle')}
        </h1>
      </div>

      {/* Penalty Calculation Box */}
      <div className="w-full bg-surface border border-crimson/80 p-6 rounded-lg shadow-2xl space-y-6">
        <div className="text-left rtl:text-right font-mono text-xs text-bone/60 border-b border-surfacelight pb-3">
          PENALTY MULTIPLIER SCALING
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
          <div className="bg-obsidian border border-surfacelight p-3 rounded">
            <div className="text-xs text-bone/60">{t('originalPenalty')}</div>
            <div className="text-xl font-bold text-bone mt-1">×{prevMultiplier}</div>
          </div>

          <div className="bg-obsidian border border-surfacelight p-3 rounded">
            <div className="text-xs text-bone/60">{t('penaltyMultiplier')}</div>
            <div className="text-xl font-bold text-crimson mt-1">×2</div>
          </div>

          <div className="bg-deepred/50 border border-crimson p-3 rounded">
            <div className="text-xs text-bone/60">{t('finalPenalty')}</div>
            <div className="text-2xl font-black text-warninggold mt-1">×{newMultiplier}</div>
          </div>
        </div>

        <div className="bg-obsidian/80 border border-crimson/40 p-4 rounded text-xs font-mono text-bone/80 text-left rtl:text-right space-y-1">
          <p className="text-crimson font-bold">• {t('addedToRecord')}</p>
          <p className="text-bone/60">
            RECORD ENTRY PRESERVED. ESCAPE REQUIRED ON SUBSEQUENT DAYS TO CLEAR.
          </p>
        </div>
      </div>

      {/* Continue CTA */}
      <div className="w-full max-w-sm pt-2">
        <button
          onClick={onContinue}
          className="w-full group relative inline-flex items-center justify-center space-x-3 rtl:space-x-reverse px-8 py-4 bg-crimson hover:bg-crimson/90 text-bone font-mono font-bold text-lg rounded border border-crimson/80 shadow-2xl transition transform active:scale-95"
        >
          <span>{t('continueCTA')}</span>
          <ArrowRight className={`w-5 h-5 transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
        </button>
      </div>
    </div>
  );
};
