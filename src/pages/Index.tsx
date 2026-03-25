import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BarChart3, History, ArrowLeft, Crosshair } from 'lucide-react';
import { useGoalStore, useGoalData, defaultEntry } from '@/hooks/useGoalData';
import type { Goal } from '@/hooks/useGoalData';
import { useTranslation } from '@/hooks/useTranslation';
import ProgressRing from '@/components/ProgressRing';
import MomentumSlider from '@/components/MomentumSlider';
import ActionToggle from '@/components/ActionToggle';
import SaveButton from '@/components/SaveButton';
import MomentumChart from '@/components/MomentumChart';
import HistoryPanel from '@/components/HistoryPanel';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import GoalSelector from '@/components/GoalSelector';

export default function Index() {
  const { store, setStore, addGoal, deleteGoal } = useGoalStore();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Card - separate box like reference */}
        <motion.div
          className="glass-card p-6 md:p-8 relative insight-border-gradient"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute right-4 top-4 md:right-6 md:top-5">
            <LanguageSwitcher />
          </div>
          <div className="text-center space-y-1.5">
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight flex items-center justify-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Crosshair className="w-5 h-5 text-primary" />
              </span>
              {selectedGoal ? selectedGoal.name : <TranslatedTitle />}
            </h1>
            {!selectedGoal && (
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                <TranslatedSubtitle />
              </p>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedGoal ? (
            <GoalTracker
              key={selectedGoal.id}
              goal={selectedGoal}
              store={store}
              setStore={setStore}
              onBack={() => setSelectedGoal(null)}
            />
          ) : (
            <motion.div
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GoalSelector
                goals={store.goals}
                onSelect={setSelectedGoal}
                onAdd={addGoal}
                onDelete={deleteGoal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TranslatedTitle() {
  const { t } = useTranslation();
  return <>{t('app.title')}</>;
}

function TranslatedSubtitle() {
  const { t } = useTranslation();
  return <>{t('app.subtitle')}</>;
}

function GoalTracker({ goal, store, setStore, onBack }: {
  goal: Goal;
  store: ReturnType<typeof useGoalStore>['store'];
  setStore: ReturnType<typeof useGoalStore>['setStore'];
  onBack: () => void;
}) {
  const {
    todayEntry, updateToday, save,
    last7Days, avg7Day, actionDays, multiplier,
    entries,
  } = useGoalData(goal.id, store, setStore);

  const { t } = useTranslation();

  const [showInsights, setShowInsights] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [glowCard, setGlowCard] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const hasData = last7Days.length > 0;
  const todayKey = new Date().toISOString().split('T')[0];

  const handleSave = () => {
    save();
    setGlowCard(true);
    setTimeout(() => {
      setGlowCard(false);
      const defaults = defaultEntry(todayKey);
      updateToday(defaults);
      setResetKey(k => k + 1);
    }, 2200);
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('goal.back')}
      </button>

      {/* Progress Ring */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ProgressRing value={avg7Day} label={t('ring.label')} hasData={hasData} noDataText={t('ring.nodata')} />
      </motion.div>

      {/* Main Form Card */}
      <motion.div
        key={resetKey}
        className={`glass-card p-6 md:p-10 insight-border-gradient transition-all duration-300 ${glowCard ? 'glass-card-glow' : ''}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Sliders - each with heading + description like reference */}
        <div className="space-y-8">
          <SliderField
            label={t('slider.drive')}
            description={t('slider.drive.desc')}
            icon="🔥"
            value={todayEntry.drive}
            onChange={v => updateToday({ drive: v })}
          />
          <SliderField
            label={t('slider.energy')}
            description={t('slider.energy.desc')}
            icon="⚡"
            value={todayEntry.energy}
            onChange={v => updateToday({ energy: v })}
          />
          <SliderField
            label={t('slider.focus')}
            description={t('slider.focus.desc')}
            icon="🎯"
            value={todayEntry.focus}
            onChange={v => updateToday({ focus: v })}
          />
          <SliderField
            label={t('slider.clarity')}
            description={t('slider.clarity.desc')}
            icon="💎"
            value={todayEntry.clarity}
            onChange={v => updateToday({ clarity: v })}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Action Toggle - styled like reference with two buttons */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{t('action.label')}</h3>
          </div>
          <ActionToggle
            label=""
            value={todayEntry.tookAction}
            onChange={v => updateToday({ tookAction: v })}
            yesLabel={t('action.yes')}
            noLabel={t('action.no')}
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
                <SliderField
                  label={t('slider.impact')}
                  description={t('slider.impact.desc')}
                  icon="📈"
                  value={todayEntry.impactLevel}
                  onChange={v => updateToday({ impactLevel: v })}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">{t('action.note.label')}</label>
                  <textarea
                    className="w-full rounded-xl border border-input bg-card p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none transition-shadow duration-200"
                    rows={2}
                    placeholder={t('action.note.placeholder')}
                    value={todayEntry.actionNote}
                    onChange={e => updateToday({ actionNote: e.target.value })}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Blocker */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">{t('blocker.label')}</label>
            <textarea
              className="w-full rounded-xl border border-input bg-card p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none transition-shadow duration-200"
              rows={2}
              placeholder={t('blocker.placeholder')}
              value={todayEntry.blocker}
              onChange={e => updateToday({ blocker: e.target.value })}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6">
          <SaveButton onSave={handleSave} />
        </div>
      </motion.div>

      {/* Insights & History toggles side by side */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          className="glass-card w-full p-4 flex items-center justify-between cursor-pointer"
          onClick={() => setShowInsights(!showInsights)}
          whileHover={{ boxShadow: 'var(--shadow-card-hover)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BarChart3 className="w-4 h-4 text-primary" />
            {t('insights.toggle')}
          </span>
          <motion.div animate={{ rotate: showInsights ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </motion.button>

        <motion.button
          type="button"
          className="glass-card w-full p-4 flex items-center justify-between cursor-pointer"
          onClick={() => setShowHistory(!showHistory)}
          whileHover={{ boxShadow: 'var(--shadow-card-hover)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <History className="w-4 h-4 text-primary" />
            {t('history.toggle')}
          </span>
          <motion.div animate={{ rotate: showHistory ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </motion.button>
      </div>

      {/* Insights Panel */}
      <AnimatePresence>
        {showInsights && (
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="glass-card p-6 md:p-8">
              <h3 className="text-sm font-semibold text-foreground mb-5">{t('insights.trend')}</h3>
              <MomentumChart data={last7Days} />
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded bg-primary inline-block" /> {t('insights.drive')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded inline-block" style={{ background: 'hsl(213, 94%, 68%)' }} /> {t('insights.energy')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded inline-block" style={{ background: 'hsl(280, 67%, 65%)' }} /> {t('insights.focus')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded inline-block" style={{ background: 'hsl(35, 92%, 60%)' }} /> {t('insights.clarity')}
                </span>
              </div>

              {hasData && (
                <motion.div
                  className="mt-6 pt-5 border-t border-border space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">{t('insights.consistency')}</span>{' '}
                    {actionDays}/7 {t('insights.days')}
                  </p>
                  {multiplier > 1 && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t('insights.multiplier.pre')} <span className="font-semibold text-primary">{multiplier.toFixed(1)}x</span> {t('insights.multiplier.post')}
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="glass-card p-6 md:p-8">
              <h3 className="text-sm font-semibold text-foreground mb-5">{t('history.title')}</h3>
              <HistoryPanel entries={entries} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Slider field with heading + description like the reference UI */
function SliderField({ label, description, icon, value, onChange }: {
  label: string;
  description: string;
  icon: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-base mt-0.5">{icon}</span>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <MomentumSlider label="" value={value} onChange={onChange} min={0} />
    </div>
  );
}
