import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { GameState } from '../../types/game';
import { Activity, Radio, AlertTriangle, ShieldAlert } from 'lucide-react';

interface PursuitScreenProps {
  gameState: GameState;
  onMakeDecision?: (decision: 'CONFRONT' | 'FOLLOW') => void;
}

export const PursuitScreen: React.FC<PursuitScreenProps> = ({ gameState, onMakeDecision }) => {
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
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6" role="region" aria-label="Pursuit Dashboard">
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
            <div
              className="font-mono font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-bone font-mono drop-shadow-[0_0_15px_rgba(233,228,216,0.15)]"
              aria-live="off"
              aria-label={`Time remaining ${timeRemainingFormatted}`}
            >
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

            <div
              className="w-full h-4 bg-obsidian border border-surfacelight rounded p-0.5 relative overflow-hidden"
              role="progressbar"
              aria-valuenow={heat}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t('heatLevel')}
            >
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

      {/* Major Decision Component for Case #001 */}
      {gameState.currentCase && (
        <div className="bg-surface border border-warninggold/50 p-6 rounded-lg space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-surfacelight pb-3">
            <h3 className="font-mono text-sm text-warninggold font-bold uppercase tracking-wider">
              MAJOR DECISION — 23:30 DEADLINE APPROACHING
            </h3>
            <span className="text-xs font-mono text-bone/60">
              {gameState.investigationDecision ? `DECISION MADE: ${gameState.investigationDecision}` : 'DECISION PENDING'}
            </span>
          </div>

          <p className="text-xs font-mono text-bone/80 text-left rtl:text-right">
            You hold 3 pieces of contradictory evidence. You do not know if your friend is betraying or protecting your brother. Choose which risk to accept:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => onMakeDecision && onMakeDecision('CONFRONT')}
              disabled={!!gameState.investigationDecision}
              className={`p-4 rounded border text-left rtl:text-right font-mono transition ${
                gameState.investigationDecision === 'CONFRONT'
                  ? 'bg-crimson/30 border-crimson text-bone'
                  : 'bg-obsidian border-crimson/50 hover:bg-crimson/20 text-bone'
              }`}
            >
              <div className="font-bold text-sm text-crimson">OPTION A — CONFRONT NOW</div>
              <p className="text-[11px] text-bone/80 mt-1">
                Force an immediate explanation. Friend becomes alerted; meeting structure shifts. Direct answers extracted, but secrecy lost.
              </p>
            </button>

            <button
              onClick={() => onMakeDecision && onMakeDecision('FOLLOW')}
              disabled={!!gameState.investigationDecision}
              className={`p-4 rounded border text-left rtl:text-right font-mono transition ${
                gameState.investigationDecision === 'FOLLOW'
                  ? 'bg-warninggold/30 border-warninggold text-bone'
                  : 'bg-obsidian border-warninggold/50 hover:bg-warninggold/20 text-bone'
              }`}
            >
              <div className="font-bold text-sm text-warninggold">OPTION B — FOLLOW SECRETLY</div>
              <p className="text-[11px] text-bone/80 mt-1">
                Maintain stealth toward 23:30 rendezvous. Friend remains unaware. Preserve access to unknown caller, but risk arriving too late.
              </p>
            </button>
          </div>

          {gameState.consequenceBranch && (
            <div className="mt-3 p-3 bg-surfacelight border border-warninggold/40 rounded text-xs font-mono text-warninggold text-left rtl:text-right">
              <strong>CONSEQUENCE BRANCH:</strong> {gameState.consequenceBranch}
            </div>
          )}
        </div>
      )}

      {/* Bottom Section: Live Activity Log */}
      <div className="bg-surface border border-surfacelight p-6 rounded-lg space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 rtl:space-x-reverse border-b border-surfacelight pb-3">
          <Activity className="w-4 h-4 text-warninggold" />
          <h3 className="font-mono text-xs text-bone font-bold uppercase tracking-wider">
            {t('liveActivityLog')}
          </h3>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1" aria-live="polite" aria-relevant="additions">
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
