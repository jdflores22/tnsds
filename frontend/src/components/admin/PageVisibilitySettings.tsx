import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useSeoSettings, useUpdateSeoSetting } from '@/api/hooks';
import { PAGE_VISIBILITY_LABELS, PAGE_VISIBILITY_ORDER } from '@/constants/pageVisibility';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Spinner } from '@/components/ui/Spinner';
import { SaveFeedback, SettingsPanel } from '@/components/admin/SettingsPanel';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export function PageVisibilitySettings() {
  const { data: pages, isLoading } = useSeoSettings();
  const updateMutation = useUpdateSeoSetting();
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [messageDrafts, setMessageDrafts] = useState<Record<string, string>>({});

  const sorted = PAGE_VISIBILITY_ORDER.map((key) => pages?.find((p) => p.pageKey === key)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  const extraPages = (pages ?? []).filter((p) => !PAGE_VISIBILITY_ORDER.includes(p.pageKey as never));

  const togglePublished = async (pageKey: string, isPublished: boolean) => {
    const page = pages?.find((p) => p.pageKey === pageKey);
    if (!page) return;

    setSavedKey(null);
    await updateMutation.mutateAsync({
      id: page.id,
      data: {
        title: page.title,
        description: page.description,
        keywords: page.keywords,
        ogImage: page.ogImage,
        isPublished,
        maintenanceMessage: messageDrafts[pageKey] ?? page.maintenanceMessage ?? '',
      },
    });
    setSavedKey(pageKey);
  };

  const saveMessage = async (pageKey: string) => {
    const page = pages?.find((p) => p.pageKey === pageKey);
    if (!page) return;

    setSavedKey(null);
    await updateMutation.mutateAsync({
      id: page.id,
      data: {
        title: page.title,
        description: page.description,
        keywords: page.keywords,
        ogImage: page.ogImage,
        isPublished: page.isPublished,
        maintenanceMessage: messageDrafts[pageKey] ?? page.maintenanceMessage ?? '',
      },
    });
    setSavedKey(`${pageKey}-msg`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  const renderPage = (page: (typeof sorted)[number]) => {
    const meta = PAGE_VISIBILITY_LABELS[page.pageKey] ?? { label: page.pageKey, path: `/${page.pageKey}` };
    const messageValue =
      messageDrafts[page.pageKey] !== undefined
        ? messageDrafts[page.pageKey]
        : page.maintenanceMessage ?? '';

    return (
      <div
        key={page.id}
        className={cn(
          'rounded-xl border p-5 transition-colors',
          page.isPublished ? 'border-slate-200 bg-white' : 'border-amber-200 bg-amber-50/40',
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium text-primary-900">{meta.label}</h3>
              <Badge variant={page.isPublished ? 'accent' : 'warning'}>
                {page.isPublished ? 'Published' : 'Maintenance'}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {meta.path}
              {page.pageKey !== 'home' && ' (+ detail pages)'}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={page.isPublished}
            aria-label={`${page.isPublished ? 'Unpublish' : 'Publish'} ${meta.label}`}
            disabled={updateMutation.isPending}
            onClick={() => void togglePublished(page.pageKey, !page.isPublished)}
            className={cn(
              'relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50',
              page.isPublished ? 'bg-primary-700' : 'bg-slate-300',
            )}
          >
            <span
              className={cn(
                'inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform',
                page.isPublished ? 'translate-x-7' : 'translate-x-1',
              )}
            />
          </button>
        </div>

        {!page.isPublished && (
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
            <Textarea
              label="Maintenance message (optional)"
              rows={2}
              value={messageValue}
              onChange={(e) =>
                setMessageDrafts((prev) => ({ ...prev, [page.pageKey]: e.target.value }))
              }
              placeholder="This page is temporarily unavailable while we make improvements."
            />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                size="sm"
                variant="outline"
                isLoading={updateMutation.isPending}
                onClick={() => void saveMessage(page.pageKey)}
              >
                Save message
              </Button>
              <SaveFeedback saved={savedKey === `${page.pageKey}-msg`} isSaving={updateMutation.isPending} />
            </div>
          </div>
        )}

        {savedKey === page.pageKey && (
          <p className="mt-3 text-xs font-medium text-emerald-600">Visibility updated.</p>
        )}
      </div>
    );
  };

  return (
    <SettingsPanel
      icon={Eye}
      title="Page visibility"
      description="Publish or unpublish public pages. Unpublished pages show a maintenance screen to visitors (admin always has access)."
    >
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <EyeOff className="h-4 w-4 shrink-0 text-slate-400" />
        Toggle off to hide a page for maintenance. Detail routes (e.g. /services/custom-app) follow the parent page.
      </div>

      <div className="space-y-4">
        {sorted.map(renderPage)}
        {extraPages.map(renderPage)}
      </div>
    </SettingsPanel>
  );
}
