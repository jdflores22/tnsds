import {
  useAdminCompanyHighlights,
  useCreateCompanyHighlight,
  useUpdateCompanyHighlight,
  useDeleteCompanyHighlight,
} from '@/api/hooks';
import type { CompanyHighlight } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { EntityForm } from '@/components/admin/EntityForm';

export default function CompanyHighlightsAdminPage() {
  const { data: items, isLoading } = useAdminCompanyHighlights();
  const createMutation = useCreateCompanyHighlight();
  const updateMutation = useUpdateCompanyHighlight();
  const deleteMutation = useDeleteCompanyHighlight();

  return (
    <AdminCrudPage<CompanyHighlight>
      title="Why choose us"
      description="Manage highlight points shown in Why Choose Us sections."
      createLabel="Add highlight"
      searchPlaceholder="Search highlights…"
      items={items}
      isLoading={isLoading}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'sortOrder', label: 'Order' },
      ]}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <EntityForm
          defaultValues={item || { sortOrder: 0, isPublished: true }}
          fields={[
            { name: 'title', label: 'Title' },
            { name: 'description', label: 'Description', type: 'textarea' },
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
