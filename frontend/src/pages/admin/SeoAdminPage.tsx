import {
  useSeoSettings,
  useCreateSeoSetting,
  useUpdateSeoSetting,
  useDeleteSeoSetting,
} from '@/api/hooks';
import type { SeoSetting } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { EntityForm } from '@/components/admin/EntityForm';
import { Badge } from '@/components/ui/Badge';

export default function SeoAdminPage() {
  const { data: items, isLoading } = useSeoSettings();
  const createMutation = useCreateSeoSetting();
  const updateMutation = useUpdateSeoSetting();
  const deleteMutation = useDeleteSeoSetting();

  return (
    <AdminCrudPage<SeoSetting>
      title="SEO"
      description="Manage SEO settings per page"
      items={items}
      isLoading={isLoading}
      columns={[
        { key: 'pageKey', label: 'Page Key' },
        { key: 'title', label: 'Title' },
        {
          key: 'isPublished',
          label: 'Status',
          render: (item) =>
            item.isPublished ? (
              <Badge variant="accent">Published</Badge>
            ) : (
              <Badge variant="warning">Maintenance</Badge>
            ),
        },
      ]}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <EntityForm
          defaultValues={item || { isPublished: true }}
          fields={[
            { name: 'pageKey', label: 'Page Key' },
            { name: 'title', label: 'Title' },
            { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
            { name: 'keywords', label: 'Keywords' },
            { name: 'ogImage', label: 'OG Image URL' },
            { name: 'maintenanceMessage', label: 'Maintenance message', type: 'textarea', rows: 2 },
            { name: 'isPublished', label: 'Published (visible to public)', type: 'checkbox' },
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
