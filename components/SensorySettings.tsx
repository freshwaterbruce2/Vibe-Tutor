import React, { useState, useEffect } from 'react';
import { Eye, Volume2, Zap, Type } from 'lucide-react';
import type { SensoryPreferences } from '../types';

const SensorySettings: React.FC = () => {
  const [prefs, setPrefs] = useState<SensoryPreferences>(() => {
    const saved = localStorage.getItem('sensory-prefs');
    return saved ? JSON.parse(saved) : {
      animationSpeed: 'normal',
      soundEnabled: true,
      hapticEnabled: true,
      fontSize: 'medium',
      dyslexiaFont: false,
      colorMode: 'default'
    };
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-animation-speed', prefs.animationSpeed);
    root.setAttribute('data-font-size', prefs.fontSize);
    root.setAttribute('data-color-mode', prefs.colorMode);
    document.body.classList.toggle('dyslexia-font', prefs.dyslexiaFont);

    localStorage.setItem('sensory-prefs', JSON.stringify(prefs));
  }, [prefs]);

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-14 h-8 rounded-full transition-colors relative ${
        enabled ? 'bg-[var(--primary-accent)]' : 'bg-surface-lighter'
      }`}
    >
      <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${
        enabled ? 'translate-x-7' : 'translate-x-1'
      }`} />
    </button>
  );

  return (
    <div className="p-8 space-y-8 max-w-2xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          <Eye size={32} className="text-[var(--primary-accent)]" />
          Sensory Settings
        </h1>
        <p className="text-text-secondary">Adjust for comfort and focus</p>
      </header>

      {/* Animation Speed */}
      <div className="glass-panel p-6 space-y-3">
        <label className="font-bold flex items-center gap-2 text-lg">
          <Zap size={20} />
          Movement & Animations
        </label>
        <select
          value={prefs.animationSpeed}
          onChange={(e) => setPrefs(p => ({ ...p, animationSpeed: e.target.value as any }))}
          className="w-full p-3 glass-panel rounded-lg text-base"
        >
          <option value="none">Off (No movement - best for focus)</option>
          <option value="reduced">Reduced (Gentle movement)</option>
          <option value="normal">Normal (Full effects)</option>
        </select>
        <p className="text-sm text-text-secondary">
          Turning off animations can help if things feel overwhelming
        </p>
      </div>

      {/* Sound */}
      <div className="glass-panel p-6 flex items-center justify-between">
        <div>
          <label className="font-bold flex items-center gap-2 text-lg">
            <Volume2 size={20} />
            Sound Effects
          </label>
          <p className="text-sm text-text-secondary mt-1">
            Notification sounds and audio feedback
          </p>
        </div>
        <Toggle
          enabled={prefs.soundEnabled}
          onChange={() => setPrefs(p => ({ ...p, soundEnabled: !p.soundEnabled }))}
        />
      </div>

      {/* Haptic */}
      <div className="glass-panel p-6 flex items-center justify-between">
        <div>
          <label className="font-bold flex items-center gap-2 text-lg">
            <Zap size={20} />
            Vibration Feedback
          </label>
          <p className="text-sm text-text-secondary mt-1">
            Gentle vibrations when completing tasks
          </p>
        </div>
        <Toggle
          enabled={prefs.hapticEnabled}
          onChange={() => setPrefs(p => ({ ...p, hapticEnabled: !p.hapticEnabled }))}
        />
      </div>

      {/* Font Size */}
      <div className="glass-panel p-6 space-y-3">
        <label className="font-bold flex items-center gap-2 text-lg">
          <Type size={20} />
          Text Size
        </label>
        <div className="flex gap-3">
          {(['small', 'medium', 'large'] as const).map(size => (
            <button
              key={size}
              onClick={() => setPrefs(p => ({ ...p, fontSize: size }))}
              className={`flex-1 p-3 rounded-lg transition-all ${
                prefs.fontSize === size
                  ? 'bg-[var(--primary-accent)] text-white'
                  : 'bg-surface-lighter hover:bg-surface-light'
              }`}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Dyslexia Font */}
      <div className="glass-panel p-6 flex items-center justify-between">
        <div>
          <label className="font-bold text-lg">OpenDyslexic Font</label>
          <p className="text-sm text-text-secondary mt-1">
            Special font designed for easier reading
          </p>
        </div>
        <Toggle
          enabled={prefs.dyslexiaFont}
          onChange={() => setPrefs(p => ({ ...p, dyslexiaFont: !p.dyslexiaFont }))}
        />
      </div>

      {/* Test Area */}
      <div className="glass-panel p-6">
        <p className="text-lg mb-3 font-bold">Test Area</p>
        <p className="leading-relaxed">
          This is sample text to see how your settings look.
          The quick brown fox jumps over the lazy dog.
          Numbers: 0123456789
        </p>
      </div>
    </div>
  );
};

export default SensorySettings;
