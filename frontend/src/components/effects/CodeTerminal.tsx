import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { cn } from '@/utils/cn';

const TERMINAL_LINES = [
  { type: 'command' as const, text: '$ git init trans-net-app' },
  { type: 'output' as const, text: 'Initialized empty Git repository' },
  { type: 'command' as const, text: '$ npm run build --production' },
  { type: 'output' as const, text: '✓ Compiled successfully in 4.2s' },
  { type: 'command' as const, text: '$ docker compose up -d' },
  { type: 'output' as const, text: '✓ API · Web · Database — running' },
  { type: 'command' as const, text: '$ deploy --env production' },
  { type: 'output' as const, text: '🚀 Ship complete. Uptime 99.9%' },
];

export function CodeTerminal({ className }: { className?: string }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const currentLine = TERMINAL_LINES[visibleCount];
  const isTyping = currentLine && charIndex < currentLine.text.length;

  useEffect(() => {
    if (visibleCount >= TERMINAL_LINES.length) {
      const reset = window.setTimeout(() => {
        setVisibleCount(0);
        setCharIndex(0);
      }, 4000);
      return () => window.clearTimeout(reset);
    }

    if (!currentLine) return;

    if (charIndex < currentLine.text.length) {
      const tick = window.setTimeout(() => setCharIndex((c) => c + 1), 28);
      return () => window.clearTimeout(tick);
    }

    const next = window.setTimeout(() => {
      setVisibleCount((v) => v + 1);
      setCharIndex(0);
    }, currentLine.type === 'command' ? 400 : 600);

    return () => window.clearTimeout(next);
  }, [visibleCount, charIndex, currentLine]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={cn(
        'relative hidden overflow-hidden rounded-xl border border-white/10 bg-primary-950/85 shadow-2xl backdrop-blur-md lg:block',
        className,
      )}
    >
      <div className="tech-grid-animated absolute inset-0 opacity-30" aria-hidden />

      <div className="relative flex items-center gap-2 border-b border-white/10 bg-primary-900/80 px-4 py-2.5">
        <Terminal className="h-3.5 w-3.5 text-brand-gold-400" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
          trans-net — dev@production
        </span>
        <span className="ml-auto flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-gold-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary-500/80" />
        </span>
      </div>

      <div className="relative min-h-[220px] p-4 font-mono text-xs leading-relaxed">
        {TERMINAL_LINES.slice(0, visibleCount).map((line, i) => (
          <div
            key={i}
            className={cn(
              'mb-1.5',
              line.type === 'command' ? 'text-brand-gold-300' : 'text-slate-400',
            )}
          >
            {line.text}
          </div>
        ))}

        {currentLine && visibleCount < TERMINAL_LINES.length && (
          <div
            className={cn(
              'mb-1.5',
              currentLine.type === 'command' ? 'text-brand-gold-300' : 'text-slate-400',
            )}
          >
            {currentLine.text.slice(0, charIndex)}
            {isTyping && <span className="tech-cursor ml-px inline-block h-3.5 w-1.5 bg-brand-gold-400" />}
          </div>
        )}
      </div>
    </motion.div>
  );
}
