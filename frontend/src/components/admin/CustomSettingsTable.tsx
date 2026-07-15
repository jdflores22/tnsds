import { useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import {
  useCreateSiteSetting,
  useUpdateSiteSetting,
  useDeleteSiteSetting,
} from '@/api/hooks';
import type { SiteSetting } from '@/types';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { EntityForm } from '@/components/admin/EntityForm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/utils/cn';

const MANAGED_KEYS = new Set([
  'company_logo',
  'company_logo_media',
  'company_name',
  'company_tagline',
  'company_email',
  'company_phone',
  'company_website',
  'company_address',
  'footer_text',
  'social_facebook',
  'social_linkedin',
  'social_whatsapp',
  'social_facebook_enabled',
  'social_linkedin_enabled',
  'social_whatsapp_enabled',
  'calendly_url',
  'ga_measurement_id',
  'hero_agency_label',
  'hero_title_line1',
  'hero_title_highlight',
  'hero_description',
  'hero_panel_eyebrow',
  'hero_panel_title',
  'hero_panel_body',
  'hero_panel_points',
  'about_intro',
  'about_secondary',
  'privacy_content',
  'terms_content',
]);

interface CustomSettingsTableProps {
  items: SiteSetting[] | undefined;
  isLoading: boolean;
}

export function CustomSettingsTable({ items, isLoading }: CustomSettingsTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SiteSetting | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SiteSetting | null>(null);
  const [search, setSearch] = useState('');

  const createMutation = useCreateSiteSetting();
  const updateMutation = useUpdateSiteSetting();
  const deleteMutation = useDeleteSiteSetting();

  const customItems = useMemo(
    () => items?.filter((s) => !MANAGED_KEYS.has(s.key)) ?? [],
    [items],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customItems;
    return customItems.filter(
      (item) =>
        item.key.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q),
    );
  }, [customItems, search]);

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          Raw key/value pairs for power users. Keys edited in other settings tabs are hidden here.
          Mark <strong className="font-medium text-slate-600">Public</strong> to expose values on the website.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search keys…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 text-sm"
              aria-label="Search custom settings"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              {filtered.length} of {customItems.length} custom {customItems.length === 1 ? 'key' : 'keys'}
            </span>
            <Button
              size="sm"
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add key
            </Button>
          </div>
        </div>

        {customItems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 py-12 text-center">
            <p className="text-sm text-slate-600">No custom settings yet.</p>
            <p className="mt-1 text-xs text-slate-500">
              Use the other settings tabs for common site content.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add custom key
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
            No keys match &ldquo;{search}&rdquo;.
            <button
              type="button"
              className="ml-2 text-primary-700 hover:underline"
              onClick={() => setSearch('')}
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-primary-900">
                      {item.key}
                    </code>
                    <span className="text-[11px] text-slate-400">{item.group}</span>
                    <span
                      className={cn(
                        'inline-flex h-1.5 w-1.5 rounded-full',
                        item.isPublic ? 'bg-emerald-500' : 'bg-slate-300',
                      )}
                      title={item.isPublic ? 'Public' : 'Private'}
                    />
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">
                      {item.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">{item.value || '—'}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Edit ${item.key}`}
                    onClick={() => {
                      setEditing(item);
                      setModalOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Delete ${item.key}`}
                    onClick={() => setDeleteTarget(item)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? `Edit — ${editing.key}` : 'Add setting'}
        size="md"
      >
        <EntityForm
          defaultValues={editing || { group: 'general', isPublic: true }}
          fields={[
            ...(!editing ? [{ name: 'key', label: 'Key' }] : []),
            { name: 'value', label: 'Value', type: 'textarea', rows: 4 },
            { name: 'group', label: 'Group' },
            { name: 'isPublic', label: 'Public (visible on website)', type: 'checkbox' },
          ]}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onCancel={closeModal}
          onSubmit={(data) => {
            const payload = {
              value: String(data.value ?? ''),
              group: String(data.group ?? 'general'),
              isPublic: data.isPublic === true,
            };
            if (editing) {
              updateMutation.mutate({ id: editing.id, data: payload }, { onSuccess: closeModal });
            } else {
              createMutation.mutate(
                { ...payload, key: String(data.key ?? '') },
                { onSuccess: closeModal },
              );
            }
          }}
        />
      </Modal>

      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteMutation.mutateAsync(deleteTarget.id);
        }}
        title="Delete setting?"
        itemName={deleteTarget?.key}
        successMessage="Setting deleted successfully."
      />
    </>
  );
}
