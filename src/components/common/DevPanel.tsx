import React from 'react';
import { useI18n } from '../../i18n/I18nContext';

interface DevPanelProps {
  onFastForward: (ms: number) => void;
  onTriggerEvent: () => void;
  onForceCaught: () => void;
  onForceEscaped: () => void;
  onResetGame: () => void;
  currentStatus: string;
}

export const DevPanel: React.FC<DevPanelProps> = ({
  onFastForward,
  onTriggerEvent,
  onForceCaught,
  onForceEscaped,
  onResetGame,
  currentStatus,
}) => {
  const { t } = useI18n();

  // Guard completely against non-development builds
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="w-full bg-surface/90 border-t border-warninggold/40 p-3 mt-6 text-xs font-mono">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 rtl:space-x-reverse font-bold text-warninggold">
          <span className="inline-block w-2 h-2 rounded-full bg-warninggold animate-pulse" />
          <span>{t('devPanelTitle')}</span>
          <span className="text-bone/50 font-normal">[{currentStatus}]</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentStatus === 'PURSUIT' && (
            <>
              <button
                onClick={() => onFastForward(10 * 60 * 1000)}
                className="px-2 py-1 bg-surfacelight border border-bone/20 hover:border-warninggold text-bone rounded"
              >
                {t('fastForward10Min')}
              </button>
              <button
                onClick={() => onFastForward(60 * 60 * 1000)}
                className="px-2 py-1 bg-surfacelight border border-bone/20 hover:border-warninggold text-bone rounded"
              >
                {t('fastForwardTime')}
              </button>
              <button
                onClick={() => onFastForward(23 * 60 * 60 * 1000)}
                className="px-2 py-1 bg-surfacelight border border-bone/20 hover:border-warninggold text-bone rounded"
              >
                {t('fastForward23H')}
              </button>
              <button
                onClick={onTriggerEvent}
                className="px-2 py-1 bg-surfacelight border border-bone/20 hover:border-warninggold text-bone rounded"
              >
                {t('triggerEvent')}
              </button>
              <button
                onClick={onForceCaught}
                className="px-2 py-1 bg-crimson/30 border border-crimson text-bone rounded hover:bg-crimson/50"
              >
                {t('forceCaught')}
              </button>
              <button
                onClick={onForceEscaped}
                className="px-2 py-1 bg-warninggold/20 border border-warninggold text-warninggold rounded hover:bg-warninggold/30"
              >
                {t('forceEscaped')}
              </button>
            </>
          )}

          <button
            onClick={onResetGame}
            className="px-2 py-1 bg-deepred border border-crimson text-bone rounded hover:bg-crimson"
          >
            {t('resetGame')}
          </button>
        </div>
      </div>
    </div>
  );
};
