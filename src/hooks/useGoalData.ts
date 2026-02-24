import { useState, useEffect, useCallback } from 'react';

export interface DayEntry {
  date: string;
  momentum: number;
  energy: number;
  focus: number;
  clarity: number;
  tookAction: boolean;
  impactLevel: number;
  actionNote: string;
  blocker: string;
}

const STORAGE_KEY = 'goal-momentum-tracker';

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function loadEntries(): DayEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: DayEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const defaultEntry = (date: string): DayEntry => ({
  date,
  momentum: 5,
  energy: 5,
  focus: 5,
  clarity: 5,
  tookAction: false,
  impactLevel: 5,
  actionNote: '',
  blocker: '',
});

export function useGoalData() {
  const [entries, setEntries] = useState<DayEntry[]>(loadEntries);
  const todayKey = getTodayKey();

  const todayEntry = entries.find(e => e.date === todayKey) || defaultEntry(todayKey);

  const updateToday = useCallback((updates: Partial<DayEntry>) => {
    setEntries(prev => {
      const idx = prev.findIndex(e => e.date === todayKey);
      const current = idx >= 0 ? prev[idx] : defaultEntry(todayKey);
      const updated = { ...current, ...updates };
      const next = idx >= 0 ? [...prev.slice(0, idx), updated, ...prev.slice(idx + 1)] : [...prev, updated];
      return next;
    });
  }, [todayKey]);

  const save = useCallback(() => {
    saveEntries(entries);
  }, [entries]);

  const last7Days = entries
    .filter(e => {
      const d = new Date(e.date);
      const now = new Date();
      const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const avg7Day = last7Days.length > 0
    ? Math.round((last7Days.reduce((s, e) => s + e.momentum, 0) / last7Days.length) * 10) / 10
    : 0;

  const actionDays = last7Days.filter(e => e.tookAction).length;
  const avgWithAction = last7Days.filter(e => e.tookAction);
  const avgWithoutAction = last7Days.filter(e => !e.tookAction);

  const actionMomentum = avgWithAction.length > 0
    ? avgWithAction.reduce((s, e) => s + e.momentum, 0) / avgWithAction.length
    : 0;
  const noActionMomentum = avgWithoutAction.length > 0
    ? avgWithoutAction.reduce((s, e) => s + e.momentum, 0) / avgWithoutAction.length
    : 0;

  const multiplier = noActionMomentum > 0 ? (actionMomentum / noActionMomentum) : 0;

  return {
    todayEntry,
    updateToday,
    save,
    entries,
    last7Days,
    avg7Day,
    actionDays,
    actionMomentum,
    noActionMomentum,
    multiplier,
  };
}
