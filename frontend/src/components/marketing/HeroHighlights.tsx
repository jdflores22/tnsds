import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DEFAULT_HERO_HIGHLIGHTS, parseHeroHighlights } from '@/constants/heroHighlights';
import { useHeroAppearance } from '@/hooks/useHeroAppearance';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import { cn } from '@/utils/cn';

function heroHighlightsEnabled(get: (key: string, fallback?: string) => string): boolean {
  return get('hero_highlights_enabled', 'true') !== 'false';
}

export function HeroHighlights() {
  const { get } = useSiteSettingsMap();
  const { colors, isDark } = useHeroAppearance();

  if (!heroHighlightsEnabled(get)) return null;

  const raw = get('hero_highlights', '');
  const parsed = parseHeroHighlights(raw);
  const hasStoredValue = raw.trim().length > 0;
  const items =
    parsed.length > 0
      ? parsed
      : hasStoredValue
        ? []
        : DEFAULT_HERO_HIGHLIGHTS;

  if (items.length === 0) return null;

  return (
    <div
      className="border-t"
      style={{ borderColor: colors.highlightsBorder, backgroundColor: colors.highlightsBg }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {items.map((item) => (
            <article
              key={item.title}
              className={cn(
                'group flex flex-col rounded-xl border p-6 transition-shadow sm:p-8',
                isDark
                  ? 'border-white/12 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]'
                  : 'border-slate-200/90 bg-white shadow-sm hover:border-slate-300 hover:shadow-md',
              )}
            >
              <h2
                className="text-xl font-semibold tracking-tight sm:text-2xl"
                style={{ color: colors.highlightsTitle }}
              >
                {item.title}
              </h2>
              <p
                className="mt-4 flex-1 text-base leading-relaxed"
                style={{ color: colors.highlightsBody }}
              >
                {item.body}
              </p>
              <Link
                to={item.href}
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                style={{ color: colors.link }}
              >
                {item.linkLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
