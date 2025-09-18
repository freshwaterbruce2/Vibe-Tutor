import React, { useState, useEffect, useRef } from 'react';
import { getMotivationalMessage } from '../services/focusService';
import { TargetIcon } from './icons/TargetIcon';
import { FlameIcon } from './icons/FlameIcon';
import { SoundOnIcon } from './icons/SoundOnIcon';
import { SoundOffIcon } from './icons/SoundOffIcon';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

type TimerMode = 'work' | 'break';

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

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  useEffect(() => {
    if (secondsLeft < 0) {
      if (audioRef.current && !isMuted) {
        audioRef.current.play();
      }
      if (mode === 'work') {
        onSessionComplete();
        setSessionsCompleted(prev => prev + 1);
        setMode('break');
        setSecondsLeft(BREAK_MINUTES * 60);
        fetchMessage();
      } else {
        setMode('work');
        setSecondsLeft(WORK_MINUTES * 60);
      }
      setIsActive(false);
    }
  }, [secondsLeft, mode, onSessionComplete, isMuted]);
  
  const fetchMessage = async () => {
    const msg = await getMotivationalMessage();
    setMotivationalMessage(msg);
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  const toggleTimer = () => setIsActive(prev => !prev);

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setSecondsLeft(WORK_MINUTES * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const totalSeconds = (mode === 'work' ? WORK_MINUTES : BREAK_MINUTES) * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-background-main to-slate-900/70">
        <audio ref={audioRef} src="/assets/timer-chime.mp3" preload="auto" />
        <div className="mb-4">
            <h1 className="text-4xl font-bold text-text-primary">Focus Timer</h1>
            <p className="text-text-secondary mt-1">{mode === 'work' ? 'Time to focus on your tasks.' : 'Take a short break.'}</p>
        </div>

        <div className="relative w-72 h-72 flex items-center justify-center my-8">
            <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="136" stroke="currentColor" strokeWidth="8" className="text-slate-700/50" fill="transparent" />
                <circle cx="50%" cy="50%" r="136" stroke="currentColor" strokeWidth="8" className="text-[var(--secondary-accent)]" fill="transparent"
                    strokeDasharray={2 * Math.PI * 136}
                    strokeDashoffset={2 * Math.PI * 136 * (1 - progress / 100)}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
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
            <button onClick={toggleTimer} className="px-10 py-4 text-lg font-bold bg-[var(--primary-accent)] text-background-main rounded-full hover:opacity-80 transition-opacity">
                {isActive ? 'Pause' : 'Start'}
            </button>
            <button onClick={resetTimer} className="p-4 rounded-full bg-slate-700/50 text-slate-400 hover:bg-slate-700">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9a9 9 0 0115.2-4M20 15a9 9 0 01-15.2 4" /></svg>
            </button>
            <button onClick={() => setIsMuted(prev => !prev)} className="p-4 rounded-full bg-slate-700/50 text-slate-400 hover:bg-slate-700">
                {isMuted ? <SoundOffIcon className="w-6 h-6" /> : <SoundOnIcon className="w-6 h-6" />}
            </button>
        </div>

        <div className="mt-10 p-4 border border-slate-700 rounded-lg bg-slate-800/50 max-w-md">
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
