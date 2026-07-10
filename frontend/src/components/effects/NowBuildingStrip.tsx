import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';

export function NowBuildingStrip({ className }: { className?: string }) {
  const { get } = useSiteSettingsMap();
  const raw = get(
    'now_building_items',
    'Enterprise HRMS,Customer Portal,Mobile App v2,Reporting Dashboard',
  );
  const items = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), 3200);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div
      className={`flex items-center gap-3 border-b border-white/10 bg-primary-950/95 px-4 py-2.5 font-mono text-xs sm:px-6 lg:px-8 ${className ?? ''}`}
    >
      <span className="shrink-0 uppercase tracking-widest text-brand-gold-400">Now building</span>
      <span className="hidden h-3 w-px bg-white/20 sm:block" />
      <div className="relative min-h-[1.25rem] flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={items[index]}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 truncate text-slate-300"
          >
            {items[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="hidden shrink-0 text-emerald-400 sm:inline">● live</span>
    </div>
  );
}
