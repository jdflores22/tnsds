import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';
import {
  isSectionEnabledValue,
  sectionEnabledKey,
  sectionDarkBgKey,
  ALL_SECTION_DARK_BG_TOGGLES,
  getSectionDarkBgDefault,
  SECTION_DARK_BG_GROUPS,
} from '@/constants/sectionVisibility';
import type { AboutSectionToggleId, HomeSectionToggleId, SectionDarkBgToggleId } from '@/constants/sectionVisibility';
import { ABOUT_SECTION_TOGGLES, HOME_SECTION_TOGGLES } from '@/constants/sectionVisibility';

export interface SectionContentDefaults {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export function useSectionContent(prefix: string, defaults: SectionContentDefaults = {}) {
  const { get } = useSiteSettingsMap();

  const eyebrow = get(`${prefix}_eyebrow`, defaults.eyebrow ?? '');
  const title = get(`${prefix}_title`, defaults.title ?? '');
  const subtitle = get(`${prefix}_subtitle`, defaults.subtitle ?? '');

  return {
    eyebrow: eyebrow || defaults.eyebrow,
    title: title || defaults.title || '',
    subtitle: subtitle || defaults.subtitle,
  };
}

export function usePageHeroContent(prefix: string, defaults: { title?: string; subtitle?: string } = {}) {
  const { get } = useSiteSettingsMap();

  return {
    title: get(`${prefix}_title`, defaults.title ?? ''),
    subtitle: get(`${prefix}_subtitle`, defaults.subtitle ?? ''),
  };
}

export function useCtaContent(defaults: {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
} = {}) {
  const { get } = useSiteSettingsMap();

  return {
    title: get('home_cta_title', defaults.title ?? 'Ready to build your next software solution?'),
    subtitle: get('home_cta_subtitle', defaults.subtitle ?? ''),
    primaryLabel: get('home_cta_primary_label', defaults.primaryLabel ?? 'Get Started'),
    secondaryLabel: get('home_cta_secondary_label', defaults.secondaryLabel ?? 'Explore Services'),
  };
}

export function useSectionEnabled(sectionId: string, defaultEnabled = true): boolean {
  const { get } = useSiteSettingsMap();
  return isSectionEnabledValue(get(sectionEnabledKey(sectionId)), defaultEnabled);
}

export function useHomeSectionsVisibility(): Record<HomeSectionToggleId, boolean> {
  const { get } = useSiteSettingsMap();
  const enabled = (id: HomeSectionToggleId) =>
    isSectionEnabledValue(get(sectionEnabledKey(id)));

  return {
    home_intro: enabled('home_intro'),
    home_services: enabled('home_services'),
    home_stats: enabled('home_stats'),
    home_clients: enabled('home_clients'),
    home_technologies: enabled('home_technologies'),
    home_products: enabled('home_products'),
    home_industries: enabled('home_industries'),
    home_why: enabled('home_why'),
    home_process: enabled('home_process'),
    home_portfolio: enabled('home_portfolio'),
    home_testimonials: enabled('home_testimonials'),
    home_faq: enabled('home_faq'),
    home_blog: enabled('home_blog'),
    home_cta: enabled('home_cta'),
  };
}

export function useAboutSectionsVisibility(): Record<AboutSectionToggleId, boolean> {
  const { get } = useSiteSettingsMap();
  const enabled = (id: AboutSectionToggleId) =>
    isSectionEnabledValue(get(sectionEnabledKey(id)));

  return {
    about_stats_bar: enabled('about_stats_bar'),
    about_stats: enabled('about_stats'),
    about_why: enabled('about_why'),
    about_process: enabled('about_process'),
    about_industries: enabled('about_industries'),
    about_cta: enabled('about_cta'),
  };
}

export function useSectionDarkBackground(sectionId: string, defaultDark?: boolean): boolean {
  const { get } = useSiteSettingsMap();
  const fallback = defaultDark ?? getSectionDarkBgDefault(sectionId);
  return isSectionEnabledValue(get(sectionDarkBgKey(sectionId)), fallback);
}

export function useSectionsDarkBackground(): Record<string, boolean> {
  const { get } = useSiteSettingsMap();
  return Object.fromEntries(
    ALL_SECTION_DARK_BG_TOGGLES.map((item) => [
      item.id,
      isSectionEnabledValue(get(sectionDarkBgKey(item.id)), item.defaultDark),
    ]),
  );
}

/** @deprecated Use useSectionDarkBackground */
export function useAboutSectionDarkBackground(
  sectionId: SectionDarkBgToggleId,
  defaultDark?: boolean,
): boolean {
  return useSectionDarkBackground(sectionId, defaultDark);
}

/** @deprecated Use useSectionsDarkBackground */
export function useAboutSectionsDarkBackground(): Record<SectionDarkBgToggleId, boolean> {
  return useSectionsDarkBackground() as Record<SectionDarkBgToggleId, boolean>;
}

export function usePageSectionTheme(sectionId: string, defaultDark?: boolean): 'light' | 'dark' {
  return useSectionDarkBackground(sectionId, defaultDark) ? 'dark' : 'light';
}

export { HOME_SECTION_TOGGLES, ABOUT_SECTION_TOGGLES, SECTION_DARK_BG_GROUPS, ALL_SECTION_DARK_BG_TOGGLES };
