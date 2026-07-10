import { useEffect, useState } from 'react';
import { LayoutGrid, Plus, Trash2 } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSetting, useCreateSiteSetting } from '@/api/hooks';
import {
  DEFAULT_HERO_HIGHLIGHTS,
  emptyHeroHighlight,
  parseHeroHighlights,
  serializeHeroHighlights,
  type HeroHighlightCard,
} from '@/constants/heroHighlights';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Spinner } from '@/components/ui/Spinner';
import { CompactSettingsSection } from '@/components/admin/SettingsTabBar';
import { SaveFeedback, SettingsPanel } from '@/components/admin/SettingsPanel';
import type { SiteSetting } from '@/types';

function getValue(settings: SiteSetting[] | undefined, key: string) {
  return settings?.find((s) => s.key === key)?.value ?? '';
}

const MAX_CARDS = 3;

export function HeroHighlightsSettings({ variant = 'panel' }: { variant?: 'panel' | 'compact' }) {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSetting();
  const createMutation = useCreateSiteSetting();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [cards, setCards] = useState<HeroHighlightCard[]>(DEFAULT_HERO_HIGHLIGHTS);

  useEffect(() => {
    if (!settings) return;

    const sectionEnabled = getValue(settings, 'hero_highlights_enabled') !== 'false';
    const raw = getValue(settings, 'hero_highlights');
    const parsed = parseHeroHighlights(raw);

    setEnabled(sectionEnabled);

    if (!sectionEnabled && raw === '[]') {
      setCards([]);
      return;
    }

    if (parsed.length > 0) {
      setCards(parsed);
      return;
    }

    if (raw === '[]') {
      setCards([]);
      return;
    }

    setCards(sectionEnabled ? DEFAULT_HERO_HIGHLIGHTS : []);
  }, [settings]);

  const saveField = async (key: string, value: string) => {
    const existing = settings?.find((s) => s.key === key);
    if (existing) {
      await updateMutation.mutateAsync({ id: existing.id, data: { value, isPublic: true } });
    } else {
      await createMutation.mutateAsync({ key, value, group: 'home', isPublic: true });
    }
  };

  const updateCard = (index: number, patch: Partial<HeroHighlightCard>) => {
    setCards((prev) => prev.map((card, i) => (i === index ? { ...card, ...patch } : card)));
  };

  const addCard = () => {
    if (cards.length >= MAX_CARDS) return;
    setEnabled(true);
    setCards((prev) => [...prev, emptyHeroHighlight()]);
  };

  const removeCard = (index: number) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAllCards = () => {
    setEnabled(false);
    setCards([]);
  };

  const restoreDefaults = () => {
    setEnabled(true);
    setCards(DEFAULT_HERO_HIGHLIGHTS);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setSaving(true);
    try {
      const validCards = cards.filter((c) => c.title.trim() && c.body.trim());
      await saveField('hero_highlights_enabled', enabled && validCards.length > 0 ? 'true' : 'false');
      await saveField('hero_highlights', serializeHeroHighlights(validCards));
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
  const sectionHidden = !enabled || cards.length === 0;

  const form = (
    <form id="hero-highlights-form" onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={enabled && cards.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setEnabled(true);
                  if (cards.length === 0) setCards([emptyHeroHighlight()]);
                } else {
                  removeAllCards();
                }
              }}
              className="rounded border-slate-300"
            />
            Show highlight cards on homepage
          </label>
          <div className="flex flex-wrap gap-2">
            {cards.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeAllCards}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Remove all
              </Button>
            )}
            <Button type="button" variant="outline" size="sm" onClick={restoreDefaults}>
              Restore defaults
            </Button>
          </div>
        </div>

        {sectionHidden ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
            Highlight cards are hidden. Click <strong>Restore defaults</strong> or{' '}
            <strong>Add card</strong> to show them again.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">Up to {MAX_CARDS} cards appear in a row on desktop.</p>
              {cards.length < MAX_CARDS && (
                <Button type="button" variant="outline" size="sm" onClick={addCard}>
                  <Plus className="h-4 w-4" />
                  Add card
                </Button>
              )}
            </div>

            {cards.map((card, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-primary-900">Card {index + 1}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCard(index)}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Title"
                    value={card.title}
                    onChange={(e) => updateCard(index, { title: e.target.value })}
                  />
                  <Input
                    label="Link URL"
                    value={card.href}
                    onChange={(e) => updateCard(index, { href: e.target.value })}
                    placeholder="/services"
                  />
                  <div className="md:col-span-2">
                    <Textarea
                      label="Description"
                      rows={3}
                      value={card.body}
                      onChange={(e) => updateCard(index, { body: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Link label"
                    value={card.linkLabel}
                    onChange={(e) => updateCard(index, { linkLabel: e.target.value })}
                    placeholder="Learn more"
                  />
                </div>
              </div>
            ))}
          </>
        )}

        {sectionHidden && cards.length < MAX_CARDS && (
          <Button type="button" variant="outline" size="sm" onClick={addCard}>
            <Plus className="h-4 w-4" />
            Add card
          </Button>
        )}
      </form>
  );

  if (variant === 'compact') {
    return (
      <CompactSettingsSection
        title="Highlight cards"
        description="Optional cards below the hero. Remove all to hide on the homepage."
        formId="hero-highlights-form"
        isSaving={isSaving}
        saved={saved}
      >
        {form}
      </CompactSettingsSection>
    );
  }

  return (
    <SettingsPanel
      icon={LayoutGrid}
      title="Hero highlight cards"
      description="Optional cards below the hero. Remove all to hide this section on the homepage."
      footer={
        <>
          <Button type="submit" form="hero-highlights-form" isLoading={isSaving} size="sm">
            Save highlight cards
          </Button>
          <SaveFeedback saved={saved} isSaving={isSaving} />
        </>
      }
    >
      {form}
    </SettingsPanel>
  );
}
