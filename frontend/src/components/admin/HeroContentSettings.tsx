import { useState } from 'react';
import { ContentSettings } from '@/components/admin/ContentSettings';
import { SettingsTabBar } from '@/components/admin/SettingsTabBar';

type HeroContentTab = 'banner' | 'intro';

const TABS = [
  { id: 'banner' as const, label: 'Hero banner', hint: 'Headline & side panel' },
  { id: 'intro' as const, label: 'Intro banner', hint: 'What we do block' },
];

export function HeroContentSettings() {
  const [tab, setTab] = useState<HeroContentTab>('banner');

  return (
    <div className="space-y-4">
      <SettingsTabBar tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'banner' && <ContentSettings includeGroups={['home']} variant="compact" />}
      {tab === 'intro' && <ContentSettings includeGroups={['home-intro']} variant="compact" />}
    </div>
  );
}
