import { useState } from 'react';
import { ContentSettings } from '@/components/admin/ContentSettings';
import { SettingsTabBar } from '@/components/admin/SettingsTabBar';

type FooterTab = 'footer' | 'social' | 'legal';

const TABS = [
  { id: 'footer' as const, label: 'Footer', hint: 'Tagline text' },
  { id: 'social' as const, label: 'Social & tracking', hint: 'Links, WhatsApp, GA4' },
  { id: 'legal' as const, label: 'Legal pages', hint: 'Privacy & terms' },
];

export function FooterSettings() {
  const [tab, setTab] = useState<FooterTab>('footer');

  return (
    <div className="space-y-4">
      <SettingsTabBar tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'footer' && <ContentSettings includeGroups={['general']} variant="compact" />}
      {tab === 'social' && <ContentSettings includeGroups={['social']} variant="compact" />}
      {tab === 'legal' && <ContentSettings includeGroups={['legal']} variant="compact" />}
    </div>
  );
}
