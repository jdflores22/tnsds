import { useState } from 'react';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSetting, useCreateSiteSetting } from '@/api/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Spinner } from '@/components/ui/Spinner';
import { SaveFeedback } from '@/components/admin/SettingsPanel';
import { SectionToggleSwitch } from '@/components/admin/SectionToggleSwitch';
import {
  SectionThemeField,
  persistSectionTheme,
  type SectionTheme,
} from '@/components/admin/SectionThemeField';
import {
  isSectionEnabledValue,
  sectionEnabledKey,
  PRODUCTS_SECTION_TOGGLES,
} from '@/constants/sectionVisibility';
import { cn } from '@/utils/cn';
import type { SiteSetting } from '@/types';

export const PRODUCTS_CTA_FIELDS = [
  { key: 'products_cta_title', label: 'Title', default: 'Need a custom demo or deployment?' },
  {
    key: 'products_cta_subtitle',
    label: 'Subtitle',
    default:
      'Our team can tailor any product to your workflows, integrate with existing systems, and support you through production rollout and beyond.',
    type: 'textarea' as const,
  },
  { key: 'products_cta_primary_label', label: 'Primary button', default: 'Request a demo' },
  { key: 'products_cta_secondary_label', label: 'Secondary button', default: 'Explore services' },
] as const;

const PRODUCTS_SECTIONS = [
  {
    id: 'products_page',
    label: 'Page hero',
    defaults: {
      eyebrow: 'Software products',
      title: 'Enterprise Software Products',
      subtitle:
        'Ready-to-deploy and customizable solutions built for real-world operations — from document management to industry-specific platforms.',
    },
  },
  {
    id: 'products_featured',
    label: 'Featured product spotlight',
    defaults: {
      eyebrow: 'Featured product',
      title: 'Our flagship solution',
      subtitle:
        'Purpose-built software for teams that need reliability, visibility, and scale in daily operations.',
    },
  },
  {
    id: 'products_catalog',
    label: 'Product catalog',
    defaults: {
      eyebrow: 'Product catalog',
      title: 'All software solutions',
      subtitle:
        'Browse our full suite of enterprise products — each customizable to your workflows and integration needs.',
    },
  },
] as const;

function getValue(settings: SiteSetting[] | undefined, key: string) {
  return settings?.find((s) => s.key === key)?.value ?? '';
}

