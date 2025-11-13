/**
 * Schedule Service
 * Manages daily routines (morning/evening) with localStorage and backend sync
 */

import type {
  DailySchedule,
  ScheduleStep,
  ScheduleProgress,
  CreateSchedulePayload,
  UpdateSchedulePayload,
  StepStatus,
} from '../types/schedule';

const SCHEDULES_KEY = 'vibetutor_schedules';
const PROGRESS_KEY = 'vibetutor_schedule_progress';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// LocalStorage helpers
function getSchedulesFromStorage(): DailySchedule[] {
  try {
    const stored = localStorage.getItem(SCHEDULES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load schedules from localStorage:', error);
    return [];
  }
}

function saveSchedulesToStorage(schedules: DailySchedule[]): void {
  try {
    localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.error('Failed to save schedules to localStorage:', error);
  }
}

function getProgressFromStorage(): ScheduleProgress[] {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load progress from localStorage:', error);
    return [];
  }
}

function saveProgressToStorage(progress: ScheduleProgress[]): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress to localStorage:', error);
  }
}

// CRUD Operations
export async function getSchedules(): Promise<DailySchedule[]> {
  // For now, use localStorage only
  // TODO: Sync with backend when online
  return getSchedulesFromStorage();
}

export async function getScheduleById(id: string): Promise<DailySchedule | null> {
  const schedules = await getSchedules();
  return schedules.find(s => s.id === id) || null;
}

export async function createSchedule(payload: CreateSchedulePayload): Promise<DailySchedule> {
  const schedules = getSchedulesFromStorage();

  const newSchedule: DailySchedule = {
    id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: payload.type,
    title: payload.title,
    description: payload.description,
    steps: payload.steps.map((step, idx) => ({
      id: `step_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 9)}`,
      ...step,
      status: 'pending' as const,
      order: idx,
    })),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    active: true,
  };

  // Deactivate other schedules of the same type
  const updatedSchedules = schedules.map(s =>
    s.type === payload.type ? { ...s, active: false } : s
  );

  updatedSchedules.push(newSchedule);
  saveSchedulesToStorage(updatedSchedules);

  // TODO: Sync to backend
  return newSchedule;
}

export async function updateSchedule(
  id: string,
  payload: UpdateSchedulePayload
): Promise<DailySchedule | null> {
  const schedules = getSchedulesFromStorage();
  const index = schedules.findIndex(s => s.id === id);

  if (index === -1) return null;

  const updatedSchedule: DailySchedule = {
    ...schedules[index],
    ...payload,
    updatedAt: Date.now(),
  };

  schedules[index] = updatedSchedule;
  saveSchedulesToStorage(schedules);

  // TODO: Sync to backend
  return updatedSchedule;
}

export async function deleteSchedule(id: string): Promise<boolean> {
  const schedules = getSchedulesFromStorage();
  const filtered = schedules.filter(s => s.id !== id);

  if (filtered.length === schedules.length) return false;

  saveSchedulesToStorage(filtered);
  // TODO: Sync to backend
  return true;
}

export async function updateStepStatus(
  scheduleId: string,
  stepId: string,
  status: StepStatus
): Promise<boolean> {
  const schedules = getSchedulesFromStorage();
  const schedule = schedules.find(s => s.id === scheduleId);

  if (!schedule) return false;

  const step = schedule.steps.find(s => s.id === stepId);
  if (!step) return false;

  step.status = status;
  if (status === 'completed') {
    step.completedAt = Date.now();
  } else if (status === 'pending') {
    delete step.completedAt;
  }

  schedule.updatedAt = Date.now();
  saveSchedulesToStorage(schedules);

  // Update daily progress
  updateDailyProgress(schedule);

  // TODO: Sync to backend
  return true;
}

// Progress tracking
function updateDailyProgress(schedule: DailySchedule): void {
  const today = new Date().toISOString().split('T')[0];
  const progressList = getProgressFromStorage();

  const existingIndex = progressList.findIndex(
    p => p.scheduleId === schedule.id && p.date === today
  );

  const completedSteps = schedule.steps.filter(s => s.status === 'completed').map(s => s.id);
  const completionPercentage = Math.round((completedSteps.length / schedule.steps.length) * 100);

  const progress: ScheduleProgress = {
    scheduleId: schedule.id,
    date: today,
    completedSteps,
    totalSteps: schedule.steps.length,
    completionPercentage,
    completedAt: completionPercentage === 100 ? Date.now() : undefined,
    tokensEarned: completionPercentage === 100 ? 10 : 0, // Reward for full completion
  };

  if (existingIndex >= 0) {
    progressList[existingIndex] = progress;
  } else {
    progressList.push(progress);
  }

  saveProgressToStorage(progressList);
}

export async function getTodayProgress(): Promise<ScheduleProgress[]> {
  const today = new Date().toISOString().split('T')[0];
  const progressList = getProgressFromStorage();
  return progressList.filter(p => p.date === today);
}

export async function getWeekProgress(): Promise<ScheduleProgress[]> {
  const progressList = getProgressFromStorage();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  return progressList.filter(p => p.date >= weekAgoStr);
}

export async function resetTodayProgress(scheduleId: string): Promise<void> {
  const schedule = await getScheduleById(scheduleId);
  if (!schedule) return;

  // Reset all steps to pending
  schedule.steps.forEach(step => {
    step.status = 'pending';
    delete step.completedAt;
  });

  schedule.updatedAt = Date.now();
  const schedules = getSchedulesFromStorage();
  const index = schedules.findIndex(s => s.id === scheduleId);
  if (index >= 0) {
    schedules[index] = schedule;
    saveSchedulesToStorage(schedules);
  }

  // Clear today's progress
  const today = new Date().toISOString().split('T')[0];
  const progressList = getProgressFromStorage();
  const filtered = progressList.filter(p => !(p.scheduleId === scheduleId && p.date === today));
  saveProgressToStorage(filtered);
}
