import { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSetting, useCreateSiteSetting } from '@/api/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Spinner } from '@/components/ui/Spinner';
import { SaveFeedback, SettingsPanel } from '@/components/admin/SettingsPanel';
import type { SiteSetting } from '@/types';

/** Matches homepage section order on the live site. */
const HOME_SECTIONS = [
  {
    id: 'home_clients',
    label: 'Trusted companies',
    defaults: {
      eyebrow: 'Trusted By',
      title: 'Companies That Trust Us',
      subtitle: 'Partnering with leading organizations across industries.',
    },
  },
  {
    id: 'home_services',
    label: 'Services',
    defaults: { eyebrow: 'Our Services', title: 'End-to-end solutions for modern businesses', subtitle: 'From discovery to delivery and support — we help you build software that performs in production.' },
  },
  {
    id: 'home_technologies',
    label: 'Technologies',
    defaults: {
      eyebrow: 'Technologies',
      title: 'Modern Tech Stack',
      subtitle: 'From frontend to backend — we choose reliable, maintainable tools for every layer of your software.',
    },
  },
  {
    id: 'home_products',
    label: 'Software products',
    defaults: {
      eyebrow: 'Products',
      title: 'Software Solutions',
      subtitle: 'Ready-to-deploy and customizable enterprise software products.',
    },
  },
  {
    id: 'home_industries',
    label: 'Industries',
    defaults: { eyebrow: 'Industries', title: 'Sector Expertise', subtitle: 'Deep domain knowledge across diverse industries.' },
  },
  {
    id: 'home_why',
    label: 'Why choose us',
    defaults: {
      eyebrow: 'Why TRANS-NET',
      title: 'Built around what matters to you',
      subtitle: 'Engagements tied to delivery milestones, transparent scope, and outcomes you can measure.',
    },
  },
  {
    id: 'home_process',
    label: 'Development process',
    defaults: {
      eyebrow: 'Process',
      title: 'Our Development Process',
      subtitle: 'A proven methodology for delivering successful projects on time and on budget.',
    },
  },
  {
    id: 'home_portfolio',
    label: 'Portfolio',
    defaults: {
      eyebrow: 'Case Studies',
      title: 'Proven results across industries',
      subtitle: 'Explore how we help organizations solve complex challenges with custom software, web platforms, and mobile applications.',
    },
  },
  {
    id: 'home_testimonials',
    label: 'Testimonials',
    defaults: {
      eyebrow: 'Testimonials',
      title: 'What Our Clients Say',
      subtitle: 'Trusted by businesses worldwide for delivering exceptional results.',
    },
  },
  {
    id: 'home_stats',
    label: 'Statistics',
    defaults: {
      eyebrow: 'Results',
      title: 'Outcomes we deliver',
      subtitle: 'Measurable impact from software built with clarity, quality, and long-term partnership.',
    },
  },
  {
    id: 'home_faq',
    label: 'FAQ',
    defaults: {
      eyebrow: 'FAQ',
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions about our services and process.',
    },
  },
  {
    id: 'home_blog',
    label: 'Latest articles',
    defaults: {
      eyebrow: 'Blog',
      title: 'Latest Articles',
      subtitle: 'Insights, trends, and best practices from our team.',
    },
  },
] as const;

const PAGE_HEROES = [
  { id: 'services_page', label: 'Services — page hero', defaults: { title: 'Our Services', subtitle: 'Comprehensive software solutions — from custom applications and web platforms to mobile apps and ongoing support.' } },
  { id: 'services_section', label: 'Services — main section', defaults: { eyebrow: 'What we do', title: 'End-to-End Software Solutions', subtitle: 'We partner with businesses to design, build, deploy, and maintain software that drives real outcomes.' } },
  { id: 'contact_page', label: 'Contact page', defaults: { title: 'Contact Us', subtitle: "We'd love to hear about your project." } },
  { id: 'careers_page', label: 'Careers page', defaults: { title: 'Careers', subtitle: 'Build the future of enterprise software with us.' } },
  { id: 'blog_page', label: 'Blog page', defaults: { title: 'Blog', subtitle: 'Insights, trends, and best practices.' } },
  { id: 'industries_page', label: 'Industries page', defaults: { title: 'Industries We Serve', subtitle: 'Domain expertise across diverse sectors.' } },
  { id: 'about_industries', label: 'About — industries section', defaults: { eyebrow: 'Industries', title: 'Sector Expertise', subtitle: 'Deep domain knowledge across diverse industries — from healthcare to logistics.' } },
] as const;