export function ProductsContentSettings() {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSetting();
  const createMutation = useCreateSiteSetting();
  const [savedId, setSavedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const saveField = async (key: string, value: string, group: string) => {
    const existing = settings?.find((s) => s.key === key);
    if (existing) {
      await updateMutation.mutateAsync({ id: existing.id, data: { value, isPublic: true } });
    } else {
      await createMutation.mutateAsync({ key, value, group, isPublic: true });
    }
  };

  const toggleSectionVisible = async (sectionId: string, enabled: boolean) => {
    setSavedId(null);
    setSavingId(`${sectionId}-visible`);
    try {
      await saveField(sectionEnabledKey(sectionId), enabled ? 'true' : 'false', 'products');
      setSavedId(`${sectionId}-visible`);
    } finally {
      setSavingId(null);
    }
  };

  const isSectionVisible = (sectionId: string) =>
    isSectionEnabledValue(getValue(settings, sectionEnabledKey(sectionId)));

  const saveProductsCta = async (formData: FormData) => {
    setSavedId(null);
    setSavingId('products-cta');
    try {
      const theme = String(formData.get('theme_products_cta') ?? 'light') as SectionTheme;
      await Promise.all([
        ...PRODUCTS_CTA_FIELDS.map((field) =>
          saveField(field.key, String(formData.get(field.key) ?? ''), 'products'),
        ),
        persistSectionTheme(saveField, 'products_cta', theme),
      ]);
      setSavedId('products-cta');
    } finally {
      setSavingId(null);
    }
  };

  const saveSection = async (sectionId: string, formData: FormData) => {
    setSavedId(null);
    setSavingId(sectionId);
    try {
      const theme = String(formData.get(`theme_${sectionId}`) ?? 'light') as SectionTheme;
      await Promise.all([
        saveField(`${sectionId}_eyebrow`, String(formData.get('eyebrow') ?? ''), 'products'),
        saveField(`${sectionId}_title`, String(formData.get('title') ?? ''), 'products'),
        saveField(`${sectionId}_subtitle`, String(formData.get('subtitle') ?? ''), 'products'),
        persistSectionTheme(saveField, sectionId, theme),
      ]);
      setSavedId(sectionId);
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
        Edit the products page at <strong className="font-medium text-primary-800">/products</strong>.
        Turn sections on or off below — the whole page must also be published under{' '}
        <strong className="font-medium text-primary-800">Settings → Page visibility → Software Products</strong>.
      </p>

      <section className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-primary-900">Show on products page</h3>
          <p className="text-xs text-slate-500">Enable or hide each section on the live /products page.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {PRODUCTS_SECTION_TOGGLES.map((item) => {
            const visible = isSectionVisible(item.id);
            return (
              <div key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-primary-900">{item.label}</p>
                  <p className="text-xs text-slate-500">{visible ? 'Visible on /products' : 'Hidden'}</p>
                </div>
                <SectionToggleSwitch
                  enabled={visible}
                  disabled={isSaving}
                  label={item.label}
                  size="sm"
                  onToggle={() => void toggleSectionVisible(item.id, !visible)}
                />
              </div>
            );
          })}
        </div>
        <div className="border-t border-slate-100 px-4 py-2">
          <SaveFeedback
            saved={savedId?.endsWith('-visible') ?? false}
            isSaving={isSaving && (savingId?.endsWith('-visible') ?? false)}
          />
        </div>
      </section>

      <p className="text-sm text-slate-500">
        Mark a product as featured under <strong className="font-medium text-primary-800">Admin → Products</strong>.
        Each block below also has a <strong className="font-medium text-primary-800">Light / Navy blue</strong>{' '}
        background theme.
      </p>

      <section className="rounded-lg border border-brand-gold-500/30 bg-brand-gold-500/5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-gold-500/20 px-4 py-3">
          <div className="flex items-start gap-2">
            <LayoutGrid className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-600" />
            <div>
              <h3 className="text-sm font-semibold text-primary-900">Bottom call-to-action</h3>
              <p className="text-xs text-slate-600">
                Banner at the bottom of the products page — copy, buttons, and background theme.
              </p>
            </div>
          </div>
          <Button type="submit" form="products-cta-form" isLoading={savingId === 'products-cta'} size="sm">
            Save CTA
          </Button>
        </div>
        <div className="bg-white p-4">
          <form
            id="products-cta-form"
            onSubmit={(e) => {
              e.preventDefault();
              void saveProductsCta(new FormData(e.currentTarget));
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="sm:col-span-2 rounded-lg border border-primary-200 bg-primary-50/60 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary-800">
                Appearance
              </p>
              <SectionThemeField sectionId="products_cta" settings={settings} />
            </div>
            <p className="sm:col-span-2 text-xs font-medium text-slate-500">Content</p>
            {PRODUCTS_CTA_FIELDS.map((field) =>
              'type' in field && field.type === 'textarea' ? (
                <div key={field.key} className="sm:col-span-2">
                  <Textarea
                    name={field.key}
                    label={field.label}
                    rows={3}
                    defaultValue={getValue(settings, field.key) || field.default}
                  />
                </div>
              ) : (
                <Input
                  key={field.key}
                  name={field.key}
                  label={field.label}
                  defaultValue={getValue(settings, field.key) || field.default}
                />
              ),
            )}
          </form>
          <SaveFeedback saved={savedId === 'products-cta'} isSaving={isSaving} />
        </div>
      </section>

      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
        {PRODUCTS_SECTIONS.map((section) => {
          const isOpen = openId === section.id;
          const currentTitle = getValue(settings, `${section.id}_title`) || section.defaults.title;

          return (
            <div key={section.id} className="bg-white">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : section.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-slate-50/80"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-primary-900">{section.label}</p>
                  <p className="truncate text-xs text-slate-500">{currentTitle}</p>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-slate-400 transition-transform',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-4">
                  <form
                    id={`products-section-form-${section.id}`}
                    onSubmit={(e) => {
                      e.preventDefault();
                      void saveSection(section.id, new FormData(e.currentTarget));
                    }}
                    className="space-y-3"
                  >
                    <SectionThemeField sectionId={section.id} settings={settings} />
                    {'eyebrow' in section.defaults && (
                      <Input
                        name="eyebrow"
                        label="Eyebrow"
                        defaultValue={
                          getValue(settings, `${section.id}_eyebrow`) ||
                          ('eyebrow' in section.defaults ? section.defaults.eyebrow : '')
                        }
                      />
                    )}
                    <Input
                      name="title"
                      label="Title"
                      defaultValue={getValue(settings, `${section.id}_title`) || section.defaults.title}
                    />
                    <Textarea
                      name="subtitle"
                      label="Subtitle"
                      rows={2}
                      defaultValue={
                        getValue(settings, `${section.id}_subtitle`) ||
                        ('subtitle' in section.defaults ? section.defaults.subtitle : '')
                      }
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <Button type="submit" size="sm" isLoading={savingId === section.id}>
                        Save
                      </Button>
                      <SaveFeedback saved={savedId === section.id} isSaving={isSaving} />
                    </div>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
