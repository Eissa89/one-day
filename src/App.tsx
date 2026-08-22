import { useState, useEffect } from 'react';
import { useI18n } from './i18n/I18nContext';
import { useGameEngine } from './hooks/useGameEngine';
import { loadUserPrefs } from './utils/storage';

import { Header } from './components/common/Header';
import { DevPanel } from './components/common/DevPanel';
import { RecordDrawer } from './components/common/RecordDrawer';

import { IntroScreen } from './components/screens/IntroScreen';
import { CaseScreen } from './components/screens/CaseScreen';
import { PursuitScreen } from './components/screens/PursuitScreen';
import { CaughtScreen } from './components/screens/CaughtScreen';
import { EscapedScreen } from './components/screens/EscapedScreen';
import { VictoryScreen } from './components/screens/VictoryScreen';

export function App() {
  const { isRTL } = useI18n();
  const [reducedMotion, setReducedMotion] = useState(() => loadUserPrefs().reducedMotion);

  const {
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
  } = useGameEngine();

  // Handle system reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
    }
  }, []);

  return (
    <div
      className={`min-h-screen bg-obsidian text-bone flex flex-col justify-between relative overflow-x-hidden ${
        reducedMotion ? 'reduced-motion' : ''
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* CRT Scanline and Vignette Effects */}
      {!reducedMotion && (
        <>
          <div className="fixed inset-0 crt-overlay z-30" />
          <div className="fixed inset-0 vignette z-20" />
        </>
      )}

      {/* Top Bar */}
      <Header
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
      />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-center items-center relative z-10 w-full py-4">
        {gameState.status === 'INTRO' && (
          <IntroScreen onEnter={enterCaseFlow} />
        )}

        {gameState.status === 'CASE_GENERATED' && (
          <CaseScreen
            currentCase={gameState.currentCase}
            currentDay={gameState.currentDay}
            onAcceptFate={acceptFate}
          />
        )}

        {gameState.status === 'PURSUIT' && (
          <PursuitScreen
            gameState={gameState}
            onMakeDecision={makeDecision}
          />
        )}

        {gameState.status === 'CAUGHT' && (
          <CaughtScreen
            gameState={gameState}
            onContinue={nextDay}
          />
        )}

        {gameState.status === 'ESCAPED' && (
          <EscapedScreen
            gameState={gameState}
            onNextDay={nextDay}
          />
        )}

        {gameState.status === 'VICTORY' && (
          <VictoryScreen onRestart={resetGame} />
        )}
      </main>

      {/* Persistent Criminal Record Backlog Footer */}
      {gameState.status !== 'INTRO' && gameState.status !== 'VICTORY' && (
        <div className="relative z-10 w-full pb-2">
          <RecordDrawer
            record={gameState.record}
            penaltyMultiplier={gameState.penaltyMultiplier}
          />
        </div>
      )}

      {/* DEV / QA Control Panel (Guarded in component by import.meta.env.DEV) */}
      <DevPanel
        onFastForward={devFastForward}
        onTriggerEvent={triggerRandomEvent}
        onForceCaught={() => triggerCaught('heat')}
        onForceEscaped={triggerEscaped}
        onResetGame={resetGame}
        currentStatus={gameState.status}
      />
    </div>
  );
}

export default App;
