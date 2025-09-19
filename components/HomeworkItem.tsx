import React from 'react';
import type { HomeworkItem as HomeworkItemType } from '../types';
// FIX: Import the LightningIcon
import { LightningIcon } from './icons/LightningIcon';

interface HomeworkItemProps {
  item: HomeworkItemType;
  onToggleComplete: (id: string) => void;
  // FIX: Add the onBreakdownClick prop
  onBreakdownClick: (item: HomeworkItemType) => void;
}

const subjectColorMap: { [key: string]: { bg: string; text: string } } = {
  math: { bg: '#2E5A8833', text: '#63A3EE' },
  science: { bg: '#2E8B5733', text: '#66CDAA' },
  history: { bg: '#D2691E33', text: '#FFA07A' },
  english: { bg: '#483D8B33', text: '#9370DB' },
  language: { bg: '#C7158533', text: '#FF69B4' },
  art: { bg: '#FFD70033', text: '#FFD700' },
  music: { bg: '#DC143C33', text: '#FF6347' },
  default: { bg: '#69696933', text: '#D3D3D3' },
};

const getSubjectColor = (subject: string) => {
    return subjectColorMap[subject.toLowerCase()] || subjectColorMap.default;
};


const HomeworkItem: React.FC<HomeworkItemProps> = ({ item, onToggleComplete, onBreakdownClick }) => {
  const color = getSubjectColor(item.subject);

  return (
    <div className={`bg-background-surface border border-[var(--border-color)] rounded-xl p-5 flex flex-col justify-between transition-all duration-300 ${item.completed ? 'opacity-50' : 'hover:shadow-lg hover:shadow-black/50 hover:-translate-y-1'}`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <span 
            className="text-xs font-bold uppercase px-2 py-1 rounded-full"
            style={{ backgroundColor: color.bg, color: color.text }}
          >
            {item.subject}
          </span>
        </div>
        <h3 className={`text-lg font-semibold text-text-primary ${item.completed ? 'line-through' : ''}`}>{item.title}</h3>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-text-secondary">{new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })}</p>
        <div className="flex items-center gap-4">
            {/* FIX: Add the AI Breakdown button */}
            {!item.completed && (
                 <button 
                    onClick={() => onBreakdownClick(item)} 
                    className="flex items-center text-sm font-medium text-text-secondary hover:text-[var(--secondary-accent)] transition-colors"
                    title="Break down task with AI"
                >
                    <LightningIcon className="w-4 h-4 mr-1.5"/>
                    Breakdown
                </button>
            )}
            <button 
                onClick={() => onToggleComplete(item.id)} 
                className="flex items-center text-sm font-medium text-text-secondary hover:text-[var(--primary-accent)] transition-colors"
            >
                <div className={`w-5 h-5 rounded-md border-2 mr-2 flex items-center justify-center transition-all ${item.completed ? 'bg-[var(--primary-accent)] border-[var(--primary-accent)]' : 'border-slate-500'}`}>
                    {item.completed && <svg className="w-3 h-3 text-background-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                {item.completed ? 'Completed' : 'Mark as done'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default HomeworkItem;