import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { GameState } from '../../types/game';
import { Activity, Radio, AlertTriangle, ShieldAlert } from 'lucide-react';

interface PursuitScreenProps {
  gameState: GameState;
}

export const PursuitScreen: React.FC<PursuitScreenProps> = ({ gameState }) => {
  const { t } = useI18n();
  const [timeRemainingFormatted, setTimeRemainingFormatted] = useState('23:59:59');

  // Authoritative absolute timestamp countdown update loop
  useEffect(() => {
    if (!gameState.endTime) return;

    const updateClock = () => {
      const now = Date.now();
      const remainingMs = Math.max(0, gameState.endTime! - now);

      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeRemainingFormatted(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    updateClock();
    const timer = setInterval(updateClock, 250);
    return () => clearInterval(timer);
  }, [gameState.endTime]);

  const caseTitle = gameState.currentCase
    ? t(gameState.currentCase.titleKey, gameState.currentCase.defaultTitle)
    : t('caseTitleDefault');

  const caseNum = gameState.currentCase ? gameState.currentCase.caseNumber : '#001';
  const heat = gameState.heat;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-surfacelight pb-4 gap-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-3 h-3 rounded-full bg-crimson animate-ping" />
          <span className="font-mono text-xs text-crimson font-bold uppercase tracking-widest">
            {t('pursuitHeader')} — {t('dayLabel')} 0{gameState.currentDay}
          </span>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse font-mono text-xs">
          <span className="text-bone/60">{t('currentCaseLabel')}:</span>
          <span className="text-warninggold font-bold">{caseNum}</span>
          <span className="text-bone/40">|</span>
          <span className="text-bone/80">{caseTitle}</span>
        </div>
      </div>

      {/* Main Command Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: 24-Hour Timer */}
        <div className="bg-surface border border-surfacelight p-6 rounded-lg flex flex-col justify-between space-y-6 shadow-2xl relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-bone/60 uppercase tracking-wider">
              {t('timeRemaining')}
            </span>
            <ShieldAlert className="w-4 h-4 text-crimson" />
          </div>

          <div className="text-center py-4">
            <div className="font-mono font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-bone font-mono drop-shadow-[0_0_15px_rgba(233,228,216,0.15)]">
              {timeRemainingFormatted}
            </div>
            <p className="text-xs font-mono text-bone/50 mt-2">
              PERSISTENT ABSOLUTE TIME ENGINE
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-surfacelight pt-4 text-xs font-mono">
            <span className="text-bone/60">{t('currentPenalty')}</span>
            <span className="text-warninggold font-bold">×{gameState.penaltyMultiplier}</span>
          </div>
        </div>

        {/* Right Column: Heat & Status */}
        <div className="bg-surface border border-surfacelight p-6 rounded-lg space-y-6 shadow-2xl">
          {/* Pursuit Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-bone/60 uppercase tracking-wider">
              {t('pursuitStatus')}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-crimson/20 border border-crimson text-crimson font-bold uppercase">
              {t('pursuitActive')}
            </span>
          </div>

          {/* Heat Level Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-bone/80 font-bold">{t('heatLevel')}</span>
              <span className={`font-bold ${heat > 80 ? 'text-crimson animate-pulse' : 'text-warninggold'}`}>
                {heat}%
              </span>
            </div>

            <div className="w-full h-4 bg-obsidian border border-surfacelight rounded p-0.5 relative overflow-hidden">
              <div
                className={`h-full rounded transition-all duration-500 ${
                  heat > 80 ? 'bg-crimson shadow-[0_0_10px_#B11226]' : 'bg-warninggold'
                }`}
                style={{ width: `${heat}%` }}
              />
            </div>
          </div>

          {/* Warning notice */}
          <div className="flex items-start space-x-2 rtl:space-x-reverse bg-deepred/20 border border-crimson/30 p-3 rounded text-xs font-mono text-bone/80">
            <AlertTriangle className="w-4 h-4 text-crimson flex-shrink-0 mt-0.5" />
            <p className="text-left rtl:text-right">
              HEAT AT 100% CAUSES IMMEDIATE CAPTURE.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Live Activity Log */}
      <div className="bg-surface border border-surfacelight p-6 rounded-lg space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 rtl:space-x-reverse border-b border-surfacelight pb-3">
          <Activity className="w-4 h-4 text-warninggold" />
          <h3 className="font-mono text-xs text-bone font-bold uppercase tracking-wider">
            {t('liveActivityLog')}
          </h3>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {gameState.eventLog.length === 0 ? (
            <p className="text-xs font-mono text-bone/40 py-2 italic">
              {t('noEventsYet')}
            </p>
          ) : (
            gameState.eventLog.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between bg-surfacelight/40 p-2.5 rounded text-xs font-mono border-l-2 border-crimson rtl:border-r-2 rtl:border-l-0"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Radio className="w-3.5 h-3.5 text-crimson animate-pulse flex-shrink-0" />
                  <span className="text-bone font-medium">
                    {t(ev.messageKey, ev.defaultMessage)}
                  </span>
                </div>

                <span className="text-crimson font-bold">
                  HEAT +{ev.heatDelta}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
