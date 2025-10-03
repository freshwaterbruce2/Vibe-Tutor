import React, { useState, useEffect, useRef } from 'react';
import { getMotivationalMessage } from '../services/focusService';
import { triggerVibration } from '../services/uiService';
import { TargetIcon } from './icons/TargetIcon';
import { FlameIcon } from './icons/FlameIcon';
import { SoundOnIcon } from './icons/SoundOnIcon';
import { SoundOffIcon } from './icons/SoundOffIcon';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

type TimerMode = 'work' | 'break';
type WakeLockSentinel = any; // For cross-browser compatibility

interface FocusTimerProps {
    onSessionComplete: () => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const targetTimeRef = useRef<number>(0);

  useEffect(() => {
    // Load persisted session count
    const savedSessions = localStorage.getItem('focusStats');
    if (savedSessions) {
        setSessionsCompleted(JSON.parse(savedSessions).sessionsCompleted || 0);
    }
  }, []);

  const releaseWakeLock = async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
    }
  };

  const acquireWakeLock = async () => {
    if ('wakeLock' in navigator) {
        try {
            const lock = await navigator.wakeLock.request('screen');
            setWakeLock(lock);
        } catch (err: any) {
            console.error(`Wake Lock failed: ${err.name}, ${err.message}`);
        }
    }
  };

  useEffect(() => {
    if (isActive) {
      acquireWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock(); // Cleanup on component unmount
    };
  }, [isActive]);


  const stopTimer = () => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
    setIsActive(false);
  }

  useEffect(() => {
    if (isActive) {
      targetTimeRef.current = Date.now() + secondsLeft * 1000;
      intervalRef.current = setInterval(() => {
        const newSecondsLeft = Math.round((targetTimeRef.current - Date.now()) / 1000);
        setSecondsLeft(newSecondsLeft > 0 ? newSecondsLeft : 0);
      }, 500); // Ticking more frequently for better sync
    } else {
        stopTimer();
    }
    return () => stopTimer();
  }, [isActive]);

  useEffect(() => {
    if (secondsLeft <= 0 && isActive) { // Check isActive to prevent multi-triggers
      triggerVibration([100, 50, 100]); // Vibrate on completion
      if (audioRef.current && !isMuted) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      
      stopTimer();

      if (mode === 'work') {
        onSessionComplete();
        const newSessionsCompleted = sessionsCompleted + 1;
        setSessionsCompleted(newSessionsCompleted);
        // Persist session count
        localStorage.setItem('focusStats', JSON.stringify({ sessionsCompleted: newSessionsCompleted }));

        setMode('break');
        setSecondsLeft(BREAK_MINUTES * 60);
        fetchMessage();
      } else {
        setMode('work');
        setSecondsLeft(WORK_MINUTES * 60);
      }
    }
  }, [secondsLeft, mode, onSessionComplete, isMuted, isActive, sessionsCompleted]);
  
  const fetchMessage = async () => {
    const msg = await getMotivationalMessage();
    setMotivationalMessage(msg);
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  const toggleTimer = () => {
     triggerVibration(50);
     // Unlock audio context on mobile
    if (audioRef.current && audioRef.current.paused) {
        audioRef.current.load();
    }
    setIsActive(prev => !prev);
  }

  const resetTimer = () => {
    stopTimer();
    setMode('work');
    setSecondsLeft(WORK_MINUTES * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const totalSeconds = (mode === 'work' ? WORK_MINUTES : BREAK_MINUTES) * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-background-main to-slate-900/70">
        <audio ref={audioRef} src="https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg" preload="auto" />
        <div className="mb-4">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-accent)] to-[var(--secondary-accent)] neon-text-primary glow-on-hover">Focus Timer</h1>
            <p className="text-text-secondary mt-1">{mode === 'work' ? 'Time to focus on your tasks.' : 'Take a short break.'}</p>
        </div>

        <div className="relative w-72 h-72 flex items-center justify-center my-8">
            <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="136" stroke="currentColor" strokeWidth="8" className="text-slate-700/50" fill="transparent" />
                <circle cx="50%" cy="50%" r="136" stroke="currentColor" strokeWidth="8" className="text-[var(--secondary-accent)]" fill="transparent"
                    strokeDasharray={2 * Math.PI * 136}
                    strokeDashoffset={2 * Math.PI * 136 * (1 - progress / 100)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s linear' }}
                />
            </svg>
            <div className="z-10">
                <div className="text-6xl font-bold tabular-nums text-white">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <div className={`mt-2 text-sm font-semibold uppercase tracking-widest ${mode === 'work' ? 'text-[var(--secondary-accent)]' : 'text-green-400'}`}>
                    {mode}
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button onClick={toggleTimer} className="px-10 py-4 text-lg font-bold bg-[var(--primary-accent)] text-background-main rounded-full hover:opacity-80 transition-opacity w-36">
                {isActive ? 'Pause' : 'Start'}
            </button>
            <button onClick={resetTimer} aria-label="Reset Timer" className="p-4 rounded-full bg-slate-700/50 text-slate-400 hover:bg-slate-700">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9a9 9 0 0115.2-4M20 15a9 9 0 01-15.2 4" /></svg>
            </button>
            <button onClick={() => setIsMuted(prev => !prev)} aria-label={isMuted ? "Unmute Sound" : "Mute Sound"} className="p-4 rounded-full bg-slate-700/50 text-slate-400 hover:bg-slate-700">
                {isMuted ? <SoundOffIcon className="w-6 h-6" /> : <SoundOnIcon className="w-6 h-6" />}
            </button>
        </div>

        <div className="mt-10 p-4 border border-slate-700 rounded-lg bg-slate-800/50 max-w-md min-h-[80px]">
            <p className="italic text-slate-300">"{motivationalMessage}"</p>
        </div>

        <div className="mt-8 flex gap-8">
            <div className="flex items-center gap-2 text-lg text-slate-300">
                <TargetIcon className="w-6 h-6 text-[var(--primary-accent)]"/>
                <span>{sessionsCompleted} sessions completed</span>
            </div>
        </div>
    </div>
  );
};

export default FocusTimer;