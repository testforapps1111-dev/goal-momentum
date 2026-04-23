import { useState, useEffect, useCallback } from 'react';
import { sql } from '@/lib/db';
import { getUserId } from '@/lib/auth';

export interface DayEntry {
  id?: string;
  goal_id: string;
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
  user_id: string;
  name: string;
  category: string;
  createdAt: string;
}

interface GoalStore {
  goals: Goal[];
  entries: Record<string, DayEntry[]>; // goalId -> entries
  loading: boolean;
}

export const defaultEntry = (goalId: string, date: string): DayEntry => ({
  goal_id: goalId,
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
  const [store, setStore] = useState<GoalStore>({ goals: [], entries: {}, loading: true });
  const userId = getUserId();

  const fetchAll = useCallback(async () => {
    if (!userId) return; // Wait for AuthProvider
    setStore(prev => ({ ...prev, loading: true }));
    try {
      const rawGoals = await sql`SELECT * FROM goals WHERE user_id = ${userId} ORDER BY created_at DESC`;
      const goals: Goal[] = rawGoals.map((g: any) => ({
        id: g.id,
        user_id: g.user_id,
        name: g.name,
        category: g.category || 'learning',
        createdAt: g.created_at
      }));
      
      const entriesRaw = await sql`
        SELECT * FROM entries WHERE goal_id IN (SELECT id FROM goals WHERE user_id = ${userId}) ORDER BY date DESC
      `;

      const entries: Record<string, DayEntry[]> = {};
      entriesRaw.forEach((e: any) => {
        if (!entries[e.goal_id]) entries[e.goal_id] = [];
        entries[e.goal_id].push({
          id: e.id,
          goal_id: e.goal_id,
          date: new Date(e.date).toISOString().split('T')[0],
          drive: e.drive,
          energy: e.energy,
          focus: e.focus,
          clarity: e.clarity,
          tookAction: e.took_action,
          impactLevel: e.impact_level,
          actionNote: e.action_note || '',
          blocker: e.blocker || '',
        });
      });

      setStore({ goals, entries, loading: false });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setStore(prev => ({ ...prev, loading: false }));
    }
  }, [userId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addGoal = useCallback(async (name: string, category: string = 'learning') => {
    try {
      const result = await sql`
        INSERT INTO goals (user_id, name, category) VALUES (${userId}, ${name}, ${category}) RETURNING *
      `;
      const rawGoal = result[0];
      const newGoal: Goal = {
        id: rawGoal.id,
        user_id: rawGoal.user_id,
        name: rawGoal.name,
        category: rawGoal.category,
        createdAt: rawGoal.created_at
      };
      setStore(prev => ({
        ...prev,
        goals: [newGoal, ...prev.goals],
        entries: { ...prev.entries, [newGoal.id]: [] },
      }));
      return newGoal;
    } catch (err) {
      console.error('Failed to add goal:', err);
      return null;
    }
  }, [userId]);

  const deleteGoal = useCallback(async (goalId: string) => {
    try {
      await sql`DELETE FROM goals WHERE id = ${goalId}`;
      setStore(prev => {
        const { [goalId]: _, ...rest } = prev.entries;
        return {
          ...prev,
          goals: prev.goals.filter(g => g.id !== goalId),
          entries: rest,
        };
      });
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  }, []);

  return { store, setStore, addGoal, deleteGoal, refresh: fetchAll };
}

export function useGoalData(goalId: string, store: GoalStore, setStore: React.Dispatch<React.SetStateAction<GoalStore>>) {
  const todayKey = new Date().toISOString().split('T')[0];
  const entries = store.entries[goalId] || [];

  const [todayEntry, setTodayEntry] = useState<DayEntry>(
    entries.find(e => e.date === todayKey) || defaultEntry(goalId, todayKey)
  );

  useEffect(() => {
    const fresh = entries.find(e => e.date === todayKey) || defaultEntry(goalId, todayKey);
    setTodayEntry(fresh);
  }, [entries, todayKey, goalId]);

  const updateToday = useCallback((updates: Partial<DayEntry>) => {
    setTodayEntry(prev => ({ ...prev, ...updates }));
  }, []);

  const save = useCallback(async () => {
    try {
      const result = await sql`
         INSERT INTO entries (goal_id, date, drive, energy, focus, clarity, took_action, impact_level, action_note, blocker)
         VALUES (${goalId}, ${todayKey}, ${todayEntry.drive}, ${todayEntry.energy}, ${todayEntry.focus}, ${todayEntry.clarity}, ${todayEntry.tookAction}, ${todayEntry.impactLevel}, ${todayEntry.actionNote}, ${todayEntry.blocker})
         ON CONFLICT (goal_id, date) DO UPDATE SET
           drive = EXCLUDED.drive,
           energy = EXCLUDED.energy,
           focus = EXCLUDED.focus,
           clarity = EXCLUDED.clarity,
           took_action = EXCLUDED.took_action,
           impact_level = EXCLUDED.impact_level,
           action_note = EXCLUDED.action_note,
           blocker = EXCLUDED.blocker
         RETURNING *
      `;
      const saved = result[0];

      const updatedEntry: DayEntry = {
        id: saved.id,
        goal_id: saved.goal_id,
        date: new Date(saved.date).toISOString().split('T')[0],
        drive: saved.drive,
        energy: saved.energy,
        focus: saved.focus,
        clarity: saved.clarity,
        tookAction: saved.took_action,
        impactLevel: saved.impact_level,
        actionNote: saved.action_note || '',
        blocker: saved.blocker || '',
      };

      setStore(prev => {
        const goalEntries = prev.entries[goalId] || [];
        const idx = goalEntries.findIndex(e => e.date === todayKey);
        const next = idx >= 0
          ? [...goalEntries.slice(0, idx), updatedEntry, ...goalEntries.slice(idx + 1)]
          : [...goalEntries, updatedEntry];
        return { ...prev, entries: { ...prev.entries, [goalId]: next } };
      });
    } catch (err) {
      console.error('Failed to save entry:', err);
    }
  }, [goalId, todayKey, todayEntry, setStore]);

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
