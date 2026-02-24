import { motion } from 'framer-motion';

interface ProgressRingProps {
  value: number;
  label: string;
  hasData: boolean;
}

export default function ProgressRing({ value, label, hasData }: ProgressRingProps) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = value / 10;
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40 md:w-44 md:h-44">
        {/* Soft radial glow */}
        {hasData && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, hsla(160, 84%, 39%, 0.08) 0%, transparent 70%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
        <svg viewBox="0 0 110 110" className="w-full h-full -rotate-90">
          <circle
            cx="55" cy="55" r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="7"
            opacity={0.5}
          />
          {hasData && (
            <motion.circle
              cx="55" cy="55" r={radius}
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            />
          )}
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(160, 84%, 39%)" />
              <stop offset="100%" stopColor="hsl(168, 80%, 28%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {hasData ? (
            <>
              <motion.span
                className="text-3xl md:text-4xl font-bold text-foreground tabular-nums"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                {value.toFixed(1)}
              </motion.span>
              <span className="text-xs text-muted-foreground font-medium mt-0.5">/10</span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground text-center px-4 leading-relaxed">
              Not enough data yet
            </span>
          )}
        </div>
      </div>
      <span className="text-sm font-semibold text-muted-foreground tracking-wide uppercase text-[11px]">
        {label}
      </span>
    </div>
  );
}
