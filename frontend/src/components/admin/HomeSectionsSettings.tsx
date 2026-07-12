import { useState } from 'react';
import { HomepageSectionsSettings } from '@/components/admin/HomepageSectionsSettings';
import { FeaturedProductAppearanceSettings } from '@/components/admin/FeaturedProductAppearanceSettings';
import { SettingsTabBar } from '@/components/admin/SettingsTabBar';

type HomeSectionsTab = 'sections' | 'featured' | 'cta';

const TABS = [
  { id: 'sections' as const, label: 'Section headings', hint: 'Eyebrow, title, subtitle' },
  { id: 'featured' as const, label: 'Featured product', hint: 'Colors & appearance' },
  { id: 'cta' as const, label: 'Bottom CTA', hint: 'Call-to-action banner' },
];

export function HomeSectionsSettings() {
  const [tab, setTab] = useState<HomeSectionsTab>('sections');

  return (
    <div className="space-y-4">
      <SettingsTabBar tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'featured' ? (
        <FeaturedProductAppearanceSettings variant="compact" />
      ) : (
        <HomepageSectionsSettings mode="home" variant="compact" compactTab={tab} />
      )}
    </div>
  );
}
