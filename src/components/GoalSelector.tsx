import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2, BookOpen, TrendingUp, HeartPulse } from 'lucide-react';
import type { Goal } from '@/hooks/useGoalData';
import { useTranslation } from '@/hooks/useTranslation';

interface GoalSelectorProps {
  goals: Goal[];
  onSelect: (goal: Goal) => void;
  onAdd: (name: string, category: string) => Promise<Goal | null>;
  onDelete: (goalId: string) => void;
}

const CATEGORIES = [
  { id: 'learning', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'performance', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'behavioral', icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

export default function GoalSelector({ goals, onSelect, onAdd, onDelete }: GoalSelectorProps) {
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleAdd = async () => {
    const name = input.trim();
    if (!name || !selectedCategory) return;
    const goal = await onAdd(name, selectedCategory);
    setInput('');
    if (goal) onSelect(goal);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const groupedGoals = goals.reduce((acc, goal) => {
    const cat = goal.category || 'learning';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(goal);
    return acc;
  }, {} as Record<string, Goal[]>);

  const activeCategory = CATEGORIES.find(c => c.id === selectedCategory);
  const activeGoals = selectedCategory ? (groupedGoals[selectedCategory] || []) : [];

  return (
    <div className="space-y-6">
      {/* Category Selection Header */}
      {!selectedCategory ? (
        <motion.div
          className="glass-card p-6 md:p-8 space-y-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">
              {t('goal.ask')}
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              {t('goal.ask.sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const count = groupedGoals[cat.id]?.length || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="flex flex-col items-start p-5 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all duration-200 text-left cursor-pointer hover:shadow-md"
                >
                  <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                  </div>
                  <span className="text-base font-semibold text-foreground">{t(`category.${cat.id}.title`)}</span>
                  <span className="text-xs text-muted-foreground mt-1">{t(`category.${cat.id}.desc`)}</span>
                  <span className="text-xs font-medium text-primary mt-3 bg-primary/10 px-2 py-1 rounded-md">
                    {count} {count === 1 ? 'Goal' : 'Goals'}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="category-view"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Back & Title */}
          <div className="flex items-center gap-3 px-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className={`w-8 h-8 rounded-lg ${activeCategory!.bg} flex items-center justify-center`}>
              {activeCategory && <activeCategory.icon className={`w-4 h-4 ${activeCategory.color}`} />}
            </div>
            <h2 className="text-lg font-bold text-foreground">{t(`category.${selectedCategory}.title`)}</h2>
          </div>

          {/* Add New Goal inside Category */}
          <div className="glass-card p-4 md:p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('goal.add')} ({t(`category.${selectedCategory}.title`)})</h3>
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-shadow duration-200"
                placeholder={t('goal.placeholder')}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={80}
              />
              <button
                onClick={handleAdd}
                disabled={!input.trim()}
                className="gradient-primary gradient-primary-hover text-primary-foreground px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 disabled:opacity-40 transition-all duration-200 save-ripple"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t('goal.add')}</span>
              </button>
            </div>
          </div>

          {/* List of Goals in Category */}
          {activeGoals.length > 0 && (
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider px-2">
                {t('goal.recent')}
              </h3>
              <div className="grid gap-2.5">
                <AnimatePresence>
                  {activeGoals.map((goal, i) => (
                    <motion.div
                      key={goal.id}
                      className="glass-card p-4 flex items-center gap-4 cursor-pointer group"
                      onClick={() => onSelect(goal)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      whileHover={{ boxShadow: 'var(--shadow-card-hover)' }}
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{goal.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(goal.createdAt).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(goal.id); }}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
          
          {activeGoals.length === 0 && (
            <div className="text-center py-10 px-4 glass-card">
              <div className={`w-12 h-12 rounded-full ${activeCategory!.bg} flex items-center justify-center mx-auto mb-3`}>
                <activeCategory.icon className={`w-6 h-6 ${activeCategory.color}`} />
              </div>
              <p className="text-muted-foreground text-sm">No goals in this category yet. Create one above!</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
