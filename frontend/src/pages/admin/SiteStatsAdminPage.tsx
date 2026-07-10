import {
  useAdminSiteStats,
  useCreateSiteStat,
  useUpdateSiteStat,
  useDeleteSiteStat,
} from '@/api/hooks';
import type { SiteStat } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { EntityForm } from '@/components/admin/EntityForm';

export default function SiteStatsAdminPage() {
  const { data: items, isLoading } = useAdminSiteStats();
  const createMutation = useCreateSiteStat();
  const updateMutation = useUpdateSiteStat();
  const deleteMutation = useDeleteSiteStat();

  return (
    <AdminCrudPage<SiteStat>
      title="Homepage stats"
      description="Manage stat counters shown on the homepage and about page."
      createLabel="Add stat"
      searchPlaceholder="Search stats…"
      items={items}
      isLoading={isLoading}
      columns={[
        { key: 'value', label: 'Value' },
        { key: 'label', label: 'Label' },
        { key: 'icon', label: 'Icon' },
        { key: 'sortOrder', label: 'Order' },
      ]}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <EntityForm
          defaultValues={item || { icon: 'users', sortOrder: 0, isPublished: true }}
          fields={[
            { name: 'value', label: 'Value (e.g. 50+)' },
            { name: 'label', label: 'Label' },
            { name: 'icon', label: 'Icon (users, code, award, headset)' },
            { name: 'sortOrder', label: 'Sort order', type: 'number' },
            { name: 'isPublished', label: 'Published', type: 'checkbox' },
          ]}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onCancel={onClose}
          onSubmit={(data) => {
            if (item) {
              updateMutation.mutate({ id: item.id, data }, { onSuccess: onClose });
            } else {
              createMutation.mutate(data as never, { onSuccess: onClose });
            }
          }}
        />
      )}
    />
  );
}
