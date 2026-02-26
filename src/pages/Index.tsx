import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BarChart3 } from 'lucide-react';
import { useGoalData } from '@/hooks/useGoalData';
import { useTranslation } from '@/hooks/useTranslation';
import ProgressRing from '@/components/ProgressRing';
import MomentumSlider from '@/components/MomentumSlider';
import ActionToggle from '@/components/ActionToggle';
import SaveButton from '@/components/SaveButton';
import MomentumChart from '@/components/MomentumChart';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Index() {
  const {
    todayEntry, updateToday, save,
    last7Days, avg7Day, actionDays, multiplier,
  } = useGoalData();

  const { t } = useTranslation();

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
        {/* Header with Language Switcher */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute right-0 top-0">
            <LanguageSwitcher />
          </div>
          <div className="text-center space-y-1.5 pt-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {t('app.title')}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t('app.subtitle')}
            </p>
          </div>
        </motion.div>

        {/* Progress Ring */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ProgressRing value={avg7Day} label={t('ring.label')} hasData={hasData} noDataText={t('ring.nodata')} />
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
              <MomentumSlider label={t('slider.momentum')} icon="🔥" value={todayEntry.momentum} onChange={v => updateToday({ momentum: v })} />
              <MomentumSlider label={t('slider.energy')} icon="⚡" value={todayEntry.energy} onChange={v => updateToday({ energy: v })} />
              <MomentumSlider label={t('slider.focus')} icon="🎯" value={todayEntry.focus} onChange={v => updateToday({ focus: v })} />
              <MomentumSlider label={t('slider.clarity')} icon="💎" value={todayEntry.clarity} onChange={v => updateToday({ clarity: v })} />
            </div>

            {/* Right: Action & Blocker */}
            <div className="space-y-8">
              <ActionToggle
                label={t('action.label')}
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
                    <MomentumSlider label={t('slider.impact')} icon="📈" value={todayEntry.impactLevel} onChange={v => updateToday({ impactLevel: v })} />
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t('blocker.label')}</label>
                <textarea
                  className="w-full rounded-xl border border-input bg-card p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none transition-shadow duration-200"
                  rows={2}
                  placeholder={t('blocker.placeholder')}
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
            {t('insights.toggle')}
          </span>
          <motion.div animate={{ rotate: showInsights ? 180 : 0 }} transition={{ duration: 0.25 }}>
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
                <h3 className="text-sm font-semibold text-foreground mb-5">{t('insights.trend')}</h3>
                <MomentumChart data={last7Days} />
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 rounded bg-primary inline-block" /> {t('insights.momentum')}
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
                    className="mt-6 pt-5 border-t border-border space-y-2.5"
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
      </div>
    </div>
  );
}
