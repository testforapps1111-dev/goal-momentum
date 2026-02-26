import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, ChevronDown } from 'lucide-react';
import { useTranslation, LANGUAGES } from '@/hooks/useTranslation';

export default function LanguageSwitcher() {
  const { lang, setLang, isTranslating } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLang = LANGUAGES.find(l => l.code === lang);

  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div ref={ref} className="relative z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-foreground bg-card border border-border hover:border-primary/30 transition-all duration-200 shadow-sm"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline">{currentLang?.name || 'English'}</span>
        <span className="sm:hidden uppercase text-xs font-bold">{lang}</span>
        {isTranslating ? (
          <motion.div
            className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search */}
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search language..."
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto overscroll-contain">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No languages found</p>
              ) : (
                filtered.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setOpen(false);
                      setSearch('');
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between hover:bg-accent/50 ${
                      l.code === lang ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'
                    }`}
                  >
                    <span>{l.name}</span>
                    <span className="text-xs text-muted-foreground uppercase">{l.code}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
