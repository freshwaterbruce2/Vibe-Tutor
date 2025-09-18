import React, { useState, useEffect } from 'react';
import type { Mood, MoodEntry } from '../types';
import { getMoodAnalysis } from '../services/buddyService';
import { HeartbeatIcon } from './icons/HeartbeatIcon';

const moodOptions: { mood: Mood; emoji: string; color: string }[] = [
    { mood: 'awful', emoji: '😞', color: 'text-red-400' },
    { mood: 'bad', emoji: '😕', color: 'text-orange-400' },
    { mood: 'okay', emoji: '😐', color: 'text-yellow-400' },
    { mood: 'good', emoji: '🙂', color: 'text-green-400' },
    { mood: 'great', emoji: '😄', color: 'text-teal-400' },
];

const MoodTracker: React.FC = () => {
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [note, setNote] = useState('');
    const [lastEntry, setLastEntry] = useState<MoodEntry | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedEntry = localStorage.getItem('lastMoodEntry');
        if (savedEntry) {
            setLastEntry(JSON.parse(savedEntry));
        }
    }, []);

    const handleMoodSelect = (mood: Mood) => {
        setSelectedMood(mood);
    };
    
    const handleSubmit = async () => {
        if (!selectedMood) return;
        setIsLoading(true);
        setAnalysis(null);

        const newEntry: MoodEntry = { mood: selectedMood, note, timestamp: Date.now() };
        localStorage.setItem('lastMoodEntry', JSON.stringify(newEntry));
        setLastEntry(newEntry);

        const aiAnalysis = await getMoodAnalysis(selectedMood, note);
        setAnalysis(aiAnalysis);

        setSelectedMood(null);
        setNote('');
        setIsLoading(false);
    };

    const hasLoggedToday = () => {
        if (!lastEntry) return false;
        const today = new Date().setHours(0,0,0,0);
        const lastDate = new Date(lastEntry.timestamp).setHours(0,0,0,0);
        return today === lastDate;
    }

    return (
        <div className="p-6 bg-background-surface border border-[var(--border-color)] rounded-2xl mt-8">
            <h3 className="text-xl font-bold text-text-primary flex items-center">
                <HeartbeatIcon className="w-6 h-6 mr-3 text-[var(--primary-accent)]" />
                How are you feeling?
            </h3>

            {hasLoggedToday() && !selectedMood ? (
                <div className="mt-4 text-center p-6 bg-slate-800/50 rounded-lg">
                    <p className="text-text-secondary">You've logged your mood for today. Great job checking in with yourself!</p>
                    {analysis && <p className="text-slate-300 italic mt-3">"{analysis}"</p>}
                </div>
            ) : (
                <>
                    <div className="flex justify-around my-6">
                        {moodOptions.map(({ mood, emoji, color }) => (
                            <button key={mood} onClick={() => handleMoodSelect(mood)} className={`text-4xl transition-transform duration-200 ${selectedMood === mood ? 'scale-125' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}>
                                <span className={selectedMood === mood ? color : ''}>{emoji}</span>
                            </button>
                        ))}
                    </div>

                    {selectedMood && (
                        <div className="animate-fade-in-up">
                            <textarea
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                placeholder="Anything on your mind? (Optional)"
                                className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent outline-none"
                                rows={2}
                            />
                            <button onClick={handleSubmit} disabled={isLoading} className="w-full mt-3 px-6 py-3 rounded-lg bg-[var(--primary-accent)] text-background-main font-semibold hover:opacity-80 disabled:opacity-50">
                                {isLoading ? 'Analyzing...' : 'Log My Mood'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default MoodTracker;
