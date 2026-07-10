import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useHeroAppearance } from '@/hooks/useHeroAppearance';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { cn } from '@/utils/cn';

export function HeroPromoPanel({
  className,
  isDark = false,
}: {
  className?: string;
  isDark?: boolean;
}) {
  const { get } = useSiteSettingsMap();
  const { colors } = useHeroAppearance();

  const eyebrow = get('hero_panel_eyebrow', 'Software solutions');
  const title = get(
    'hero_panel_title',
    'Want software built for how your business actually works?',
  );
  const body = get(
    'hero_panel_body',
    'TRANS-NET is a software development company. We design and build custom applications that streamline operations, connect your teams, and support growth — from enterprise systems to web and mobile products.',
  );
  const pointsRaw = get(
    'hero_panel_points',
    'Custom enterprise software,Web & mobile applications,System integration & APIs,Ongoing support & maintenance',
  );
  const points = pointsRaw.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className={cn(
        'rounded-2xl border p-6 shadow-lg backdrop-blur-sm sm:p-7',
        isDark ? 'shadow-black/20' : 'shadow-primary-900/5',
        className,
      )}
      style={{
        backgroundColor: colors.panelBg,
        borderColor: colors.panelBorder,
      }}
    >
      <p
        className="mb-4 text-xs font-semibold uppercase tracking-[0.16em]"
        style={{ color: colors.eyebrow }}
      >
        {eyebrow}
      </p>
      <h2
        className="text-xl font-semibold leading-snug tracking-tight sm:text-2xl"
        style={{ color: colors.title }}
      >
        {title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed" style={{ color: colors.body }}>
        {body}
      </p>

      {points.length > 0 && (
        <ul className="mt-5 space-y-2.5">
          {points.map((point, index) => (
            <li key={point} className="flex items-start gap-2.5 text-sm" style={{ color: colors.body }}>
              <CheckCircle2
                className={cn(
                  'mt-0.5 h-4 w-4 shrink-0',
                  index % 2 === 0 ? 'text-brand-gold-500' : isDark ? 'text-brand-gold-400' : 'text-primary-600',
                )}
                strokeWidth={1.5}
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}

      <Link to="/contact" className="mt-7 block">
        <Button className="w-full" variant={isDark ? 'secondary' : 'primary'}>
          Start your project
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </motion.aside>
  );
}
