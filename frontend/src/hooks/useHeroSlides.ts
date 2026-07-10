import {
  DEFAULT_HERO_SLIDES,
  parseHeroSlides,
  type HeroLayoutMode,
  type HeroSlide,
} from '@/constants/heroCarousel';
import { useSiteSettingsMap } from '@/hooks/useSiteSettingsMap';

export function useHeroLayoutMode(): HeroLayoutMode {
  const { get } = useSiteSettingsMap();
  const mode = get('hero_layout_mode', 'static');
  return mode === 'carousel' ? 'carousel' : 'static';
}

export function useHeroSlides(): HeroSlide[] {
  const { get } = useSiteSettingsMap();
  const raw = get('hero_carousel_slides', '');
  const parsed = parseHeroSlides(raw);
  return parsed.length > 0 ? parsed : DEFAULT_HERO_SLIDES;
}

export function useHeroCarouselOptions() {
  const { get } = useSiteSettingsMap();
  const intervalRaw = Number.parseInt(get('hero_carousel_interval', '7'), 10);
  const intervalMs = Number.isFinite(intervalRaw) ? Math.max(3, intervalRaw) * 1000 : 7000;
  const showPanel = get('hero_carousel_show_panel', 'true') !== 'false';
  const autoplay = get('hero_carousel_autoplay', 'true') !== 'false';

  return { intervalMs, showPanel, autoplay };
}
