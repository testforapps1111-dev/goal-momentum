import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BarChart3 } from 'lucide-react';
import { useGoalData } from '@/hooks/useGoalData';
import ProgressRing from '@/components/ProgressRing';
import MomentumSlider from '@/components/MomentumSlider';
import ActionToggle from '@/components/ActionToggle';
import SaveButton from '@/components/SaveButton';
import MomentumChart from '@/components/MomentumChart';

export default function Index() {
  const {
    todayEntry, updateToday, save,
    last7Days, avg7Day, actionDays, multiplier,
  } = useGoalData();

  const [showInsights, setShowInsights] = useState(false);
  const [glowCard, setGlowCard] = useState(false);

  const hasData = last7Days.length > 0;

  const handleSave = () => {
    save();
    setGlowCard(true);
    setTimeout(() => setGlowCard(false), 1200);
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          className="text-center space-y-1.5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Goal Momentum Tracker
          </h1>
          <p className="text-muted-foreground text-sm">
            Track your daily growth signals
          </p>
        </motion.div>

        {/* Progress Ring */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ProgressRing value={avg7Day} label="7-Day Performance Index" hasData={hasData} />
        </motion.div>

        {/* Main Form */}
        <motion.div
          className={`glass-card p-8 md:p-12 transition-all duration-300 ${glowCard ? 'glass-card-glow' : ''}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Left: Sliders */}
            <div className="space-y-8">
              <MomentumSlider
                label="Momentum"
                icon="🔥"
                value={todayEntry.momentum}
                onChange={v => updateToday({ momentum: v })}
              />
              <MomentumSlider
                label="Energy"
                icon="⚡"
                value={todayEntry.energy}
                onChange={v => updateToday({ energy: v })}
              />
              <MomentumSlider
                label="Focus"
                icon="🎯"
                value={todayEntry.focus}
                onChange={v => updateToday({ focus: v })}
              />
              <MomentumSlider
                label="Clarity"
                icon="💎"
                value={todayEntry.clarity}
                onChange={v => updateToday({ clarity: v })}
              />
            </div>

            {/* Right: Action & Blocker */}
            <div className="space-y-8">
              <ActionToggle
                label="Took a meaningful step today?"
                value={todayEntry.tookAction}
                onChange={v => updateToday({ tookAction: v })}
              />

              <AnimatePresence>
                {todayEntry.tookAction && (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: 10, height: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                  >
                    <MomentumSlider
                      label="Impact Level"
                      icon="📈"
                      value={todayEntry.impactLevel}
                      onChange={v => updateToday({ impactLevel: v })}
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Action Note</label>
                      <textarea
                        className="w-full rounded-xl border border-input bg-card p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none transition-shadow duration-200"
                        rows={2}
                        placeholder="What did you do today?"
                        value={todayEntry.actionNote}
                        onChange={e => updateToday({ actionNote: e.target.value })}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  🚧 Current Blocker
                </label>
                <textarea
                  className="w-full rounded-xl border border-input bg-card p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none transition-shadow duration-200"
                  rows={2}
                  placeholder="Anything holding you back?"
                  value={todayEntry.blocker}
                  onChange={e => updateToday({ blocker: e.target.value })}
                />
              </div>

            </div>
          </div>

          {/* Centered Save Button */}
          <div className="pt-4">
            <SaveButton onSave={handleSave} hasSaved={last7Days.some(e => e.date === todayEntry.date)} />
          </div>
        </motion.div>

        {/* Insights Toggle */}
        <motion.button
          type="button"
          className="glass-card w-full p-5 flex items-center justify-between cursor-pointer"
          onClick={() => setShowInsights(!showInsights)}
          whileHover={{ boxShadow: 'var(--shadow-card-hover)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
            <BarChart3 className="w-4 h-4 text-primary" />
            View Goal Insights
          </span>
          <motion.div
            animate={{ rotate: showInsights ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </motion.button>

        {/* Insights Panel */}
        <AnimatePresence>
          {showInsights && (
            <motion.div
              className="space-y-0 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-foreground mb-5">7-Day Trend</h3>
                <MomentumChart data={last7Days} />
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 rounded bg-primary inline-block" /> Momentum
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 rounded inline-block" style={{ background: 'hsl(213, 94%, 68%)' }} /> Energy
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 rounded inline-block" style={{ background: 'hsl(280, 67%, 65%)' }} /> Focus
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 rounded inline-block" style={{ background: 'hsl(35, 92%, 60%)' }} /> Clarity
                  </span>
                </div>

                {/* Minimal dynamic insights */}
                {hasData && (
                  <motion.div
                    className="mt-6 pt-5 border-t border-border space-y-2.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">Action consistency:</span>{' '}
                      {actionDays}/7 days with action taken.
                    </p>
                    {multiplier > 1 && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Momentum increases <span className="font-semibold text-primary">{multiplier.toFixed(1)}x</span> on days you take action.
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
