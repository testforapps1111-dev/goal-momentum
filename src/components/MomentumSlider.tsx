import { useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MomentumSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  icon?: string;
}

export default function MomentumSlider({ label, value, onChange, min = 1, max = 10, icon }: MomentumSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const pct = ((value - min) / (max - min)) * 100;

  const updateFromEvent = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const newVal = Math.round(min + ratio * (max - min));
    onChange(Math.max(min, Math.min(max, newVal)));
  }, [min, max, onChange]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromEvent(e.clientX);
  }, [updateFromEvent]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    updateFromEvent(e.clientX);
  }, [dragging, updateFromEvent]);

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {icon && <span className="mr-1.5">{icon}</span>}
          {label}
        </span>
        <motion.span
          className="text-lg font-bold text-primary tabular-nums"
          animate={{ scale: dragging ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {value}
        </motion.span>
      </div>
      <div
        ref={trackRef}
        className="slider-track relative cursor-pointer select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="slider-fill" style={{ width: `${pct}%` }} />
        <AnimatePresence>
          {dragging && (
            <motion.div
              className="absolute rounded-full"
              style={{
                left: `${pct}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 40,
                height: 40,
                background: 'hsla(160, 84%, 39%, 0.12)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        <div
          className="slider-thumb absolute top-1/2 -translate-y-1/2"
          style={{ left: `${pct}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>
    </div>
  );
}
