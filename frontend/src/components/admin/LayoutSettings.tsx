import { useState } from 'react';
import { SectionVisibilitySettings } from '@/components/admin/SectionVisibilitySettings';
import { SettingsTabBar } from '@/components/admin/SettingsTabBar';

type LayoutTab = 'home' | 'about' | 'backgrounds';

const TABS = [
  { id: 'home' as const, label: 'Homepage', hint: 'Show / hide sections' },
  { id: 'about' as const, label: 'About', hint: 'About page sections' },
  { id: 'backgrounds' as const, label: 'Backgrounds', hint: 'Navy section themes' },
];

export function LayoutSettings() {
  const [tab, setTab] = useState<LayoutTab>('home');

  return (
    <div className="space-y-4">
      <SettingsTabBar tabs={TABS} active={tab} onChange={setTab} />
      <SectionVisibilitySettings variant="compact" section={tab} />
    </div>
  );
}
