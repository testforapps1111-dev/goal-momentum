import { useState, useEffect, useCallback } from 'react';

export interface DayEntry {
  date: string;
  drive: number;
  energy: number;
  focus: number;
  clarity: number;
  tookAction: boolean;
  impactLevel: number;
  actionNote: string;
  blocker: string;
}

export interface Goal {
  id: string;
  name: string;
  createdAt: string;
}

interface GoalStore {
  goals: Goal[];
  entries: Record<string, DayEntry[]>; // goalId -> entries
}

const STORAGE_KEY = 'goal-momentum-tracker-v2';

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function loadStore(): GoalStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    // Migrate from old format
    const oldRaw = localStorage.getItem('goal-momentum-tracker');
    if (oldRaw) {
      const oldEntries = JSON.parse(oldRaw) as DayEntry[];
      if (Array.isArray(oldEntries) && oldEntries.length > 0) {
        const defaultGoal: Goal = { id: 'default', name: 'My Goal', createdAt: new Date().toISOString() };
        return { goals: [defaultGoal], entries: { default: oldEntries } };
      }
    }
    return { goals: [], entries: {} };
  } catch {
    return { goals: [], entries: {} };
  }
}

function saveStore(store: GoalStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export const defaultEntry = (date: string): DayEntry => ({
  date,
  drive: 5,
  energy: 5,
  focus: 5,
  clarity: 5,
  tookAction: false,
  impactLevel: 5,
  actionNote: '',
  blocker: '',
});

export function useGoalStore() {
  const [store, setStore] = useState<GoalStore>(loadStore);

  useEffect(() => {
    saveStore(store);
  }, [store]);

  const addGoal = useCallback((name: string) => {
    const goal: Goal = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      createdAt: new Date().toISOString(),
    };
    setStore(prev => ({
      ...prev,
      goals: [goal, ...prev.goals],
      entries: { ...prev.entries, [goal.id]: [] },
    }));
    return goal;
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setStore(prev => {
      const { [goalId]: _, ...rest } = prev.entries;
      return {
        goals: prev.goals.filter(g => g.id !== goalId),
        entries: rest,
      };
    });
  }, []);

  return { store, setStore, addGoal, deleteGoal };
}

export function useGoalData(goalId: string, store: GoalStore, setStore: React.Dispatch<React.SetStateAction<GoalStore>>) {
  const todayKey = getTodayKey();
  const entries = store.entries[goalId] || [];

  const todayEntry = entries.find(e => e.date === todayKey) || defaultEntry(todayKey);

  const updateToday = useCallback((updates: Partial<DayEntry>) => {
    setStore(prev => {
      const goalEntries = prev.entries[goalId] || [];
      const idx = goalEntries.findIndex(e => e.date === todayKey);
      const current = idx >= 0 ? goalEntries[idx] : defaultEntry(todayKey);
      const updated = { ...current, ...updates };
      const next = idx >= 0
        ? [...goalEntries.slice(0, idx), updated, ...goalEntries.slice(idx + 1)]
        : [...goalEntries, updated];
      return { ...prev, entries: { ...prev.entries, [goalId]: next } };
    });
  }, [goalId, todayKey, setStore]);

  const save = useCallback(() => {
    saveStore(store);
  }, [store]);

  const last7Days = entries
    .filter(e => {
      const d = new Date(e.date);
      const now = new Date();
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const avg7Day = last7Days.length > 0
    ? Math.round((last7Days.reduce((s, e) => s + (e.drive + e.energy + e.focus + e.clarity) / 4, 0) / last7Days.length) * 10) / 10
    : 0;

  const actionDays = last7Days.filter(e => e.tookAction).length;
  const avgWithAction = last7Days.filter(e => e.tookAction);
  const avgWithoutAction = last7Days.filter(e => !e.tookAction);

  const actionAvg = avgWithAction.length > 0
    ? avgWithAction.reduce((s, e) => s + (e.drive + e.energy + e.focus + e.clarity) / 4, 0) / avgWithAction.length
    : 0;
  const noActionAvg = avgWithoutAction.length > 0
    ? avgWithoutAction.reduce((s, e) => s + (e.drive + e.energy + e.focus + e.clarity) / 4, 0) / avgWithoutAction.length
    : 0;

  const multiplier = noActionAvg > 0 ? (actionAvg / noActionAvg) : 0;

  return {
    todayEntry,
    updateToday,
    save,
    entries,
    last7Days,
    avg7Day,
    actionDays,
    multiplier,
  };
}
