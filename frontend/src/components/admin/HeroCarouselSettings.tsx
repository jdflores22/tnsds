import { useEffect, useState } from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSetting, useCreateSiteSetting } from '@/api/hooks';
import {
  DEFAULT_HERO_SLIDES,
  emptyHeroSlide,
  parseHeroSlides,
  serializeHeroSlides,
  type HeroLayoutMode,
  type HeroSlide,
} from '@/constants/heroCarousel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Spinner } from '@/components/ui/Spinner';
import { SaveFeedback, SettingsPanel } from '@/components/admin/SettingsPanel';
import { SettingsImageField } from '@/components/admin/SettingsImageField';
import type { SiteSetting } from '@/types';

function getValue(settings: SiteSetting[] | undefined, key: string) {
  return settings?.find((s) => s.key === key)?.value ?? '';
}

export function HeroCarouselSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSetting();
  const createMutation = useCreateSiteSetting();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [layoutMode, setLayoutMode] = useState<HeroLayoutMode>('static');
  const [interval, setInterval] = useState('7');
  const [autoplay, setAutoplay] = useState(true);
  const [showPanel, setShowPanel] = useState(true);
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);

  useEffect(() => {
    if (!settings) return;
    const mode = getValue(settings, 'hero_layout_mode');
    setLayoutMode(mode === 'carousel' ? 'carousel' : 'static');
    setInterval(getValue(settings, 'hero_carousel_interval') || '7');
    setAutoplay(getValue(settings, 'hero_carousel_autoplay') !== 'false');
    setShowPanel(getValue(settings, 'hero_carousel_show_panel') !== 'false');
    const parsed = parseHeroSlides(getValue(settings, 'hero_carousel_slides'));
    setSlides(parsed.length > 0 ? parsed : DEFAULT_HERO_SLIDES);
  }, [settings]);

  const saveField = async (key: string, value: string, group: string) => {
    const existing = settings?.find((s) => s.key === key);
    if (existing) {
      await updateMutation.mutateAsync({ id: existing.id, data: { value, isPublic: true } });
    } else {
      await createMutation.mutateAsync({ key, value, group, isPublic: true });
    }
  };

  const updateSlide = (index: number, patch: Partial<HeroSlide>) => {
    setSlides((prev) => prev.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)));
  };

  const addSlide = () => {
    setSlides((prev) => [...prev, emptyHeroSlide()]);
  };

  const removeSlide = (index: number) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const loadDefaults = () => {
    setSlides(DEFAULT_HERO_SLIDES);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setSaving(true);
    try {
      await saveField('hero_layout_mode', layoutMode, 'home');
      await saveField('hero_carousel_interval', interval, 'home');
      await saveField('hero_carousel_autoplay', autoplay ? 'true' : 'false', 'home');
      await saveField('hero_carousel_show_panel', showPanel ? 'true' : 'false', 'home');
      await saveField('hero_carousel_slides', serializeHeroSlides(slides), 'home');
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const isSaving = saving || createMutation.isPending || updateMutation.isPending;

  return (
    <SettingsPanel
      icon={Layers}
      title="Hero layout & carousel"
      description="Use a single static hero or rotate multiple highlight messages in the homepage header."
      footer={
        <>
          <Button type="submit" form="hero-carousel-form" isLoading={isSaving} size="sm">
            Save hero layout
          </Button>
          <SaveFeedback saved={saved} isSaving={isSaving} />
        </>
      }
    >
      <form id="hero-carousel-form" onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        <div className="space-y-1.5">
          <label htmlFor="hero_layout_mode" className="text-sm font-medium text-slate-700">
            Hero layout
          </label>
          <select
            id="hero_layout_mode"
            value={layoutMode}
            onChange={(e) => setLayoutMode(e.target.value as HeroLayoutMode)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-primary-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="static">Static — one headline (Hero banner fields below)</option>
            <option value="carousel">Carousel — rotate highlight slides</option>
          </select>
        </div>

        {layoutMode === 'carousel' && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Autoplay interval (seconds)"
                type="number"
                min={3}
                max={60}
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
              />
              <label className="flex items-center gap-2 self-end rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                  className="rounded border-slate-300"
                />
                Autoplay slides
              </label>
              <label className="flex items-center gap-2 self-end rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={showPanel}
                  onChange={(e) => setShowPanel(e.target.checked)}
                  className="rounded border-slate-300"
                />
                Show side panel
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-primary-900">Carousel slides</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={loadDefaults}>
                  Reset sample slides
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={addSlide}>
                  <Plus className="h-4 w-4" />
                  Add slide
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-primary-900">
                      Slide {index + 1}
                    </p>
                    {slides.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSlide(index)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Eyebrow"
                      value={slide.eyebrow}
                      onChange={(e) => updateSlide(index, { eyebrow: e.target.value })}
                    />
                    <SettingsImageField
                      label="Slide background image (optional)"
                      value={slide.backgroundImage}
                      onChange={(url) => updateSlide(index, { backgroundImage: url })}
                      folder="pages"
                      hint="Overrides the default hero image for this slide only."
                    />
                    <Input
                      label="Title line 1"
                      value={slide.titleLine1}
                      onChange={(e) => updateSlide(index, { titleLine1: e.target.value })}
                    />
                    <Input
                      label="Title highlight"
                      value={slide.titleHighlight}
                      onChange={(e) => updateSlide(index, { titleHighlight: e.target.value })}
                    />
                    <div className="md:col-span-2">
                      <Textarea
                        label="Description"
                        rows={3}
                        value={slide.description}
                        onChange={(e) => updateSlide(index, { description: e.target.value })}
                      />
                    </div>
                    <Input
                      label="Primary button label"
                      value={slide.ctaLabel}
                      onChange={(e) => updateSlide(index, { ctaLabel: e.target.value })}
                    />
                    <Input
                      label="Primary button link"
                      value={slide.ctaHref}
                      onChange={(e) => updateSlide(index, { ctaHref: e.target.value })}
                      placeholder="/services"
                    />
                    <Input
                      label="Secondary button label"
                      value={slide.secondaryCtaLabel}
                      onChange={(e) => updateSlide(index, { secondaryCtaLabel: e.target.value })}
                    />
                    <Input
                      label="Secondary button link"
                      value={slide.secondaryCtaHref}
                      onChange={(e) => updateSlide(index, { secondaryCtaHref: e.target.value })}
                      placeholder="/contact"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {layoutMode === 'static' && (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Static mode uses the <strong>Hero banner</strong> fields below (headline, description,
            side panel). Switch to carousel to highlight multiple messages with rotation.
          </p>
        )}
      </form>
    </SettingsPanel>
  );
}
