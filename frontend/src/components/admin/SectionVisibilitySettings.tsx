import { useState } from 'react';
import { Layers } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSetting, useCreateSiteSetting } from '@/api/hooks';
import {
  ABOUT_SECTION_TOGGLES,
  HOME_SECTION_TOGGLES,
  SECTION_DARK_BG_GROUPS,
  isSectionEnabledValue,
  sectionDarkBgKey,
  sectionEnabledKey,
} from '@/constants/sectionVisibility';
import { Spinner } from '@/components/ui/Spinner';
import { SettingsPanel } from '@/components/admin/SettingsPanel';
import { SectionToggleSwitch } from '@/components/admin/SectionToggleSwitch';
import { Badge } from '@/components/ui/Badge';
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

export function SectionVisibilitySettings() {
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

  const renderGroup = (
    title: string,
    description: string,
    items: typeof HOME_SECTION_TOGGLES | typeof ABOUT_SECTION_TOGGLES,
    group: string,
  ) => (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium text-primary-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {items.map((item) => {
          const enabled = getEnabled(settings, item.id);
          return (
            <div
              key={item.id}
              className={cn(
                'flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between',
                !enabled && 'bg-slate-50/80',
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-primary-900">{item.label}</span>
                  <Badge variant={enabled ? 'accent' : 'default'}>
                    {enabled ? 'Visible' : 'Hidden'}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">Content: {item.manageHint}</p>
              </div>
              <SectionToggleSwitch
                enabled={enabled}
                disabled={isSaving}
                label={item.label}
                onToggle={() => void toggleSection(item.id, !enabled, group)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <SettingsPanel
      icon={Layers}
      title="Section visibility"
      description="Show or hide sections and choose navy backgrounds across all public pages."
    >
      <div className="space-y-8">
        {renderGroup(
          'Homepage sections',
          'Toggle sections on the homepage without unpublishing the whole site.',
          HOME_SECTION_TOGGLES,
          'home',
        )}
        {renderGroup(
          'About page sections',
          'Toggle sections on the about page.',
          ABOUT_SECTION_TOGGLES,
          'about',
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-primary-900">Section backgrounds (all pages)</h3>
            <p className="mt-1 text-sm text-slate-500">
              Enable a navy background (like Our Development Process) for any section on the site.
            </p>
          </div>

          {SECTION_DARK_BG_GROUPS.map((group) => (
            <div key={group.page} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-700">
                {group.page}
              </h4>
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                {group.toggles.map((item) => {
                  const darkBg = getDarkBg(settings, item.id, item.defaultDark);
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between',
                        darkBg && 'bg-primary-950/5',
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-primary-900">{item.label}</span>
                          <Badge variant={darkBg ? 'accent' : 'default'}>
                            {darkBg ? 'Navy background' : 'Light background'}
                          </Badge>
                        </div>
                      </div>
                      <SectionToggleSwitch
                        enabled={darkBg}
                        disabled={isSaving}
                        label={`${item.label} dark background`}
                        onToggle={() => void toggleDarkBg(item.id, !darkBg)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      {savedId && (
        <p className="mt-4 text-xs font-medium text-emerald-600">Section settings updated.</p>
      )}
    </SettingsPanel>
  );
}
