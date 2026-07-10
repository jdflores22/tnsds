import { useState } from 'react';
import { Briefcase, FileText, Home, Info, Share2 } from 'lucide-react';
import { useSiteSettings, useUpdateSiteSetting, useCreateSiteSetting } from '@/api/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Spinner } from '@/components/ui/Spinner';
import { SaveFeedback, SettingsPanel } from '@/components/admin/SettingsPanel';
import { SettingsImageField } from '@/components/admin/SettingsImageField';
import type { SiteSetting } from '@/types';

type FieldDef = {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'select';
  rows?: number;
  options?: { value: string; label: string }[];
};

type ImageFieldDef = {
  key: string;
  label: string;
  hint?: string;
};

const CONTENT_GROUPS: {
  id: string;
  title: string;
  description: string;
  icon: typeof Home;
  fields: FieldDef[];
  imageKey?: string;
  imageFields?: ImageFieldDef[];
}[] = [
  {
    id: 'home',
    title: 'Hero banner',
    description: 'Static hero copy, side panel, and default background image. Used when layout is Static.',
    icon: Home,
    fields: [
      { key: 'hero_tagline', label: 'Tagline (fallback if agency label is empty)' },
      { key: 'hero_agency_label', label: 'Agency label (shown above headline)' },
      { key: 'hero_title_line1', label: 'Title line 1' },
      { key: 'hero_title_highlight', label: 'Title highlight' },
      { key: 'hero_description', label: 'Description', type: 'textarea', rows: 3 },
      { key: 'hero_panel_eyebrow', label: 'Side panel — eyebrow' },
      { key: 'hero_panel_title', label: 'Side panel — headline' },
      { key: 'hero_panel_body', label: 'Side panel — message', type: 'textarea', rows: 4 },
      {
        key: 'hero_panel_points',
        label: 'Side panel — bullet points (comma-separated)',
        type: 'textarea',
        rows: 3,
      },
    ],
    imageKey: 'hero_background_image',
  },
  {
    id: 'home-intro',
    title: 'Intro banner',
    description: '“What we do” statement block below the hero.',
    icon: Home,
    fields: [
      { key: 'home_intro_line1', label: 'Headline — line 1' },
      { key: 'home_intro_line2', label: 'Headline — line 2 (accent)' },
      { key: 'home_intro_line3', label: 'Headline — line 3 (optional)' },
      { key: 'home_intro_body', label: 'Body text', type: 'textarea', rows: 3 },
    ],
  },
  {
    id: 'portfolio',
    title: 'Portfolio page',
    description: 'Hero image and intro text on the portfolio page.',
    icon: Briefcase,
    fields: [
      { key: 'portfolio_page_subtitle', label: 'Page subtitle', type: 'textarea', rows: 2 },
    ],
    imageKey: 'portfolio_hero_image',
  },
  {
    id: 'about',
    title: 'About page',
    description: 'Hero, vision, mission, and company story on the about page.',
    icon: Info,
    imageFields: [
      {
        key: 'about_hero_image',
        label: 'Hero & story image',
        hint: 'Shown in the page hero and company story section. Recommended 1200×900 or wider.',
      },
      {
        key: 'about_mission_image',
        label: 'Mission section image',
        hint: 'Optional image beside the mission statement.',
      },
      {
        key: 'about_vision_image',
        label: 'Vision section image',
        hint: 'Optional image beside the vision statement.',
      },
    ],
    fields: [
      { key: 'about_page_title', label: 'Page headline' },
      { key: 'about_page_subtitle', label: 'Page intro', type: 'textarea', rows: 3 },
      { key: 'about_mission', label: 'Mission statement', type: 'textarea', rows: 3 },
      {
        key: 'about_mission_image_position',
        label: 'Mission image position',
        type: 'select',
        options: [
          { value: 'left', label: 'Image on left' },
          { value: 'right', label: 'Image on right' },
        ],
      },
      { key: 'about_vision', label: 'Vision statement', type: 'textarea', rows: 3 },
      {
        key: 'about_vision_image_position',
        label: 'Vision image position',
        type: 'select',
        options: [
          { value: 'left', label: 'Image on left' },
          { value: 'right', label: 'Image on right' },
        ],
      },
      { key: 'about_story_eyebrow', label: 'Story section — eyebrow' },
      { key: 'about_story_title', label: 'Story section — title' },
      { key: 'about_intro', label: 'Story — first paragraph', type: 'textarea', rows: 4 },
      { key: 'about_secondary', label: 'Story — second paragraph', type: 'textarea', rows: 4 },
      { key: 'about_stats_title', label: 'Stats section — title' },
    ],
  },
  {
    id: 'general',
    title: 'Footer',
    description: 'Short description shown in the site footer.',
    icon: FileText,
    fields: [{ key: 'footer_text', label: 'Footer tagline', type: 'textarea', rows: 3 }],
  },
  {
    id: 'social',
    title: 'Social links',
    description: 'Social profile URLs for the website.',
    icon: Share2,
    fields: [
      { key: 'social_facebook', label: 'Facebook URL' },
      { key: 'social_linkedin', label: 'LinkedIn URL' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal pages',
    description: 'HTML content for privacy and terms pages.',
    icon: FileText,
    fields: [
      { key: 'privacy_content', label: 'Privacy policy', type: 'textarea', rows: 8 },
      { key: 'terms_content', label: 'Terms & conditions', type: 'textarea', rows: 8 },
    ],
  },
];

function getValue(settings: SiteSetting[] | undefined, key: string) {
  return settings?.find((s) => s.key === key)?.value ?? '';
}

export function ContentSettings({ includeGroups }: { includeGroups?: string[] }) {
  const { data: settings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSetting();
  const createMutation = useCreateSiteSetting();
  const [savedGroup, setSavedGroup] = useState<string | null>(null);
  const [savingGroup, setSavingGroup] = useState<string | null>(null);
  const [imageDrafts, setImageDrafts] = useState<Record<string, string>>({});

  const visibleGroups = includeGroups
    ? CONTENT_GROUPS.filter((group) => includeGroups.includes(group.id))
    : CONTENT_GROUPS;

  const saveFieldByKey = async (key: string, value: string, group: string) => {
    const existing = settings?.find((s) => s.key === key);
    if (existing) {
      await updateMutation.mutateAsync({
        id: existing.id,
        data: { value, isPublic: true },
      });
    } else {
      await createMutation.mutateAsync({
        key,
        value,
        group,
        isPublic: true,
      });
    }
  };

  const saveField = async (field: FieldDef, value: string, group: string) => {
    await saveFieldByKey(field.key, value, group);
  };

  const saveGroup = async (
    groupId: string,
    formData: FormData,
    fields: FieldDef[],
    group: string,
    imageKey?: string,
    imageFields?: ImageFieldDef[],
  ) => {
    setSavedGroup(null);
    setSavingGroup(groupId);
    try {
      const saves = fields.map((field) =>
        saveField(field, String(formData.get(field.key) ?? ''), group),
      );
      const imageKeys = [
        ...(imageKey ? [imageKey] : []),
        ...(imageFields?.map((img) => img.key) ?? []),
      ];
      for (const key of imageKeys) {
        if (key in imageDrafts) {
          saves.push(saveFieldByKey(key, imageDrafts[key], group));
        }
      }
      await Promise.all(saves);
      setSavedGroup(groupId);
    } finally {
      setSavingGroup(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {visibleGroups.map((group) => (
        <SettingsPanel
          key={group.id}
          icon={group.icon}
          title={group.title}
          description={group.description}
          footer={
            <>
              <Button
                type="submit"
                form={`content-form-${group.id}`}
                isLoading={savingGroup === group.id}
                size="sm"
              >
                Save {group.title.toLowerCase()}
              </Button>
              <SaveFeedback
                saved={savedGroup === group.id}
                isSaving={isSaving}
              />
            </>
          }
        >
          <form
            id={`content-form-${group.id}`}
            onSubmit={(e) => {
              e.preventDefault();
              void saveGroup(
                group.id,
                new FormData(e.currentTarget),
                group.fields,
                group.id,
                group.imageKey,
                group.imageFields,
              );
            }}
            className="space-y-4"
          >
            {group.imageFields?.map((imageField) => (
              <SettingsImageField
                key={imageField.key}
                label={imageField.label}
                value={
                  imageDrafts[imageField.key] !== undefined
                    ? imageDrafts[imageField.key]
                    : getValue(settings, imageField.key)
                }
                onChange={(url) =>
                  setImageDrafts((prev) => ({ ...prev, [imageField.key]: url }))
                }
                folder="pages"
                hint={imageField.hint}
              />
            ))}
            {!group.imageFields && group.imageKey && (
              <SettingsImageField
                label={group.id === 'portfolio' ? 'Portfolio hero image' : 'Hero background image'}
                value={
                  imageDrafts[group.imageKey] !== undefined
                    ? imageDrafts[group.imageKey]
                    : getValue(settings, group.imageKey)
                }
                onChange={(url) =>
                  setImageDrafts((prev) => ({ ...prev, [group.imageKey!]: url }))
                }
                folder="pages"
                hint={
                  group.id === 'portfolio'
                    ? 'Displayed behind the portfolio page title. Recommended 1920×600 or wider.'
                    : 'Optional image behind the homepage hero headline.'
                }
              />
            )}
            {group.fields.map((field) =>
              field.type === 'textarea' ? (
                <Textarea
                  key={field.key}
                  name={field.key}
                  label={field.label}
                  rows={field.rows ?? 4}
                  defaultValue={getValue(settings, field.key)}
                />
              ) : field.type === 'select' ? (
                <div key={field.key} className="space-y-1.5">
                  <label htmlFor={field.key} className="text-sm font-medium text-slate-700">
                    {field.label}
                  </label>
                  <select
                    id={field.key}
                    name={field.key}
                    defaultValue={
                      getValue(settings, field.key) || field.options?.[0]?.value || ''
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-primary-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <Input
                  key={field.key}
                  name={field.key}
                  label={field.label}
                  defaultValue={getValue(settings, field.key)}
                />
              ),
            )}
          </form>
        </SettingsPanel>
      ))}
    </div>
  );
}
