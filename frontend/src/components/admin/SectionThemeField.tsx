import {
  getSectionDarkBgDefault,
  isSectionEnabledValue,
  sectionDarkBgKey,
} from '@/constants/sectionVisibility';
import type { SiteSetting } from '@/types';

const SELECT_CLASS =
  'h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-primary-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20';

export type SectionTheme = 'light' | 'navy';

export function getSectionThemeFromSettings(
  settings: SiteSetting[] | undefined,
  sectionId: string,
): SectionTheme {
  const stored = settings?.find((s) => s.key === sectionDarkBgKey(sectionId))?.value;
  const dark = isSectionEnabledValue(stored, getSectionDarkBgDefault(sectionId));
  return dark ? 'navy' : 'light';
}

export function sectionThemeToDarkBg(theme: SectionTheme): string {
  return theme === 'navy' ? 'true' : 'false';
}

interface SectionThemeFieldProps {
  sectionId: string;
  settings: SiteSetting[] | undefined;
  name?: string;
  className?: string;
  hint?: string;
}

export function SectionThemeField({
  sectionId,
  settings,
  name,
  className,
  hint = 'Section background on the live site.',
}: SectionThemeFieldProps) {
  const theme = getSectionThemeFromSettings(settings, sectionId);
  const fieldName = name ?? `theme_${sectionId}`;

  return (
    <div className={className}>
      <label htmlFor={`${sectionId}-${fieldName}`} className="text-sm font-medium text-slate-700">
        Background theme
      </label>
      <select
        id={`${sectionId}-${fieldName}`}
        name={fieldName}
        defaultValue={theme}
        className={`${SELECT_CLASS} mt-1.5`}
      >
        <option value="light">Light</option>
        <option value="navy">Navy blue</option>
      </select>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

export async function persistSectionTheme(
  saveField: (key: string, value: string, group: string) => Promise<void>,
  sectionId: string,
  theme: SectionTheme,
) {
  await saveField(sectionDarkBgKey(sectionId), sectionThemeToDarkBg(theme), 'sections');
  if (sectionId === 'products_featured') {
    await saveField(
      'products_featured_theme_preset',
      theme === 'navy' ? 'navy' : 'light',
      'products',
    );
  }
}

export const ABOUT_THEME_SECTION_IDS = [
  'about_hero',
  'about_mission',
  'about_vision',
  'about_story',
  'about_stats',
  'about_why',
  'about_process',
  'about_industries',
  'about_products_promo',
  'about_cta',
] as const;

export async function persistAboutThemesFromForm(
  saveField: (key: string, value: string, group: string) => Promise<void>,
  formData: FormData,
) {
  await Promise.all(
    ABOUT_THEME_SECTION_IDS.map(async (sectionId) => {
      const theme = String(formData.get(`theme_${sectionId}`) ?? '');
      if (theme === 'light' || theme === 'navy') {
        await persistSectionTheme(saveField, sectionId, theme);
      }
    }),
  );
}
