import { motion } from 'framer-motion';
import type { DayEntry } from '@/hooks/useGoalData';
import { useTranslation } from '@/hooks/useTranslation';

interface HistoryPanelProps {
  entries: DayEntry[];
}

export default function HistoryPanel({ entries }: HistoryPanelProps) {
  const { t } = useTranslation();

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground text-sm">
        {t('history.nodata')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sorted.map((entry, i) => {
        const dateStr = new Date(entry.date).toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
        });
        const avg = ((entry.drive + entry.energy + entry.focus + entry.clarity) / 4).toFixed(1);

        return (
          <motion.div
            key={entry.date}
            className="glass-card p-5 space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{dateStr}</span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                Avg: {avg}/10
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Metric label="🔥 Drive" value={entry.drive} />
              <Metric label="⚡ Energy" value={entry.energy} />
              <Metric label="🎯 Focus" value={entry.focus} />
              <Metric label="💎 Clarity" value={entry.clarity} />
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {entry.tookAction ? (
                <span className="bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
                  ✅ {t('history.action.yes')}
                </span>
              ) : (
                <span className="bg-muted text-muted-foreground font-medium px-2 py-0.5 rounded-full">
                  {t('history.action.no')}
                </span>
              )}
              {entry.tookAction && entry.impactLevel > 0 && (
                <span className="bg-accent/10 text-accent-foreground font-medium px-2 py-0.5 rounded-full">
                  📈 Impact: {entry.impactLevel}/10
                </span>
              )}
            </div>

            {entry.actionNote && (
              <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                {entry.actionNote}
              </p>
            )}
            {entry.blocker && (
              <p className="text-sm text-muted-foreground border-l-2 border-destructive/30 pl-3">
                <span className="font-medium text-foreground">{t('history.blocker')}:</span> {entry.blocker}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
      <span className="text-xs">{label}</span>
      <span className="text-sm font-bold text-foreground ml-auto">{value}</span>
    </div>
  );
}
