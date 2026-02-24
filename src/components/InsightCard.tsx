import { motion } from 'framer-motion';

interface InsightCardProps {
  icon: string;
  message: string;
  index: number;
}

export default function InsightCard({ icon, message, index }: InsightCardProps) {
  return (
    <motion.div
      className="glass-card p-4 insight-border-gradient cursor-default"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -2, boxShadow: 'var(--shadow-card-hover)' }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{icon}</span>
        <p className="text-sm text-foreground leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}
