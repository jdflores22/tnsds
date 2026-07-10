import { useState } from 'react';
import { HeroAppearanceSettings } from '@/components/admin/HeroAppearanceSettings';
import { HeroCarouselSettings } from '@/components/admin/HeroCarouselSettings';
import { HeroHighlightsSettings } from '@/components/admin/HeroHighlightsSettings';
import { SettingsTabBar } from '@/components/admin/SettingsTabBar';

type HeroTab = 'layout' | 'highlights' | 'appearance';

const TABS = [
  { id: 'layout' as const, label: 'Layout', hint: 'Static or carousel' },
  { id: 'highlights' as const, label: 'Highlights', hint: 'Cards below hero' },
  { id: 'appearance' as const, label: 'Appearance', hint: 'Colors & overlay' },
];

export function HeroBannerSettings() {
  const [tab, setTab] = useState<HeroTab>('layout');

  return (
    <div className="space-y-4">
      <SettingsTabBar tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'layout' && <HeroCarouselSettings variant="compact" />}
      {tab === 'highlights' && <HeroHighlightsSettings variant="compact" />}
      {tab === 'appearance' && <HeroAppearanceSettings variant="compact" />}
    </div>
  );
}
