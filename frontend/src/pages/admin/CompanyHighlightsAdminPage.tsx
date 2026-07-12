import {
  useAdminCompanyHighlights,
  useCreateCompanyHighlight,
  useUpdateCompanyHighlight,
  useDeleteCompanyHighlight,
  useReorderCompanyHighlights,
} from '@/api/hooks';
import type { CompanyHighlight } from '@/types';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { EntityForm } from '@/components/admin/EntityForm';

export default function CompanyHighlightsAdminPage() {
  const { data: items, isLoading } = useAdminCompanyHighlights();
  const createMutation = useCreateCompanyHighlight();
  const updateMutation = useUpdateCompanyHighlight();
  const deleteMutation = useDeleteCompanyHighlight();
  const reorderMutation = useReorderCompanyHighlights();

  return (
    <AdminCrudPage<CompanyHighlight>
      title="Why choose us"
      description="Manage highlight points shown in Why Choose Us sections. Use homepage row to control which row each card appears in."
      createLabel="Add highlight"
      searchPlaceholder="Search highlights…"
      items={items}
      isLoading={isLoading}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'sortOrder', label: 'Order' },
        {
          key: 'homepageRow',
          label: 'Homepage row',
          render: (item) => (item.homepageRow === 2 ? 'Row 2' : 'Row 1'),
        },
      ]}
      onReorder={(ordered) => reorderMutation.mutateAsync(ordered)}
      isReordering={reorderMutation.isPending}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
      formContent={(item, onClose) => (
        <EntityForm
          defaultValues={item || { sortOrder: 0, homepageRow: 1, isPublished: true }}
          fields={[
            { name: 'title', label: 'Title' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'sortOrder', label: 'Sort order', type: 'number' },
            {
              name: 'homepageRow',
              label: 'Homepage row',
              type: 'select',
              options: [
                { value: 1, label: 'First row' },
                { value: 2, label: 'Second row' },
              ],
              hint: 'Which row this highlight appears in on the homepage.',
            },
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
