import type { Achievement, HomeworkItem } from '../types';
import { TrophyIcon } from '../components/icons/TrophyIcon';
import { FlameIcon } from '../components/icons/FlameIcon';
import { TargetIcon } from '../components/icons/TargetIcon';

export type AchievementEvent = 
  | { type: 'TASK_COMPLETED' }
  | { type: 'FOCUS_SESSION_COMPLETED' }
  | { type: 'HOMEWORK_UPDATE'; payload: { items: HomeworkItem[] } };


let achievements: Achievement[] = [
  { id: 'FIRST_TASK', name: 'First Step', description: 'Complete your first homework task.', unlocked: false, icon: TrophyIcon, goal: 1 },
  { id: 'FIVE_TASKS', name: 'Task Rabbit', description: 'Complete 5 homework tasks.', unlocked: false, icon: TrophyIcon, goal: 5 },
  { id: 'TEN_TASKS', name: 'Task Master', description: 'Complete 10 homework tasks.', unlocked: false, icon: TrophyIcon, goal: 10 },
  { id: 'FIRST_FOCUS', name: 'Deep Diver', description: 'Complete your first focus session.', unlocked: false, icon: TargetIcon, goal: 1 },
  { id: 'FIVE_FOCUS', name: 'Zen Master', description: 'Complete 5 focus sessions.', unlocked: false, icon: TargetIcon, goal: 5 },
  { id: 'STREAK_MASTER', name: 'Streak Master', description: 'Complete tasks for 3 days in a row.', unlocked: false, icon: FlameIcon, goal: 3 },
];

const loadAchievements = (): void => {
    try {
        const saved = localStorage.getItem('achievements');
        if (saved) {
            const savedAchievements = JSON.parse(saved);
            // Merge saved state with default state to handle new achievements
            achievements = achievements.map(def => {
                const savedAch = savedAchievements.find((s: Achievement) => s.id === def.id);
                return savedAch ? { ...def, unlocked: savedAch.unlocked, progress: savedAch.progress } : def;
            });
        }
    } catch (e) {
        console.error("Failed to load achievements from localStorage", e);
    }
};

const saveAchievements = (): void => {
    try {
        const toSave = achievements.map(({ id, unlocked, progress }) => ({ id, unlocked, progress }));
        localStorage.setItem('achievements', JSON.stringify(toSave));
    } catch (e) {
        console.error("Failed to save achievements to localStorage", e);
    }
};

loadAchievements();

export const getAchievements = (): Achievement[] => {
    // Update progress before returning
    const completedTasks = JSON.parse(localStorage.getItem('homeworkStats') || '{}').completedTasks || 0;
    const focusSessions = JSON.parse(localStorage.getItem('focusStats') || '{}').sessionsCompleted || 0;

    return achievements.map(ach => {
        if (ach.id.includes('TASKS')) {
            return { ...ach, progress: Math.min(completedTasks, ach.goal || 0) };
        }
        if (ach.id.includes('FOCUS')) {
            return { ...ach, progress: Math.min(focusSessions, ach.goal || 0) };
        }
        return ach;
    });
};

export const checkAndUnlockAchievements = (event: AchievementEvent): Achievement[] => {
    let statsChanged = false;
    let homeworkStats = JSON.parse(localStorage.getItem('homeworkStats') || '{}');
    let focusStats = JSON.parse(localStorage.getItem('focusStats') || '{}');

    if (event.type === 'TASK_COMPLETED') {
        homeworkStats.completedTasks = (homeworkStats.completedTasks || 0) + 1;
        statsChanged = true;
    }

    if (event.type === 'FOCUS_SESSION_COMPLETED') {
        focusStats.sessionsCompleted = (focusStats.sessionsCompleted || 0) + 1;
        statsChanged = true;
    }

    if(statsChanged) {
        localStorage.setItem('homeworkStats', JSON.stringify(homeworkStats));
        localStorage.setItem('focusStats', JSON.stringify(focusStats));
    }

    const completedTasks = homeworkStats.completedTasks || 0;
    const focusSessions = focusStats.sessionsCompleted || 0;

    achievements.forEach(ach => {
        if (ach.unlocked) return;

        let conditionMet = false;
        if (ach.id === 'FIRST_TASK' && completedTasks >= 1) conditionMet = true;
        if (ach.id === 'FIVE_TASKS' && completedTasks >= 5) conditionMet = true;
        if (ach.id === 'TEN_TASKS' && completedTasks >= 10) conditionMet = true;
        if (ach.id === 'FIRST_FOCUS' && focusSessions >= 1) conditionMet = true;
        if (ach.id === 'FIVE_FOCUS' && focusSessions >= 5) conditionMet = true;

        if (conditionMet) {
            ach.unlocked = true;
        }
    });

    saveAchievements();
    return getAchievements();
};
