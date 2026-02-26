import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface SaveButtonProps {
  onSave: () => void;
  hasSaved?: boolean;
}

export default function SaveButton({ onSave, hasSaved = false }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);

  const handleClick = useCallback(() => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [onSave]);

  const label = hasSaved ? 'Update Today\'s Entry' : 'Save Today\'s Entry';

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className="save-ripple w-full py-4 px-6 rounded-xl font-semibold text-primary-foreground gradient-primary transition-shadow duration-200 flex items-center justify-center gap-2 text-[15px]"
      whileHover={{ scale: 1.02, boxShadow: 'var(--shadow-glow)' }}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence mode="wait">
        {saved ? (
          <motion.span
            key="saved"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="w-5 h-5" />
            Saved
          </motion.span>
        ) : (
          <motion.span
            key="save"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
