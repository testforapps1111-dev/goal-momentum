import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2 } from 'lucide-react';
import type { Goal } from '@/hooks/useGoalData';
import { useTranslation } from '@/hooks/useTranslation';

interface GoalSelectorProps {
  goals: Goal[];
  onSelect: (goal: Goal) => void;
  onAdd: (name: string) => Goal;
  onDelete: (goalId: string) => void;
}

export default function GoalSelector({ goals, onSelect, onAdd, onDelete }: GoalSelectorProps) {
  const [input, setInput] = useState('');
  const { t } = useTranslation();

  const handleAdd = () => {
    const name = input.trim();
    if (!name) return;
    const goal = onAdd(name);
    setInput('');
    onSelect(goal);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="space-y-5">
      {/* Add Goal */}
      <motion.div
        className="glass-card p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-foreground mb-1">
          {t('goal.ask')}
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          {t('goal.ask.sub')}
        </p>
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
            {t('goal.add')}
          </button>
        </div>
      </motion.div>

      {/* Recent Goals */}
      {goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            {t('goal.recent')}
          </h3>
          <div className="grid gap-2.5">
            <AnimatePresence>
              {goals.map((goal, i) => (
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
                      {new Date(goal.createdAt).toLocaleDateString('en-US', {
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
        </motion.div>
      )}
    </div>
  );
}
