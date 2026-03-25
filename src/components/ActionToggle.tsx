import { motion } from 'framer-motion';

interface ActionToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  yesLabel?: string;
  noLabel?: string;
}

export default function ActionToggle({ value, onChange, label, yesLabel = 'Yes, I did', noLabel = 'Not today' }: ActionToggleProps) {
  return (
    <div className="space-y-2">
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      <div className="flex gap-3">
        <motion.button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            value
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-input bg-card text-muted-foreground hover:border-primary/40'
          }`}
          whileTap={{ scale: 0.97 }}
        >
          ✅ {yesLabel}
        </motion.button>
        <motion.button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            !value
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-input bg-card text-muted-foreground hover:border-primary/40'
          }`}
          whileTap={{ scale: 0.97 }}
        >
          {noLabel}
        </motion.button>
      </div>
    </div>
  );
}
