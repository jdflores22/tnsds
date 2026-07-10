import { useState } from 'react';
import {
  Building2,
  Eye,
  Home,
  Layers,
  Mail,
  ScrollText,
  Settings2,
} from 'lucide-react';
import { useSiteSettings } from '@/api/hooks';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { BrandingSettings } from '@/components/admin/BrandingSettings';
import { ContactSettings } from '@/components/admin/ContactSettings';
import { ContentSettings } from '@/components/admin/ContentSettings';
import { HeroAppearanceSettings } from '@/components/admin/HeroAppearanceSettings';
import { HeroCarouselSettings } from '@/components/admin/HeroCarouselSettings';
import { HeroHighlightsSettings } from '@/components/admin/HeroHighlightsSettings';
import { HomepageSectionsSettings } from '@/components/admin/HomepageSectionsSettings';
import { PageVisibilitySettings } from '@/components/admin/PageVisibilitySettings';
import { SectionVisibilitySettings } from '@/components/admin/SectionVisibilitySettings';
import { CustomSettingsTable } from '@/components/admin/CustomSettingsTable';

const TABS = [
  { id: 'branding', label: 'Branding', icon: Building2 },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'homepage', label: 'Homepage', icon: Home },
  { id: 'pages', label: 'Pages', icon: Eye },
  { id: 'layout', label: 'Layout', icon: Layers },
  { id: 'footer', label: 'Footer & legal', icon: ScrollText },
  { id: 'advanced', label: 'Advanced', icon: Settings2 },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function SettingsAdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('branding');
  const { data: items, isLoading } = useSiteSettings();

  return (
    <div>
      <AdminPageHeader
        title="Site settings"
        description="Manage branding, page content, section layout, and legal copy. Public settings appear on the live website."
        eyebrow="Configuration"
      />

      <AdminTabs tabs={TABS} active={activeTab} onChange={setActiveTab} className="mb-8" />

      <div className="min-h-[420px]">
        {activeTab === 'branding' && <BrandingSettings />}
        {activeTab === 'contact' && <ContactSettings />}
        {activeTab === 'homepage' && (
          <div className="space-y-8">
            <HeroCarouselSettings />
            <HeroHighlightsSettings />
            <HeroAppearanceSettings />
            <ContentSettings includeGroups={['home', 'home-intro']} />
            <HomepageSectionsSettings mode="home" />
          </div>
        )}
        {activeTab === 'pages' && (
          <div className="space-y-8">
            <PageVisibilitySettings />
            <ContentSettings includeGroups={['about', 'portfolio']} />
            <HomepageSectionsSettings mode="pages" />
          </div>
        )}
        {activeTab === 'layout' && <SectionVisibilitySettings />}
        {activeTab === 'footer' && (
          <ContentSettings includeGroups={['general', 'social', 'legal']} />
        )}
        {activeTab === 'advanced' && (
          <CustomSettingsTable items={items} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
