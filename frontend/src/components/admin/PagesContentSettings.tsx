import { useState } from 'react';
import { ContentSettings } from '@/components/admin/ContentSettings';
import { HomepageSectionsSettings } from '@/components/admin/HomepageSectionsSettings';
import { cn } from '@/utils/cn';
type PageTab = 'about' | 'portfolio' | 'headings';

const TABS: { id: PageTab; label: string; hint: string }[] = [
  { id: 'about', label: 'About', hint: 'Hero, story, mission & vision' },
  { id: 'portfolio', label: 'Portfolio', hint: 'Page intro & hero image' },
  { id: 'headings', label: 'Page headings', hint: 'Titles on inner pages' },
];

export function PagesContentSettings() {
  const [tab, setTab] = useState<PageTab>('about');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-white p-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              'rounded-md px-3 py-2 text-left transition-colors sm:min-w-[7rem]',
              tab === item.id
                ? 'bg-primary-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-primary-900',
            )}
          >
            <span className="block text-sm font-medium">{item.label}</span>
            <span
              className={cn(
                'mt-0.5 hidden text-[11px] sm:block',
                tab === item.id ? 'text-white/70' : 'text-slate-400',
              )}
            >
              {item.hint}
            </span>
          </button>
        ))}
      </div>

      {tab === 'about' && (
        <ContentSettings includeGroups={['about']} variant="compact" />
      )}
      {tab === 'portfolio' && (
        <ContentSettings includeGroups={['portfolio']} variant="compact" />
      )}
      {tab === 'headings' && (
        <HomepageSectionsSettings mode="pages" variant="compact" />
      )}
    </div>
  );
}
