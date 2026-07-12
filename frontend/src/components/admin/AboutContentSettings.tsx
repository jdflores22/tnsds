import { useState } from 'react';
import { Layers } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSetting, useCreateSiteSetting } from '@/api/hooks';
import { ContentSettings } from '@/components/admin/ContentSettings';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { SaveFeedback } from '@/components/admin/SettingsPanel';
import {
  SectionThemeField,
  persistSectionTheme,
  type SectionTheme,
} from '@/components/admin/SectionThemeField';

const EXTRA_ABOUT_THEME_SECTIONS = [
  { id: 'about_stats', label: 'Stats showcase' },
  { id: 'about_why', label: 'What we do' },
  { id: 'about_process', label: 'Development process' },
  { id: 'about_industries', label: 'Sector expertise' },
] as const;

export function AboutContentSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSetting();
  const createMutation = useCreateSiteSetting();
  const [savedId, setSavedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const saveField = async (key: string, value: string, group: string) => {
    const existing = settings?.find((s) => s.key === key);
    if (existing) {
      await updateMutation.mutateAsync({ id: existing.id, data: { value, isPublic: true } });
    } else {
      await createMutation.mutateAsync({ key, value, group, isPublic: true });
    }
  };

  const saveExtraThemes = async (formData: FormData) => {
    setSavedId(null);
    setSavingId('about-extra-themes');
    try {
      await Promise.all(
        EXTRA_ABOUT_THEME_SECTIONS.map(({ id }) => {
          const theme = String(formData.get(`theme_${id}`) ?? 'light') as SectionTheme;
          return persistSectionTheme(saveField, id, theme);
        }),
      );
      setSavedId('about-extra-themes');
    } finally {
      setSavingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Edit the about page at <strong className="font-medium text-primary-800">/about</strong>.
        Mission, vision, story, and contact CTA include a{' '}
        <strong className="font-medium text-primary-800">Light / Navy blue</strong> theme in each
        block below. Section headings for stats, process, and industries are under{' '}
        <strong className="font-medium text-primary-800">Other pages</strong>.
      </p>

      <ContentSettings includeGroups={['about']} variant="compact" />

      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="flex items-start gap-2">
            <Layers className="mt-0.5 h-4 w-4 shrink-0 text-primary-700" />
            <div>
              <h3 className="text-sm font-semibold text-primary-900">More section themes</h3>
              <p className="text-xs text-slate-500">
                Background theme for stats, highlights, process, and industries on the about page.
              </p>
            </div>
          </div>
          <Button
            type="submit"
            form="about-extra-themes-form"
            isLoading={savingId === 'about-extra-themes'}
            size="sm"
          >
            Save themes
          </Button>
        </div>
        <div className="p-4">
          <form
            id="about-extra-themes-form"
            onSubmit={(e) => {
              e.preventDefault();
              void saveExtraThemes(new FormData(e.currentTarget));
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {EXTRA_ABOUT_THEME_SECTIONS.map(({ id, label }) => (
              <SectionThemeField
                key={id}
                sectionId={id}
                settings={settings}
                hint={`${label} section on /about`}
              />
            ))}
          </form>
          <SaveFeedback saved={savedId === 'about-extra-themes'} isSaving={isSaving} />
        </div>
      </section>
    </div>
  );
}
