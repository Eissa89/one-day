import { useState, useEffect, useCallback } from 'react';
import { GameState, FictionalEvent, RecordEntry } from '../types/game';
import { loadGameState, saveGameState, DEFAULT_GAME_STATE, INITIAL_RECORDS } from '../utils/storage';
import { generateFictionalCase } from '../utils/cases';
import { getRandomEvent } from '../utils/events';
import { soundEngine } from '../audio/soundEngine';

export const DURATION_24_HOURS = 24 * 60 * 60 * 1000; // 24 hours in ms

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(() => loadGameState());

  // Save state on change
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Helper to update state safely
  const updateState = useCallback((updater: (prev: GameState) => GameState) => {
    setGameState((prev) => {
      const next = updater(prev);
      saveGameState(next);
      return next;
    });
  }, []);

  // Enter Case Flow (INTRO -> CASE_GENERATED)
  const enterCaseFlow = useCallback(() => {
    updateState((prev) => {
      const newCase = generateFictionalCase(prev.currentDay, prev.penaltyMultiplier);
      return {
        ...prev,
        status: 'CASE_GENERATED',
        currentCase: newCase,
      };
    });
  }, [updateState]);

  // Accept Fate (CASE_GENERATED -> PURSUIT)
  const acceptFate = useCallback(() => {
    soundEngine.init();
    soundEngine.playWarningPulse();

    updateState((prev) => {
      const now = Date.now();
      const endTime = now + DURATION_24_HOURS;
      return {
        ...prev,
        status: 'PURSUIT',
        startTime: now,
        endTime: endTime,
        heat: 15, // initial starting heat
        eventLog: [],
      };
    });
  }, [updateState]);

  // Trigger CAUGHT
  const triggerCaught = useCallback((_reason: 'heat' | 'time') => {
    soundEngine.playCaptureImpact();

    updateState((prev) => {
      if (prev.status !== 'PURSUIT') {
        return prev;
      }

      const nextMultiplier = prev.penaltyMultiplier * 2;

      // Update record to show CAUGHT for active day if present
      const updatedRecord = prev.record.map((r) => {
        if (r.status === 'active' && !r.outcome) {
          return {
            ...r,
            outcome: 'CAUGHT' as const,
            multiplierWhenClosed: prev.penaltyMultiplier,
          };
        }
        return r;
      });

      return {
        ...prev,
        status: 'CAUGHT',
        penaltyMultiplier: nextMultiplier,
        record: updatedRecord,
      };
    });
  }, [updateState]);

  // Trigger ESCAPED
  const triggerEscaped = useCallback(() => {
    soundEngine.playEscapeChord();

    updateState((prev) => {
      if (prev.status !== 'PURSUIT') {
        return prev;
      }

      // Resolve exactly ONE active record entry
      let resolvedOne = false;
      const updatedRecord: RecordEntry[] = prev.record.map((r) => {
        if (!resolvedOne && r.status === 'active') {
          resolvedOne = true;
          return {
            ...r,
            status: 'resolved' as const,
            outcome: 'ESCAPED' as const,
            multiplierWhenClosed: prev.penaltyMultiplier,
          };
        }
        return r;
      });

      // Check if all active records are now resolved
      const remainingActive = updatedRecord.filter((r) => r.status === 'active').length;

      return {
        ...prev,
        status: remainingActive === 0 ? 'VICTORY' : 'ESCAPED',
        record: updatedRecord,
      };
    });
  }, [updateState]);

  // Trigger a random fictional event
  const triggerRandomEvent = useCallback((customEvent?: FictionalEvent) => {
    const event = customEvent || getRandomEvent();

    updateState((prev) => {
      if (prev.status !== 'PURSUIT') return prev;

      const newHeat = Math.min(100, Math.max(0, prev.heat + event.heatDelta));
      const newLog = [event, ...prev.eventLog].slice(0, 15);

      soundEngine.playTick();

      return {
        ...prev,
        heat: newHeat,
        eventLog: newLog,
      };
    });
  }, [updateState]);

  // Main Loop Timer & Automatic Random Events during PURSUIT
  useEffect(() => {
    if (gameState.status !== 'PURSUIT' || !gameState.endTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeRemaining = gameState.endTime! - now;

      // 1. Check Timer Expiration -> ESCAPED
      if (timeRemaining <= 0) {
        clearInterval(interval);
        triggerEscaped();
        return;
      }

      // 2. Check Heat Overload -> CAUGHT
      if (gameState.heat >= 100) {
        clearInterval(interval);
        triggerCaught('heat');
        return;
      }

      // 3. Random event chance (~12% chance every tick interval if heat < 100)
      if (Math.random() < 0.12) {
        triggerRandomEvent();
      }
    }, 3000); // check every 3 seconds

    return () => clearInterval(interval);
  }, [gameState.status, gameState.endTime, gameState.heat, triggerCaught, triggerEscaped, triggerRandomEvent]);

  // Move to NEXT DAY
  const nextDay = useCallback(() => {
    updateState((prev) => {
      const nextDayNum = prev.currentDay + 1;
      const nextCase = generateFictionalCase(nextDayNum, prev.penaltyMultiplier);

      return {
        ...prev,
        currentDay: nextDayNum,
        status: 'CASE_GENERATED',
        currentCase: nextCase,
        heat: 0,
        startTime: null,
        endTime: null,
        eventLog: [],
      };
    });
  }, [updateState]);

  // Full Game Reset
  const resetGame = useCallback(() => {
    setGameState({
      ...DEFAULT_GAME_STATE,
      record: INITIAL_RECORDS,
      lastUpdated: Date.now(),
    });
  }, []);

  // Make a major investigation decision (CONFRONT vs FOLLOW)
  const makeDecision = useCallback((decision: 'CONFRONT' | 'FOLLOW') => {
    soundEngine.playWarningPulse();
    updateState((prev) => {
      const branchText = decision === 'CONFRONT'
        ? 'CONFRONTED FRIEND: Friend alerted. 23:30 meeting pattern shifted. Direct answers extracted, but secrecy lost.'
        : 'FOLLOWED SECRETLY: Friend unaware. Maintained stealth toward 23:30 meeting. Unknown caller remains unalerted.';

      const consequenceEvent: FictionalEvent = {
        id: `ev-decision-${Date.now()}`,
        timestamp: Date.now(),
        messageKey: decision === 'CONFRONT' ? 'consequence_confront_msg' : 'consequence_follow_msg',
        defaultMessage: branchText,
        heatDelta: decision === 'CONFRONT' ? 25 : 10,
      };

      const newHeat = Math.min(100, prev.heat + consequenceEvent.heatDelta);

      return {
        ...prev,
        investigationDecision: decision,
        consequenceBranch: branchText,
        heat: newHeat,
        eventLog: [consequenceEvent, ...prev.eventLog],
      };
    });
  }, [updateState]);

  // Dev Controls (Guarded strictly by import.meta.env.DEV)
  const devFastForward = useCallback((msToAdd: number) => {
    if (!import.meta.env.DEV) return;
    updateState((prev) => {
      if (prev.status !== 'PURSUIT' || !prev.endTime) return prev;
      const newEndTime = prev.endTime - msToAdd;
      return {
        ...prev,
        endTime: newEndTime,
      };
    });
  }, [updateState]);

  return {
    gameState,
    enterCaseFlow,
    acceptFate,
    triggerCaught,
    triggerEscaped,
    triggerRandomEvent,
    makeDecision,
    nextDay,
    resetGame,
    devFastForward,
  };
}
