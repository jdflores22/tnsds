import { useState } from 'react';
import { HomepageSectionsSettings } from '@/components/admin/HomepageSectionsSettings';
import { SettingsTabBar } from '@/components/admin/SettingsTabBar';

type HomeSectionsTab = 'sections' | 'cta';

const TABS = [
  { id: 'sections' as const, label: 'Section headings', hint: 'Eyebrow, title, subtitle' },
  { id: 'cta' as const, label: 'Bottom CTA', hint: 'Call-to-action banner' },
];

export function HomeSectionsSettings() {
  const [tab, setTab] = useState<HomeSectionsTab>('sections');

  return (
    <div className="space-y-4">
      <SettingsTabBar tabs={TABS} active={tab} onChange={setTab} />
      <HomepageSectionsSettings mode="home" variant="compact" compactTab={tab} />
    </div>
  );
}
