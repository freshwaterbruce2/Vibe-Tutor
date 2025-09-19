import React, { useState, useEffect, useRef } from 'react';
import type { ParsedHomework } from '../types';
import { parseHomeworkFromVoice } from '../services/geminiService';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface AddHomeworkModalProps {
  onClose: () => void;
  onAdd: (item: ParsedHomework) => void;
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

const AddHomeworkModal: React.FC<AddHomeworkModalProps> = ({ onClose, onAdd }) => {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceTranscript(transcript);
      setIsParsing(true);
      parseHomeworkFromVoice(transcript)
        .then(parsed => {
            if (parsed) {
                setSubject(parsed.subject || '');
                setTitle(parsed.title || '');
                setDueDate(parsed.dueDate || '');
            }
        })
        .finally(() => setIsParsing(false));
    };
    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
  }, []);
  
  const handleListen = () => {
    if (!recognition) {
        return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setVoiceTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject && title && dueDate) {
      onAdd({ subject, title, dueDate });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-background-surface border border-[var(--border-color)] rounded-2xl shadow-2xl shadow-black/50 p-8 w-full max-w-lg transform transition-all animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[var(--secondary-accent)] to-[var(--primary-accent)]">New Assignment</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input type="text" placeholder="Subject (e.g., Math)" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent outline-none" required />
            <input type="text" placeholder="Title (e.g., Complete worksheet)" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent outline-none" required />
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent outline-none" required />
          </div>
          <div className="mt-6 text-center">
            <div className="flex items-center my-2">
                <hr className="flex-grow border-slate-700"/>
                <span className="mx-2 text-slate-500 text-sm">OR</span>
                <hr className="flex-grow border-slate-700"/>
            </div>
            {recognition ? (
                <button type="button" onClick={handleListen} className={`px-6 py-3 rounded-full flex items-center justify-center mx-auto transition-all duration-300 font-semibold ${isListening ? 'bg-red-500 text-white w-full' : 'bg-transparent border-2 border-[var(--primary-accent)] text-[var(--primary-accent)] hover:bg-primary-accent/20'}`} style={!isListening ? {boxShadow: 'var(--neon-glow-primary)'} : {}}>
                <MicrophoneIcon className="w-6 h-6 mr-2"/>
                {isListening ? 'Listening...' : 'Add with Voice'}
                </button>
            ) : (
                <p className="text-sm text-slate-500">Voice input is not supported on this browser.</p>
            )}
             {(voiceTranscript || isParsing) && (
                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg text-left border border-slate-700">
                  <p className="text-sm text-slate-400">Transcript:</p>
                  <p className="text-slate-200 italic">"{voiceTranscript}"</p>
                  {isParsing && <p className="text-sm text-[var(--primary-accent)] animate-pulse mt-1 neon-text-primary">AI is parsing...</p>}
                </div>
            )}
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-slate-300 bg-slate-700/50 hover:bg-slate-700">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-[var(--primary-accent)] text-background-main font-semibold hover:opacity-80">Add Assignment</button>
          </div>
        </form>
      </div>
       <style>{`
          @keyframes fade-in-up {
              0% { opacity: 0; transform: translateY(20px); }
              100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(0.8) sepia(1) saturate(5) hue-rotate(150deg);
          }
        `}</style>
    </div>
  );
};

export default AddHomeworkModal;