const CTA_FIELDS = [
  { key: 'home_cta_title', label: 'Title', default: 'Ready to build your next software solution?' },
  { key: 'home_cta_subtitle', label: 'Subtitle', default: "Let's discuss how we can help you plan, build, and maintain software that fits your business.", type: 'textarea' as const },
  { key: 'home_cta_primary_label', label: 'Primary button', default: 'Get Started' },
  { key: 'home_cta_secondary_label', label: 'Secondary button', default: 'Explore Services' },
];

function getValue(settings: SiteSetting[] | undefined, key: string) {
  return settings?.find((s) => s.key === key)?.value ?? '';
}

type HomepageSectionsSettingsProps = {
  mode?: 'home' | 'pages';
};

export function HomepageSectionsSettings({ mode = 'home' }: HomepageSectionsSettingsProps) {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSetting();
  const createMutation = useCreateSiteSetting();
  const [savedId, setSavedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const saveField = async (key: string, value: string, group: string) => {
    const existing = settings?.find((s) => s.key === key);
    if (existing) {
      await updateMutation.mutateAsync({ id: existing.id, data: { value, isPublic: true } });
    } else {
      await createMutation.mutateAsync({ key, value, group, isPublic: true });
    }
  };

  const saveSection = async (sectionId: string, formData: FormData, group: string) => {
    setSavedId(null);
    setSavingId(sectionId);
    try {
      await Promise.all([
        saveField(`${sectionId}_eyebrow`, String(formData.get('eyebrow') ?? ''), group),
        saveField(`${sectionId}_title`, String(formData.get('title') ?? ''), group),
        saveField(`${sectionId}_subtitle`, String(formData.get('subtitle') ?? ''), group),
      ]);
      setSavedId(sectionId);
    } finally {
      setSavingId(null);
    }
  };

  const saveCta = async (formData: FormData) => {
    setSavedId(null);
    setSavingId('cta');
    try {
      await Promise.all(
        CTA_FIELDS.map((field) => saveField(field.key, String(formData.get(field.key) ?? ''), 'home')),
      );
      setSavedId('cta');
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

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const showHome = mode === 'home';

  const renderSectionForm = (
    section: (typeof HOME_SECTIONS)[number] | (typeof PAGE_HEROES)[number],
    group: string,
  ) => (
    <SettingsPanel
      key={section.id}
      icon={LayoutGrid}
      title={section.label}
      description={
        showHome
          ? 'Section heading text on the homepage.'
          : 'Page hero title and subtitle.'
      }
      footer={
        <>
          <Button
            type="submit"
            form={`section-form-${section.id}`}
            isLoading={savingId === section.id}
            size="sm"
          >
            Save
          </Button>
          <SaveFeedback saved={savedId === section.id} isSaving={isSaving} />
        </>
      }
    >
      <form
        id={`section-form-${section.id}`}
        onSubmit={(e) => {
          e.preventDefault();
          void saveSection(section.id, new FormData(e.currentTarget), group);
        }}
        className="space-y-4"
      >
        <Input
          name="eyebrow"
          label="Eyebrow"
          defaultValue={
            getValue(settings, `${section.id}_eyebrow`) ||
            ('eyebrow' in section.defaults ? section.defaults.eyebrow : '')
          }
        />
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
      </form>
    </SettingsPanel>
  );

  if (showHome) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-slate-500">
          Section headings appear in the same order as on the homepage. Toggle visibility and navy
          backgrounds in the <strong className="font-medium text-primary-800">Layout</strong> tab.
        </p>

        {HOME_SECTIONS.map((section) => renderSectionForm(section, 'home'))}

        <SettingsPanel
          icon={LayoutGrid}
          title="Homepage call-to-action"
          description="Bottom CTA banner on the homepage."
          footer={
            <>
              <Button type="submit" form="homepage-cta-form" isLoading={savingId === 'cta'} size="sm">
                Save CTA
              </Button>
              <SaveFeedback saved={savedId === 'cta'} isSaving={isSaving} />
            </>
          }
        >
          <form
            id="homepage-cta-form"
            onSubmit={(e) => {
              e.preventDefault();
              void saveCta(new FormData(e.currentTarget));
            }}
            className="space-y-4"
          >
            {CTA_FIELDS.map((field) =>
              field.type === 'textarea' ? (
                <Textarea
                  key={field.key}
                  name={field.key}
                  label={field.label}
                  rows={2}
                  defaultValue={getValue(settings, field.key) || field.default}
                />
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
        </SettingsPanel>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">
        Hero titles and section headings for inner pages. Publish or hide whole pages in the{' '}
        <strong className="font-medium text-primary-800">Pages</strong> tab.
      </p>
      {PAGE_HEROES.map((page) => renderSectionForm(page, 'pages'))}
    </div>
  );
}
