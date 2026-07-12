import { useState } from 'react';
import { useSiteSettings, useUpdateSiteSetting, useCreateSiteSetting } from '@/api/hooks';
import {
  ABOUT_SECTION_TOGGLES,
  HOME_SECTION_TOGGLES,
  PRODUCTS_SECTION_TOGGLES,
  CONTACT_SECTION_TOGGLES,
  SECTION_DARK_BG_GROUPS,
  isSectionEnabledValue,
  sectionDarkBgKey,
  sectionEnabledKey,
} from '@/constants/sectionVisibility';
import { Spinner } from '@/components/ui/Spinner';
import { SettingsPanel } from '@/components/admin/SettingsPanel';
import { SectionToggleSwitch } from '@/components/admin/SectionToggleSwitch';
import { Layers } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SiteSetting } from '@/types';

function getEnabled(settings: SiteSetting[] | undefined, sectionId: string): boolean {
  return isSectionEnabledValue(settings?.find((s) => s.key === sectionEnabledKey(sectionId))?.value);
}

function getDarkBg(
  settings: SiteSetting[] | undefined,
  sectionId: string,
  defaultDark: boolean,
): boolean {
  const value = settings?.find((s) => s.key === sectionDarkBgKey(sectionId))?.value;
  return isSectionEnabledValue(value, defaultDark);
}

type LayoutSection = 'home' | 'about' | 'products' | 'contact' | 'backgrounds' | 'all';

interface SectionVisibilitySettingsProps {
  variant?: 'panel' | 'compact';
  section?: LayoutSection;
}

export function SectionVisibilitySettings({
  variant = 'panel',
  section = 'all',
}: SectionVisibilitySettingsProps) {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSetting();
  const createMutation = useCreateSiteSetting();
  const [savedId, setSavedId] = useState<string | null>(null);

  const saveSetting = async (key: string, value: string, group: string) => {
    const existing = settings?.find((s) => s.key === key);
    if (existing) {
      await updateMutation.mutateAsync({ id: existing.id, data: { value, isPublic: true } });
    } else {
      await createMutation.mutateAsync({ key, value, group, isPublic: true });
    }
  };

  const toggleSection = async (sectionId: string, enabled: boolean, group: string) => {
    setSavedId(null);
    await saveSetting(sectionEnabledKey(sectionId), enabled ? 'true' : 'false', group);
    setSavedId(`${sectionId}-visible`);
  };

  const toggleDarkBg = async (sectionId: string, enabled: boolean) => {
    setSavedId(null);
    await saveSetting(sectionDarkBgKey(sectionId), enabled ? 'true' : 'false', 'sections');
    if (sectionId === 'home_featured_product' || sectionId === 'products_featured') {
      await saveSetting(
        sectionId === 'products_featured'
          ? 'products_featured_theme_preset'
          : 'home_featured_product_theme_preset',
        enabled ? 'navy' : 'light',
        sectionId === 'products_featured' ? 'products' : 'home',
      );
    }
    setSavedId(`${sectionId}-dark`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const isSaving = updateMutation.isPending || createMutation.isPending;

  const renderVisibilityRow = (
    label: string,
    hint: string | undefined,
    enabled: boolean,
    onToggle: () => void,
    muted?: boolean,
  ) => (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-2',
        muted && 'bg-slate-50/80',
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-primary-900">{label}</p>
        {hint && <p className="truncate text-xs text-slate-500">{hint}</p>}
      </div>
      <SectionToggleSwitch
        enabled={enabled}
        disabled={isSaving}
        label={label}
        size="sm"
        onToggle={onToggle}
      />
    </div>
  );

  const renderVisibilityList = (
    items:
      | typeof HOME_SECTION_TOGGLES
      | typeof ABOUT_SECTION_TOGGLES
      | typeof PRODUCTS_SECTION_TOGGLES
      | typeof CONTACT_SECTION_TOGGLES,
    group: string,
  ) => (
    <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
      {items.map((item) => {
        const enabled = getEnabled(settings, item.id);
        return (
          <div key={item.id}>
            {renderVisibilityRow(
              item.label,
              item.manageHint,
              enabled,
              () => void toggleSection(item.id, !enabled, group),
              !enabled,
            )}
          </div>
        );
      })}
    </div>
  );

  const renderBackgrounds = () => (
    <div className="space-y-4">
      {SECTION_DARK_BG_GROUPS.map((group) => (
        <div key={group.page}>
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {group.page}
          </p>
          <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
            {group.toggles.map((item) => {
              const darkBg = getDarkBg(settings, item.id, item.defaultDark);
              return (
                <div key={item.id}>
                  {renderVisibilityRow(
                    item.label,
                    darkBg ? 'Navy background' : 'Light background',
                    darkBg,
                    () => void toggleDarkBg(item.id, !darkBg),
                    darkBg,
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const compactBody = (
    <>
      {(section === 'home' || section === 'all') && renderVisibilityList(HOME_SECTION_TOGGLES, 'home')}
      {(section === 'about' || section === 'all') && renderVisibilityList(ABOUT_SECTION_TOGGLES, 'about')}
      {(section === 'products' || section === 'all') &&
        renderVisibilityList(PRODUCTS_SECTION_TOGGLES, 'products')}
      {(section === 'contact' || section === 'all') &&
        renderVisibilityList(CONTACT_SECTION_TOGGLES, 'contact')}
      {(section === 'backgrounds' || section === 'all') && renderBackgrounds()}
      {savedId && (
        <p className="mt-3 text-xs font-medium text-emerald-600">Updated.</p>
      )}
    </>
  );

  if (variant === 'compact') {
    return compactBody;
  }

  return (
    <SettingsPanel
      icon={Layers}
      title="Section visibility"
      description="Show or hide sections and choose navy backgrounds across all public pages."
    >
      <div className="space-y-8">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-primary-900">Homepage sections</h3>
            <p className="mt-1 text-sm text-slate-500">
              Toggle sections on the homepage without unpublishing the whole site.
            </p>
          </div>
          {renderVisibilityList(HOME_SECTION_TOGGLES, 'home')}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-primary-900">About page sections</h3>
            <p className="mt-1 text-sm text-slate-500">Toggle sections on the about page.</p>
          </div>
          {renderVisibilityList(ABOUT_SECTION_TOGGLES, 'about')}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-primary-900">Products page sections</h3>
            <p className="mt-1 text-sm text-slate-500">Toggle sections on the products page.</p>
          </div>
          {renderVisibilityList(PRODUCTS_SECTION_TOGGLES, 'products')}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-primary-900">Contact page sections</h3>
            <p className="mt-1 text-sm text-slate-500">Toggle sections on the contact page.</p>
          </div>
          {renderVisibilityList(CONTACT_SECTION_TOGGLES, 'contact')}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-primary-900">Section backgrounds</h3>
            <p className="mt-1 text-sm text-slate-500">
              Enable a navy background for any section on the site.
            </p>
          </div>
          {renderBackgrounds()}
        </div>
      </div>
      {savedId && (
        <p className="mt-4 text-xs font-medium text-emerald-600">Section settings updated.</p>
      )}
    </SettingsPanel>
  );
}
