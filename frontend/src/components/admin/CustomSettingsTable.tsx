import { useState } from 'react';
import { Plus, Pencil, Trash2, Database } from 'lucide-react';
import {
  useCreateSiteSetting,
  useUpdateSiteSetting,
  useDeleteSiteSetting,
} from '@/api/hooks';
import type { SiteSetting } from '@/types';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { EntityForm } from '@/components/admin/EntityForm';
import { SettingsPanel } from '@/components/admin/SettingsPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';

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

  const createMutation = useCreateSiteSetting();
  const updateMutation = useUpdateSiteSetting();
  const deleteMutation = useDeleteSiteSetting();

  const customItems = items?.filter((s) => !MANAGED_KEYS.has(s.key));

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
      <SettingsPanel
        icon={Database}
        title="Custom settings"
        description="Advanced key-value pairs for developers. Must be marked Public to appear on the website."
      >
        <div className="mb-4 flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add setting
          </Button>
        </div>

        <Table>
          <THead>
            <TR>
              <TH>Key</TH>
              <TH>Group</TH>
              <TH>Public</TH>
              <TH className="w-24">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {customItems?.length ? (
              customItems.map((item) => (
                <TR key={item.id}>
                  <TD className="font-mono text-xs">{item.key}</TD>
                  <TD>
                    <Badge variant="default">{item.group}</Badge>
                  </TD>
                  <TD>
                    <Badge variant={item.isPublic ? 'success' : 'default'}>
                      {item.isPublic ? 'Yes' : 'No'}
                    </Badge>
                  </TD>
                  <TD>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
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
                        onClick={() => setDeleteTarget(item)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))
            ) : (
              <TR>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                  No custom settings yet. Use the tabs above for common site content.
                </td>
              </TR>
            )}
          </TBody>
        </Table>
      </SettingsPanel>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit setting' : 'Add setting'}
        size="lg"
      >
        <EntityForm
          defaultValues={editing || { group: 'general', isPublic: true }}
          fields={[
            { name: 'key', label: 'Key' },
            { name: 'value', label: 'Value', type: 'textarea' },
            { name: 'group', label: 'Group' },
            { name: 'isPublic', label: 'Public', type: 'checkbox' },
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
