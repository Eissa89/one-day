import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Globe, Eye } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';
import { soundEngine } from '../../audio/soundEngine';
import { loadUserPrefs, saveUserPrefs } from '../../utils/storage';

export const Header: React.FC<{
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
}> = ({ reducedMotion, setReducedMotion }) => {
  const { language, setLanguage, t } = useI18n();
  const [soundOn, setSoundOn] = useState(() => loadUserPrefs().soundEnabled);

  useEffect(() => {
    soundEngine.setEnabled(soundOn);
  }, [soundOn]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundEngine.setEnabled(next);
    const prefs = loadUserPrefs();
    saveUserPrefs({ ...prefs, soundEnabled: next });
  };

  const toggleLang = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const toggleMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    const prefs = loadUserPrefs();
    saveUserPrefs({ ...prefs, reducedMotion: next });
  };

  return (
    <header className="w-full border-b border-surfacelight bg-obsidian/90 backdrop-blur-md px-4 py-3 flex items-center justify-between z-40 sticky top-0" role="banner">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <span className="font-display font-extrabold text-lg md:text-xl tracking-wider text-bone">
          ONE DAY
        </span>
        <span className="text-xs px-2 py-0.5 rounded border border-crimson/40 text-crimson font-mono uppercase bg-crimson/10 hidden sm:inline-block">
          FICTIONAL SIMULATION
        </span>
      </div>

      <nav aria-label="System Settings" className="flex items-center space-x-2 md:space-x-4 rtl:space-x-reverse text-xs font-mono">
        {/* Reduced Motion Toggle */}
        <button
          onClick={toggleMotion}
          className="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1.5 rounded border border-surfacelight hover:border-bone/40 transition text-bone/80 hover:text-bone"
          title={reducedMotion ? t('reducedMotionActiveNotice') : t('fullMotionLabel')}
          aria-label={reducedMotion ? t('reducedMotionLabel') : t('fullMotionLabel')}
        >
          <Eye className={`w-3.5 h-3.5 ${reducedMotion ? 'text-warninggold' : 'text-bone/60'}`} />
          <span className="hidden md:inline">
            {reducedMotion ? t('reducedMotionLabel') : t('fullMotionLabel')}
          </span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1.5 rounded border border-surfacelight hover:border-bone/40 transition text-bone/80 hover:text-bone"
          aria-label={soundOn ? t('soundOn') : t('soundOff')}
        >
          {soundOn ? (
            <Volume2 className="w-3.5 h-3.5 text-bone" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-crimson" />
          )}
          <span className="hidden md:inline">{soundOn ? t('soundOn') : t('soundOff')}</span>
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          className="flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1.5 min-h-[44px] min-w-[44px] rounded border border-crimson/60 bg-crimson/10 text-bone hover:bg-crimson/20 transition font-bold"
          aria-label="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{t('langToggle')}</span>
        </button>
      </nav>
    </header>
  );
};
